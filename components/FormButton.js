import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { windowHeight } from "../constants/config";

const FormButton = ({ buttonTitle, ...rest }) => {
    return (
        <TouchableOpacity style={styles.buttonContainer} {...rest}>
            <Text style={styles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
    );
};

export default FormButton;

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 10,
        width: '100%',
        height: windowHeight / 12,
        backgroundColor: '#FF9990',
        padding: 13,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: 'Lato-Regular',
    },
});
