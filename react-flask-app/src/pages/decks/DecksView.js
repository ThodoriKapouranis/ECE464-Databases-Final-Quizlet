import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Center, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/layout'
import { Link } from "react-router-dom";
import React from 'react'
import Header from '../../components/header'
import './decks.css'
import "../forms.css"
export default function DecksView() {
  

  const searchArea = () => <>
    <Text className="large-text"> Search Decks </Text>
    <Input placeholder="Deck name" width="90%" className="text-form" id="deckname"/> 
    <Input placeholder="Tags, space seperated" width="90%" className="text-form" id="tags"/> 
    
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
    // Grab the tags from the tag search bar, split whitespace
    let tags = document.getElementById("tags").value.split(" ")
    // Filter out the empty splits (extra inputed whitespaces)
    tags = tags.filter( c => c !== "" )
    // Dont bother with keeping unique values, let backend do that shit

    let searchURL = `/decks/search/for?=${deckName}`

    for ( const [k,v] of Object.entries(tags) ){
      searchURL += "&tag" + k + "=" + v
    }

    window.location.href = searchURL


  }

  const favorites = () => <Box marginTop="40px">
    <Text className="large-text"> Favorited Decks </Text>
  </Box>

  const created = () => <Box marginTop="40px">
  <Text className="large-text"> Created Decks </Text>
</Box>

  const createButton = () => <>
    <Text className="large-text"  marginTop="40px"> Add new deck</Text>
      <Flex className="add-btn"><Link to={"/decks/create"} >+</Link></Flex>

    </>

  return (
    <div>
      <Header />
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
            {created()}
            {createButton()}
            {favorites()}
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
