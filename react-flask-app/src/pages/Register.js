import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { VStack, Box, Text,  Center } from '@chakra-ui/layout';
import React from 'react'
import Header from '../components/header'
import './forms.css'
import { AccordionButton } from "@chakra-ui/react";
import { registerUser } from "../api/api";

export default function Register() {
  const [show, setShow] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [failure, setFailure] = React.useState(false)
  const [errorCode, setErrorCode] = React.useState(false)

  const errors = {0: "Missing fields", 1: "Email is already registered"}
  
  const toggleShow = () => setShow(!show)
  

  const register = () => {
    setFailure(false)
    let email = document.getElementById("email").value
    let username = document.getElementById("user").value
    let password = document.getElementById("pass").value
    
    if (email === "" || password === "" || username === "" ){
      setFailure(true); setErrorCode( errors[0] ); setSuccess(false)
      return -1
    }

    const body = registerUser(email, username, password)
    body.then( (res) => {
      if (res['status']===200) {
        setSuccess(true)
        window.location.href="/login"
      } 
      else {setSuccess(false); setFailure(true); setErrorCode( errors[1] )}
    })
  }

  return (
    <div> 

      <Header/>
      <Center>
        
        <VStack>
          <Text class="form-text" > REGISTER </Text>

          <Input placeholder="E-mail" className="text-form" id="email"/>
          
          <Input placeholder="Username" className="text-form" id="user"/>
        
          <Input placeholder="Password" type={show? "text":"password"} className="text-form" id="pass"/>

          <Button className="button-form" onClick={register}> Register </Button>

          { failure ? 
          <Text color="#F47174"> {errorCode} </Text> 
          : 
          <></>}
          { success ? 
          <Text color="#72BDA3"> Registration success! </Text> 
          : 
          <></>}
        </VStack>
      </Center>
    </div>

  )
}
