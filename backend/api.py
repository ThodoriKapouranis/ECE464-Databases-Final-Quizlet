# /venv/ is the folder generated when we installed flask.
import pymongo
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>";



