# /venv/ is the folder generated when we installed flask.
import pymongo
# from  mongodb import auths, decks, cards, users
import time
from flask import Flask, request
from pprint import pprint

app = Flask(__name__)

@app.route("/time")
def getCurrentTime():
    return {'time': time.time()}

@app.route("/register", methods=['POST'])
def registerUse():
    data = request.json
    return {"response": 300 }

