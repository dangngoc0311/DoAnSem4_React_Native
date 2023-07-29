import React from 'react';
import { useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../navigation/AuthProvider';
import { useState } from 'react';
import { useEffect } from 'react';
import { Card, Divider, Interaction, InteractionText, InteractionWrapper, PostText, PostTime, UserImg, UserInfo, UserInfoText, UserName } from '../constants/FeedStyle';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import ProgressiveImage from './ProgressiveImage';
import moment from 'moment/moment';
import { useNavigation } from '@react-navigation/native';
import { windowWidth } from '../constants/config';
import Dialog from "react-native-dialog";
import { InputField } from '../constants/PostStyle';
const PostCard = ({ item, onDelete, onPress, onLike, onComment }) => {
    const { user, logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [isOpenDialogCmt, setOpenDialogCmt] = useState(false)
    const [cmt, setCmt] = useState('')
    const navigation = useNavigation();
   
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
            <TouchableOpacity onPress={() =>
                navigation.navigate('HomeProfile', { userId: item.userId })
            }>
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
            </TouchableOpacity>
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
                    <TouchableOpacity onPress={() => onLike(item.id)}>
                        <Ionicons name={item.liked ? 'heart' : 'heart-outline'} size={25} color={item.liked ? '#2e64e5' : '#333'} />
                    </TouchableOpacity>
                    <InteractionText active={item.liked}>{item.likes?.length === 1 ? '1 ' : `${item.likes?.length} `} Like</InteractionText>
                </Interaction>
                <Interaction>
                    <Ionicons name="chatbubble-ellipses-outline" size={25} />
                    <TouchableOpacity onPress={() => {
                        setOpenDialogCmt(true)
                    }}>
                        <InteractionText> {item.comments?.length === 0 ? '0 ' : `${item.comments?.length} `} Comments</InteractionText>
                    </TouchableOpacity>
                </Interaction>
                {user._id == item.userId ? (
                    <Interaction onPress={() => onDelete(item.id)}>
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
                            onPress={() => {
                                setOpenDialogCmt(false);
                setCmt('');
                                onComment(item.id, cmt);
                            }} />
                    </Dialog.Container>
                ) : null}
            </View>
        </Card>
    );
};

export default PostCard;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DDDDDD',
        justifyContent: 'center',
        alignContent: 'center',
        width: windowWidth,
    },
})