import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
import { InputWrapper } from '../constants/PostStyle';
import { useRef } from 'react';
import ActionSheet from 'react-native-actionsheet';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
const EditProfileScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
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
                Toast.show({
                    type: 'error',
                    text1: 'Network response was not ok',
                    visibilityTime: 1000,
                });
                console.error('Error fetching user data:', error);
            });
    }
    const handleUpdate = async () => {
        var postImg = "";
        if (image != null) {
            postImg = 'http://10.0.2.2:3000/public/uploads/' + await uploadImage();
        }
        console.log("Anh : " + postImg);
        fetch(`http://10.0.2.2:3000/users/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fname: userData.fname,
                lname: userData.lname,
                phone: userData.phone,
                about: userData.about,
                userImg: postImg
            })
        })
            .then(res => {
                if (!res.ok) {Toast.show({
                        type: 'error',
                        text1: 'Network response was not ok',
                        visibilityTime: 1000,
                    });
                    throw new Error('Network response was not ok');
                    
                }
                setUploading(true);
                return res.json();
            })
            .then(data => {
                console.log(data)
                if (data.error) {
                    console.log('Error:', data.error);
                } else {
                    setImage(null);
                    setUserData(data)
                    console.log(' successful:', data);
                }
            })
            .catch(err => {
                console.log('Error:', err);
            });
    };

    const uploadImage = async () => {
        if (image == null) {
            return null;
        }
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

        // Add timestamp to File Name
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;
        const formData = new FormData();
        formData.append('media', {
            uri: uploadUri,
            type: 'image/jpeg',
            name: filename,
        });

        setUploading(true);

        try {
            const response = await fetch('http://10.0.2.2:3000/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();
            setUploading(false);
            return data.filename;
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Network response was not ok',
                visibilityTime: 1000,
            });
            console.error('Error uploading image:', e);
            setUploading(false);
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

    const actionSheet = useRef();
    const optionArray = ["Take Photo", 'Choose Photo', 'Cancel'];
    const showActionSheet = () => {
        actionSheet.current.show();
    }
    return (
        <View style={styles.container}>

            <View style={{ alignItems: 'center', marginTop: 40 }}>
                <InputWrapper>
                    <ImageBackground
                        source={{
                            uri: image
                                ? image
                                : userData
                                    ? userData.userImg || 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg'
                        }}
                        style={{ height: 90, width: 90, marginTop: 10 }}
                        imageStyle={{ borderRadius: 15 }}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <TouchableOpacity onPress={showActionSheet}>
                                <MaterialCommunityIcons
                                    name="camera"
                                    size={30}
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
                            </TouchableOpacity>

                        </View>
                    </ImageBackground>
                </InputWrapper>
                <Text style={{ marginTop: 55, fontSize: 18, fontWeight: 'bold' }}>
                    {userData ? userData.fname : ''} {userData ? userData.lname : ''}
                </Text>
            </View>
            <View style={{ marginTop: 40 }}>
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
                    <Ionicons name="clipboard-outline" color="#333333" size={20} />
                    <TextInput
                        multiline
                        numberOfLines={3}
                        placeholder="About Me"
                        placeholderTextColor="#666666"
                        value={userData ? userData.about : ''}
                        onChangeText={(txt) => setUserData({ ...userData, about: txt })}
                        autoCorrect={true}
                        style={[styles.textInput, { height: 60 }]}
                    />
                </View>
            </View>
            <FormButton buttonTitle="Update" onPress={handleUpdate} />
            <ActionSheet ref={actionSheet} options={optionArray} cancelButtonIndex={2}
                title='' destructiveButtonIndex={0} onPress={(index) => {
                    if (index === 0) {
                        takePhotoFromCamera();
                    } else if (index === 1) {
                        choosePhotoFromLibrary();
                    }
                }}>
            </ActionSheet>
        </View>

    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
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
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        paddingTop: 30,
        backgroundColor: 'gray',
        padding: 16,

    },
    titleStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        marginTop: 10,
    }
});
