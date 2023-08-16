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
import Menu, { MenuItem, MenuDivider, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Video from 'react-native-video';

const DetailPostScreen = ({ route, navigation, onPress }) => {
    const { postId } = route.params;
    const { user } = useContext(AuthContext);
    const [item, setItem] = useState(null);
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
                const hasLiked = item.likes.includes(user._id);
                if (updatedLiked.liked && !hasLiked) {
                    setItem((prevItem) => ({
                        ...prevItem,
                        liked: true,
                        likes: [...prevItem.likes, user._id],
                    }));
                } else if (!updatedLiked.liked && hasLiked) {
                    setItem((prevItem) => ({
                        ...prevItem,
                        liked: false,
                        likes: prevItem.likes.filter((userId) => userId !== user._id),
                    }));
                }
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
            setComments(data.comments);
            setItem(data);
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
                Toast.show({
                    type: 'success',
                    text1: 'Post deleted successfully!',
                    visibilityTime: 1000,
                });
                navigation.navigate('Social App', { deleteId: postId });
            } else {
                console.error('Failed to delete post:', response.statusText);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error deleting post',
                visibilityTime: 1000,
            });
            console.error('Error deleting post:', error);
        }
    };
    const _handleCmt = () => {
        if (!cmt) {
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
                console.log('Comment added successfully:', data.comment);
                setCmt('');
                setOpenDialogCmt(false)
                setComments((prevComments) => [data.comment, ...prevComments]);
                setItem((prevItem) => ({ ...prevItem, comments: [data.comment, ...prevItem.comments] }));
            })
            .catch((error) => {
                console.error('Error adding comment:', error);
            });
    }
    const handleDelCmt = async (commentId) => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/posts/cmt/${postId}/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Comment deleted successfully');
                Toast.show({
                    type: 'success',
                    text1: 'Comment deleted successfully!',
                    visibilityTime: 1000,
                });
                setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
                setItem((prevItem) => {
                    const updatedComments = prevItem.comments.filter((comment) => comment._id !== commentId);
                    return { ...prevItem, comments: updatedComments };
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to delete comment',
                    visibilityTime: 1000,
                });
                console.error('Failed to delete comment:', response.statusText);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Network response was not ok',
                visibilityTime: 1000,
            });
            console.error('Error deleting comment:', error);
        }
    };
    const handleUpdate = (postId) => {
        navigation.navigate('EditPost', { postId });
    };
    useEffect(() => {
        fetchPostDetail();
        console.log(comments);
    }, []);
    if (!item) {
        return <ActivityIndicator size="large" color="#000" />;
    }
    return (
        <Card style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                    <TouchableOpacity onPress={() =>
                        navigation.navigate('HomeProfile', { userId: item.userId })
                    }>
                        <UserInfo>
                            <UserImg
                                source={{
                                    uri: item
                                        ? item.userImg
                                        || 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg'
                                }}
                            />
                            <UserInfoText>
                                <TouchableOpacity onPress={onPress}>
                                    <UserName>
                                        {item ? item.userName || 'User' : 'User'}
                                    </UserName>
                                </TouchableOpacity>
                                <PostTime>{moment(item.postTime).fromNow()}</PostTime>
                            </UserInfoText>
                        </UserInfo>
                    </TouchableOpacity>
                </View>
                <View>
                    {user._id == item.userId ? (
                        <Menu>
                            <MenuTrigger customStyles={{ triggerText: { fontSize: 20 } }}>
                                <Ionicons name="ellipsis-vertical" size={22} />
                            </MenuTrigger>
                            <MenuOptions >
                                <MenuOption onSelect={() => handleUpdate(item.id)} style={{ alignItems: 'center', flexDirection: 'row' }} >
                                    <Ionicons name="create-outline" size={18} color={'blue'} />
                                    <Text style={{ color: 'blue', paddingLeft: 10 }}>Edit</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => handleDelete(item.id)} style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Ionicons name="trash-bin-outline" size={18} color={'red'} />
                                    <Text style={{ color: 'red', paddingLeft: 10 }}>Delete</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    ) : null}

                </View>
            </View>
           
            <PostText>{item.post}</PostText>
            {item.postImg != null ? (
                item.postImg.map((mediaUrl, index) => (
                    mediaUrl.endsWith('.mp4') ? (
                        <Video
                            key={index}
                            source={{ uri: mediaUrl }}
                            style={{ width: '100%', height: 250 }}
                            resizeMode="cover"
                            controls autoplay={false}
                        />
                    ) : (
                        <ProgressiveImage
                            key={index}
                            defaultImageSource={require('../assets/default-img.jpg')}
                            source={{ uri: mediaUrl }}
                            style={{ width: '100%', height: 250 }}
                            resizeMode="cover"
                        />
                    )
                ))
            ) : (
                <Divider />
            )}
            <InteractionWrapper>
                <Interaction active={item.liked}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons name={item.liked ? 'heart' : 'heart-outline'} size={25} color={item.liked ? '#E62E2E' : '#333'} />
                    </TouchableOpacity>
                    <InteractionText active={item.liked}>{item.likes?.length === 1 ? '1 ' : `${item.likes?.length} `} Like</InteractionText>
                </Interaction>

                <Interaction>
                    <Ionicons name="chatbubble-ellipses-outline" size={25} />
                    <TouchableOpacity onPress={() => {
                        setOpenDialogCmt(true)
                    }}>
                        <InteractionText> {item.comments?.length === 1 ? '1 ' : `${item.comments?.length} `}Comments</InteractionText>

                    </TouchableOpacity>
                </Interaction>
            </InteractionWrapper>
            <View style={styles.container}>
                {(isOpenDialogCmt) ? (
                    <Dialog.Container visible={true}>
                        <Dialog.Title></Dialog.Title>
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
            <View style={{ flex: 1 }}>

                <FlatList
                    data={comments}
                    renderItem={({ item: comment }) => ( 
                        <>
                            <View style={styles.UserInfo}>
                                <Image
                                    style={styles.UserImg}
                                    source={{
                                        uri: comment
                                            ? comment.userAvatar
                                            || 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg'
                                    }}
                                />
                                <View style={styles.UserInfoText}>
                                    <UserName>{comment ? comment.userName || 'User' : 'User'}</UserName>
                                    <PostTime>{moment(comment.cmtDate).fromNow()}</PostTime>
                                </View>
                                <>
                                    <PostText style={{width:275}}>{comment.content}</PostText>
                                    {user._id == comment.userId ? (
                                        <Menu style={{ alignItems: 'flex-end' }}>
                                            <MenuTrigger customStyles={{ triggerText: { fontSize: 20 } }}>
                                                <Ionicons name="ellipsis-vertical" size={22} />
                                            </MenuTrigger>
                                            <MenuOptions >
                                                <MenuOption onSelect={() => handleDelCmt(comment._id)} style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                    <Ionicons name="trash-bin-outline" size={18} color={'red'} />
                                                    <Text style={{ color: 'red', paddingLeft: 10 }}>Delete</Text>
                                                </MenuOption>
                                            </MenuOptions>
                                        </Menu>
                                    ) : null}
                                </>
                                
                            </View>
                        </>
                        
                    )}
                    keyExtractor={(comment) => comment._id.toString()}
                />
            </View>
        </Card>
    );
};

export default DetailPostScreen;
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DDDDDD',
        justifyContent: 'center',
        alignContent: 'center',
        width: windowWidth,
    },

    containerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 510,
        marginVertical: 6,
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
    UserInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
        backgroundColor:'#fff',
        borderColor:'#ccc',
        borderWidth:0.5,
        alignItems:'center'
    },
    UserImg: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    UserInfoText: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 10
    }
})