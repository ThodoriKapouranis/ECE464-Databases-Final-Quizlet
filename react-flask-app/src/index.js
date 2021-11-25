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

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/decks" element={<DecksView/>}/>
        <Route path="/decks/create" element={<DeckCreate/>} />
        <Route path="/user/:username" element={<Userpage/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
