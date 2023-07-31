import { FlatList, StyleSheet } from "react-native";
import { Card, TextSection, UserImg, UserImgWrapper, UserInfo, UserInfoText, UserName } from "../constants/MessageStyles";
const UserList = () => {
const [userList, setUserList] = useState([]);
<FlatList
    data={userList}
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
                    </UserInfoText>
                </TextSection>
            </UserInfo>
        </Card>
    )}
    />
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        height: 40,
    },
});

export default UserList;