import json
from pprint import pprint
from bson.objectid import ObjectId
from flask import request
from bson.json_util import dumps, loads
from main import app
from mongodb import users, decks, auths, cards


# 200 code :: Good 
# 400 code :: Bad Request (use as generic error code)
# 404 code :: Requested information DNE (good response, but db object DNE)

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
  user = request.args.get('name')
  tags = request.args.get('tags').split(",")
  res = decks.searchDecks(name=user, tags=tags)
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
  token = data["token"]
  # def addComment ( did:str, utoken:str, content:str ):
  res = decks.addComment(ObjectId(did), token, comments )
  if (res != -1):
    return {"status":200}
  else:
    return {"status":400}

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
  if (res != -1): return {"status":200}
  else:           return {"status":400}

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

@app.route("/deck/<did>/add", methods=["POST"])
def addCard(did):

  data = request.form
  files = request.files
  pprint(data)
  pprint(files)
  file = files['fimg0']
  file.save("borpa.png")
  return {"status":200}