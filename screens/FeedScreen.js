import React, { useState, useEffect } from "react"
import { View, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { useSelector } from "react-redux"
import { ListItem, Avatar, Header, Text } from 'react-native-elements'

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const FeedScreen = (props) => {

    const following = useSelector(store => store.userState.following)
    const feed = useSelector(store => store.usersState.feed)
    const usersFollowingLoaded = useSelector(store => store.usersState.usersFollowingLoaded)

    //STATE FOR FEED
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (usersFollowingLoaded == following.length && following.length !== 0) {
            feed.sort(function (x, y) {
                return x.creation - y.creation
            })
            setPosts(feed)

        }
    }, [usersFollowingLoaded, feed])


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


    return (<>
        <Header
            placement="center"
            centerComponent={{ text: 'Instagram', style: { fontFamily: "Billabong", color: "#FFF", fontSize: 44 } }}
            containerStyle={{
                backgroundColor: "rgb(40,90,135)",
                height: 100,
            }}
        />

        <View style={styles.container}>
            <View style={styles.galleryContainer}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => {
                        return (<>
                            {/*POST HEADER - user info etc */}
                            <View style={styles.post}>
                                <ListItem bottomDivider >
                                    {item.user.profilePic ? <Avatar source={{ uri: item.user.profilePic }} size="medium" rounded />
                                        : <Avatar rounded icon={{ name: 'home' }} size="medium" rounded overlayContainerStyle={{ backgroundColor: 'grey' }} />}
                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontWeight: "bold" }}>{item.user.name}</ListItem.Title>
                                        <ListItem.Subtitle>{item.user.userName ? "@" + item.user.userName : "new user"}</ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Chevron size={44} />
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