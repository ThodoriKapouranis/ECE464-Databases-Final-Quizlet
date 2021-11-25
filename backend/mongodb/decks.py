from bson.objectid import ObjectId
from datetime import datetime
from pymongo.collation import Collation, CollationStrength
from pprint import pprint
import secrets
import mongodb.auths as auths
import mongodb.users as users

from flask_pymongo import PyMongo
from main import db

users_db = db.users
auths_db = db.auths
decks_db = db.decks
cards_db = db.cards

########
# Decks #
########

def createDeckobject( name:str, tags:"list[str]", uid:ObjectId, private:bool ):
	return {
			"name": name,
			"tags" : tags,
			"date_created": datetime.now(),
			"cards": [],
			"comments": [],
			"ratings": [],
			"private": private,
			"creator_id": uid,
			"admin_ids": [],
			"editor_ids" :[],
			"whitelist_ids": [],
	}

def createDeck ( name:str, tags:"list[str]", utoken:str, private:bool ):
	
	if not (uid := auths.getUid(utoken)) :
		print("Invalid user!")
		return -1
	
	deck = createDeckobject(name, tags, uid, private)
	result = decks_db.insert_one(deck)

	userQuery = {"_id": uid}
	userUpdate = {"$push": {"created_decks": result.inserted_id} }
	resultUser = users_db.update_one(userQuery, userUpdate)
	pprint(resultUser)
	return result.inserted_id

def searchDecks (*args, **kwargs):
	'''
	parameters:
	- `name` (OPTIONAL) : Name of deck to query on
	- `tags` (OPTIONAL) : List of tags to query for
	
	At least one argument must be given for a query to run
	'''
	if len(kwargs) == 0:
		print("ERROR : No arguments given")
		return -1

	name, tags = kwargs.get("name"), kwargs.get("tags")

	# Build the query given available information
	query = {}
	if (name != None): query["name"] = {"$regex": name}
	if (tags != None): query["tags"] = {"$all": tags}
	
	projection = {"comments": 0, "cards":0 }
	return decks_db.find(query, projection)

def getUsersDecks( username:str ):
	query = {"username": username}
	projection = {"_id": 0, "favorite_decks":1, "created_decks":1 }

	user = users_db.find_one(query, projection)
	return user


############
# Comments #
############

def createCommentObject ( uid:ObjectId, content:str ):
	return {
		"uid": uid,
		"content": content,
		"date_created": datetime.now()
	}

def addComment ( did:str, utoken:str, content:str ):
	
	if not (uid := auths.getUid(utoken)):
		print("Invalid user trying to comment!")
		return -1
	
	comment = createCommentObject(uid, content)
	
	query = {"_id": did }
	update = {"$push": {"comments": comment}}
	if not (decks_db.find_one_and_update(query, update) ):
		print("Deck not found. Cannot comment.")
		return -1

###########
# Ratings #
###########
def createRatingObject ( uid:ObjectId, rating:int ):
	return {
		"uid": uid,
		"rating": rating,
	}

def addRating ( did:ObjectId, utoken:str, rating:int ):
	if not (uid := auths.getUid(utoken)):
		print("Invalid user trying to rate!")
		return -1
	
	if ( rating > 5 or rating < 0 ):
		print("Invalid rating")
		return -1
	
	ratingObject = createRatingObject(uid, rating)

	query_update = {"_id": did, "ratings.uid":uid }
	query_insert = {"_id": did}
	update = {"$set": {"ratings.$.rating": rating} }	
	insert = {"$push": {"ratings": ratingObject} }


	# Try to update a rating the user has already made for this deck.
	# If no rating is found (matched_count==0), then insert new rating.
	if ( decks_db.update_one(query_update, update).matched_count == 0 ):
		decks_db.update_one(query_insert, insert)

######################
# Deck Authorization #
######################
AUTH_LEVEL = {
	"owner": 4,
	"admin": 3,
	"editor": 2,
	"whitelist": 1,
	}

DECK_AUTH_FIELD = {
	4: "creator_id",
	3: "admin_ids",
	2: "editor_ids",
	1: "whitelist_ids",
	0: None,
	}

def userAuthorizationLevel ( did:ObjectId, uid:str ):
	'''
	Returns user's authorization level.
	
	If the deck is public, the default authorization for the nonpriveledged is 1, which is the same as the whitelist authorization for private decks.
	'''
	# if not ( deck := decks_db.find_one({"_id": did}) ):	return -1
	# Testing if this works faster
	deckQuery = {"_id": did}
	deckProjection = {"creator_id":1, "admin_ids":1, "editor_ids":1, "whitelist_ids":1, "private":1 }
	if not ( deck := decks_db.find_one(deckQuery, deckProjection)):	return -1

	defaultAuthorization =  0 if deck["private"] else 1

	# pprint(deck)
	if uid == deck["creator_id"]: 			return AUTH_LEVEL["owner"]
	elif uid in deck["admin_ids"]: 			return AUTH_LEVEL["admin"]
	elif uid in deck["editor_ids"]:			return AUTH_LEVEL["editor"]
	elif uid in deck["whitelist_ids"]:	return AUTH_LEVEL["whitelist"]
	else: 															return defaultAuthorization

# TO DO : UNWANTED BEHAVIOR BUT I DONT REALLY CARE : 
# If a deck is public the user can still be upgraded to be whitelisted for it.
# This doesn't really matter though as the whitelist_ids field isn't used for 
# public decks
def authorizeUser ( did:ObjectId, utoken:str, tuid:ObjectId, level:int ):
	'''
	:Parameters:
	- `did`: Deck ID.
	- `utoken`: Token of Privileged User.
	- `tuid`: uid of target user recieving promotion.
	
	Makes the target user id (tuid) recieve authorization on specified deck id.\n
	Only possible if the requesting userid has enough AUTH_LEVEL to promote people.

	>>> ex: owner(4) can promote people to admin(3), editor(2), whitelist(1)
	>>> ex: admin(3) can promote people to editor(2), whitelist(1)
	>>> ... etc
	'''
	if ( level > 3 or level < 0):
		print("Invalid promotion level")
		return -1

	if not (uid := auths.getUid(utoken) ):
		return -1

	promoters_auth = userAuthorizationLevel(did, uid) 
	targets_auth= userAuthorizationLevel(did, tuid)

	if ( targets_auth >= promoters_auth ):
		print(targets_auth, promoters_auth)
		print("User has no authority over target user")
		return -1
	
	if (promoters_auth > level):
		# User will be pulled from old field once they are pushed to the new.
		new_field, old_field  = DECK_AUTH_FIELD[level], DECK_AUTH_FIELD[targets_auth]
		print("new_field:",new_field, "  old_field:", old_field)

		query = {"_id": did}

		if (new_field != None):
			update_push = {"$push": {new_field: tuid} }
			decks_db.update_one(query, update_push)

		if (old_field != None):
			remove_pull = {"$pull": {old_field: tuid}}
			decks_db.update_one(query,remove_pull)

	return 0


if (__name__  == "__main__"):
	users_db.drop()
	decks_db.drop()
	# Creates an index for the name of decks. 
	# CollationStrength.SECONDARY means that this index should be case-insensitive, useful for searching.
	decks_db.create_index("name", collation=Collation(locale="en_US", strength= CollationStrength.SECONDARY) )
	uid1 = users.createUser("h0@gmail.com", "Billy Bob", "123")
	uid2 = users.createUser("h1@gmail.com", "Jean Lam", "123")

	users.attemptLogin("h0@gmail.com", "123")
	users.attemptLogin("h1@gmail.com", "123")
	utoken1 = auths.getToken("h0@gmail.com")
	utoken2 = auths.getToken("h1@gmail.com")

	
	did = createDeck( "CULTURE STUDY", ["Culture", "Manga", "Anime", "UWU"], utoken1, False )

	did2 = createDeck( "My private deck >:(", ["Private", "Study", "Pogchamps"], utoken1, True )

	
	# authorizeUser(did, utoken1, uid2, 3)
	# authorizeUser(did, utoken1, uid2, 2)
	# authorizeUser(did, utoken1, uid2, 1)
	# authorizeUser(did, utoken1, uid2, 0)

	searchResult = searchDecks(name = "CULT", tags=["Culture", "UWU"] )
	for i in searchResult:
		pprint(i)

	# addComment(did, utoken1, "This deck sucks! Terrible!")
	# addComment(did, utoken1, "Nevermind this deck is ok! Just ok!")
	# addComment(did, utoken2, "Great deck but not as good as Haskell")
	# addComment(did, utoken2, "Just ok")
	# addComment(did, "invalid utoken", "Just ok")

	# addRating(did, utoken1, 5)
	# addRating(did, utoken2, 4)
	# addRating(did, utoken1, 3)
	# addRating(did, utoken1, 2)
	# addRating(did, utoken1, 1)
	# addRating(did, utoken2, 5)