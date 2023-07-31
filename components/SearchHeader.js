import { useContext, useEffect, useState } from "react";
import { FlatList, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS, windowWidth } from "../constants/config";
import { Card, Container, TextSection, UserImg, UserImgWrapper, UserInfo, UserInfoText, UserName } from "../constants/MessageStyles";
import { AuthContext } from "../navigation/AuthProvider";


const SearchHeader = () => {
    const [searchText, setSearchText] = useState('');
    const [userList, setUserList] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const { user } = useContext(AuthContext);
    const handleFocus = () => {
        setIsFocused(true);
    };
    useEffect(() => {
        // Fetch user connections data from the API
        const fetchUserConnections = async () => {
            try {
                const response = await fetch(`http:/10.0.2.2:3000/connections/${user._id}`); 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("User list : " +data);
                setUserList(data);
            } catch (error) {
                console.error('Error fetching user connections:', error);
            }
        };

        fetchUserConnections();
    }, [searchText]);
    const handleBlur = () => {
        setIsFocused(false);
    };
    useEffect(() => {
        const filteredUsers = userList.filter(
            (user) =>
                user.fname.toLowerCase().includes(searchText.toLowerCase()) ||
                user.lname.toLowerCase().includes(searchText.toLowerCase())
        );
        setUserList(filteredUsers);
    }, [searchText]);
    const renderItem = ({ item }) => (

        <Card onPress={() => navigation.navigate('Chat', { userName: item.userName })}>
            <UserInfo>
                <UserImgWrapper>
                    <UserImg source={{ uri: item ? item.userImg || 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' }} />
                </UserImgWrapper>
                <TextSection>
                    <UserInfoText>
                        <UserName>{item.fname} {item.lname}</UserName>
                    </UserInfoText>
                </TextSection>
            </UserInfo>
        </Card>
        
    );
    return (
        
        <SafeAreaView style={{
            padding: 6,
        }}>
            <View
                style={{
                    padding: 4,
                    borderRadius: 25,
                }}>
                <TextInput
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder="Search"
                    value={searchText}
                    onChangeText={setSearchText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                        backgroundColor: '#ffffff',
                        paddingHorizontal:10,
                        borderColor: '#ccc',
                        borderWidth:1,
                        borderRadius:20
                    }}
                    textStyle={{ color: COLORS.black }}
                />
            </View>
            <View style={{ paddingHorizontal:10}}>
                {isFocused && (
                <FlatList
                    data={userList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                />
                )}
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        padding:10,
        width:windowWidth,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    searchContainer: {
        borderRadius: 8,
        paddingHorizontal: 8,
        borderColor: 'black',
    },
    input: {
        height: 40,
        color:COLORS.black,
        width:windowWidth-50,
        padding:5,
    },
});
export default SearchHeader;