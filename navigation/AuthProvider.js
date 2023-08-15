import React from 'react';
import { createContext } from "react";
import { useState } from "react";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useNavigation } from '@react-navigation/native';

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
                                Toast.show({
                                    type: 'error',
                                    text1: data.error,
                                    visibilityTime: 1000,
                                });
                            } else {
                                await AsyncStorage.setItem('user', JSON.stringify(data));
                                setUser(data);
                                Toast.show({
                                    type: 'success',
                                    text1: 'Login successfully!',
                                    visibilityTime: 1000, 
                                });
                            }
                        })
                        .catch(err => {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                visibilityTime: 1000,
                            });
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
                                Toast.show({
                                    type: 'error',
                                    text1: 'Error',
                                    visibilityTime: 1000,
                                });
                            } else {
                                console.log('Registration successful:', data);
                                Toast.show({
                                    type: 'success',
                                    text1: 'Register successfully!',
                                    visibilityTime: 1000,
                                });
                            }
                        })
                        .catch(err => {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                visibilityTime: 1000,
                            });
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
                        Toast.show({
                            type: 'error',
                            text1: 'Error during logout',
                            visibilityTime: 1000,
                        });
                    }
                },
            }}>
            {children}
        </AuthContext.Provider>
    );
};
