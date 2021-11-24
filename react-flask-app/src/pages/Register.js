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
  const [missing, setMissing] = React.useState(false)

  const toggleShow = () => setShow(!show)
  

  const register = () => {
    setMissing(false)
    let email = document.getElementById("email").value
    let username = document.getElementById("user").value
    let password = document.getElementById("pass").value
    
    if (email === "" || password === "" || username === "" ){
      setMissing(true)
    }

    registerUser(email, username, password)
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

          { missing ? 
          <Text color="#F47174"> ERROR:  Missing fields </Text> 
          : 
          <></>}
        </VStack>
      </Center>
    </div>

  )
}
