import json
import random
import string
from os import name
from bson.json_util import dumps, loads
from bson.objectid import ObjectId
from datetime import datetime
from pymongo.collation import Collation, CollationStrength
from pymongo.message import query, update

import mongodb.auths as auths
import mongodb.users as users
import mongodb.decks as decks
import mongodb.cards as cards
from flask_pymongo import PyMongo
from main import db

users_db = db.users
auths_db = db.auths
decks_db = db.decks
cards_db = db.cards
source = "generator/"
tags = open( source + "nouns.txt", "r")
line = tags.read()
tag_arr = line.split(",")


def createPassword(length):
    # choose from all lowercase letter
    char = string.ascii_letters + string.digits + string.punctuation
    result_str = ''.join(random.choice(char) for i in range(length))
    return result_str

def chooseNoun(arr, length):
    tag =[]
    for i in range(length):
        tag.append(random.choice(tag_arr))
    
    return tag
#create users
def fillUser():
    email = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"]
    f_name = open(source + 'f_names.txt', "r")
    #l_name = open('l_names.txt', "r")
    
    #idk why there is an error on my part for i, can u check for me :DDD
    for i, f_lines in enumerate(f_name):
        f_lines = f_lines[:-1]
        userEmail =  f_lines + str(i) + email[ random.randint(0,3) ]
        pwd = createPassword(random.randint(8,15))
        users.createUser (userEmail, f_lines, pwd)

def fillDeck():
    proj = {"name": 1}
    user_list = users_db.find({}, {"_id":1})


    for line in user_list:
        for i in range(random.randint(1,10)):
            name = chooseNoun(tag_arr, 1)[0]
            uid = line["_id"]
            tags = chooseNoun(tag_arr, random.randint(1,10))
            priv = random.randint(0,1)
            deck = decks.createDeckobject(name, tags, uid, bool(priv))
            result = decks_db.insert_one(deck)
            print( "name:", name, " tags:", tags)

            userQuery = {"_id": uid}
            userUpdate = {"$push": {"created_decks": result.inserted_id} }
            resultUser = users_db.update_one(userQuery, userUpdate)
        

if __name__ == "__main__":
    users_db.create_index(("email"), unique=True)
    users_db.create_index(("username"), unique=True)
    # fillUser()
    fillDeck()