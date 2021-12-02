import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/layout'
import React from 'react'
import Header from '../../components/header'
import "./decks.css"

export default function DeckAddCard() {
  
  const [frontFields, setFront] = React.useState([])
  const [backFields, setBack] = React.useState([])

  
  const addFrontComponent = (HTMLelement) => {
    setFront([...frontFields, HTMLelement(frontFields.length)])
  }

  const addBackComponent = (HTMLelement) => {
    setBack([...backFields, HTMLelement])
  }

  const removeFrontComponent = (i) => {
    let newFrontFields = frontFields
    newFrontFields.splice(i)
    setFront( newFrontFields )
  }

  const textField = (i) => <Flex flexDirection="row">
    <Box w="80%">
      <Input placeholder="Text goes here" />
    </Box>
    <Box w="20%">
      <Button className="delete-field" onClick={()=>removeFrontComponent(i)}>❌</Button>
    </Box>
  </Flex>

  const imageField = <>
    <Input placeholder="Upload image somehow..." />
  </>

  const audioField = <>
    <Input placeholder="Upload audio somehow..." />
  </>

  const addFrontFieldButtons = () => <HStack>
    <Button className="add-field field1" backgroundColor="#FF6666"
      onClick={() => addFrontComponent(textField)}> Text </Button>

    <Button className="add-field field1" backgroundColor="#66FF66"
      onClick={() => addFrontComponent(imageField)}> Image </Button>
      
    <Button className="add-field field1" backgroundColor="#66B2FF"
      onClick={() => addFrontComponent(audioField)}> Audio </Button>
  </HStack>

  const addBackFieldButtons = () => <HStack>
    <Button className="add-field field1" backgroundColor="#FF6666"
      onClick={() => addBackComponent(<p>1</p>)}> Text </Button>

    <Button className="add-field field1" backgroundColor="#66FF66"
      onClick={() => addBackComponent(<p>1</p>)}> Image </Button>
      
    <Button className="add-field field1" backgroundColor="#66B2FF"
      onClick={() => addBackComponent(<p>1</p>)}> Audio </Button>
  </HStack>


  const renderComponents = (listOfComponents) => 
  listOfComponents.map( (component) =>  component) 

  return (
    <>
      <Header/>
      <VStack justifyContent="center" alignContent="center" textAlign="center">
        {/* Front side of the card */}
        <Box>
          <Text> Front side </Text>
          <Box id="front-container"> 
            <VStack>
              {renderComponents(frontFields)}
            </VStack>
          </Box>

          {addFrontFieldButtons()}
        </Box>

        {/* Back side of the card */}
        <Box>
          <Text> Back side</Text>
          <Box id="back-container"> 
            {renderComponents(backFields)}
          </Box>

          {addBackFieldButtons()}
        </Box>
      </VStack>
    </>
  )
}
