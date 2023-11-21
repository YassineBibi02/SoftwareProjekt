import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { useCookies } from 'react-cookie';

const LoginScreen = () => {

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
    login();
  }, [setAuthenticated, setLoading, setUser])

  const login = () => {
    let port = (window.location.port ? ':' + window.location.port : '');
    if (port === ':3000') {
      port = ':8080';
    }
    window.location.href = `//${window.location.hostname}${port}/api/private`;
  }

  const logout = () => {
    fetch('/api/logout', {
      method: 'POST', credentials: 'include',
      headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] } // <.>
    })
      .then(res => res.json())
      .then(response => {
        window.location.href = `${response.logoutUrl}?id_token_hint=${response.idToken}`
          + `&post_logout_redirect_uri=${window.location.origin}`;
      });
  }

  const message = user ?
    <h2>Welcome, {user.name}!</h2> :
    <p></p>;

  const button = authenticated ?
    <div>
      <br/>
      <Button color="link" onClick={logout}>Logout</Button>
    </div> :
    <Button color="primary" onClick={login}>Login</Button>;

  if (loading) {
    return <p>Loading...</p>;
  }

  return
}

export default LoginScreen;