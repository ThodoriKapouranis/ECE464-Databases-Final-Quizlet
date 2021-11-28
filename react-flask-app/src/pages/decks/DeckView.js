import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/layout'
import React from 'react'
import { render } from 'react-dom'
import { useParams } from 'react-router'
import { requestDeckInfo, addComment, addToFavorites } from '../../api/api'
import Header from '../../components/header'
import "../forms.css"
import "./decks.css"

export default function DeckView() {
  const {did} = useParams()
  const [deck, setDeck] = React.useState(false)

  const commentSearch = () => <>
    <Input placeholder="Comment here" className="text-form" id="comment"/>
    <Button className="search-btn" onClick={submitComment}> Comment </Button>
  </>

  const submitComment = () => {
    let comment = document.getElementById("comment").value
    if (comment === ""){
      alert("empty comment blegh")
      return
    }
    addComment(did, comment).then( data => {
      if (data.status === 200){
        window.location.reload()
      }
    })
  }
    
  const favoriteDeck = () => {
    addToFavorites(did)
  } 

  const renderDeck = (deck) => <>
    <VStack>
      <Text className="deck-name-display"> {deck.name}</Text> 
      <Button className="fav-btn" onClick={favoriteDeck} > 💖  </Button>
      <Button className="study-btn"> Study </Button>
      {commentSearch()}
      {renderComments(deck.comments)}
    </VStack>
  </>

  const renderComments = (comments) => comments.map( comment => {
    let unix_timestamp = comment.date_created.$date
    var date = new Date(unix_timestamp);
    var year = date.getFullYear()
    var month = date.getMonth()
    var day = date.getDate()

    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = year + "/" + month + "/" + day +"   " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return <Box marginBottom="24px"> 
      <HStack w="400px">
        <Text className="comment-user">{comment.username}</Text>
        <Text className="comment-date" flex={1}>{formattedTime} </Text>
      </HStack>
      <Text className="comment">{comment.content}</Text>
    </Box>
  })

  React.useEffect(() => {
    requestDeckInfo(did).then( data => {
      setDeck(data.deck)
    })
  }, [did])

  return (
    <div>
      <Header/>
      { deck ? renderDeck(deck) : <>WAAH</> }
      {/* <p> Make an API call to get the rating, comments, etc </p>
      <p> Actual card view will be under a different url probably</p>
      <p> Something like deck/study/:did maybe</p>
      <p> Maybe its too many API calls? idk</p>
      <p> Here is where you can rate, favorite, and comment on a deck</p>
      <p> If you own the deck you also have the option to give usernames admin/editor/whitelist permissions</p>
      <h3> Also here will be the add cards option if you have perms </h3> */}

    </div>
  )
}
