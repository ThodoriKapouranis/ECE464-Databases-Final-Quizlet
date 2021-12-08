import { Image } from '@chakra-ui/image'
import { Box, Divider, Text, VStack } from '@chakra-ui/layout'
import React from 'react'
import { useParams } from 'react-router'
import { studyDeck } from '../../api/api'
import Header from '../../components/header'

export default function DeckStudy() {
  const {did} = useParams()
  const [cards, setCards] = React.useState(null)

  const renderCards = cards => cards.map( card => <>
    <Box 
      marginBottom="60px" 
      minW="500px"
      textAlign="center"
      border="solid" borderWidth="2px" borderRadius="25px" backgroundColor="white"
    >
      {renderSide( card.front)}
      <Divider/>
      {renderSide( card.back)}
    </Box>
    

  </>)


  const renderSide = cardSide => Object.keys(cardSide).map( key => {
    let field_type = Object.keys(cardSide[key])[0]
    let field_content = Object.values(cardSide[key])[0]
    
    if (field_type === 'txt')
      return  <Text> {field_content} </Text>
    
    else if (field_type === 'img')
      return <Box>
              <Image 
                src={`http://127.0.0.1:5000/media/${field_content}`}
                maxW="400px"
              /> 
              </Box>
    
    else if (field_type === 'aud')
      return <p>Audio is supposed to go here :|</p>

  })

  React.useEffect(() => {
    studyDeck(did).then (data => {
      if (data["status"] === 200){
        setCards(data["cards"])
      }
      else {
        alert("ERROR FINDING CARDS")
      }
    })
  }, [did])
  return (
    <div>
      <Header/>
      <VStack>
        {cards ? renderCards(cards) : <></>}
      </VStack>
    </div>
  )
}
