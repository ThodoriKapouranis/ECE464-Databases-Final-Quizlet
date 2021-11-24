// here we go again

async function registerUser(email, username, password ){
  const rawResponse = await fetch("/register", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: email, username:username, password:password})
  });
  const content = await rawResponse.json();
  console.log(content)
}


export {registerUser}