import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, TouchableWithoutFeedback, Keyboard, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AddImage, InputField, InputWrapper, StatusWrapper, SubmitBtn, SubmitBtnText } from '../constants/PostStyle';
import { windowWidth } from '../constants/config';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../navigation/AuthProvider';
import { useContext } from 'react';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

const EditPostScreen = ({ route, navigation }) => {
    const { postId } = route.params;
    const { user, logout } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
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
    const fetchPostDetail = async () => {
        console.log('post id : ' +postId);

        try {
            const response = await fetch(`http://10.0.2.2:3000/postDetail/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setImage(data.postImg[0]);
            setPost(data.post)
        } catch (error) {
            console.error('Error fetching post detail:', error);
        }
    };
    useEffect(() => {
        fetchPostDetail();
        console.log("img : " + post);

    }, [postId]);
    
    if (!item) {
        return <ActivityIndicator size="large" color="#000" />;
    }
 
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
                        <SubmitBtn >
                            <SubmitBtnText>Update</SubmitBtnText>
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
                        value={post}
                        onChangeText={(content) => setPost(content)}
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

export default EditPostScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF9F9'
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
        paddingBottom: 10,
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
