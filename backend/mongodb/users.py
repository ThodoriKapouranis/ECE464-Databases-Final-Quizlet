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

def emailExists( email:str ):
    result = users_db.find_one( {"email":email}, {"_id": 1} )
    return True if result else False

def createUserObject( email:str, username:str, password:str ):
    return({
        "username": username,
        "email": email,
        "password": password,
        "create_date": datetime.now(),
        "favorite_deck_ids": [],
        "decks_created": []
    })

def createUser( email:str, username:str, password:str ):
    if ( emailExists(email) ): return -1

    # Check if username and password are valid?

    user = createUserObject(email, username, password)
    result = users_db.insert_one(user)

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

if (__name__ == "__main__"):
    # users_db.drop()
    # auths_db.drop()
    createUser("h0@gmail.com", "Billy Bob", "123")
    attemptLogin("h0@gmail.com", "123")
    attemptLogin("h0@gmail.com", "124")

