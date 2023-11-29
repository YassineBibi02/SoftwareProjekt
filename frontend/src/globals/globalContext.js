import {createContext, useState,useEffect} from 'react';

const LoginContext = createContext({
});

export function LoginProvider({children}) {
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
                localStorage.setItem('userV', JSON.stringify({ given_name: userV.given_name, email: userV.email }));
            }
        }, [LoggedIn,userV]);


        return (
            <LoginContext.Provider value={{ isLoggedIn, setLoggedIn: handleSetLoggedIn ,userV, setUserV}}>
                {children}
            </LoginContext.Provider>
        );
}

export default LoginContext;
