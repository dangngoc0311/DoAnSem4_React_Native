import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from '../navigation/AuthProvider';
const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const { user } = useContext(AuthContext);
    const fetchGroupChats = async () => {
        console.log("sjhjh : " + 1);
        try {
            const response = await fetch(`http:/10.0.2.2:3000/messages/${user._id}/${1}`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchGroupChats();
    }, []);
    useEffect(() => {
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages),
        );
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

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: 1,
            }}
            renderBubble={renderBubble}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
        />
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
