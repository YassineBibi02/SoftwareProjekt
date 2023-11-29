import {createContext, useState,useEffect} from 'react';

const LoginContext = createContext({
});

export function LoginProvider({children}) {
     // Initialize the LoggedIn state based on local storage
        const [LoggedIn, setLoggedIn] = useState(() => {
            const storedLoggedIn = localStorage.getItem('LoggedIn');
            return storedLoggedIn !== null ? JSON.parse(storedLoggedIn) : false;
        });

        // Update local storage when LoggedIn changes
        useEffect(() => {
            localStorage.setItem('LoggedIn', JSON.stringify(LoggedIn));
        }, [LoggedIn]);

        // Function to set the LoggedIn state
        const handleSetLoggedIn = (boolean) => {
            setLoggedIn(boolean);
        };

        // Function to get the current login status
        function isLoggedIn() {
            return LoggedIn;
        }

        return (
            <LoginContext.Provider value={{ isLoggedIn, setLoggedIn: handleSetLoggedIn }}>
                {children}
            </LoginContext.Provider>
        );
}

export default LoginContext;