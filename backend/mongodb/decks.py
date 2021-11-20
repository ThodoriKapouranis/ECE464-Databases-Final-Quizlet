from bson.objectid import ObjectId
import pymongo
from datetime import datetime

from pymongo.message import update
from mongoCredentials import MONGO_URI
from pprint import pprint
import secrets
import auths
import users

client = pymongo.MongoClient(MONGO_URI)

db = client.Quizlet
users_db = db.users
decks_db = db.decks
cards_db = db.cards

#########
# Decks #
#########

def createDeckobject( deckName:str, tags:"list[str]", uid:ObjectId, private:bool ):
	return {
			"deck_name": deckName,
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

def createDeck ( deckName:str, tags:"list[str]", utoken:str, private:bool ):
	
	if not (uid := auths.getUid(utoken)) :
		print("Invalid user!")
		return -1
	
	deck = createDeckobject(deckName, tags, uid, private)
	result = decks_db.insert_one(deck)
	return result.inserted_id
	
############
# Comments #
############

def createCommentObject( uid:ObjectId, content:str ):
	return {
		"uid": uid,
		"content": content,
		"date_created": datetime.now()
	}

def addComment( did:str, utoken:str, content:str ):
	
	if not (uid := auths.getUid(utoken)):
		print("Invalid user trying to comment!")
		return -1
	
	comment = createCommentObject(uid, content)
	
	query = {"_id": did }
	update = {"$push": {"comments": comment}}
	deck = decks_db.find_one_and_update(query, update)

###########
# Ratings #
###########
def createRatingObject( uid:ObjectId, rating:int ):
	return {
		"uid": uid,
		"rating": rating,
	}

def addRating( did:ObjectId, utoken:str, rating:int ):
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
authLevel = {
	"owner": 4,
	"admin": 3,
	"editor": 2,
	"whitelisted": 1,
}

def userAuthorizationLevel( did:ObjectId, utoken:str ):
	'''
	Returns user's authorization level.
	
	If the deck is public, the default authorization for the nonpriveledged is 1, which is the same as the whitelist authorization for private decks.
	'''
	if not ( uid := auths.getUid(utoken) ):
		return -1

	if not ( deck := decks_db.find_one({"_id": did}) ):
		return -1
	
	defaultAuthorization =  0 if deck["private"] else 1

	if uid == deck["creator_id"]:
		return 4
	elif uid in deck["admin_ids"]:
		return 3
	elif uid in deck["editor_ids"]:
		return 2
	elif uid in deck["whitelist_ids"]:
		return 1
	else: 
		return defaultAuthorization


# To do
def authorizeUser( did:ObjectId, utoken:str, tuid:ObjectId):
	'''
	:Parameters:
	- `did`: Deck ID.
	- `utoken`: Token of Privileged User.
	- `tuid`: uid of target user recieving promotion.
	
	Makes the target user id (tuid) recieve authorization on specified deck id.\n
	Only possible if the requesting userid has enough authLevel to promote people.

	>>> ex: owner(4) can promote people to admin(3), editor(2), whitelisted(1)
	>>> ex: admin(3) can promote people to editor(2), whitelisted(1)
	>>> ... etc
	
	'''
	# Check utoken's 
	return 0


if (__name__  == "__main__"):
	users_db.drop()
	decks_db.drop()
	
	users.createUser("h0@gmail.com", "Billy Bob", "123")
	users.createUser("h1@gmail.com", "Jean Lam", "123")

	users.attemptLogin("h0@gmail.com", "123")
	users.attemptLogin("h1@gmail.com", "123")
	utoken = auths.getToken("h0@gmail.com")
	utoken2 = auths.getToken("h1@gmail.com")

	
	did = createDeck( "CULTURE STUDY", ["Culture", "Manga", "Anime", "UWU"], utoken, False )

	did2 = createDeck( "My private deck >:(", ["Private", "Study", "Pogchamps"], utoken, True )
	
	addComment(did, utoken, "This deck sucks! Terrible!")
	addComment(did, utoken, "Nevermind this deck is ok! Just ok!")
	addComment(did, utoken2, "Great deck but not as good as Haskell")
	addComment(did, utoken2, "Just ok")
	addComment(did, "invalid utoken", "Just ok")

	addRating(did, utoken, 5)
	addRating(did, utoken2, 4)
	addRating(did, utoken, 3)
	addRating(did, utoken, 2)
	addRating(did, utoken, 1)
	addRating(did, utoken2, 5)

	print(userAuthorizationLevel(did, utoken), 
				userAuthorizationLevel(did, utoken2),
				"\n",
				userAuthorizationLevel(did2, utoken),
				userAuthorizationLevel(did2, utoken2),
	)







