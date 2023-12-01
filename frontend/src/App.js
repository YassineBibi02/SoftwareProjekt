import React from 'react';
import SendMailScreenComponent from './pages/SendMailScreen/SendMailScreenComponent';
import LoginScreen  from './pages/LoginScreen';
import ReactDOM from 'react-dom';
import MainMenuScreenComponent from './components/MainMenuScreen/MainMenuScreenComponent';
import LessonsScreenComponent from './pages/LessonsOverviewScreen/LessonsScreenComponent';
import { BrowserRouter as Router, Route, Routes , Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  
import HereingefallenScreen from './pages/HereingefallenScreen';
import WatchLessonScreen from './pages/WatchLessonScreen/WatchLessonScreen';
import { LoginProvider } from './globals/globalContext';




function App() {
  return (
  <LoginProvider>
    <Router>
      <Routes>
        <Route exact path="/" element= { <MainMenuScreenComponent/> }/>
        <Route path ="/hereingefallen" element = {<HereingefallenScreen/>}/>
        <Route path="/login" element= { <LoginScreen/> }/>
        <Route path="/mail" element= { <SendMailScreenComponent/> }/>    
        <Route path="/lessons" element= { <LessonsScreenComponent/> }/>
        <Route path="/lessons/:lessonID" element={<WatchLessonScreen/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>       
    </Router>
  </LoginProvider>

  );  
}


export default App;