import React from 'react';

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddPostScreen from "../screens/AddPostScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChatScreen from "../screens/ChatScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import { Image, StyleSheet, View } from 'react-native';
import MessageScreen from '../screens/MessageScreen';
import DetailPostScreen from '../screens/DetailPostScreen';
import SearchHeader from '../components/SearchHeader';
import { windowWidth } from '../constants/config';
import EditPostScreen from '../screens/EditPostScreen';
import AddStoryScreen from '../screens/AddStoryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FeedStack = ({ navigation }) => (
    <Stack.Navigator>
        <Stack.Screen
            name="Social App"
            component={HomeScreen}
            options={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: '#FF9990',
                    fontFamily: 'Kufam-SemiBoldItalic',
                    fontSize: 18
                },
                headerStyle: {
                    shadowColor: '#fff',
                    elevation: 0,
                },
                headerRight: () => (
                    <View style={{ marginRight: 10 }}>
                        <FontAwesome5.Button
                            name="plus"
                            size={22}
                            backgroundColor="#fff"
                            color="#FF9990"
                            onPress={() => navigation.navigate('AddPost')}
                        />
                    </View>
                ),
                headerLeft: () => (
                    <View style={{ marginRight: 15 }}>
                        <Image source={require('../assets/logo1.png')} style={styles.logo} />
                    </View>
                ),
            }}
        />
        <Stack.Screen
            name="AddPost"
            component={AddPostScreen}
            options={{
                title: '',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#FFF9F9',
                    shadowColor: '#FF999015',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#FF9990" />
                    </View>
                ),
            }}
        />
        
        <Stack.Screen
            name="DetailPost"
            component={DetailPostScreen}
        />
        <Stack.Screen
            name="AddStory"
            component={AddStoryScreen}
        />
        <Stack.Screen
            name="EditPost"
            component={EditPostScreen}
            options={{
                title: '',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#FFF9F9',
                    shadowColor: '#FF999015',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#FF9990" />
                    </View>
                ),
            }}
        />
        <Stack.Screen
            name="HomeProfile"
            component={ProfileScreen}
            options={{
                title: '',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                        <Ionicons name="arrow-back" size={25} color="#FF9990" />
                    </View>
                ),
            }}
        />
    </Stack.Navigator>
);

const MessageStack = ({ navigation }) => (
    <Stack.Navigator>
        <Stack.Screen name="Messages" component={MessageScreen} options={{
            header: (props) => <SearchHeader {...props} />
        }} />
        <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={({ route }) => ({
                title: route.params.fname + " " + route.params.lname,
                headerBackTitleVisible: false,
            })}
        />
    </Stack.Navigator>
);

const ProfileStack = ({ navigation }) => (
    <Stack.Navigator >
        <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
                headerTitle: 'Edit Profile',
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
            }}
        />
    </Stack.Navigator>
);

const AppStack = () => {
    const getTabBarVisibility = (route) => {
        const routeName = route.state
            ? route.state.routes[route.state.index].name
            : '';

        if (routeName === 'Chat') {
            return false;
        }
        return true;
    };

    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#FF9990'
            }}>
            <Tab.Screen
                name="Home"
                component={FeedStack}
                options={({ route }) => ({
                    tabBarLabel: 'Home',
                    headerShown: false,
                    // tabBarVisible: route.state && route.state.index === 0,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="home-outline"
                            color={color}
                            size={size}
                        />
                    ),
                })}
            />
            <Tab.Screen
                name="Message"
                component={MessageStack}
                options={({ route }) => ({
                    tabBarVisible: getTabBarVisibility(route),
                    headerShown: false,
                    // Or Hide tabbar when push!
                    // https://github.com/react-navigation/react-navigation/issues/7677
                    // tabBarVisible: route.state && route.state.index === 0,
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="chatbox-ellipses-outline"
                            color={color}
                            size={size}
                        />
                    ),
                })}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" color={color} size={size} />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};
const styles = StyleSheet.create({
    logo: {
        height: 36,
        width: 36,
        resizeMode: 'cover',
    }
});

export default AppStack;