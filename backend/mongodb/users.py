import pymongo
from enum import unique
from bson.objectid import ObjectId
from datetime import datetime
from pprint import pprint
import secrets

from flask_pymongo import PyMongo
from main import db
import mongodb.auths as auths

users_db = db.users
auths_db = db.auths
decks_db = db.decks
cards_db = db.cards

# "users_db" COLLECTION functions
def createUserObject( email:str, username:str, password:str ):
    return({
        "username": username,
        "email": email,
        "password": password,
        "create_date": datetime.now(),
        "favorite_decks": [],
        "created_decks": []
    })

def createUser( email:str, username:str, password:str ):
    # Do not need to check if email exists
    # Since the index will take care of that.
    user = createUserObject(email, username, password)
    try:
        result = users_db.insert_one(user)
        return result.inserted_id
    except pymongo.errors.DuplicateKeyError:
        return -1

    return result.inserted_id

def getUsersByName( username:str ):
    return users_db.find( 
        {"username": {"$regex": username }},
        {"password":0}
    )

# Debugging only?
def getUserByEmail( email:str ):
    return users_db.find( {"email": email}, {"password":0} )

def attemptLogin ( email: str, password:str ):   
    result = users_db.find_one( {"email":email, "password":password} )
    if result:
        token = auths.creatAuth(result["_id"])
        return (result["username"], token)
    else:
        print("User does not exist")
        return None

def toggleFavorite ( did: ObjectId, utoken:str):

    if not (uid := auths.getUid(utoken)):
        print("INVALID USER TRYING TO DO SOMETHING@!")
        return -1
    query = {"_id": uid}
    arr = users_db.find_one(query, {"_id":0, "favorite_decks" : 1})

    if did not in arr["favorite_decks"]:
        insert = {"$push": {"favorite_decks": did} }
        res = users_db.update_one(query, insert)
    else:
        insert = {"$pull": {"favorite_decks": did} }
        res = users_db.update_one(query, insert)
    return res if res else -1
	
if (__name__ == "__main__"):
    # users_db.drop()
    # auths_db.drop()
    createUser("h0@gmail.com", "Billy Bob", "123")
    attemptLogin("h0@gmail.com", "123")
    attemptLogin("h0@gmail.com", "124")

