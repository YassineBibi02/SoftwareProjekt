import React from 'react';
import SendMailScreenComponent from './SendMailScreen/SendMailScreenComponent';
import LoginScreen  from './pages/LoginScreen';
import ReactDOM from 'react-dom';
import MainMenuScreenComponent from './components/MainMenuScreen/MainMenuScreenComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  



function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element= { <LoginScreen/> }/>
        <Route path="/menu" element= { <MainMenuScreenComponent/> }/>
        <Route path="/mail" element= { <SendMailScreenComponent/> }/>    
      </Routes>       
    </Router>
  );  
}


export default App;