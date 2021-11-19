import pymongo
from datetime import datetime
from mongoCredentials import MONGO_URI
from pprint import pprint

client = pymongo.MongoClient(MONGO_URI)

db = client.Quizlet
users = db.users
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
        "favorite_deck_ids": []
    })

def createUser( email:str, username:str, password:str ):
    if ( emailExists(email) ): return -1

    # Check if username and password are valid?

    user = createUserObject(email, username, password)
    result = users.insert_one(user)

def getUsersByName( username:str ):
    return users.find( 
        {"username": {"$regex": username }},
        {"username":1, "favorite_deck_ids":1, "create_date":1}
    )
    
if (__name__ == "__main__"):
    users.drop()
    createUser("h0@gmail.com", "Billy Bob", "123")
    createUser("h1@gmail.com", "Bil", "123")
    createUser("h2@gmail.com", "Billy John", "123")
    createUser("h3@gmail.com", "Axel", "123")
    createUser("h4@gmail.com", "Lima", "123")

    for x in getUsersByName("Billy"):
        pprint(x)


