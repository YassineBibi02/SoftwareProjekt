import {createContext, useState,useEffect} from 'react';
import { useCookies } from 'react-cookie';

const LoginContext = createContext({
});

export function LoginProvider({children}) {

    //User variables
    const [cookies] = useCookies(['XSRF-TOKEN']); // <.>
    // Initialize the LoggedIn state based on local storage
    const [LoggedIn, setLoggedIn] = useState(() => {
        const storedLoggedIn = localStorage.getItem('LoggedIn');
        return storedLoggedIn !== null ? JSON.parse(storedLoggedIn) : false;
    });

    // Initialize user from local storage
    const [userV, setUserV] = useState(() => {
        const storedUser = localStorage.getItem('userV');
        return storedUser !== null ? JSON.parse(storedUser) : null;
    });

    //Function to login
    const login = () => {
        let port = (window.location.port ? ':' + window.location.port : '');
        if (port === ':3000') {
        port = ':8080';
    }
        window.location.href = `//${window.location.hostname}${port}/api/private`;
    }

    //Function to logout
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


    // Function to set the LoggedIn state
    const handleSetLoggedIn = (boolean) => {
        setLoggedIn(boolean);
    };

    // Function to get the current login status
    function isLoggedIn() {
        return LoggedIn;
    }

    // Update local storage when LoggedIn changes
    useEffect(() => {
        localStorage.setItem('LoggedIn', JSON.stringify(LoggedIn));
        // Save user to local storage
        if (userV) {
            localStorage.setItem('userV', JSON.stringify({ given_name: userV.given_name, email: userV.email , mailLevel: userV.mailLevel }));
        }
    }, [LoggedIn,userV]);


    return (
        <LoginContext.Provider value={{ isLoggedIn, setLoggedIn: handleSetLoggedIn ,userV, setUserV,login,logout}}>
            {children}
        </LoginContext.Provider>
    );
}

export default LoginContext;
