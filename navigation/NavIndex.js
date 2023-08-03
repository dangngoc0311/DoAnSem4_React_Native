import React from 'react';
import { AuthProvider } from "./AuthProvider";
import Routes from "./Routes";
import { MenuProvider } from 'react-native-popup-menu';

const Providers = () => {
    return (
        <MenuProvider>
             <AuthProvider>
            <Routes />
        </AuthProvider>
        </MenuProvider>
       
    );
}

export default Providers;