import React from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import { useContext } from 'react';
import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FormButton from '../components/FormButton';
import { useEffect } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { InputWrapper } from '../constants/PostStyle';

const EditProfileScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [userData, setUserData] = useState(null);

    bs = React.createRef();
   
    const getUser = async () => {
        console.log(user);
        fetch(`http://10.0.2.2:3000/users/${user._id}`)
            .then((response) => response.json())
            .then((data) => {
                setUserData(data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }
    const handleUpdate = async () => {
        let imgUrl = await uploadImage();

        if (imgUrl == null && userData.userImg) {
            imgUrl = userData.userImg;
        }
        console.log("imagsg : "+imgUrl);

        try {
            // Send the updated user data to your Node.js API
            await fetch(`http://10.0.2.2:3000/users/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            console.log('User Updated!');
            Alert.alert('Profile Updated!', 'Your profile has been updated successfully.');
        } catch (error) {
            console.log('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile.');
        }
    };

    const uploadImage = async () => {
        if (image == null) {
            return null;
        }
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name +'.' + extension;
        console.log(filename);
        setUploading(true);
        setTransferred(0);
        const data = new FormData();
        data.append('image', {
            uri: image,
            type: 'image/jpeg', // Set the image type according to your file type
            name: filename, // Set the filename as needed
        });

        try {
            const response = await fetch('http://10.0.2.2:3000/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: data,
            });
            console.log('Image uploaded successfully');
            const responseData = await response.json();
            return responseData.imageUrl; // Assuming your API returns the uploaded image URL
        } catch (error) {
            console.log('Error uploading image:', error);
            return null;
        }
    };
    useEffect(() => {
        getUser();
    }, []);
    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.7,
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        });
    };

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7,
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        });
    };
    renderInner = () => (
        <View style={styles.panel}>
            <ActionButton buttonColor="#FF9990">
                <ActionButton.Item
                    buttonColor="#9b59b6"
                    title="Take Photo"
                    onPress={takePhotoFromCamera}>
                    <Icon name="camera-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item
                    buttonColor="#3498db"
                    title="Choose Photo"
                    onPress={choosePhotoFromLibrary}>
                    <Icon name="md-images-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        </View>
    );

    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    margin: 20,
                }}>
                <View style={{ alignItems: 'center' }}>
                    <InputWrapper>
                        <View
                            style={{
                                height: 100,
                                width: 100,
                                borderRadius: 15,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <ImageBackground
                                source={{
                                    uri: image
                                        ? image
                                        : userData
                                            ? userData.userImg ||
                                            'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                                            : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                                }}
                                style={{ height: 100, width: 100 }}
                                imageStyle={{ borderRadius: 15 }}>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcons
                                        name="camera"
                                        size={35}
                                        color="#fff"
                                        style={{
                                            opacity: 0.7,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderColor: '#fff',
                                            borderRadius: 10,
                                        }}
                                    />
                                </View>
                            </ImageBackground>
                        </View>
                    </InputWrapper>
                    <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                        {userData ? userData.fname : ''} {userData ? userData.lname : ''}
                    </Text>
                    {/* <Text>{user.uid}</Text> */}
                </View>

                <View style={styles.action}>
                    <FontAwesome name="user-o" color="#333333" size={20} />
                    <TextInput
                        placeholder="First Name"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        value={userData ? userData.fname : ''}
                        onChangeText={(txt) => setUserData({ ...userData, fname: txt })}
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="user-o" color="#333333" size={20} />
                    <TextInput
                        placeholder="Last Name"
                        placeholderTextColor="#666666"
                        value={userData ? userData.lname : ''}
                        onChangeText={(txt) => setUserData({ ...userData, lname: txt })}
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.action}>
                    <Ionicons name="ios-clipboard-outline" color="#333333" size={20} />
                    <TextInput
                        multiline
                        numberOfLines={3}
                        placeholder="About Me"
                        placeholderTextColor="#666666"
                        value={userData ? userData.about : ''}
                        onChangeText={(txt) => setUserData({ ...userData, about: txt })}
                        autoCorrect={true}
                        style={[styles.textInput, { height: 40 }]}
                    />
                </View>
                <View style={styles.action}>
                    <Feather name="phone" color="#333333" size={20} />
                    <TextInput
                        placeholder="Phone"
                        placeholderTextColor="#666666"
                        keyboardType="number-pad"
                        autoCorrect={false}
                        value={userData ? userData.phone : ''}
                        onChangeText={(txt) => setUserData({ ...userData, phone: txt })}
                        style={styles.textInput}
                    />
                </View>

                <View style={styles.action}>
                    <FontAwesome name="globe" color="#333333" size={20} />
                    <TextInput
                        placeholder="Country"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        value={userData ? userData.country : ''}
                        onChangeText={(txt) => setUserData({ ...userData, country: txt })}
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.action}>
                    <MaterialCommunityIcons
                        name="map-marker-outline"
                        color="#333333"
                        size={20}
                    />
                    <TextInput
                        placeholder="City"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        value={userData ? userData.city : ''}
                        onChangeText={(txt) => setUserData({ ...userData, city: txt })}
                        style={styles.textInput}
                    />
                </View>
                <FormButton buttonTitle="Update" onPress={handleUpdate} />
            </Animated.View>
        </View>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        width: '100%',
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#2e64e5',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#333333',
    },
});
