import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter,  Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Header from './components/header';
import Register from './pages/Register';
import Home from './pages/Home';
import DecksView from './pages/decks/DecksView';
import DeckCreate from './pages/decks/DeckCreate';
import Userpage from './pages/users/Userpage';
import DeckSearch from './pages/decks/DeckSearch';
import DeckView from './pages/decks/DeckView';
import UserSearch from './pages/users/UserSearch';
import DeckAddCard from './pages/decks/DeckAddCard';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/user/:username" element={<Userpage/>} />

        <Route path="/users/search" element={<UserSearch/>} />
        <Route path="/users/search/username" element={<UserSearch/>} />

        
        <Route path="/decks" element={<DecksView/>}/>
        <Route path="/decks/create" element={<DeckCreate/>} />        
        <Route path="/decks/search/" element={<DeckSearch/>} />
        
        <Route path="/decks/:did" element={<DeckView/>} />
        <Route path="/decks/:did/add" element={<DeckAddCard/>} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
