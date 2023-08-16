import React, { useEffect } from 'react';
import { useState } from 'react';
import { Alert, FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View,Image, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Container } from '../constants/FeedStyle';
import PostCard from '../components/PostCard';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import { useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import InstaStory from 'react-native-insta-story';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const HomeScreen = ({ navigation }) => {
    
    const [posts, setPosts] = useState();
    const [loading, setLoading] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const { user } = useContext(AuthContext);
    const [storyData, setStoryData] = useState([]);
    const isFocused = useIsFocused();
    const fetchPosts = async () => {
        try {
            const response = await fetch('http://10.0.2.2:3000/listPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPosts(data);
            if (loading) {
                setLoading(false);
            }
        } catch (error) {
            console.log('Error fetching posts:', error);
        }

    };
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
                if (loading) {
                    setLoading(false);
                }
            } else {
                console.error('Error fetching story data');
            }
        } catch (error) {
            console.error('Error fetching story data:', error);
        }
    };
    useEffect(() => {

        if (isFocused) {
            fetchPosts();
            fetchStoryData();
        }
        // navigation.addListener("focus", () => setLoading(!loading));
        setDeleted(false);
    }, [isFocused,user]);

    const handleDelete = (postId) => {
        Alert.alert(
            'Delete post',
            'Are you sure?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed!'),
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => deletePost(postId),
                },
            ],
            { cancelable: false },
        );
    };

    const deletePost = async (postId) => {
        console.log('Current Post Id: ', postId);

        try {
            const response = await fetch(`http://10.0.2.2:3000/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Post deleted successfully');
                Toast.show({
                    type: 'success',
                    text1: 'Post deleted successfully !',
                    visibilityTime: 2000,
                });
                console.log(postId);
                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            } else {
                console.error('Failed to delete post:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const _handleCmt = (postId, cmt) => {
        if (!cmt) {
            return
        }
        console.log(cmt);
        fetch(`http://10.0.2.2:3000/posts/cmt/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user._id, content: cmt }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Comment added successfully:', data);
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? { ...post, comments: [...post.comments, data.comment] }
                            : post
                    )
                );
            })
            .catch((error) => {
                console.error('Error adding comment:', error);
            });
    }
    const handleLike = async (postId) => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/posts/${postId}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id }),
            });
            if (response.ok) {
                const updatedLiked = await response.json();
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? {
                                ...post,
                                liked: updatedLiked.liked,
                                likes: updatedLiked.liked
                                    ? [...post.likes, user._id]
                                    : post.likes.filter((userId) => userId !== user._id),
                            }
                            : post
                    )
                );
            } else {
                console.error('Failed to update post likes:', response.statusText);
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };
    const ListHeader = () => {
        return null;
    };
    const handleUpdate = (postId) => {
        navigation.navigate('EditPost', { postId });
    };

    const handleAddPostStory = () => {
        navigation.navigate('AddStory')
    }

    const handleUserPressStory = (user) => {
        navigation.navigate('UserStories', { user });
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} >
            {loading ? (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ alignItems: 'center' }}>
                    <SkeletonPlaceholder>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                                <View
                                    style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10, marginBottom: 30 }}>
                            <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            <View
                                style={{ marginTop: 6, width: 250, height: 20, borderRadius: 4 }}
                            />
                            <View
                                style={{ marginTop: 6, width: 350, height: 200, borderRadius: 4 }}
                            />
                        </View>
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                                <View
                                    style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10, marginBottom: 30 }}>
                            <View style={{ width: 300, height: 20, borderRadius: 4 }} />
                            <View
                                style={{ marginTop: 6, width: 250, height: 20, borderRadius: 4 }}
                            />
                            <View
                                style={{ marginTop: 6, width: 350, height: 200, borderRadius: 4 }}
                            />
                        </View>
                    </SkeletonPlaceholder>
                </ScrollView>
            ) : (
                
                <ScrollView style={{ paddingVertical: 3, paddingHorizontal: 6,flex:1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                            {!loading ? (
                            <View style={{ position: 'relative', top: -10 }}>
                                <Image
                                    source={{ uri: user ? user.userImg || 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' }}
                                    style={{ width: 65, height: 65, borderRadius: 65 / 2, borderColor: 'black', borderWidth: 2, opacity: 0.8 }} />
                                <TouchableOpacity onPress={handleAddPostStory} style={{ marginLeft: 'auto', paddingHorizontal: 15 }}>
                                    <MaterialCommunityIcons
                                        name="camera-plus"
                                        size={25}
                                        color="black"
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'absolute',
                                            top: -20
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>):(
                                null
                            )}
                            {!loading ? (
                                <InstaStory
                                    data={storyData}
                                    duration={10}

                                />
                            ) : (
                                <Text>Loading...</Text>
                            )}


                        </View>
                    <FlatList
                        data={posts}
                        renderItem={({ item }) => (
                            <PostCard
                                item={item}
                                onDelete={handleDelete}
                                onLike={handleLike}
                                onComment={_handleCmt}
                                onUpdate={handleUpdate}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={ListHeader}
                        ListFooterComponent={ListHeader}
                        showsVerticalScrollIndicator={false}
                    />

                    </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default HomeScreen;
const styles = StyleSheet.create({
    storyContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'black'
    }
});