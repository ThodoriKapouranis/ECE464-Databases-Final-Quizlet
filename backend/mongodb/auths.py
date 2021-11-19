from bson.objectid import ObjectId
import pymongo
from datetime import datetime
from mongoCredentials import MONGO_URI
from pprint import pprint
import secrets

client = pymongo.MongoClient(MONGO_URI)

db = client.Quizlet
users_db = db.users
auths_db = db.auths

# Checks if given token is valid, if it is valid, returns the user's uid
def getUid ( token:str ) :
    if (auth := auths_db.find_one({"token":token})):
        return auth["uid"]
    else: 
        return None
        

# FOR DEBUGGING ONLY
def getToken( email:str ):
    if not (user := users_db.find_one({"email":email})):
        print("Invalid email, cannot find user.")
        return None
    if not (auth := auths_db.find_one({"uid":user["_id"]})):
        print("User is not logged in.")
        return None
    return auth["token"]

def attemptLogin ( email: str, password:str ):   
    result = users_db.find_one( {"email":email, "password":password} )
    if result:
        auth = creatAuth(result["_id"])
    else:
        print("Wrong login, try again!")
        

def creatAuth ( id:ObjectId ) :
    # Check if authentication already exists for the user
    query = { "uid" : id }
    newDoc = {"$set" :  {
                "uid":id, 
                "token":secrets.token_hex(), 
                "login_time": datetime.now()}
            } 
    
    result = auths_db.update_one( query, newDoc, upsert=True )
    
    if not result:
        print("Could not add user to authentication table")
    else:
        pprint("LOGGED IN!")


if (__name__ == "__main__"):
    #auths_db.drop()
    attemptLogin("h0@gmail.com", "123")
    attemptLogin("h0@gmail.com", "124")