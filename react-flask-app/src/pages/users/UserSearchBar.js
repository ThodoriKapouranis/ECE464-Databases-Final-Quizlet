import React from 'react'
import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Flex, Text, VStack } from '@chakra-ui/layout'

export default function UserSearchBar() {
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

  const searchDecks = () => {
    let deckName = document.getElementById("deckname").value
    let searchURL = `/users/search/?username=${deckName}`
    window.location.href = searchURL
  }

  return <>
  {searchArea()}
  </>
}
