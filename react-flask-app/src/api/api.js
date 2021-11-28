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
  const rawResponse = await fetch(`/deck/${did}`, {
    method: "get",
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const content = await rawResponse.json()
  content.deck.comments.reverse()
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

export {registerUser, loginUser, validToken, logoutUser, createDeck, getUserDecks, requestDeckInfo, addComment, addToFavorites}


