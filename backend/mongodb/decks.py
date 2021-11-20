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

# Decks

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
			"admin_ids": [uid],
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
	

# Comments

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






