import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Flex, Text, VStack } from '@chakra-ui/layout'
import React from 'react'
import Header from '../../components/header'

export default function UserSearch() {
  

  const searchArea = () => <>
  <Text className="large-text"> Search Users </Text>
  <Input placeholder="username" width="90%" className="text-form" id="deckname"/> 
  
  <Flex w="100%" flexDirection="row"> 
    <Box w="70%"></Box>
    <Box w="30%">
      <Button class="search-btn" cursor="pointer" onClick={searchDecks}> 
        Search 
      </Button>
    </Box>
  </Flex>
  </>

const searchResult = () => <>
  <p> SEARCH RESULTS GO HERE</p>
</>

  const searchDecks = () => {
    let deckName = document.getElementById("deckname").value
    let searchURL = `/users/username?=${deckName}`
    window.location.href = searchURL
  }

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
            {searchArea()}
            <p> Write the search API call </p>
            {searchResult()}
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
