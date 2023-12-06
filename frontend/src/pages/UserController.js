import React, { useEffect ,useContext } from 'react';
import { Button, Container } from 'reactstrap';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
import LoginContext from '../globals/globalContext';
import { Link } from 'react-router-dom';

const UserController = () => {


//User variables
const [cookies] = useCookies(['XSRF-TOKEN']); // <.>
const {isLoggedIn, setLoggedIn , userV , setUserV} = useContext(LoginContext);




    const login = () => {
    fetch('/api/methode/roles', {
            method: 'GET', credentials: 'include',
            headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] } // <.>
          })
            .then(response => response.text())// <.>
    console.log("test");
    }

    const login2 = () => {
    fetch('/api/methode/user/roles', {
            method: 'GET', credentials: 'include',
            headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] } // <.>
          })
            .then(response => response.text())// <.>
    }

    const login3 = () => {
        fetch('/api/methode/token', {
                method: 'GET', credentials: 'include',
                headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] } // <.>
              })
                .then(response => response.text())// <.>
        }


  const button = <Button color="primary" onClick={login}>Keycloak</Button>;
  const button2 = <Button color="primary" onClick={login2}>User</Button>;
  const button3 = <Button color="primary" onClick={login3}>Token</Button>;

  const message = <h2>Welcome</h2> ;


  return (
      <div>
        <Header/>
        <div>
          {message}
          {button}
          <div>
          {button2}
          </div>
            <div>
            {button3}
            </div>
        </div>
      </div>
    );


}

export default UserController;