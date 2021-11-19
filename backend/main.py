# /venv/ is the folder generated when we installed flask.
import pymongo
from flask import Flask
from mongoCredentials import MONGO_URI # Connection link

app = Flask(__name__)

client = pymongo.MongoClient(MONGO_URI)
db = client.test


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>";

