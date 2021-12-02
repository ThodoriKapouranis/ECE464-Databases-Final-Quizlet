import React from 'react'
import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Center, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/layout'
import { Link } from "react-router-dom";
import Header from '../../components/header'
import './decks.css'
import "../forms.css"


export default function DeckSearchBar() {

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

    let searchURL = `/decks/search/?name=${deckName}&tags=`

    for ( const  v of Object.values(tags) ){
      searchURL += v + ","
    }
    searchURL = searchURL.substr( 0, searchURL.length-1 )

    window.location.href = searchURL
  }

  return <>
    {searchArea()}
  </>
}
