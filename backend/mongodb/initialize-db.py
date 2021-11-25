from enum import unique
from flask_pymongo import PyMongo
from pymongo import MongoClient
from settings import MONGO_URI
Client = MongoClient(MONGO_URI)
db = Client["Quizlet"]

users_db = db.users
auths_db = db.auths
decks_db = db.decks
cards_db = db.cards

users_db.create_index(("email"), unique=True)
users_db.create_index(("username"), unique=True)
