from struct import error
from bson.objectid import ObjectId
import pymongo
import time
from pymongo.collation import Collation, CollationStrength
from pymongo.message import query, update
from mongoCredentials import MONGO_URI
from pprint import pprint
import secrets
import auths
import users
import decks

client = pymongo.MongoClient(MONGO_URI)

db = client.Quizlet
auths_db = db.auths
users_db = db.users
decks_db = db.decks
cards_db = db.cards

def createCardObject ( front:'list[dict]', back:'list[dict]' ):
  return {
    "front": front,
    "back": back,
  }

def createCard ( did:ObjectId, utoken:str, front:'list[dict]', back:'list[dict]'):
  '''
  Creates a card object and appends it to the decks "cards" field.
  '''
  # Check valid user, valid priveledges
  if ( (uid := auths.checkUserExist(utoken)) == -1) : return -1
  if ( (level := decks.userAuthorizationLevel(did, uid)) < 1) : return -1
  # Insert card into the cards collection
  insertResult = cards_db.insert_one(createCardObject(front, back))

  # Insert card id into the corresponding deck's "cards" field
  deckQuery = {"_id": did}
  deckUpdate = {"$push": {"cards": insertResult.inserted_id}}
  return insertResult, decks_db.update_one( deckQuery, deckUpdate) 

# Create a copy of a card (not a reference, but make a new card)
def createCardCopy ( cdid:ObjectId, tdid:ObjectId, utoken:str,  cid:ObjectId, *args,  **kwargs):
  '''
  Creates a copy of an existing card. 

  *Parameters*
  - `cdid` - Deck to copy card from
  - `tdid` - Deck to copy card to
  - `utoken` - User attempting the copy
  - `cid` - Card to copy from
  - `reference` (optional) - default False. If True, creates reference.
  '''
  if ( (uid := auths.checkUserExist(utoken)) == -1) : 
    print("user dne") 
    return -1

  if ( (res := decks.userAuthorizationLevel(cdid, uid)) < 1) :
    print("uid not good for cdid") 
    return -1

  if ( (res := decks.userAuthorizationLevel(tdid, uid)) < 1) :
    print(res)
    print("uid not good for tdid") 
    return -1

  reference = True if kwargs.get("reference") else False
  if (reference):
    decks_db.update_one( {"_id": tdid}, {"$push": {"cards": cid}} )
  
  else:
    card = cards_db.find_one( {"_id": cid} )
    insertResult = cards_db.insert_one(createCardObject(card["front"],card["back"]))
    deckQuery = {"_id": tdid}
    deckUpdate = {"$push": {"cards": insertResult.inserted_id}}
    return decks_db.update_one( deckQuery, deckUpdate )

def getDecksCards ( did:ObjectId, utoken:str ):
  '''
  Returns deck's cards if the user is priviledged.
  '''

  if ( (uid := auths.checkUserExist(utoken)) == -1) : return -1
  if ( userAuth := decks.userAuthorizationLevel(did, uid) < 1 ):
    print("User does not have access")
    return -1

  deckQuery = {"_id": did}
  deckProjection = {"cards":1} # We only want the cards from this search

  cardIds = []
  for i in  decks_db.find( deckQuery, deckProjection ):
    for j in i["cards"]:
      cardIds.append(j)

  return cards_db.find( {"_id": {'$in' :cardIds} } )

if (__name__  == "__main__"):
  users_db.drop()
  decks_db.drop()
  cards_db.drop()

  uid1 = users.createUser("h0@gmail.com", "Billy Bob", "123")
  uid2 = users.createUser("h1@gmail.com", "Jean Lam", "123")

  users.attemptLogin("h0@gmail.com", "123")
  users.attemptLogin("h1@gmail.com", "123")
  utoken1 = auths.getToken("h0@gmail.com")
  utoken2 = auths.getToken("h1@gmail.com")


  did1 = decks.createDeck( "CULTURE STUDY", ["Culture", "Manga", "Anime", "UWU"], utoken1, False )
  did2 = decks.createDeck( "My private deck >:(", ["Private", "Study", "Pogchamps"], utoken1, True )

  
  start = time.time()
  
  cardResult1 = createCard(did1, utoken1, [{"text": "COPY ME!"}], [{"text": "こんにちは"},{"image": "wave.png"}])
  cardResult2 = createCard(did1, utoken1, [{"text": "IM UNIQUE!"}], [{"text": "こんにちは"},{"image": "wave.png"}])

  cid1 = cardResult1[0].inserted_id
  cid2 = cardResult2[0].inserted_id

  createCardCopy(did1, did2, utoken1, cid1, reference=True)
  createCardCopy(did1, did2, utoken1, cid1, reference=True)
  createCardCopy(did1, did2, utoken1, cid1, reference=True)
  createCardCopy(did1, did2, utoken1, cid1, reference=True)
  createCardCopy(did1, did2, utoken1, cid1, reference=True)
  createCardCopy(did1, did2, utoken1, cid1, reference=True)
  createCardCopy(did1, did2, utoken1, cid1, reference=True)
  createCardCopy(did1, did2, utoken1, cid2 )
  createCardCopy(did1, did2, utoken1, cid2 )
  createCardCopy(did1, did2, utoken1, cid2 )
  createCardCopy(did1, did2, utoken1, cid2 )

  end = time.time()
  print("Time to create cards: ", end-start)

  start = time.time()
  cards = getDecksCards(did1, utoken1)
  end = time.time()
  print("Time to search for all cards: ", end-start)

  # for i in cards:
  #   pprint(i)