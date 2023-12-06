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
import EditLessonScreenComponent from './pages/EditLessonScreen/EditLessonScreenComponent';
import { LoginProvider } from './globals/globalContext';
import UserController from './pages/UserController';
import AchievementFrontend from './pages/AchievementsPage/AchievementFrontend';



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
        <Route path="/UserController" element= { <UserController/> }/>
        <Route path="/lessons/:lessonID" element={<WatchLessonScreen/>} />
        <Route path="/lessonEdit/:lessonID" element={<EditLessonScreenComponent/>} />
        <Route path="/achievements" element={<AchievementFrontend/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>       
    </Router>
  </LoginProvider>

  );  
}


export default App;