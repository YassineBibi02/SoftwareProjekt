import React, { useEffect,useState ,useContext } from 'react';
import { Button, Container } from 'reactstrap';
import { useCookies } from 'react-cookie';
import Header from '../../components/Header';
import LoginContext from '../../globals/globalContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AchievementDisplay from './AchievementDisplay'; // Import the new component
import './AchievementDisplay.css';



const AchievementFrontend = () => {


    //User variables
    const [cookies] = useCookies(['XSRF-TOKEN']); // <.>
    const {isLoggedIn, setLoggedIn , userV , setUserV} = useContext(LoginContext);
    const navigate = useNavigate();
    const [user, setUser] = useState(undefined);
    const achievementIds = user?.achievements || [];


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



    const login2 = () => {
    console.log(userV);
    fetch('/api/methode/AchievementDetails', {
                          method: 'POST', credentials: 'include',
                          headers: {
                            'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                            'Content-Type': 'application/json',
                         }, // <.>
                        body: 1
                    })
                   .then(response => response.text()).then(data => console.log("Response:",data));

    }



  const button2 = <Button color="primary" onClick={login2}>Achievements</Button>;

  const message = <h2>Welcome</h2> ;


  return (
           <div>
               <Header/>
               <div className="achievement-page-container">
                   <h2 className="achievements-title">Your Achievements</h2>
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