import React from 'react'
import Header from '../../components/header'

export default function DeckView() {
  return (
    <div>
      <Header/>
      <p> Make an API call to get the rating, comments, etc </p>
      <p> Actual card view will be under a different url probably</p>
      <p> Something like deck/study/:did maybe</p>
      <p> Maybe its too many API calls? idk</p>
      <p> Here is where you can rate, favorite, and comment on a deck</p>
      <p> If you own the deck you also have the option to give usernames admin/editor/whitelist permissions</p>
      <h3> Also here will be the add cards option if you have perms </h3>

    </div>
  )
}
