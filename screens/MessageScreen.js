import React, { useContext, useEffect, useState } from 'react';
import { Card, Container, MessageText, PostTime, TextSection, UserImg, UserImgWrapper, UserInfo, UserInfoText, UserName } from '../constants/MessageStyles';
import { FlatList, Keyboard, SafeAreaView, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useIsFocused } from '@react-navigation/native';

const MessageScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();
    const fetchGroupChats = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/user_group_chats/${user._id}`);
            const data = await response.json();
            var list = [];
            data.forEach(element => {
                var avatarUrl = element.userImage;
                var messageText = "";

                if (element.lastMessage.senderId == user._id) {
                    if (element.lastMessage.content.startsWith("http://10.0.2.2:3000/public/uploads/")) {
                        messageText = "Bạn đã gửi 1 ảnh";
                    } else {
                        messageText = element.lastMessage.content;
                    }
                } else {
                    if (element.lastMessage.content.startsWith("http://10.0.2.2:3000/public/uploads/")) {
                        messageText = "Bạn đã nhận 1 ảnh";
                    } else {
                        messageText = element.lastMessage.content;
                    }
                }

                var dataItem = {
                    id: element._id,
                    _id: element.userId,
                    fname: element.fname,
                    lname: element.lname,
                    userImg: avatarUrl,
                    messageTime: element.lastMessage.createdAt,
                    messageText: messageText,
                };

                list.push(dataItem);
            });
            setMessages(list);
            if (loading) {
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        fetchGroupChats();
        if (isFocused) {
            fetchGroupChats();
        }
    }, [isFocused]);

    const chat = (item) => {
        navigation.navigate("Chat", item)
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} >
            {loading ? (
                <ScrollView
                    style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                    <SkeletonPlaceholder style={{ width: '100%', paddingTop: 10, marginBottom: 15, paddingBottom: 10, borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 }}>
                            <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View
                                    style={{ marginBottom: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                                <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder style={{ width: '100%', paddingTop: 10, paddingBottom: 10, marginBottom: 15, borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View
                                    style={{ marginBottom: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                                <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder style={{ width: '100%', paddingTop: 10, paddingBottom: 10, marginBottom: 15, borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View
                                    style={{ marginBottom: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                                <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder style={{ width: '100%', paddingTop: 10, paddingBottom: 10, marginBottom: 15, borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View
                                    style={{ marginBottom: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                                <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder style={{ width: '100%', paddingTop: 10, paddingBottom: 10, marginBottom: 15, borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View
                                    style={{ marginBottom: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                                <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder style={{ width: '100%', paddingTop: 10, paddingBottom: 10, marginBottom: 15, borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View
                                    style={{ marginBottom: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                                <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            </View>
                        </View>
                    </SkeletonPlaceholder><SkeletonPlaceholder style={{ width: '100%', paddingTop: 10, paddingBottom: 10, marginBottom: 15, borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View
                                    style={{ marginBottom: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                                <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder style={{ width: '100%', paddingTop: 10, paddingBottom: 10, marginBottom: 15, borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View
                                    style={{ marginBottom: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                                <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder style={{ width: '100%', paddingTop: 10, paddingBottom: 10, marginBottom: 15, borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View
                                    style={{ marginBottom: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                                <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                </ScrollView>
            ) : (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <Container>
                        <FlatList
                            data={messages}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => (
                                <Card>
                                    <TouchableOpacity onPress={() => chat(item)} activeOpacity={0.7}>
                                        <UserInfo>
                                            <UserImgWrapper>
                                                <UserImg source={{ uri: item.userImg || 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' }} />
                                            </UserImgWrapper>
                                            <TextSection>
                                                <UserInfoText>
                                                    <UserName>{item.fname + " " + item.lname}</UserName>
                                                    <PostTime>{moment(item.messageTime).fromNow()}</PostTime>
                                                </UserInfoText>
                                                <MessageText>{item.messageText}</MessageText>
                                            </TextSection>
                                        </UserInfo>
                                    </TouchableOpacity>
                                </Card>
                            )}
                        />
                    </Container>

                </TouchableWithoutFeedback >
            )}

        </SafeAreaView>
    );
};

export default MessageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
