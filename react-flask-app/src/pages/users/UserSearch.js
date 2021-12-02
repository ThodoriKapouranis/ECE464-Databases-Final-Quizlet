import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Flex, Text, VStack } from '@chakra-ui/layout'
import { addPrefix } from '@chakra-ui/styled-system'
import React from 'react'
import { searchUsers } from '../../api/api'
import Header from '../../components/header'
import UserSearchBar from './UserSearchBar'
import { Link } from "react-router-dom";
import "./users.css"
export default function UserSearch() {
  
  const [searchResults, setSearchResults] = React.useState(null)
  const [resultAmount, setResultAmount] = React.useState(null)

  const displayUsers = userList => userList.map( 
    user => <>
      <Link to={`/user/${user.username}`}>
        <Box className="user-box"> 
          <Text className="user-name"> {user.username}</Text>
        </Box>
      </Link>
    </>
  )
  const displayResultCount = () =>  <> 
    <p> Users found: {resultAmount} </p>
  </>

  React.useEffect(() => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let username = params.get('username')
    if ( username != null) { 
      searchUsers(username).then( data => {
        if ( data.status === 200){
          setSearchResults(data.users)
          setResultAmount(data.users.length)
        }
        else {
          setResultAmount(0)
          // Display to user that search resulted to no one
        }
      })
    }


  }, [])

  return (
    <div>
      <Header/>
      <Flex  w="100%" justifyContent="center" alignContent="center" textAlign="center" >
        
        <Box w="20%" 
          // backgroundColor="#5E8C61"
        > </Box>
        <Box w="20%" 
          // backgroundColor="#5E8C61"
        > </Box>
        
        <Box w="33%"> 
          <VStack>
            <UserSearchBar/>
            {searchResults ? displayUsers(searchResults) : <></>}
            {resultAmount ? displayResultCount() : <></>}

          </VStack>
        </Box>

        <Box w="20%" 
          // backgroundColor="#5E8C61"
        > </Box>
        <Box w="20%" 
          // backgroundColor="#5E8C61"
        > </Box>

      </Flex>
    </div>
  )
}
