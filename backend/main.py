from flask_pymongo import PyMongo
from flask import Flask, request
from mongodb.settings import MONGO_URI

app = Flask(__name__)
app.config["MONGO_URI"] = MONGO_URI
client = PyMongo(app)
db = client.db


''' 
All the routes are located in routes.py

routes.py also imports all of the mongodb python files 
for api use.
'''

import routes