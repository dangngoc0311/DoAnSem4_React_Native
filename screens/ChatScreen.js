import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from '../navigation/AuthProvider';
import { useContext } from 'react';
import { Image } from 'react-native';
import moment from 'moment';
const ChatScreen = ({ route }) => {
    const [messages, setMessages] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const { user } = useContext(AuthContext);
    const user2 = route.params;

    var imgUrl = null;
    const fetchGroupChats = async () => {
        try {
            const response = await fetch(`http:/10.0.2.2:3000/messages/${user._id}/${1}`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchMessages = async () => {
        try {
            console.log(user._id)
            console.log(user2._id)
            const response = await fetch(`http:/10.0.2.2:3000/messages/${user._id}/${user2._id}`);
            const data = await response.json();
            var formdt = [];
            data.forEach(element => {
                var formdata = {
                    _id: Math.random().toString(),
                    user: {
                        _id: element.user.senderId,
                        avatar: element.user.avatar,

                    },
                    text: element.text,
                    createdAt: element.createdAt
                }
                formdt.push(formdata);
            });
            formdt.forEach(e => {
                // console.log(e)
                if (!e.text.includes("public/uploads")) {
                    setMessages((previousMessages) =>
                        GiftedChat.append(previousMessages, e),)
                } else {
                    const imageMessage = {
                        _id: Math.round(Math.random() * 1000000),
                        createdAt: e.createdAt,
                        user: {
                            _id: e.user._id, // Use the ID of the current user or the sender of the image
                        },
                        image: e.text,
                    };

                    // Append the image message to the messages array
                    setMessages((previousMessages) => GiftedChat.append(previousMessages, [imageMessage]));
                }


            })

        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchMessages();

        // fetchGroupChats();
    }, []);
    const handlePostRequest = async (formdata) => {
        try {
            //   const requestBody = {
            //     username: 'exampleuser',
            //     password: 'examplepassword',
            //   };

            const response = await fetch('http:/10.0.2.2:3000/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            });

            const jsonResponse = await response.json();
            //   setResponseText(JSON.stringify(jsonResponse));
        } catch (error) {
            console.error('Error making POST request:', error);
        }
    };
    const handleImageSelect = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7,
        }).then((image) => {
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setSelectedImg(imageUri)
        });
    }
    const onSend = useCallback(async (messages = []) => {
        try {
            const img = messages[0].user.img;
            const content = messages[0].text;
            let imageUrl = null;

            if (img) {
                // Xử lý upload ảnh
                const originalString = img;
                const subString = 'file:///storage/emulated/0/Android/data/com.doansem4reactnative/files/Pictures/';
                const startIndex = originalString.indexOf(subString);
                const newImg = originalString.replace(subString, '');
                imageUrl = 'http://10.0.2.2:3000/public/uploads/' + newImg;

                const form = new FormData();
                form.append('media', {
                    uri: img,
                    type: 'image/jpeg',
                    name: newImg,
                });

                try {
                    const response = await fetch('http://10.0.2.2:3000/upload', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: form,
                    });
                } catch (e) {
                    console.error('Error uploading image:', e);
                }
            }

            const formdata = {
                userId1: user._id,
                userId2: user2._id,
                content: content,
            };

            console.log("imageUrl : " +imageUrl);
            if (imageUrl) {
                const formdataWithImage = {
                    ...formdata,
                    content: imageUrl,
                };
                await handlePostRequest(formdataWithImage);
            }

            if (content) {
                await handlePostRequest(formdata);
            }

            if (imageUrl) {
                const imageMessage = {
                    _id: Math.round(Math.random() * 1000000),
                    createdAt: new Date(),
                    user: messages[0].user,
                    image: imageUrl,
                };
                setMessages((previousMessages) =>
                    GiftedChat.append(previousMessages, [imageMessage])
                );
            }

            if (content) {
                const textMessage = {
                    _id: Math.round(Math.random() * 1000000),
                    createdAt: new Date(),
                    user: messages[0].user,
                    text: content,
                };
                setMessages((previousMessages) =>
                    GiftedChat.append(previousMessages, [textMessage])
                );
            }
            setSelectedImg(null);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, []);

    const renderSend = (props) => {
        return (
            <Send {...props}>

                <View>
                    <MaterialCommunityIcons
                        name="send-circle"
                        style={{ marginBottom: 5, marginRight: 5 }}
                        size={32}
                        color="#2e64e5"
                    />
                </View>
            </Send>
        );
    };

    const renderMessageImage = (props) => {
        // Check if the message contains an image and render it
        if (props.currentMessage && props.currentMessage.image) {
            return (
                <Image
                    source={{ uri: props.currentMessage.image }}
                    style={{ width: 200, height: 150 }}
                    resizeMode="cover"
                />
            );
        }
        return null;
    };
    const renderCustomActions = (props) => {
        return (
            <TouchableOpacity onPress={handleImageSelect}>

                <View>
                    <MaterialCommunityIcons
                        name="camera"
                        style={{ marginBottom: 5, marginRight: 5 }}
                        size={32}
                        color="#2e64e5"
                    />
                </View>
            </TouchableOpacity>
        );
    };
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2e64e5',
                    },
                }}
                textStyle={{
                    right: {
                        color: '#fff',
                    },
                }}
            />
        );
    };

    const scrollToBottomComponent = () => {
        return (
            <FontAwesome name='angle-double-down' size={22} color='#333' />
        );
    }
    const renderUserAvatar = (props) => {
        return (
            <View style={{ marginRight: 10 }}>
                <Image
                    source={{ uri: props.currentMessage.user.img || 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                />
            </View>
        );
    };
    return (
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: user._id,
                    img: selectedImg 
                }}

                renderBubble={renderBubble}
                alwaysShowSend
                renderActions={renderCustomActions}
                renderSend={renderSend}
                renderMessageImage={renderMessageImage}
                scrollToBottom
                scrollToBottomComponent={scrollToBottomComponent}
                renderAvatar={renderUserAvatar}
            />
            {selectedImg && (
                <Image source={{ uri: selectedImg }} style={{ width: 100, height: 100 }} />
            )}
        </View>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
