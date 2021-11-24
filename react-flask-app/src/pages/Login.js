import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { VStack, Box, Text,  Center } from '@chakra-ui/layout';
import React from 'react'
import Header from '../components/header'
import './forms.css'
import { AccordionButton } from "@chakra-ui/react";
import { loginUser } from "../api/api";


export default function Login() {
  const [show, setShow] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [failure, setFailure] = React.useState(false)
  const [errorCode, setErrorCode] = React.useState(false)

  const errors = {0: "Missing fields", 1: "Error logging in"}

  const toggleShow = () => setShow(!show)
  
  const login = () => {
    let email = document.getElementById("email").value
    let password = document.getElementById("pass").value
    if (email === "" || password === "" ){
      setFailure(true); setErrorCode( errors[0] ); setSuccess(false)
      return -1
    }

    const body = loginUser(email, password)
    body.then( (res) => {
      if (res['status']===200){ 
        setSuccess(true); 
        setFailure(false); 
        window.location.href="/";
      }
      else {setSuccess(false); setFailure(true); setErrorCode( errors[1] )}
    })

  }

  return (
    <div> 

      <Header/>
      <Center>
        
        <VStack>
          <Text class="form-text" > LOGIN </Text>

          <Input placeholder="Email" id="email" className="text-form"/>
        
          <Input placeholder="Password" id="pass" type={show? "text":"password"} className="text-form"/>

          <Button  className="button-form" onClick={login}> Login </Button>
          { failure ? 
          <Text color="#F47174"> {errorCode} </Text> 
          : 
          <></>}
          { success ? 
          <Text color="#72BDA3"> Logged in Transfer the user yo </Text> 
          : 
          <></>}

        </VStack>
      </Center>
    </div>

  )
}
