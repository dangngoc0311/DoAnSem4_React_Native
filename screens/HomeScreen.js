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

    const deletePost = (postId) => {
        console.log('Current Post Id: ', postId);

        firestore()
            .collection('posts')
            .doc(postId)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const { postImg } = documentSnapshot.data();

                    if (postImg != null) {
                        const storageRef = storage().refFromURL(postImg);
                        const imageRef = storage().ref(storageRef.fullPath);

                        imageRef
                            .delete()
                            .then(() => {
                                console.log(`${postImg} has been deleted successfully.`);
                                deleteFirestoreData(postId);
                            })
                            .catch((e) => {
                                console.log('Error while deleting the image. ', e);
                            });
                        // If the post image is not available
                    } else {
                        deleteFirestoreData(postId);
                    }
                }
            });
    };

    const deleteFirestoreData = (postId) => {
        firestore()
            .collection('posts')
            .doc(postId)
            .delete()
            .then(() => {
                Alert.alert(
                    'Post deleted!',
                    'Your post has been deleted successfully!',
                );
                setDeleted(true);
            })
            .catch((e) => console.log('Error deleting posst.', e));
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
