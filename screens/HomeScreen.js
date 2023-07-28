import React, { useEffect } from 'react';
import { useState } from 'react';
import { Alert, FlatList, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Container } from '../constants/FeedStyle';
import PostCard from '../components/PostCard';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import { useContext } from 'react';


const HomeScreen = ({ navigation }) => {
    const [posts, setPosts] = useState();
    const [loading, setLoading] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const { user } = useContext(AuthContext);
    
    const fetchPosts = async () => {
        try {
            const response =  await fetch('http://10.0.2.2:3000/listPost', {
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

    useEffect(() => {
        const newPost = route.params?.newPost;
        if (newPost) {
            setPosts(prevPosts => [newPost, ...prevPosts]);
        }
        fetchPosts();
        setDeleted(false);
    }, [deleted]);

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
                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            } else {
                console.error('Failed to delete post:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const _handleCmt = (postId,cmt) => {
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
                <View style={{paddingVertical:3,paddingHorizontal:6}}>
                            <FlatList
                                data={posts}
                                renderItem={({ item }) => (
                                    <PostCard
                                        item={item}
                                        onDelete={handleDelete}
                                        onLike={handleLike}
                                        onComment={_handleCmt}
                                    />
                                )}
                                keyExtractor={(item) => item.id}
                                ListHeaderComponent={ListHeader}
                                ListFooterComponent={ListHeader}
                                showsVerticalScrollIndicator={false}
                            />
                      
                </View>
                  
            )}
        </SafeAreaView>
    );
};

export default HomeScreen;
