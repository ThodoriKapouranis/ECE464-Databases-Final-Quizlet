import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/layout'
import React from 'react'
import { useParams } from 'react-router'
import { getUserDecks } from '../../api/api'
import Header from '../../components/header'
import "../decks/decks.css"
import { Link } from "react-router-dom";

export default function Userpage() {

  const {username} = useParams()
  const [created_decks, setCreated] = React.useState(false)  
  const [favorited_decks, setFavorited] = React.useState(false)  

  
  React.useEffect(() => {
    getUserDecks(username).then( (data) => {
      setCreated(data.created_decks)
      setFavorited(data.favorite_decks)
    })
  },[username])

  const favorites = () => <Box marginTop="40px">
    <Text className="large-text"> Favorited Decks </Text>
    { favorited_decks ? renderDeckList(favorited_decks) : <></>}

  </Box>

  const created = () => <Box marginTop="40px">
      <Text className="large-text"> Created Decks </Text>
      { created_decks ? renderDeckList(created_decks) : <></>}
    </Box>

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
            {created()}
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
