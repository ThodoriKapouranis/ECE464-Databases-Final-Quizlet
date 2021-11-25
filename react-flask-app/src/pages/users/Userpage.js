import { Box, Flex, Text, VStack } from '@chakra-ui/layout'
import React from 'react'
import { useParams } from 'react-router'
import { getUserDecks } from '../../api/api'
import Header from '../../components/header'

export default function Userpage() {

    const favorites = () => <Box marginTop="40px">
      <Text className="large-text"> Favorited Decks </Text>
    </Box>

    const created = () => <Box marginTop="40px">
      <Text className="large-text"> Created Decks </Text>
    </Box>

    const {username} = useParams()

    React.useEffect(() => {
      getUserDecks(username)
    },[username])

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
