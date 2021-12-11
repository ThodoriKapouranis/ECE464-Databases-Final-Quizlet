import json
import secrets
import os
from pprint import pprint
from bson import json_util
from bson.objectid import ObjectId
from flask import request, send_from_directory
from bson.json_util import dumps, loads
from werkzeug.datastructures import FileStorage
from main import app
from mongodb import users, decks, auths, cards


# 200 code :: Good 
# 400 code :: Bad Request (use as generic error code)
# 404 code :: Requested information DNE (good response, but db object DNE)
MEDIA_PATH = "media/"

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# Register page
@app.route("/register", methods=['POST'])
def registerUser():
    data = request.json
    res = users.createUser(data["email"], data["username"], data["password"])
    return {"status": 200 } if res!=-1 else {"status": 400 }

# Login Page
@app.route("/login", methods=["POST"])
def login():
  data = request.json
  res = users.attemptLogin(data["email"], data["password"])
  if (res != None):
    return {"status":200, "username": res[0], "token": res[1] }
  else:
    return {"status":400 }

# Logout, deletes token from db
@app.route("/logout", methods=["POST"])
def logout():
  data = request.json
  res = auths.deleteToken( data["token"] )
  return {"status":200} if res else {"status":400}

@app.route("/checkToken", methods=["POST"])
def checkToken():
  '''
  This is called when the header is rerendered and the token hasnt been
  checked for at least {2} minutes. Checks to see if token is still valid.
  '''
  data = request.json
  res = auths.checkUserExist( data["token"] )
  if ( res != None):
    return {"status":200}
  else:
    return {"status":400}

# Get user by name
# /search/users/user?=asdfasdf 
@app.route("/search/users/<username>", methods=["GET"])
def searchUsers(username):
  res = users.getUsersByName(username)
  if (res != None):
    res = json.loads( dumps(res) )
    return {"status":200, "users": res}
  else:
    return {"status":400}

@app.route("/search/decks/", methods=["GET"])
def searchDecks():
  name = request.args.get('name')
  tags = request.args.get('tags').split(",")
  rating = request.args.get('rating')
  if rating != "":
    rating = int(rating)
  pprint(name)
  pprint(tags)
  pprint(rating)
  res = decks.searchDecks(name=name, tags=tags, rating=rating)
  if ( res != None):
    res = json.loads( dumps(res) )
    return { "status":200, "decks": res }
  else:
    return { "status":400 }

@app.route("/search/email/", methods=["GET"])
def searchEmail():
  email = request.args.get("email")
  name = users.getUserByEmail(email)
  return "<p> email </p>"


@app.route("/deck/create", methods=["POST"])
def createDeck():
  data = request.json
  tags = data["tags"].split(" ")
  did = decks.createDeck(data["name"] , tags, data["token"], data["privacy"])

  if (did != -1 and did != None):
    return {"status":200, "did": str(did)}
  else:
    return {"status":400}


# https://stackoverflow.com/questions/16586180/typeerror-objectid-is-not-json-serializable
# ObjectIDs cannot be sent through JSON easily.
# The solution is to use bson.json_util.dump to convert the JSON to a string which breaks up the 
# object id. Then we rebuild it back to JSON using json.load()
@app.route("/user/<username>/decks", methods=["GET"])
def requestUserDecks(username):
  res = decks.getUsersDecks(username)
  if (res != None):
    dids_created = [json.loads(dumps(i)) for i in res[0]]
    dids_favorited = [json.loads(dumps(i)) for i in res[1]]

    return {"status" : 200, 
            "created_decks": dids_created,
            "favorite_decks": dids_favorited
            }
  else:
    return {"status":400}

# # Single Deck view (Deck, comments, ratings)
# # url: did  | json: token
@app.route("/deck/<did>", methods=["POST"])
def getDeckInfo(did):
  # Get the user's tokens to figure out their authorization level
  # so that the proper things are returned to the frontend 
  # for better user-specific rendering.
  data = request.json
  utoken = data["token"]
  uid = auths.getUid(utoken)

  deck = decks.getDeck( ObjectId(did) )
  if (deck != None and uid != None):
    # Write the code to average the ratings to display on frontend
    # ratingAverage = 0
    # listOfRatings = res["ratings"]
    # for i in listOfRatings:
      # ...
    authLevel = decks.userAuthorizationLevel(ObjectId(did), uid)
    deckJson = json.loads( dumps(deck) )
    avgRating = decks.getRating( ObjectId(did) )
    return {"status":200, "deck": deckJson, "authLevel":authLevel,  "rating": avgRating}
  else:
    return {"status":400}

@app.route("/deck/<did>/comment", methods=["POST"])
def addComment(did):
  data = request.json
  comments = data["comment"]
  token = request.headers["token"]
  # def addComment ( did:str, utoken:str, content:str ):
  res = decks.addComment(ObjectId(did), token, comments)
  return {"status": res}

@app.route("/deck/<did>/favorite", methods=["POST"])
def addToFavorite(did):
  data = request.json
  token = data["token"]
  res = users.toggleFavorite(ObjectId(did), token)

  if (res != -1):
    return {"status":200}
  else:
    return {"status":400}

# # Add comment (visible on single deck page)
# url: did | json: comment, token
# @app.route("/deck/<did>/comment", methods=["POST"])
# def addDeckComment():

# # Add rating (visible on single deck page)
# # url: did | json: comment, token
@app.route("/deck/<did>/rate", methods=["POST"])
def addDeckRating(did):
  data = request.json
  token = data["token"]
  rating = data["rating"]

  res = decks.addRating(ObjectId(did), token, rating)
  return {"status": res}

# # Promote someone's auth lv
@app.route("/deck/<did>/authorize", methods = ["POST"])
def authorizeUser(did):
  data = request.json

  token = data["token"]
  user = data["username"]
  level = data["level"]

  res = decks.authorizeUser(ObjectId(did), token, user, level)

  if (res != -1):
    return {"status": 200}
  else:
    return {"status": 400}

#ftxt0
#fimg34
class Tag:
  def __init__(self, tag):
    self.side = tag[0]
    self.type = tag[1:4]
    self.id = tag[4:]


@app.route("/deck/<did>/add", methods=["POST"])
def addCard(did):

  data = request.form
  files = request.files
  token = request.headers["token"]

  front = {}
  back = {}
  pprint(token)
  pprint(data)
  
  # These are all the text fields
  for key in data:
    tag = Tag(key)
    field = {tag.type: data[key]} # {"img", URL}
    if (tag.side == "f"):
      front[tag.id] = field  # {0 : {"img", URL}}
    elif (tag.side == "b"):
      back[tag.id] = field

  for key in files:
    tag = Tag(key)
    secret = secrets.token_hex()
    file = files[key]
    field = {tag.type: secret}
    file.save(MEDIA_PATH + secret)

    if (tag.side == "f"):
      front[tag.id] = field  # {0 : {"img", URL}}
    elif (tag.side == "b"):
      back[tag.id] = field

  pprint(front)
  pprint(back)

  # Use ORM function to actually create this object
  res = cards.createCard( ObjectId(did), token, front, back)
  if res != -1:
    return {"status": 200}
  else:
    return {'status': 400}


@app.route('/media/<path:path>')
def send_media(path):
  return send_from_directory( MEDIA_PATH, path, as_attachment=True )

@app.route("/deck/<did>/study", methods=["GET"])
def getFullDeck(did):
  token = request.headers["token"]
  
  # res[0] user auth
  # res[1] cursor object
  res = cards.getDecksCards(ObjectId(did), token)
  if (res[1] != -1):
    res[1] = json.loads( dumps(res[1]) ) 
    return {"status": 200, "auth": res[0], "cards": res[1]} 
  else :
    return {"status": 400}

@app.route("/deck/<did>", methods = ["DELETE"])
def deckDelete(did):
  utoken = request.headers ["token"]
  uid = auths.getUid(utoken)
  res = decks.deleteDeck( ObjectId(did), uid )
  if (res == 0 ):
    # res = json_util.loads( dumps(res) )
    return {"status": 200}
  else:
    return {"status": res}


@app.route("/deck/<did>/card/<cid>", methods=["DELETE"])
def cardDelete(did, cid):
  utoken = request.headers["token"]
  uid = auths.getUid(utoken)
  res = cards.deleteCard(ObjectId(did), ObjectId(cid), uid)
  if (res == 0):
    return {"status": 200}
  else:
    return {"status": 400}