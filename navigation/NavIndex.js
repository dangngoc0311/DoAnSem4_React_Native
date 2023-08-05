import React from 'react';
import { AuthProvider } from "./AuthProvider";
import Routes from "./Routes";
import { MenuProvider } from 'react-native-popup-menu';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
const Providers = () => {
    return (
        <MenuProvider>
             <AuthProvider>
            <Routes />
        </AuthProvider>
            <Toast style={{
                height:10
            }} topOffset={10} />
        </MenuProvider>
       
    );
}

export default Providers;