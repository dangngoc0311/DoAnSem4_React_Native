import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { AuthContext } from '../navigation/AuthProvider';
import { COLORS } from '../constants/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const { login } = useContext(AuthContext);
    const [submitted, setSubmitted] = useState(false);

    const [passwordError, setPasswordError] = useState('');

   
    const validatePassword = (password) => {
        return password.length >= 6;
    };
    const handleValidation = () => {
        if (!password) {
            setPasswordError('Password is required');
        } else if (!validatePassword(password)) {
            setPasswordError('Password must be at least 6 characters long');
        } else {
            setPasswordError('');
        }
    };
    const handleSignIn = () => {
        setSubmitted(true);
        if (!email || !password) {
            return;
        } 
            login(email, password);
    };
    return (

        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('../assets/logo1.png')}
                style={styles.logo}
            />
            <Text style={styles.text}>Sign in</Text>
            <View>
                <FormInput
                    labelValue={email}
                    onChangeText={(userEmail) => setEmail(userEmail)}
                    placeholderText="Email"
                    iconType="mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false} onBlur={handleValidation}
                />
               
            </View>
            {submitted && !email && (
                <Text style={styles.errorText}>Email is required</Text>
            )}
            <View style={{ flexDirection: 'row' }}>
                <FormInput 
                    labelValue={password}
                    onChangeText={(userPassword) => setPassword(userPassword)}
                    placeholderText="Password"
                    iconType="lock"
                    secureTextEntry={isPasswordShown} onBlur={handleValidation}
                />
                <TouchableOpacity
                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                    style={{
                        marginLeft: 8, 
                        justifyContent: 'center', 
                        position:'absolute',
                        right:10,
                        top:15
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
                    <Text style={{ color: 'red',textAlign:'left' }}>{passwordError}</Text>
                )}
            <FormButton
                buttonTitle="Sign In"
                onPress={handleSignIn}
            />

            <TouchableOpacity style={styles.forgotButton} onPress={() => { }}>
                <Text style={styles.navButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.forgotButton}
                onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.navButtonText}>
                    Don't have an acount? Create here
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 20
    },
    logo: {
        height: 150,
        width: 150,
        resizeMode: 'cover',
    },
    text: {
        fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: 26,
        marginBottom: 10,
        color: '#051d5f',
    },
    navButton: {
        marginTop: 15,
    },
    forgotButton: {
        marginVertical: 30,
    },
    navButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FF9990',
        fontFamily: 'Lato-Regular',
    }, errorText: {
        color: 'red'
    }
});
