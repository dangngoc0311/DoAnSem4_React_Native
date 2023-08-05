import { useContext, useEffect, useState } from "react";
import { FlatList, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS, windowWidth } from "../constants/config";
import { Card, Container, TextSection, UserImg, UserImgWrapper, UserInfo, UserInfoText, UserName } from "../constants/MessageStyles";
import { AuthContext } from "../navigation/AuthProvider";
import { TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from 'react-native-vector-icons/Ionicons';


const SearchHeader = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [userList, setUserList] = useState([]);
    const [list, setList] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const { user } = useContext(AuthContext);
    const Search = (text) => {
        setSearchText(text);
        setUs(text);

    }
    const fetchUserConnections = async () => {
        try {
            const response = await fetch(`http:/10.0.2.2:3000/connections/${user._id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUserList(data);
        } catch (error) {
            console.error('Error fetching user connections:', error);
        }
    };
    useEffect(() => {
        fetchUserConnections();
        setUs(searchText);
    }, [searchText]);
   
    const setUs = (text) => {
        const filteredUsers = userList.filter(
            (user) => (user.fname.toLowerCase() + " " + user.lname.toLowerCase()).includes(text.toLowerCase()) || (user.lname.toLowerCase() + " " + user.fname.toLowerCase()).includes(text.toLowerCase())
            // user.fname.toLowerCase().includes(searchText.toLowerCase()) ||
            // user.lname.toLowerCase().includes(searchText.toLowerCase())
        );
        setList(filteredUsers);
    }
    
    const chat = (item) => {
        console.log("ok");
        navigation.navigate("Chat", item)
    };
    const handleCloseDropdown = () => {
        setSearchText('');
        setIsFocused(false);
    };
    return (
        <SafeAreaView style={{ padding: 6, position: 'relative',maxHeight:300 }}>
            <View style={{ flexDirection:'row',alignItems:'center',padding:4 }}>
                <TextInput
                    value={searchText}
                    onChangeText={Search}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Type something..."
                    style={{
                        backgroundColor: '#ffffff',
                        paddingHorizontal: 10,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 20,
                        padding: 4,
                        width:'95%'
                    }}
                    textStyle={{ color: 'black' }}
                />
                <TouchableOpacity onPress={handleCloseDropdown}>
                    <Ionicons name="close" color={'black'} size={22} />
                </TouchableOpacity>
            </View>
            {isFocused && (
                <View style={{ position: 'absolute', zIndex: 999, top:65,marginHorizontal:10,marginRight:20, backgroundColor: "#fbfbfb", width: '100%', maxHeight: 250, borderColor: '#ccc', borderWidth: 1, borderRadius: 25,width:'100%' }}>
                    <FlatList
                        data={list} style={{ paddingHorizontal:5 }}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <Card style={{
                                borderBottomWidth: 1,
                                borderBottomColor: '#ccc',}}>
                                <TouchableOpacity onPress={() => chat(item)} activeOpacity={0.7}>
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
                                </TouchableOpacity >

                            </Card>
                        )}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: windowWidth,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    searchContainer: {
        borderRadius: 8,
        paddingHorizontal: 8,
        borderColor: 'black',
    },
    input: {
        height: 40,
        color: COLORS.black,
        width: windowWidth - 50,
        padding: 5,
    },
});
export default SearchHeader;