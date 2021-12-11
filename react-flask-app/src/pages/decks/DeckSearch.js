import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/layout'
import React from 'react'
import { searchDecks } from '../../api/api'
import Header from '../../components/header'
import DeckSearchBar from './DeckSearchBar';
import "./decks.css"
import { Link } from "react-router-dom";

export default function DeckSearch() {

  const [searchResults, setSearchResults] = React.useState(null)
  const [resultAmount, setResultAmount] = React.useState(null)

  const displayResultCount = () =>  <> 
    <p> Decks found: {resultAmount} </p>
  </>
  // ok 

  const renderDeckList = decksJson => decksJson.map( deck => (
    <Link to={`/decks/${deck._id.$oid}`} >
      <Box className="deck-box" id={deck._id.$oid} >
        <Text className="deck-name" margin={0} > {deck.name} {deck.private ? "🔒" : false} </Text>
          {renderTags(deck.tags)}
      </Box>
    </Link>
  ))  

  const renderTags = tagList => <HStack maxWidth="500px" flexWrap="wrap">
    {tagList.map( tag => ( <Flex className="tag"> {tag} </Flex> ))}
  </HStack>


  React.useEffect( () => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let deckname = params.get('name')
    let rating = params.get("rating")
    let tags = params.get('tags')
    searchDecks(deckname, rating, tags).then( data => {
      if (data.status === 200){
        setSearchResults(data.decks)
        setResultAmount(data.decks.length)
      }
      else 
        setResultAmount(0)
    })
  }, [])

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
            <DeckSearchBar/>
            {searchResults ? renderDeckList(searchResults) :  <></>}
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
