import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { HStack, Text, VStack } from '@chakra-ui/layout'
import { Radio, RadioGroup } from '@chakra-ui/radio'
import React from 'react'
import { createDeck } from '../../api/api'
import Header from '../../components/header'
import "../forms.css"
import "./decks.css"


export default function DeckCreate() {

  const [privacy, setPrivacy] = React.useState(false)

  const submitForm = () => {
    let name = document.getElementById("name").value
    let tags = document.getElementById("tags").value
    createDeck(name, tags, privacy)

  }
  const privateRadio = () => <>
    <HStack>
      
      <Button backgroundColor={privacy ? "#ffffff" : "#94e8b4" }
      onClick={()=>setPrivacy(false)} className="search-btn"> 
        Public
      </Button>

      <Button backgroundColor={privacy ? "#94e8b4" : "#ffffff" }
      onClick={()=>setPrivacy(true)} className="search-btn"> Private </Button>
      
    </HStack>
  </>

  return (
    <div>
      <Header/>
      <VStack>
        <Text className="large-text"> Creating Deck </Text>
        
        <Input placeholder="Deck Name" className="text-form" id="name"/>
        <Input placeholder="Tags, space seperated" className="text-form" id="tags"/>
        {privateRadio()}

        <Button className="search-btn" onClick={submitForm}> Create Deck </Button>
      </VStack>
    </div>
  )
}
