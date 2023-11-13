import React from "react";
import { TextField } from '@mui/material';
const LoginScreen = () => {
    return (
        <div>               
            <p>
                LoginScreen
            </p>
            <div>
                <TextField id="outlined-basic" label="Username" variant="outlined" />
                <TextField id="outlined-basic" label="Password" variant="outlined" />
            </div>
        </div>
    );
};

export default LoginScreen;
