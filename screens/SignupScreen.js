import React from 'react';
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../navigation/AuthProvider";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/config';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [passwordError, setPasswordError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const { register } = useContext(AuthContext);
    const handleValidation = () => {
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
        } else {
            setPasswordError(''); 
        }
    };
    const handleSubmit = () => {
        setSubmitted(true);
        if (!fname || !lname || !email || !password) {
            return;
        } 
        register(fname, lname, email, password);
    };
    return (
        <View style={styles.container}>
            <FormInput
                labelValue={fname}
                onChangeText={(userFname) => setFname(userFname)}
                placeholderText="First name"
                iconType="user"
                keyboardType="text"
                autoCapitalize="none"
                autoCorrect={false}
            />{submitted && !fname && (
                <Text style={styles.errorText}>First name is required</Text>
            )}

            <FormInput
                labelValue={lname}
                onChangeText={(lname) => setLname(lname)}
                placeholderText="Last name"
                iconType="user"
                autoCapitalize="none"
                autoCorrect={false}
            />
            {submitted && !lname && (
                <Text style={styles.errorText}>Last name is required</Text>
            )}
            <FormInput
                labelValue={email}
                onChangeText={(email) => setEmail(email)}
                placeholderText="Email"
                iconType="mail"
                autoCapitalize="none"
                autoCorrect={false}
            />
            {submitted && !email && (
                <Text style={styles.errorText}>Email is required</Text>
            )}
            <View style={{ flexDirection: 'row' }}>
                <FormInput
                    labelValue={password}
                    onChangeText={(password) => setPassword(password)}
                    placeholderText="Password"
                    iconType="lock"
                    secureTextEntry={isPasswordShown} onBlur={handleValidation}
                />
                <TouchableOpacity
                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                    style={{
                        marginLeft: 8,
                        justifyContent: 'center',
                        position: 'absolute',
                        right: 10,
                        top: 15
                    }}
                >
                    {
                        isPasswordShown == true ? (
                            <Ionicons name="eye-off" size={24} color={COLORS.black} />
                        ) : (
                            <Ionicons name="eye" color={COLORS.black} size={24} />
                        )
                    }
                </TouchableOpacity>
            </View>
            {submitted && !password && (
                <Text style={styles.errorText}>Password is required</Text>
            )}
            {passwordError.length > 0 && (
                <Text style={{ color: 'red', textAlign: 'left' }}>{passwordError}</Text>
            )}
            <FormButton
                buttonTitle="Sign Up"
                onPress={handleSubmit}
            />
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.navButtonText}>Have an account? Sign In</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafd',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: 24,
        marginBottom: 10,
        color: '#051d5f',
    },
    navButton: {
        marginTop: 15,
        marginBottom:25
    },
    navButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#FF9990',
        fontFamily: 'Lato-Regular', 
        marginVertical: 30,
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 35,
        justifyContent: 'center',
    },
    color_textPrivate: {
        fontSize: 13,
        fontWeight: '400',
        fontFamily: 'Lato-Regular',
        color: 'grey',
    },
    logo: {
        height: 120,
        width: 120,
        resizeMode: 'cover',
    }, errorText:{
        color:'red'
    }
});
