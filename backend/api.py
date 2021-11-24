# /venv/ is the folder generated when we installed flask.
import pymongo
# from  mongodb import auths, decks, cards, users
import time
from flask import Flask

app = Flask(__name__)

@app.route("/api/time")
def getCurrentTime():
    return {'time': time.time()}


