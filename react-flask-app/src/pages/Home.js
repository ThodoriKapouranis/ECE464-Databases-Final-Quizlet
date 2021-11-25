import React from 'react'
import Header from '../components/header'
import { VStack, Text, Box } from '@chakra-ui/layout'
import './Home.css'


export default function Home() {

  return (
    <div>
      <Header />
      
      <VStack>
        <Box w="50vw" justifyContent="center" textAlign="center"
        // backgroundColor="yellow"
        >
        <Text className="humongous"> 
          Welcome to our /generic/ flashcard app
        </Text>
        </Box>

        <Text className="huge">--> Create deck page  </Text>
        <Text className="huge">--> Search decks page </Text>
        <Text className="huge">--> Search users page </Text>
        <Text className="huge">--> Create cards </Text>
        <Text className="huge">--> Edit user groups </Text>
        <Text className="huge">--> View cards </Text>
        <Text className="huge">--> </Text>



      </VStack>
    </div>
  )
}
