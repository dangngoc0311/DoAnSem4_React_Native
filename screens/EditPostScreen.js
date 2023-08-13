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
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Video from 'react-native-video';

const EditPostScreen = ({ route, navigation }) => {
    const { postId } = route.params;
    const { user, logout } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isImage, setIsImage] = useState(true);
    const [transferred, setTransferred] = useState(0);
    const [item,setItem] = useState(null);
    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
            setIsImage(true);
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
            setIsImage(true);
        });
    };
    const chooseVideoFromLibrary = () => {
        ImagePicker.openPicker({
            mediaType: 'video',
            width: 1200,
            height: 780,
            cropping: true,
        }).then((media) => {
            console.log(media);
            const mediaUri = Platform.OS === 'ios' ? media.sourceURL : media.path;
            setImage(mediaUri);
            setImage(false);
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
                Toast.show({
                    type: 'error',
                    text1: 'Network response was not ok',
                    visibilityTime: 1000,
                });
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setItem(data)
            setPost(data.post)
            console.log("sdjhsjgd : " + data.postImg[0])
            if (data.postImg != null) {
                const fileExtension = getFileExtension(data.postImg[0]);
                const isImage = isImageFile(fileExtension);
                setIsImage(isImage);
                if (isImage) {
                    setImage(data.postImg[0]);
                } else {
                    setImage(data.postImg[0]);
                }
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Network response was not ok',
                visibilityTime: 1000,
            });
            console.error('Error fetching post detail:', error);
        }
    };
    // Hàm update post
    const getFileExtension = (filename) => {
        return filename.split('.').pop();
    };
    const isImageFile = (extension) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        return imageExtensions.includes(extension.toLowerCase());
    };

    const updatePost = async () => {
        if (!postId || (!post && !image)) {
            console.error('Error: Post ID, content, or image is missing for updating the post.');
            return;
        }

        let isImageDeleted = false; // Thêm cờ isImageDeleted với giá trị mặc định là false

        let updatedPostImg = null;
        if (image) {
            // Kiểm tra xem ảnh có thay đổi so với ảnh hiện tại
            const currentImg = item.postImg[0];
            if (currentImg !== image) {
                updatedPostImg = 'http://10.0.2.2:3000/public/uploads/' + await uploadImage();
            }
        } else {
            // Nếu không có ảnh, và đã có ảnh trong postImg thì đánh dấu ảnh đã xoá
            if (item.postImg[0]) {
                isImageDeleted = true;
            }
        }

        const requestBody = {
            userId: user._id,
            post: post,
            deletePostImg: isImageDeleted, // Gửi cờ isImageDeleted lên API để xử lý xoá ảnh
        };

        // Nếu ảnh có thay đổi hoặc bị xoá
        if (updatedPostImg !== null) {
            requestBody.postImg = updatedPostImg;
        }
        console.log("req body  : " + requestBody);

        fetch(`http://10.0.2.2:3000/posts/${postId}`, {
            method: 'PUT',
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
                        visibilityTime: 1000,
                    });
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                // Xoá ảnh trong postImg nếu có
                if (isImageDeleted) {
                    const updatedPostImgList = item.postImg.filter((img) => img !== image);
                    // Cập nhật lại list postImg sau khi xoá ảnh
                    setItem({ ...item, postImg: updatedPostImgList });
                }

                setPost(null);
                setImage(null);
                console.log('Updated Post:', data.post);
                Toast.show({
                    type: 'success',
                    text1: 'Update post successfully!',
                    visibilityTime: 1000,
                });
                navigation.navigate('Social App'); 
            })
            .catch(error => {
                Toast.show({
                    type: 'error',
                    text1: 'Network response was not ok',
                    visibilityTime: 1000,
                });
                console.error('Error updating post:', error);
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
            type: isImage ? 'image/jpeg' : 'video/mp4',
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

    useEffect(() => {
        fetchPostDetail();
        console.log("img : " + post);

    }, [postId]);
    
    // if (!post) {
    //     return <ActivityIndicator size="large" color="#000" />;
    // }
 
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>

                <View style={styles.viewHeader}>
                    <View style={styles.viewUser}>

                        <Image style={styles.avatar}
                            source={{ uri: user ? user.userImg || 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' }} />

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
                            <SubmitBtn onPress={updatePost}>
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
                    {image != null ?

                        isImage ?
                            <AddImage source={{ uri: image }} />

                            : <Video
                                source={{ uri: image }}
                                style={{ width: '100%', height: 250 }}
                                resizeMode="cover"
                                controls
                            />
                        : null}


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
                    <ActionButton.Item
                        buttonColor="#f0e511"
                        title="Choose Video"
                        onPress={chooseVideoFromLibrary}>
                        <Icon name="videocam-outline" style={styles.actionButtonIcon} />
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
