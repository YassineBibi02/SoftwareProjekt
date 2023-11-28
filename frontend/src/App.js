import React from 'react';
import SendMailScreenComponent from './pages/SendMailScreen/SendMailScreenComponent';
import LoginScreen  from './pages/LoginScreen';
import ReactDOM from 'react-dom';
import MainMenuScreenComponent from './components/MainMenuScreen/MainMenuScreenComponent';
import LessonsScreenComponent from './pages/LessonsOverviewScreen/LessonsScreenComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  
import HereingefallenScreen from './pages/HereingefallenScreen';
import WatchLessonScreen from './pages/WatchLessonScreen/WatchLessonScreen';



function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element= { <MainMenuScreenComponent/> }/>
        <Route path ="/hereingefallen" element = {<HereingefallenScreen/>}/>
        <Route path="/login" element= { <LoginScreen/> }/>
        <Route path="/mail" element= { <SendMailScreenComponent/> }/>    
        <Route path="/lessons" element= { <LessonsScreenComponent/> }/>
        <Route path="/lessons/:lessonID" element={<WatchLessonScreen/>} />
      </Routes>       
    </Router>
  );  
}


export default App;