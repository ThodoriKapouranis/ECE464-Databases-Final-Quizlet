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
  if (content["status"] === 200) {
    localStorage.setItem("token", content["token"])
    localStorage.setItem("validLoginDate", Date.now )
    localStorage.setItem("user", content["username"])

  }
  return content
}

// async function checkToken(){
//   let token = localStorage.getItem("token")

//   const rawResponse = await fetch("/checkToken", {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({token: token})
//   });
//   const content = await rawResponse.json();
  
//   if (content['status'] === 200){

//   }
//   return content

// }
export {registerUser, loginUser}