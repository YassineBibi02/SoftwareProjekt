import React from 'react';
import SendMailScreenComponent from './pages/SendMailScreen/SendMailScreenComponent';
import LoginScreen  from './pages/LoginScreen';
import ReactDOM from 'react-dom';
import MainMenuScreenComponent from './components/MainMenuScreen/MainMenuScreenComponent';
import AchievementsOverviewScreenComponent from './pages/AchievementsOverviewScreen/AchievementsOverviewScreeenComponent';
import LessonsScreenComponent from './pages/LessonsOverviewScreen/LessonsScreenComponent';
import TemplateComponent from './pages/TemplateVerwaltungScreen/TemplateComponent';
import { BrowserRouter as Router, Route, Routes , Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  
import HereingefallenScreen from './pages/HereingefallenScreen';
import WatchLessonScreen from './pages/WatchLessonScreen/WatchLessonScreen';
import EditLessonScreenComponent from './pages/EditLessonScreen/EditLessonScreenComponent';
import { LoginProvider } from './globals/globalContext';
import UserController from './pages/UserVerwaltungScreen/UserController';
import AchievementFrontend from './pages/AchievementsPage/AchievementFrontend';
import CreateAchievement from './pages/AchievementsPage/CreateAchievement';
import CreateMailScreen from './pages/CreateMailScreen/CreateMailComponent';
import DoQuizScreen from './pages/Quiz/doQuizScreen';
import CreateQuizScreen from './pages/Quiz/createQuizScreen';


function App() {
  return (
  <LoginProvider>
    <Router>
      <Routes>
        <Route exact path="/" element= { <MainMenuScreenComponent/> }/>
        <Route path ="/hereingefallen" element = {<HereingefallenScreen/>}/>
        <Route path="/login" element= { <LoginScreen/> }/>
        <Route path="/mail" element= { <SendMailScreenComponent/> }/>    
        <Route path="/lessonsOverview" element= { <LessonsScreenComponent/> }/>
        <Route path="/UserController" element= { <UserController/> }/>
        <Route path="/lessons/:lessonID" element={<WatchLessonScreen/>} />
        <Route path="/lessonCreate" element={<EditLessonScreenComponent newLesson={true}/>} />
        <Route path="/lessonEdit/:lessonID" element={<EditLessonScreenComponent newLesson={false}/>} />
        <Route path="/achievements" element={<AchievementFrontend/>} />
        <Route path="/createAchievement" element={<CreateAchievement/>} />
        <Route path="/createMail" element={<CreateMailScreen/>}/>
        <Route path="/templates" element={<TemplateComponent/>}/>
        <Route path="/doQuiz" element={<DoQuizScreen/>}/>
        <Route path="/createQuiz" element={<CreateQuizScreen/>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>       
    </Router>
  </LoginProvider>

  );  
}


export default App;