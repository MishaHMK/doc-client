import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Home } from './components/Home';
import { NavBar } from './components/NavBar';
import { BrowserRouter, Route, Routes, Link} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div className="container">
          <BrowserRouter>
                  <NavBar/>
                  <Routes>
                      <Route path="home" element={<Home/>} />
                      <Route path="register" element={<Register/>} />
                      <Route path="" element={<Login/>} />
                  </Routes>
          </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
