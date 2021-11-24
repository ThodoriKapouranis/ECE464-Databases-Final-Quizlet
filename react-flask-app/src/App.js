import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {ChakraProvider, Switch} from "@chakra-ui/react";
import Header from './components/header';
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';



function App() {

  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    fetch('/api/time').then( res => res.json())
      .then(data => { setCurrentTime(data.time)})
  }, [])

  return (
    <ChakraProvider> 

      <div className="App">

        <header className="App-header">
          <Header> </Header>
        </header>

      <Routes>
        <Route exact path="/login" component={<Login/>} />
      </Routes>

      </div>
    </ChakraProvider>
  );
}

export default App;
