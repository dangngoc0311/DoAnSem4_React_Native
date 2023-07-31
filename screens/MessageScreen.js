import React, { useContext, useEffect, useState } from 'react';
import { Card, Container, MessageText, PostTime, TextSection, UserImg, UserImgWrapper, UserInfo, UserInfoText, UserName } from '../constants/MessageStyles';
import { FlatList, Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
const Messages = [
    {
        id: '1',
        userName: 'Jenny Doe',
        userImg: require('../assets/users/user-3.jpg'),
        messageTime: '4 mins ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '2',
        userName: 'John Doe',
        userImg: require('../assets/users/user-1.jpg'),
        messageTime: '2 hours ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '3',
        userName: 'Ken William',
        userImg: require('../assets/users/user-4.jpg'),
        messageTime: '1 hours ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '4',
        userName: 'Selina Paul',
        userImg: require('../assets/users/user-6.jpg'),
        messageTime: '1 day ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '5',
        userName: 'Christy Alex',
        userImg: require('../assets/users/user-7.jpg'),
        messageTime: '2 days ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
];

const MessageScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchGroupChats = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/user_group_chats/${user._id}`); 
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchGroupChats();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <Container>
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card onPress={() => navigation.navigate('Chat', { userName: item.userName })}>
                        <UserInfo>
                            <UserImgWrapper>
                                <UserImg source={item.userImg} />
                            </UserImgWrapper>
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.userName}</UserName>
                                    <PostTime>{item.messageTime}</PostTime>
                                </UserInfoText>
                                <MessageText>{item.messageText}</MessageText>
                            </TextSection>
                        </UserInfo>
                    </Card>
                )}
            />
        </Container>

        </TouchableWithoutFeedback>
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
