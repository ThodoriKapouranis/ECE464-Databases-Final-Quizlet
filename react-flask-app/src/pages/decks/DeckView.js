import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import React from 'react'
import { render } from 'react-dom'
import { useParams } from 'react-router'
import { requestDeckInfo, addComment, addToFavorites } from '../../api/api'
import Header from '../../components/header'
import "../forms.css"

export default function DeckView() {
  const {did} = useParams()
  const [deck, setDeck] = React.useState(false)


  const renderDeck = (deck) => <>
    <p> {deck.name}</p>
  </>

  const commentSearch = () => 
  <Input placeholder="Comment here" className="text-form" id="comment"/>

  const submitComment = () => {
    let comment = document.getElementById("comment").value
    addComment(did, comment)
  }

  const favoriteDeck = () => {
    addToFavorites(did)
  } 

  React.useEffect(() => {
    requestDeckInfo(did).then( data => {
      setDeck(data.deck)
    })
  }, [did])

  return (
    <div>
      <Header/>
      { deck ? renderDeck(deck) : <>WAAH</> }
      { commentSearch()}
      
      <Button className="search-btn" onClick={submitComment}> Comment </Button>
      <Button className="search-btn" onClick={favoriteDeck} backgroundColor="salmon"> 
        Favorite 
      </Button>


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
