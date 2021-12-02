import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Flex, Text, VStack } from '@chakra-ui/layout'
import React from 'react'
import Header from '../../components/header'
import DeckSearchBar from './DeckSearchBar';

export default function DeckSearch() {

  const searchResult = () => <>
    <p> SEARCH RESULTS GO HERE</p>
  </>

  React.useEffect( () => {
    console.log(" DO THE API CALL! ")
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
