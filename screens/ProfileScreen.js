import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PostCard from '../components/PostCard';
import { useState } from 'react';

const ProfileScreen = ({ navigation, route }) => {
    const { user, logout } = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const [userData, setUserData] = useState(null);

    const fetchPosts = async () => {
        try {
            const list = [];
            setPosts(list);
            const response = await fetch(`http://10.0.2.2:3000/users/posts/${route.params ? route.params.userId : user._id}`, {
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

            console.log(response);
            if (loading) {
                setLoading(false);
            }

            console.log('Posts: ', posts);
        } catch (e) {
            console.log(e);
        }
    };

    const getUser = async () => {
        fetch(`http://10.0.2.2:3000/users/${route.params ? route.params.userId : user._id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUserData(data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }

    useEffect(() => {
        getUser();
        fetchPosts();
        navigation.addListener("focus", () => setLoading(!loading));
    }, [navigation, loading]);

    const handleDelete = () => { };
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
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                showsVerticalScrollIndicator={false}>
                <Image
                    style={styles.userImg}
                    source={{ uri: userData ? userData.userImg || 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' }}
                />
                <Text style={styles.userName}>{userData ? userData.fname || 'Test' : 'Test'} {userData ? userData.lname || 'User' : 'User'}</Text>
                {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
                <Text style={styles.aboutUser}>
                    {userData ? userData.about || 'No details added.' : ''}
                </Text>
                <View style={styles.userBtnWrapper}>
                    {route.params ? (
                        <>
                            <TouchableOpacity style={styles.userBtn} onPress={() => { }}>
                                <Text style={styles.userBtnTxt}>Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.userBtn} onPress={() => { }}>
                                <Text style={styles.userBtnTxt}>Follow</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.userBtn}
                                onPress={() => {
                                    navigation.navigate('EditProfile');
                                }}>
                                <Text style={styles.userBtnTxt}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
                                <Text style={styles.userBtnTxt}>Logout</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={styles.userInfoWrapper}>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>{posts.length}</Text>
                        <Text style={styles.userInfoSubTitle}>Posts</Text>
                    </View>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>10,000</Text>
                        <Text style={styles.userInfoSubTitle}>Followers</Text>
                    </View>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>100</Text>
                        <Text style={styles.userInfoSubTitle}>Following</Text>
                    </View>
                </View>

                {posts.map((item) => (
                    <PostCard key={item.id} item={item} onDelete={handleDelete} onLike={handleLike}
                        onComment={_handleCmt} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    aboutUser: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    userBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    userBtn: {
        borderColor: '#2e64e5',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
    },
    userBtnTxt: {
        color: '#2e64e5',
    },
    userInfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
    },
    userInfoItem: {
        justifyContent: 'center',
    },
    userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    userInfoSubTitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});
