import React, { useState, useEffect } from "react"
import { View, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { useDispatch, useSelector } from "react-redux"
import { fetchUserFollowing } from "../redux/actions/index"
import { ListItem, Avatar, Header, Text } from 'react-native-elements'

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const FeedScreen = (props) => {

    const following = useSelector(store => store.userState.following)
    const feed = useSelector(store => store.usersState.feed)
    const usersFollowingLoaded = useSelector(store => store.usersState.usersFollowingLoaded)
    const dispatch = useDispatch()

    //STATE FOR NEWS FEED
    const [posts, setPosts] = useState([])
    const [isFeedRefresh, setIsFeedRefresh] = useState(false)

    useEffect(() => {
        if (usersFollowingLoaded == following.length && following.length !== 0) {
            feed.sort(function (x, y) {
                return x.creation - y.creation
            })
            setPosts(feed)
        }
    }, [usersFollowingLoaded, feed])

    const onRefresh = () => {
        setIsFeedRefresh(true)
        dispatch(fetchUserFollowing)
        console.log("Newsfeed refreshing!")
        setIsFeedRefresh(false)
    }

    const onLikePress = (uid, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }


    const onDislikePress = (uid, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }


    return (
        <>
            <Header
                placement="center"
                centerComponent={{ text: 'Robstagram', style: { fontFamily: "Billabong", color: "#FFF", fontSize: 44 } }}
                containerStyle={{
                    backgroundColor: "rgb(40,90,135)",
                    height: 100,
                }}
            />

            <View style={styles.container}>
                <View style={styles.galleryContainer}>
                    <FlatList
                        numColumns={1}
                        onRefresh={() => onRefresh()}
                        refreshing={isFeedRefresh}
                        horizontal={false}
                        data={posts}
                        renderItem={({ item }) => {
                            return (
                                <>
                                    {/*POST HEADER - user info etc */}
                                    <View style={styles.post}>
                                        <ListItem bottomDivider >
                                            <TouchableOpacity onPress={() => props.navigation.navigate("Profile", { uid: item.user.uid })}>
                                                {item.user.profilePic ? <Avatar source={{ uri: item.user.profilePic }} size="medium" rounded />
                                                    : <Avatar rounded icon={{ name: 'person', type: "ionicons" }} size="medium" rounded overlayContainerStyle={{ backgroundColor: 'grey' }} />}
                                            </TouchableOpacity>
                                            <ListItem.Content>
                                                <TouchableOpacity onPress={() => props.navigation.navigate("Profile", { uid: item.user.uid })}>
                                                    <ListItem.Title style={{ fontWeight: "bold" }}>{"@" + item.user.userName}</ListItem.Title>
                                                </TouchableOpacity>
                                                <ListItem.Subtitle>
                                                    <FontAwesome5 name="map-pin" size={15} color="crimson" />
                                                    {" " + item.location}
                                                </ListItem.Subtitle>
                                            </ListItem.Content>
                                            <ListItem.Chevron size={30} />
                                        </ListItem>

                                        {/*POST IMAGE - pressable */}
                                        <TouchableOpacity
                                            onPress={() => props.navigation.navigate("Show", { postId: item.id, userId: item.user.uid })}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: item.downloadUrl }}
                                            />
                                        </TouchableOpacity>

                                        {/*POST BUTTONS - like/comment etc */}
                                        <View style={styles.buttonContainer}>
                                            {item.currentUserLike
                                                ? <Ionicons name="heart-sharp" size={34} color="black" style={{ color: "red", marginLeft: 5, marginRight: 10 }} onPress={() => onDislikePress(item.user.uid, item.id)} />
                                                : <Ionicons name="heart-outline" size={34} color="black" style={{ color: "red", marginLeft: 5, marginRight: 10 }} onPress={() => onLikePress(item.user.uid, item.id)} />
                                            }
                                            <FontAwesome5 name="comment" size={30} color="black" onPress={() => props.navigation.navigate("Show", { postId: item.id, userId: item.user.uid })} />
                                            {item.comments ? <Text style={{ padding: 5 }} h5 onPress={() => props.navigation.navigate("Show", { postId: item.id, userId: item.user.uid })}>{item.comments.length} comments</Text> : null}
                                            <FontAwesome5 name="bookmark" size={24} color="black" style={{ marginLeft: "auto", padding: 5 }} />
                                        </View>
                                        {/*POST CAPTION  */}
                                        <Text style={{ marginTop: 5, marginBottom: 5, maxHeight: 30 }}><Text style={{ fontWeight: "bold" }}>@{item.user.userName || "blank"}</Text>: {item.caption}</Text>
                                    </View>
                                </>
                            )
                        }}
                    />
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d3d3d3"
    },
    galleryContainer: {
        flex: 1,
    },
    post: {
        margin: 10,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 5
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 10
    },
    buttonContainer: {
        display: "flex",
        marginTop: 5,
        flexDirection: "row",
    }
})


export default FeedScreen