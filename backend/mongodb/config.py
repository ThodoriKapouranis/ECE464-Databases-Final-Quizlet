from  flask import Flask
from flask_pymongo import PyMongo
from settings import MONGO_URI

app = Flask(__name__)
app.config["MONGO_URI"] = MONGO_URI


# Create the flask mongo object that the 
# api files will be using
client = PyMongo(app)
db = client.db