import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InstaStory from "react-native-insta-story";
import { AuthContext } from "../navigation/AuthProvider";
import { useContext } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useEffect } from "react";

const StoryComponent = () => {
    const { user } = useContext(AuthContext);
    const [storyData, setStoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    const fetchStoryData = async () => {
        try {
            const response = await fetch('http://10.0.2.2:3000/listStory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id }),
            });

            if (response.ok) {
                const data = await response.json();
                setStoryData(data);
                setIsLoading(false);
            } else {
                console.error('Error fetching story data');
            }
        } catch (error) {
            console.error('Error fetching story data:', error);
        }
    };

    useEffect(() => {
        fetchStoryData();
    }, []);

    useEffect(() => {
        console.log("storyData:", storyData);
    }, [storyData]);


    const handleAddPostStory = () => {
        navigation.navigate('AddStory')
    }

    const handleUserPressStory = (user) => {
        navigation.navigate('UserStories', { user });
    };
    return (
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <View style={{position:'relative',top:-10}}>
                    <Image
                    source={{ uri: user ? user.userImg || 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' }}
                        style={{ width: 65, height: 65, borderRadius: 65/2, borderColor:'black',borderWidth:2,opacity:0.8 }} />
                    <TouchableOpacity onPress={handleAddPost} style={{ marginLeft: 'auto', paddingHorizontal: 15 }}>
                    <MaterialCommunityIcons
                        name="camera-plus"
                        size={25}
                        color="black"
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            position:'absolute',
                            top:-20
                        }}
                    />
                    </TouchableOpacity>
                </View>
            {!isLoading ? (
                <InstaStory
                    data={storyData}
                    duration={10}

                />
            ) : (
                <Text>Loading...</Text>
            )}

               
            </View>
    );
}

export default StoryComponent;
const styles = StyleSheet.create({
    storyContainer: {
        width: 100,
        height: 100,
        borderRadius:50,
        borderWidth:2,
        borderColor:'black'
    }
});