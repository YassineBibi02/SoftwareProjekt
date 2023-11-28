import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';


const LoginScreen = () => {


//User variables
const [authenticated, setAuthenticated] = useState(false);
const [loading, setLoading] = useState(false);
const [user, setUser] = useState(undefined);
const [cookies] = useCookies(['XSRF-TOKEN']); // <.>



  useEffect(() => {
    setLoading(true);
    fetch('api/user', { credentials: 'include' }) // <.>
    .then(response => response.text())
    .then(body => {
        if (body === '') {
            setAuthenticated(false);
        } else {
            setUser(JSON.parse(body));
            setAuthenticated(true);
        }
     setLoading(false);
    });
}, [setAuthenticated, setLoading, setUser])

  const login = () => {
    let port = (window.location.port ? ':' + window.location.port : '');
    if (port === ':3000') {
      port = ':8080';
    }
    window.location.href = `//${window.location.hostname}${port}/api/private`;
  }

  const logout = () => {
    console.log("Noch nicht implementiert\n" , cookies);

  //    fetch('/api/logout', {
  //      method: 'POST', credentials: 'include',
  //      headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] } // <.>
  //    })
  //      .then(res => res.json())
  //      .then(response => {
  //        window.location.href = `${response.logoutUrl}?id_token_hint=${response.idToken}`
  //          + `&post_logout_redirect_uri=${window.location.origin}`;
  //      });
  }

  const button = authenticated ?
      <div>
        <Button color="link" onClick={logout}>Logout</Button>
      </div> :
      <Button color="primary" onClick={login}>Login</Button>;

  const message = user ?
  <h2>Welcome, {user.name}!</h2> :
  <p>Please log in to manage your JUG Tour.</p>;

  if (loading) {
      return <p>Loading...</p>;
  }

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