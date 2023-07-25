import React from 'react';

import { useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../navigation/AuthProvider';
import { Card, Divider, Interaction, InteractionText, InteractionWrapper, PostText, PostTime, UserImg, UserInfo, UserInfoText, UserName } from '../constants/FeedStyle';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View, TextInput, FlatList, Text, Image } from 'react-native';
import moment from 'moment/moment';
import ProgressiveImage from '../components/ProgressiveImage';
import { useState } from 'react';
import { useEffect } from 'react';
import Dialog from "react-native-dialog";
import { windowWidth } from '../constants/config';
import { InputField, AddImage, InputWrapper, StatusWrapper, SubmitBtn, SubmitBtnText } from '../constants/PostStyle';
const DetailPostScreen = ({ route, navigation }) => {
    const { postId } = route.params;
    const { user, logout } = useContext(AuthContext);
    const [item, setItem] = useState(null);
    const [userData, setUserData] = useState(null);
    const [liked, setLiked] = useState();
    const [comments, setComments] = useState([]);
    const [isOpenDialogCmt, setOpenDialogCmt] = useState(false)
    const [cmt, setCmt] = useState('')
    const handleLike = async () => {
        try {
            const postId = item.id;
            const response = await fetch(`http://10.0.2.2:3000/posts/${postId}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id }),
            });
            if (response.ok) {
                const updatedLiked = await response.json();
                item.liked = updatedLiked.liked;
                setLiked(updatedLiked.liked);
            } else {
                console.error('Failed to update post likes:', response.statusText);
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };
    const getUser = async () => {
        fetch(`http://10.0.2.2:3000/users/${route.params ? route.params.userId : user._id}`)
            .then((response) => response.json())
            .then((data) => {
                setUserData(data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    };
    const fetchPostDetail = async () => {
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
            setItem(data);
            setComments(data.comments);
        } catch (error) {
            console.error('Error fetching post detail:', error);
        }
    };

    const handleDelete = (postId) => {
        Alert.alert(
            'Delete post',
            'Are you sure?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed!'),
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => deletePost(postId),
                },
            ],
            { cancelable: false },
        );
    };

    const deletePost = async (postId) => {
        console.log('Current Post Id: ', postId);

        try {
            const response = await fetch(`http://10.0.2.2:3000/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Post deleted successfully');
                navigation.navigate('Home');
            } else {
                console.error('Failed to delete post:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };
    const _handleCmt = () => {
        if (!cmt) {
            Alert.alert('Opps', 'Vui lòng điền bình luận!!!')
            return
        }
        fetch(`http://10.0.2.2:3000/posts/cmt/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user._id, content: cmt }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Comment added successfully:', data);
                setCmt('');
                setOpenDialogCmt(false)
                setComments((prevComments) => [...prevComments, data.comment]);
            })
            .catch((error) => {
                console.error('Error adding comment:', error);
            });
    }
    useEffect(() => {
        fetchPostDetail();
    }, []);
    useEffect(() => {
        console.log(comments); 
    }, [comments]);
    if (!item) {
        return <ActivityIndicator size="large" color="#000" />;
    }
    return (
        <Card >
            <UserInfo>
                <UserImg
                    source={{
                        uri: item
                            ? item.userImg ||
                            'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                            : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                    }}
                />
                <UserInfoText>
                    <UserName>
                        {item ? item.userName || 'User' : 'User'}
                    </UserName>
                    <PostTime>{moment(item.postTime).fromNow()}</PostTime>
                </UserInfoText>
            </UserInfo>
            <PostText>{item.post}</PostText>
            {item.postImg != null ? (
                item.postImg.map((imageUrl, index) => (
                    <ProgressiveImage
                        key={index}
                        defaultImageSource={require('../assets/default-img.jpg')}
                        source={{ uri: imageUrl }}
                        style={{ width: '100%', height: 250 }}
                        resizeMode="cover"
                    />
                ))
            ) : (
                <Divider />
            )}
            <InteractionWrapper>
                <Interaction active={item.liked}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons name={likeIcon} size={25} color={likeIconColor} />
                    </TouchableOpacity>
                    <InteractionText active={item.liked}>{item.likes === 1 ? '1 ' : item.likes > 1 ? `${item.likes} ` : ''} Like</InteractionText>
                </Interaction>

                <Interaction>
                    <Ionicons name="chatbubble-ellipses-outline" size={25} />
                    <TouchableOpacity onPress={() => {
                        setOpenDialogCmt(true)
                    }}>
                        <InteractionText> {item.comments.length === 1 ? '1 ' : `${item.comments.length} `}Comments</InteractionText>

                    </TouchableOpacity>
                </Interaction>
                {user._id == item.userId ? (
                    <Interaction onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash-bin-outline" size={25} />
                    </Interaction>
                ) : null}
            </InteractionWrapper>
            <View style={styles.container}>
                {(isOpenDialogCmt) ? (
                    <Dialog.Container visible={true}>
                        <Dialog.Title>Bình luận bài viết</Dialog.Title>
                        <InputField
                            placeholder="Vui lòng nhập bình luận ?"
                            multiline
                            style={{
                                height: 60,
                                paddingHorizontal: 8,
                                fontSize: 14,
                                color: 'grey'
                            }}
                            value={cmt}
                            onChangeText={(cmt) => setCmt(cmt)}
                        />
                        <Dialog.Button label="Hủy" onPress={() => setOpenDialogCmt(false)} />
                        <Dialog.Button label="Bình luận"
                            onPress={_handleCmt} />
                    </Dialog.Container>
                ) : null}
            </View>
            <View>
               
                {/* <FlatList
                    data={comments}
                    renderItem={({ comment }) => ( // Change 'item' to 'comment' or any other desired variable name
                        <View style={styles.UserInfo}>
                            <Image
                                style={styles.userAvatar}
                                source={{
                                    uri: comment
                                        ? comment.userAvatar ||
                                        'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                                        : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                                }}
                            />
                            <View style={styles.UserInfoText}>
                                <UserName>{comment ? comment.userName || 'User' : 'User'}</UserName>
                                <PostTime>{moment(comment.cmtDate).fromNow()}</PostTime>
                            </View>
                            <PostText>{comment.content}</PostText>
                        </View>
                    )}
                    keyExtractor={(comment) => comment.userId + comment.content} 
                /> */}
            </View>
        </Card>
    );
};

export default DetailPostScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DDDDDD',
        justifyContent: 'center',
        alignContent: 'center',
        width: windowWidth,
    },

    containerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 500,
        marginVertical: 5,
    },

    viewHeader: {
        width: windowWidth,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },

    avatar: {
        height: 65,
        width: 65,
        resizeMode: 'cover',
        borderRadius: 100,
    },

    textEmailUser: {
        fontSize: 14,
        fontWeight: 'bold',
        marginStart: 12,
        color: '#7C4DAD'
    },

    textCreatedAt: {
        fontSize: 10,
        color: 'gray',
        marginStart: 12
    },

    viewTitle: {
        width: windowWidth,
        padding: 5
    },

    imagePost: {
        width: windowWidth,
        resizeMode: 'cover',
        flex: 1,
    },

    viewFooter: {
        width: windowWidth,
        height: 40,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    icons: {
        height: 17,
        width: 17,
        marginEnd: 7
    },
    viewContainerIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    color: {
        color: '#670D95',
        tintColor: '#670D95'
    },
    UserInfo : {
        flexDirection: 'row',
    justifyContent: 'flex-start',
padding: 15,
    },
    UserImg:{
        width: 30,
        heightt: 30,
        borderRadius: 15,
    },
    UserInfoText:{
        flexDirection:'column',
        justifyContent:'center',
        marginLeft:10
    }
})