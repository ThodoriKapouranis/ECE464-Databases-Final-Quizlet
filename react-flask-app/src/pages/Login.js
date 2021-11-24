import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { VStack, Box, Text,  Center } from '@chakra-ui/layout';
import React from 'react'
import Header from '../components/header'
import './forms.css'
import { AccordionButton } from "@chakra-ui/react";
export default function Login() {
  const [show, setShow] = React.useState(false)
  const toggleShow = () => setShow(!show)
  
  return (
    <div> 

      <Header/>
      <Center>
        
        <VStack>
          <Text class="form-text" > LOGIN </Text>

          <Input placeholder="Username" className="text-form"/>
        
          <Input placeholder="Password" type={show? "text":"password"} className="text-form"/>

          <Button  className="button-form"> Login </Button>
        </VStack>
      </Center>
    </div>

  )
}
