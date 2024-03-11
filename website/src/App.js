import './App.css';

import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages";
import Authenticate from './pages/login';
import MessagesPage from './pages/messages';
import Loc from './pages/map';

//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import Home from './Home';
//import About from './About';
//import Contact from './Contact';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Authenticate/>} />
          <Route path="/messages" element={<MessagesPage/>} />
          <Route path="/map" element={<Loc/>} />
        </Routes>
    </BrowserRouter>
  );
};

/*function App() {
  return (
    <div>
      <Authenticate />
    </div>
  );
}*/

export default App;
