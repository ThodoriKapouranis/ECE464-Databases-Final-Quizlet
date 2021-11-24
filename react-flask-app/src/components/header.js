import React from 'react'
import { Box } from "@chakra-ui/react"
import { Flex, HStack, Text } from "@chakra-ui/layout"
import { Input } from "@chakra-ui/input";
import { Link } from "react-router-dom";
import { validToken, logout, logoutUser } from '../api/api';
import './header.css'

export default function Header() {
  
  const [loggedIn, setLoggedIn] = React.useState(true)

  React.useEffect(() => {
    let token = localStorage.getItem("token")
    let loggedTime = localStorage.getItem("validLoginDate")
    if (token != null && loggedTime != null){
      let timeDiffSecs = (Date.now() - loggedTime)/1000
      
      // If it has been 2 minutes since last login token check,
      // do it again. Otherwise, use the stored information
      if (timeDiffSecs >= 1){
        validToken(token).then((bool) => setLoggedIn(bool))
      } 
      // Else, assume the user is still logged in (improved performance)
      else { setLoggedIn(true) }
      
    } else { setLoggedIn(false) }
  }, [])

  const logout = () => {
    logoutUser().then( () => {
      setLoggedIn(false)
      window.location.href='/'
    })
  }
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
        paddingLeft={"25px"} paddingRight={"50px"}
        justifyContent={"center"} alignItems={"center"}
        >
          {loggedIn ? 
          <HStack spacing="40px" w="100%" justifyContent="right">
            <Text className="welcome"> 
              {localStorage.getItem("username")}
            </Text>
            <Text className="logout" onClick={logout}> 
              Logout 
            </Text>
          </HStack> :
          <>
            <Link to={"/login"} className="login"> Login </Link>
            <Link to={"/register"} className="login"> Register </Link>
          </>
        }


        </Flex>

      </Flex>
    </HStack>
  )
}
