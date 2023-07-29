import React from 'react';
import { createContext } from "react";
import { useState } from "react";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {

                    fetch('http://10.0.2.2:3000/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email,
                            password
                        })
                    })
                        .then(res => res.json())
                        .then(async data => {
                            if (data.error) {
                                console.log('Error:', data.error);
                            } else {
                                await AsyncStorage.setItem('user', JSON.stringify(data));
                                setUser(data);
                            }
                        })
                        .catch(err => {
                            console.log('Error:', err);
                        });
                },
                register: async (fname,lname,email, password) => {
                    fetch('http://10.0.2.2:3000/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            fname,
                            lname,
                            email,
                            password
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data)
                            if (data.error) {
                                console.log('Error:', data.error);
                            } else {
                                console.log('Registration successful:', data);
                            }
                        })
                        .catch(err => {
                            console.log('Error:', err);
                        });
                },
                logout: async () => {
                    try {
                        setUser(null);
                        await AsyncStorage.removeItem('user');
                        console.log('User data removed from AsyncStorage.');
                    } catch (e) {
                        console.log('Error during logout:', e);
                    }
                },
            }}>
            {children}
        </AuthContext.Provider>
    );
};
