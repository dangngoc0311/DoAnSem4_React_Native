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

    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const { register } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo1.png')}
                style={styles.logo}
            />
            <Text style={styles.text}>Create an account</Text>
            <FormInput
                labelValue={fname}
                onChangeText={(userFname) => setFname(userFname)}
                placeholderText="First name"
                iconType="user"
                keyboardType="text"
                autoCapitalize="none"
                autoCorrect={false}
            /><FormInput
                labelValue={lname}
                onChangeText={(userLname) => setLname(userLname)}
                placeholderText="Last name"
                iconType="user"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <FormInput
                labelValue={email}
                onChangeText={(userEmail) => setEmail(userEmail)}
                placeholderText="Email"
                iconType="mail"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <View>
                <FormInput
                    labelValue={password}
                    onChangeText={(userPassword) => setPassword(userPassword)}
                    placeholderText="Password"
                    iconType="lock"
                    secureTextEntry={isPasswordShown}
                />
                <TouchableOpacity
                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                    style={{
                        position: "absolute",
                        right: 8,
                        bottom: 20
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
            <FormButton
                buttonTitle="Sign Up"
                onPress={() => register(fname,lname,email, password)}
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
        fontSize: 28,
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
        height: 130,
        width: 130,
        resizeMode: 'cover',
    },
});
