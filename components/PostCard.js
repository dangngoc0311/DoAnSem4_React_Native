import React from 'react';
import { useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../navigation/AuthProvider';
import { useState } from 'react';
import { useEffect } from 'react';
import { Card, Divider, Interaction, InteractionText, InteractionWrapper, PostText, PostTime, UserImg, UserInfo, UserInfoText, UserName } from '../constants/FeedStyle';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressiveImage from './ProgressiveImage';
import moment from 'moment/moment';
import { useNavigation } from '@react-navigation/native';
import { windowWidth } from '../constants/config';
import Dialog from "react-native-dialog";
import { InputField } from '../constants/PostStyle';
import Menu, { MenuItem, MenuDivider, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import Video from 'react-native-video';
const PostCard = ({ item, onDelete, onPress, onLike, onComment, onUpdate }) => {
    const { user, logout } = useContext(AuthContext);
    // const [userData, setUserData] = useState(null);
    const [isOpenDialogCmt, setOpenDialogCmt] = useState(false)
    const [cmt, setCmt] = useState('')
    const navigation = useNavigation();
    // const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    // const getUser = async () => {
    //     fetch(`http://10.0.2.2:3000/users/${route.params ? route.params.userId : user._id}`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             setUserData(data);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching user data:', error);
    //         });
    // };
    const handlePostPress = (postId) => {
        navigation.navigate('DetailPost', { postId: postId, navigation });
    };

    useEffect(() => {
    }, []);
    return (
        <Card key={item.id} >
           
            <View style={{ flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}>
                <View>
                    <TouchableOpacity onPress={() =>
                        navigation.navigate('HomeProfile', { userId: item.userId })
                    }>
                        <UserInfo>
                            <UserImg
                                source={{
                                    uri: item
                                        ? item.userImg || 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg'
                                }}
                            />
                            <UserInfoText>
                                    <UserName>
                                        {item ? item.userName || 'User' : 'User'}
                                    </UserName>
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
                                <MenuOption onSelect={() => onUpdate(item.id)} style={{ alignItems: 'center', flexDirection: 'row' }} >
                                    <Ionicons name="create-outline" size={18} color={'blue'} />
                                    <Text style={{ color: 'blue', paddingLeft: 10 }}>Edit</Text>
                            </MenuOption>
                                <MenuOption onSelect={() => onDelete(item.id)} style={{alignItems:'center',flexDirection:'row'}}>
                                <Ionicons name="trash-bin-outline" size={18} color={'red'} />
                                <Text style={{ color: 'red',paddingLeft:10 }}>Delete</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                    ) : null}
                   
                </View>
           </View>
            <TouchableOpacity onPress={() => handlePostPress(item.id)}>
                <PostText>{item.post}</PostText>
                {item.postImg != null ? (
                    item.postImg.map((mediaUrl, index) => (
                        mediaUrl.endsWith('.mp4') ? ( 
                            <Video
                                key={index}
                                source={{ uri: mediaUrl }}
                                style={{ width: '100%', height: 250 }}
                                resizeMode="cover"
                                controls autoplay={false} playWhenInactive={false}
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

            </TouchableOpacity>
            <InteractionWrapper>
                <Interaction active={item.liked}>
                    <TouchableOpacity onPress={() => onLike(item.id)}>
                        <Ionicons name={item.liked ? 'heart' : 'heart-outline'} size={25} color={item.liked ? '#E62E2E' : '#333'} />
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
            </InteractionWrapper>
            {item.lastComment ? (
                <View style={styles.LastComment}>
                    <View style={styles.UserInfo}>
                        <Image
                            style={styles.UserImg}
                            source={{
                                uri: item.lastComment && item.lastComment.userAvatar
                                    ? item.lastComment.userAvatar : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg'
                            }}
                        />
                        <View style={styles.UserInfoText}>
                            <UserName>{item.lastComment ? item.lastComment.userName || 'User' : 'User'}</UserName>
                            <PostTime>{item.lastComment ? moment(item.lastComment.cmtDate).fromNow() : ''}</PostTime>
                        </View>
                        <>
                            <PostText style={{ width: 275 }}>{item.lastComment ? item.lastComment.content : ''}</PostText>
                            {item.lastComment && user._id == item.lastComment.userId ? (
                                <Menu style={{ alignItems: 'flex-end' }}>
                                    <MenuTrigger customStyles={{ triggerText: { fontSize: 20 } }}>
                                        <Ionicons name="ellipsis-vertical" size={22} />
                                    </MenuTrigger>
                                    <MenuOptions >
                                        <MenuOption onSelect={() => handleDelCmt(item.lastComment._id)} style={{ alignItems: 'center', flexDirection: 'row' }}>
                                            <Ionicons name="trash-bin-outline" size={18} color={'red'} />
                                            <Text style={{ color: 'red', paddingLeft: 10 }}>Delete</Text>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            ) : null}
                        </>

                    </View>
                </View>
            ) : (
                null
            )}

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
    UserInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
        backgroundColor: '#FCFCFC',
    borderColor: '#ccc',
    borderWidth: 0.5,
    alignItems: 'center',
    borderRadius:20
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
},
LastComment:{
// paddingHorizontal:10,
}
})