import React, { useEffect, useState } from 'react';

const LoginScreen = () => {

  useEffect(() => {
    login();
  })

  const login = () => {
    let port = (window.location.port ? ':' + window.location.port : '');
    if (port === ':3000') {
      port = ':8080';
    }
    window.location.href = `//${window.location.hostname}${port}/api/private`;
  }

  return
}

export default LoginScreen;