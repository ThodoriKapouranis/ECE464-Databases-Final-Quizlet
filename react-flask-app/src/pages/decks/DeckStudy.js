import { Button } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import { Box, Divider, Text, VStack } from '@chakra-ui/layout'
import React from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { deleteCard, studyDeck } from '../../api/api'
import Header from '../../components/header'

export default function DeckStudy() {
  const {did} = useParams()
  const [cards, setCards] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [auth, setAuth] = React.useState(null)

  const renderCards = cards => cards.map( card => <>
    <Box id={card._id.$oid}
      minW="500px"
      textAlign="center"
      border="solid" borderWidth="2px" borderRadius="25px" backgroundColor="white"
    >
      {renderSide( card.front)}
      <Divider/>
      {renderSide( card.back)}
    </Box>
    { auth>2 ? <Button onClick={() => requestCardDelete(did, card._id.$oid)}> ❌ </Button> : <></> }

  </>)

  const addCardButton = () => <>
  { auth>1 ?
    <Link to={`/decks/${did}/add`} >
      <Button > Add card </Button> 
    </Link>
    : <></>
  }
  </>
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
    
    else if (field_type === 'aud'){
      return <Box>
              <audio 
                controls src={`http://127.0.0.1:5000/media/${field_content}`}> 
              </audio>
              </Box>
    }
  })

  const requestCardDelete = (did, cid) => {
    deleteCard(did, cid).then( data => {
      if (data.status === 200){
        // update the cards array to update the cid we DESTROYED
        for (var i = 0; i<cards.length; i++){
          if (cards[i]._id.$oid === cid){
            let newCards = cards
            newCards.splice(i,1)
            setCards([...newCards])
            console.log("set something")
            console.log(cards)
          }
        }
      }
      else {
        alert("Could not delete?")
      }
    })
  }

  React.useEffect(() => {
    studyDeck(did).then (data => {
      if (data["status"] === 200){
        setCards(data["cards"])
        setAuth(data["auth"])
      }
      else {
        setError(<>
          <Text> Could not open deck.</Text>
          <Text> Either you dont have  permission for this deck</Text>
          <Text> Or this deck doesnt exist.</Text>
        </>)
      }
    })
  }, [did])

  React.useEffect(() => {
    setCards(cards)
  }, [cards])

  return (
    <div>
      <Header/>
      <VStack>
        {addCardButton()}
        {error ? error : <></> }
        {cards ? renderCards(cards) : <></>}
      </VStack>
    </div>
  )
}
