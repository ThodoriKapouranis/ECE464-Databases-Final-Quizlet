from bson.objectid import ObjectId
import pymongo
from datetime import datetime
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

def createDeckobject( deckName:str, tags:"list[str]", uid:str, private:bool ):
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
    decks_db.insert_one(deck)



if (__name__  == "__main__"):
    users.createUser("h0@gmail.com", "Billy Bob", "123")
    users.attemptLogin("h0@gmail.com", "123")
    utoken = auths.getToken("h0@gmail.com")
    print(utoken)
    
    createDeck( "CULTURE STUDY", ["Culture", "Manga", "Anime", "UWU"], utoken, False )
