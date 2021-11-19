from bson.objectid import ObjectId
import pymongo
from datetime import datetime
from mongoCredentials import MONGO_URI
from pprint import pprint
import secrets

client = pymongo.MongoClient(MONGO_URI)

db = client.Quizlet
users = db.users
auths = db.auth
decks = db.decks
cards = db.cards

# "users" COLLECTION functions

def emailExists( email:str ):
    result = users.find_one( {"email":email}, {"email":1} )
    return True if result else False

def create_collection():
    return 0

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
    result = users.insert_one(user)

def getUsersByName( username:str ):
    return users.find( 
        {"username": {"$regex": username }},
        {"username":1, "favorite_deck_ids":1, "decks_created": 1, "create_date":1}
    )

def attemptLogin ( email: str, password:str ):   
    result = users.find_one( {"email":email, "password":password} )
    if result:
        auth = creatAuth(result["_id"])
    else:
        print("Wrong login, try again!")
        

def creatAuth( id:ObjectId ):
    # Check if authentication already exists for the user
    query = { "uid" : id }
    newDoc = {"$set" :  {
                "uid":id, 
                "token":secrets.token_hex(), 
                "login_time": datetime.now()}
            } 
    
    result = auths.update_one( query, newDoc, upsert=True )
    
    if not result:
        print("Could not add user to authentication table")
    else:
        pprint("LOGGED IN!")




if (__name__ == "__main__"):
    # users.drop()
    # auths.drop()
    createUser("h0@gmail.com", "Billy Bob", "123")
    attemptLogin("h0@gmail.com", "123")
    attemptLogin("h0@gmail.com", "124")


    # for x in getUsersByName("Billy"):
    #     pprint(x)


