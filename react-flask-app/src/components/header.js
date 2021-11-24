import React from 'react'
import { Box } from "@chakra-ui/react"
import { Flex, HStack } from "@chakra-ui/layout"
import { Input } from "@chakra-ui/input";
import { Link } from "react-router-dom";
import './header.css'

export default function Header() {
  
  return (
    <HStack  w="100%" h="8vh" margin={0} backgroundColor="#4e6151"> 

      <Flex flexDirection={"row"} flexGrow={1}>
        
        <Flex w="70%" h="8vh" paddingLeft={200} flexGrow={1} 
        justifyContent={"left"} alignItems={"center"}>
          {/* <Box className={"tile"}> Decks </Box> */}
          {/* <Box className={"tile"}> Users </Box> */}
        </Flex>

        <Flex w="30%" h="8vh" 
        // backgroundColor="#2a6151"
        paddingLeft={"25px"} paddingRight={"25px"}
        justifyContent={"center"} alignItems={"center"}
        >
          <Link to={"/login"} className="login"> Login </Link>
          <Link to={"/register"} className="login"> Register </Link>

        </Flex>

      </Flex>
    </HStack>
  )
}
