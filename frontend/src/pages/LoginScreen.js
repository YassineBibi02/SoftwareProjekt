import React, { useEffect, useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
import LoginContext from '../globals/globalContext';

const LoginScreen = () => {


//User variables
const [authenticated, setAuthenticated] = useState(false);
const [user, setUser] = useState(undefined);
const [cookies] = useCookies(['XSRF-TOKEN']); // <.>
const {isLoggedIn, setLoggedIn , userV , setUserV} = useContext(LoginContext);


  useEffect(() => {
    fetch('api/user', { credentials: 'include' }) // <.>
    .then(response => response.text())
    .then(body => {
        if (body === '') {
            setAuthenticated(false);
            setLoggedIn(false);
        } else {
            setUser(JSON.parse(body));
            setAuthenticated(true);
            setLoggedIn(true);
            setUserV({ given_name: JSON.parse(body).given_name, email: JSON.parse(body).email });
            console.log(userV);
        }
    });
}, [setAuthenticated, setUser, setUserV])

  const login = () => {
    let port = (window.location.port ? ':' + window.location.port : '');
    if (port === ':3000') {
      port = ':8080';
    }
    window.location.href = `//${window.location.hostname}${port}/api/private`;
  }

  const logout = () => {
    console.log("Started Logging out\n" );
    setLoggedIn(false);
    setUserV({ given_name: "", email:""});
      fetch('/api/logout', {
        method: 'POST', credentials: 'include',
        headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] } // <.>
      })
        .then(res => res.json())
        .then(response => {
          window.location.href = `${response.logoutUrl}?id_token_hint=${response.idToken}`
           + `&post_logout_redirect_uri=http://${window.location.hostname}:3000/`;                     //MAKE SURE TO MODIFY THIS
           console.log(`&post_logout_redirect_uri=`+`http://${window.location.hostname}:3000/` );
        });

        console.log("Finished Logging out\n" );
  }

  const button = authenticated ?
      <div>
        <Button color="link" onClick={logout}>Logout</Button>
      </div> :
      <Button color="primary" onClick={login}>Login</Button>;

  const message = user ?
  <h2>Welcome, {user.name}!</h2> :
  <p>Please log in.</p>;


  return (
      <div>
        <Header/>
        <Container fluid>
          {message}
          {button}
        </Container>
      </div>
    );


}

export default LoginScreen;