// here we go again

async function registerUser(email, username, password){
  const rawResponse = await fetch("/register", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: email, username:username, password:password})
  });
  const content = await rawResponse.json();
  return content
}

async function loginUser(email, password ){
  const rawResponse = await fetch("/login", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: email, password:password})
  });
  const content = await rawResponse.json();
  console.log(content)
  if (content["status"] === 200) {
    localStorage.setItem("token", content["token"])
    localStorage.setItem("validLoginDate", Date.now() )
    localStorage.setItem("username", content["username"])
  }
  return content
}

async function validToken(){
  let token = localStorage.getItem("token")

  const rawResponse = await fetch("/checkToken", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token: token})
  });
  const content = await rawResponse.json();
  
  console.log(content)
  if (content['status'] === 200){
    localStorage.setItem("validLoginDate", Date.now() )
    return true
  } else {
    localStorage.removeItem("token")
    return false
  }

}

async function logoutUser(){
  let token = localStorage.getItem("token")
  localStorage.removeItem("token")

  const rawResponse = await fetch("/logout", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token: token})
  });

  const content = await rawResponse.json();
  console.log(content)
  
}

async function createDeck(name, tags, privacy){
  let token = localStorage.getItem("token")
  const rawResponse = await fetch("/deck/create", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: name, tags:tags, privacy:privacy, token:token})
  });
  
  const content = await rawResponse.json()
  console.log(content)
  return content
}

async function getUserDecks(username){
  const rawResponse = await fetch(`/user/${username}/decks`, {
    method: "get",
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const content = await rawResponse.json()
  // content.created_decks = JSON.parse(content.created_decks)
  // content.created_decks = JSON.parse(content.favorited_decks)

  console.log(content)
  return content
}

async function requestDeckInfo(did){
  let token = localStorage.getItem("token")
  const rawResponse = await fetch(`/deck/${did}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"token": token})
  });
  const content = await rawResponse.json()
  console.log(content)
  return content
}

async function addComment(did, comment){
  let token = localStorage.getItem("token")
  const rawResponse = await fetch(`/deck/${did}/comment`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({comment:comment, token:token})
  });
  const content = await rawResponse.json()
  console.log(content)
  return content
}

async function addToFavorites(did){
  let token = localStorage.getItem("token")
  const rawResponse = await fetch(`/deck/${did}/favorite`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token:token})
  });
  const content = await rawResponse.json()
  console.log(content)
  return content
}

async function searchUsers(username){
  const rawResponse = await fetch(`/search/users/${username}`, {
    method: "get",
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const  content = await rawResponse.json()
  console.log(content)
  return content
}

async function searchDecks(deckname,tags){
  const rawResponse = await fetch(`/search/decks/?name=${deckname}&tags=${tags}`, {
    method: "get",
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const content = await rawResponse.json()
  console.log(content)
  return content
}

async function rateDeck(did, rating){
  let token = localStorage.getItem("token")
  const rawResponse = await fetch(`/deck/${did}/rate`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token:token, "rating": rating})
  });
  const content = await rawResponse.json()
  console.log(content)
  return content
}

async function authorizeUser(did, username, level){
  let token = localStorage.getItem("token")
  const rawResponse = await fetch(`/deck/${did}/authorize`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token:token, "username": username, "level": level})
  });
  const content = await rawResponse.json()
  console.log(content)
  return content
}

async function uploadCard(did, frontForm, backForm){
  let ultimateForm = new FormData()
  let token = localStorage.getItem("token")

  for ( var [k,v] of frontForm.entries()){
    ultimateForm.set(k,v)
  }
  for ( var [k,v] of backForm.entries()){
    ultimateForm.set(k,v)
  }

  for ( var [k,v] of ultimateForm.entries() ) {
    console.log("new one")
    console.log(k,v)
  }

  const rawResponse = await fetch(`/deck/${did}/add`, {
    method: 'POST',
    headers: {
      "enctype": "multipart/form-data",
      "token": token,
    },
    body: ultimateForm
  });
  const content = await rawResponse.json()
  console.log(content)
  return content
}

async function studyDeck(did){
  let token = localStorage.getItem("token")
  const rawResponse = await fetch(`/deck/${did}/study`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
  const content = await rawResponse.json()
  console.log(content)
  return content
}

async function deleteDeck(did){
  let token = localStorage.getItem("token")
  const rawResponse = await fetch(`/deck/${did}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
  const content = await rawResponse.json()
  console.log(content)
  return content
}

async function deleteCard(did, cid){
  let token = localStorage.getItem("token")
  const rawResponse = await fetch(`/deck/${did}/card/${cid}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
  const content = await rawResponse.json()
  console.log(content)
  return content
}

export {
  registerUser, loginUser, validToken, logoutUser, createDeck,
  getUserDecks, requestDeckInfo, addComment, addToFavorites, 
  searchUsers, searchDecks, rateDeck, authorizeUser, uploadCard,
  studyDeck, deleteDeck, deleteCard
}
