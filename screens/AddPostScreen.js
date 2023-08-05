import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { useContext } from 'react';
import { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { AddImage, InputField, InputWrapper, StatusWrapper, SubmitBtn, SubmitBtnText } from '../constants/PostStyle';
import ActionButton from 'react-native-action-button';
import { AuthContext } from '../navigation/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import { windowWidth } from '../constants/config';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const AddPostScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [post, setPost] = useState(null);
    const userId = user._id;
    const navigation = useNavigation();
    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        });
    };

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        });
    };
    const _handleClearImage = () => {
        setImage(null)
    }

    const submitPost = async () => {
        if (!post && image == null) {
            console.error('Error: Either content or image is required for a post.');
            return;
        }

        let postImg = null;
        if (image != null) {
            postImg = 'http://10.0.2.2:3000/public/uploads/' + await uploadImage();
        }

        console.log("Anh : " + postImg);

        const requestBody = {
            userId,
        };

        if (postImg !== null) {
            requestBody.postImg = postImg;
        }else{
            requestBody.postImg = "";
        }

        if (post) {
            requestBody.post = post;
        }else{
            requestBody.post = "";
        }

        fetch('http://10.0.2.2:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => {
                if (!res.ok) {
                    Toast.show({
                        type: 'error',
                        text1: 'Network response was not ok',
                        visibilityTime: 500,
                    });
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setPost(null);
                setImage(null);
                Toast.show({
                    type: 'success',
                    text1: 'Add new post successfully!',
                    visibilityTime: 1000,
                });
                navigation.navigate('Social App');
            })
            .catch(error => {
                Toast.show({
                    type: 'error',
                    text1: 'Error adding post',
                    visibilityTime: 500,
                });
                console.error('Error adding post:', error);
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
        formData.append('image', {
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
            console.log('Response:', data);
            setUploading(false);
            return data.filename;
        } catch (e) {
            console.error('Error uploading image:', e);
            setUploading(false);
            return null;
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>

                <View style={styles.viewHeader}>
                    <View style={styles.viewUser}>

                        <Image style={styles.avatar}
                            source={{ uri: user ? user.userImg || 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' }} />

                        <Text style={styles.textEmail}>
                            {user ? user.fname || 'Test' : 'Test'} {user ? user.lname || 'User' : 'User'}
                        </Text>
                    </View>
                    {uploading ? (
                        <StatusWrapper>
                            <Text>{transferred} % Completed!</Text>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </StatusWrapper>
                    ) : (
                        <SubmitBtn onPress={submitPost}>
                            <SubmitBtnText>Post</SubmitBtnText>
                        </SubmitBtn>
                    )}
                </View>
                <InputWrapper>
                    {
                        (image)
                            ? (
                                <View style={{
                                    width: windowWidth,
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    paddingEnd: 12,
                                    marginBottom: 12
                                }}>
                                    <TouchableOpacity onPress={_handleClearImage}>
                                        <Image source={require('../assets/remove.png')}
                                            style={{
                                                height: 35,
                                                width: 35
                                            }} />
                                    </TouchableOpacity>
                                </View>
                            )
                            : null
                    }
                    {image != null ? <AddImage source={{ uri: image }} /> : null}

                    <InputField
                        placeholder="What's on your mind?"
                        multiline
                        numberOfLines={4}
                        value={post || ''}
                        onChangeText={(content) => setPost(content || '')}
                    />

                </InputWrapper>
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
        </TouchableWithoutFeedback>
    );
};

export default AddPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#FFF9F9'
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    }, viewUser: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    viewHeader: {
        width: windowWidth,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom:10,
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 100,
        marginEnd: 10
    }, textEmail: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    viewBody: {
        width: windowWidth,
        flex: 1,
        paddingTop: 12,
    }, input: {
        marginBottom: 21,
        fontSize: 18,
        color: 'black',
        marginHorizontal: 12
    },
});
