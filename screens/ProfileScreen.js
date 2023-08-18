import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { useEffect } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PostCard from '../components/PostCard';
import { useState } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';


const ProfileScreen = ({ navigation, route }) => {
    const { user, logout } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [follow, setFollowing] = useState(false);
   
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
        fetch(`http://10.0.2.2:3000/users/${route.params ? route.params.userId : user._id}?loggedInUserId=${user._id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUserData(data);
                setFollowing(data.followed);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    };
    useEffect(() => {
        getUser();
        fetchPosts();
        navigation.addListener("focus", () => setLoading(!loading));
       
    }, [navigation, loading]);

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
                    text1: 'Post deleted successfully!',
                    visibilityTime: 1000,
                });
                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to delete post',
                    visibilityTime: 1000,
                });
                console.error('Failed to delete post:', response.statusText);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Network response was not ok',
                visibilityTime: 1000,
            });
            console.error('Error deleting post:', error);
        }
    };
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
                            ? { ...post, comments: [...post.comments, data.comment], lastComment: data.comment }
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
                Toast.show({
                    type: 'success',
                    text1: 'Successfully!',
                    visibilityTime: 1000,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Network response was not ok',
                    visibilityTime: 1000,
                });
                console.error('Failed to update post likes:', response.statusText);
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };
    const handleFollowUnfollow = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/users/${userData._id}/follow?loggedInUserId=${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.followed)
                setFollowing(data.followed);
                setUserData((prevUserData) => ({
                    ...prevUserData,
                    followers: data.followers,
                    followings: data.followings,
                }));
                Toast.show({
                    type: 'success',
                    text1: 'Successfully!',
                    visibilityTime: 1000,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Network response was not ok',
                    visibilityTime: 1000,
                });
                console.error('Failed to follow/unfollow user:', response.statusText);
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        }
    };
    const handleChatNavigation = () => {
        console.log("ok");
        // Get the 'userName' and 'userId' from the user data
        // const userName = userData.fname + ' ' + userData.lname;
        // const userId = userData._id;
        // var item = {
        //     _id: userData._id,
        //     fname: userData.fname,
        //     lname: userData.lname,
        //     userImg: userData.userImg
        // }
         var item = userData;
        console.log(item);
        // Navigate to 'ChatScreen' with the parameters
        navigation.navigate('Chat', item);
    };
    const handleUpdate = (postId) => {
        navigation.navigate('EditPost', { postId });
    };
    let followersColor = 'gray';
    const followersCount = userData?.followers?.length || 0;
    // Mặc định là màu xám
    if (followersCount >= 3 && followersCount < 6) {
        followersColor = 'gold'; // Màu vàng cho 5-9 followers
    } else if (followersCount >= 6) {
        followersColor = 'blue'; // Màu xanh dương cho 10 followers trở lên
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                showsVerticalScrollIndicator={false}>
                <Image
                    style={styles.userImg}
                    source={{ uri: userData ? userData.userImg || 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg' }}
                />
                <Text style={styles.userName}>
                    {userData ? userData.fname || 'Test' : 'Test'} {userData ? userData.lname || 'User' : 'User'}
                    <Ionicons name='checkmark-circle-sharp' size={22} color={followersColor}></Ionicons>
                </Text>
                <Text style={styles.aboutUser}>
                    {userData ? userData.about || 'No details added.' : ''}
                </Text>
                <View style={styles.userBtnWrapper}>
                    {route.params ? (
                        <>
                            <TouchableOpacity style={styles.userBtn} onPress={handleChatNavigation}>
                                <Text style={styles.userBtnTxt}>Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.userBtn} onPress={handleFollowUnfollow}>
                                <Text style={styles.userBtnTxt}>{follow ? 'Unfollow' : 'Follow'}</Text>
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
                        <Text style={styles.userInfoTitle}> {userData && userData.followers?.length === 0 ? '0 ' : `${userData?.followers?.length || 0} `}</Text>
                        <Text style={styles.userInfoSubTitle}>Followers</Text>
                    </View>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>{userData && userData.followings?.length === 0 ? '0 ' : `${userData?.followings?.length || 0} `}</Text>
                        <Text style={styles.userInfoSubTitle}>Following</Text>
                    </View>
                </View>

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
                ) : (<>
                            {posts.map((item) => (
                                <PostCard key={item.id} item={item} onDelete={handleDelete} onLike={handleLike}
                                    onComment={_handleCmt} onUpdate={handleUpdate} />
                            ))}</>
                )}


                
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
        display:'flex',
        justifyContent:'space-between'
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
