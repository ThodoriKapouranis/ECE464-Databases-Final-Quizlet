# /venv/ is the folder generated when we installed flask.
from flask import Flask
from mongoCredentials import MONGO_URI # Connection link

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>";

