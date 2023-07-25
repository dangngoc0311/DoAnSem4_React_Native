import React from 'react';

import firestore from '@react-native-firebase/firestore';
import { useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../navigation/AuthProvider';
import { useState } from 'react';
import { useEffect } from 'react';
import { Card, Divider, Interaction, InteractionText, InteractionWrapper, PostText, PostTime, UserImg, UserInfo, UserInfoText, UserName } from '../constants/FeedStyle';
import { TouchableOpacity, View } from 'react-native';
import ProgressiveImage from './ProgressiveImage';
import moment from 'moment/moment';
import { useNavigation } from '@react-navigation/native';
const PostCard = ({ item, onDelete, onPress }) => {
    const { user, logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [liked, setLiked] = useState(item.liked);
    const navigation = useNavigation();
    likeIcon = item.liked ? 'heart' : 'heart-outline';
    likeIconColor = item.liked ? '#2e64e5' : '#333';

    if (item.likes.length == 1) {
        likeText = '1 Like';
    } else if (item.likes.length > 1) {
        likeText = item.likes.length + ' Likes';
    } else {
        likeText = 'Like';
    }

    if (item.comments.length == 1) {
        commentText = '1 Comment';
    } else if (item.comments.length > 1) {
        commentText = item.comments.length + ' Comments';
    } else {
        commentText = 'Comment';
    }
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
    const handlePostPress = (postId) => {
        navigation.navigate('DetailPost', { postId: postId, navigation });
    };

    useEffect(() => {
        getUser();
    }, []);
    return (
        <Card key={item.id} >
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
                    <TouchableOpacity onPress={onPress}>
                        <UserName>
                            {item ? item.userName || 'User' : 'User'}
                        </UserName>
                    </TouchableOpacity>
                    <PostTime>{moment(item.postTime).fromNow()}</PostTime>
                </UserInfoText>
            </UserInfo>
            <TouchableOpacity onPress={() => handlePostPress(item.id)}>
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
            </TouchableOpacity>
            <InteractionWrapper>
                <Interaction active={item.liked}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons name={likeIcon} size={25} color={likeIconColor} />
                    </TouchableOpacity>
                    <InteractionText active={item.liked}>{item.likes === 1 ? '1 ' : item.likes > 1 ? `${item.likes} ` : ''} Like</InteractionText>
                </Interaction>
                <Interaction>
                    <Ionicons name="chatbubble-ellipses-outline" size={25} />
                    <InteractionText> {item.comments.length === 1 ? '1 ' : `${item.comments.length} `}Comments</InteractionText>
                </Interaction>
                {user._id == item.userId ? (
                    <Interaction onPress={() => onDelete(item.id)}>
                        <Ionicons name="trash-bin-outline" size={25} />
                    </Interaction>
                ) : null}
            </InteractionWrapper>
            
        </Card>
    );
};

export default PostCard;
