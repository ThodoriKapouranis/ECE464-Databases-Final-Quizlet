import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/layout'
import React from 'react'
import Header from '../../components/header'
import "./decks.css"
import ImageUploading from 'react-images-uploading';
import { uploadCard } from '../../api/api'
import { useParams } from 'react-router'

export default function DeckAddCard() {
  const {did} = useParams()
  const [frontFields, setFront] = React.useState([])
  const [frontIdList, setFrontIdList] = React.useState([])
  const [frontId, setFrontId] = React.useState(0)

  const [backFields, setBack] = React.useState([])
  const [backIdList, setBackIdlist] = React.useState([])
  const [backId,setBackId] = React.useState(0)

  const [frontImages, setFrontImages] = React.useState([]);
  const [backImages, setBackImages] = React.useState([]);

  const maxImagePerField = 1

  // Create the component and set their ids to the next available id
  // f0 f1 f2 f3 ...
  // b0 b1 b2 b3 ...
  const addFrontComponent = (HTMLelement) => {
    setFront([...frontFields, HTMLelement('f', frontId)])
    setFrontId(frontId+1)
  }

  const addBackComponent = (HTMLelement) => {
    setBack([...backFields, HTMLelement('b', backId)])
    setBackId(backId+1)
  }

  const removeFrontComponent = (i) => {
    let newFrontFields = frontFields
    newFrontFields.splice(i)
    setFront( newFrontFields )
  }

  const textField = (fb,i) => <Flex flexDirection="row" id={`${fb}${i}`}>
    <Box w="80%">
      <input id={`${fb}txt${i}`} placeholder="Text goes here" 
      name={`${fb}txt${i}`}
      className="grabme"/>
    </Box>
    <Box w="20%">
      <Button className="delete-field">❌</Button>
    </Box>
  </Flex>

  const imageField = (fb, i) => <Flex flexDirection="row" id={`${fb}${i}`}>
    <Box w="80%">
      <input 
        type="file" 
        name={`${fb}img${i}`}
        className="grabme"
        id={`${fb}img${i}`}  accept="image/*" 
      />
    </Box>
    <Box w="20%">
      <Button className="delete-field">❌</Button>
    </Box>
  </Flex>

  const audioField = (fb, i) => <Flex flexDirection="row" id={`${fb}${i}`}>
    <Box w="80%">
      <input 
        type="file" 
        name={`${fb}aud${i}`}
        className="grabme"
        id={`${fb}aud${i}`} accept=".mp3" 
      />
    </Box>
    <Box w="20%">
      <Button className="delete-field">❌</Button>
    </Box>
  </Flex>

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
      onClick={() => addBackComponent(textField)}> Text </Button>

    <Button className="add-field field1" backgroundColor="#66FF66"
      onClick={() => addBackComponent(imageField)}> Image </Button>
      
    <Button className="add-field field1" backgroundColor="#66B2FF"
      onClick={() => addBackComponent(audioField)}> Audio </Button>
  </HStack>


  const renderComponents = (listOfComponents) => 
  listOfComponents.map( (component) =>  component) 

  const submitForm = () => {
    let front = document.getElementById("front-container")
    let back  = document.getElementById("back-container")


    let frontForm = new FormData(front)
    let backForm = new FormData(back)
    uploadCard(did, frontForm, backForm)
  }

  return (
    <>
      <Header/>
      <VStack justifyContent="center" alignContent="center" textAlign="center">
        {/* Front side of the card */}
        <Box>
          <Text> Front side </Text>
          <form id="front-container" method="post" enctype="mutlipart/form-data"> 
            {renderComponents(frontFields)}
          </form>

          {addFrontFieldButtons()}
        </Box>

        {/* Back side of the card */}
        <Box>
          <Text> Back side</Text>
          <form id="back-container" method="post" enctype="mutlipart/form-data"> 
            {renderComponents(backFields)}
          </form>

          {addBackFieldButtons()}
        </Box>
        <Button onClick={()=> submitForm()}> Add card </Button>
      </VStack>
      
    </>
  )
}
