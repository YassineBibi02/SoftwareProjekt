
import React, { useEffect,useState ,useContext } from 'react';
import { Button } from 'reactstrap';
import { useCookies } from 'react-cookie';
import Header from '../../components/Header';
import LoginContext from '../../globals/globalContext';
import { useNavigate } from 'react-router-dom';
import AchievementDisplay from './AchievementDisplay'; // Import the new component
import './AchievementDisplay.css';


/**
 * Renders the AchievementFrontend component.
 * This component displays the user's achievements.
 * @returns {JSX.Element} The rendered AchievementFrontend component.
 */
const AchievementFrontend = () => {


    //User variables
    const [cookies] = useCookies(['XSRF-TOKEN']); // <.>
    const {isLoggedIn, setLoggedIn , userV , setUserV} = useContext(LoginContext);
    const navigate = useNavigate();
    const [user, setUser] = useState(undefined);
    const achievementIds = user?.achievements || [];

    //Fetches the user data from the server
    useEffect(() => {   
            fetch('api/user', { credentials: 'include' }) // <.>
            .then(response => response.text())
            .then(body => {
                if (body === '') {
                    navigate('/login');
                } else {
                    setUser(JSON.parse(body));
                }
            });
    }, []);


  return (
           <div>
               <Header/>
               <div className="achievement-page-container">
                   <h2 className="achievements-title">Deine Achievements</h2>
                   <div className="achievements-container">
                       {achievementIds.map(id => (
                           <AchievementDisplay key={id} achievementId={id} xsrfToken={cookies['XSRF-TOKEN']} />
                       ))}
                   </div>
               </div>
           </div>
       );
  }

   export default AchievementFrontend;