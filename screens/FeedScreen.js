import React, { useState, useEffect } from "react"
import { Text, View, Button, StatusBar, Image, StyleSheet, FlatList } from "react-native"

import MainHeader from "../components/MainHeader"
import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"


const FeedScreen = (props) => {

    const [posts, setPosts] = useState([])


    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation
            })

            setPosts(props.feed)
        }

    }, [props.usersFollowingLoaded, props.feed])


    const onLikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }


    const onDislikePress = (userId, postId) => {
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
        <View style={styles.container}>



            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => {
                        return (<View style={styles.containerImage}>
                            <Text style={styles.container}>{item.user.name}</Text>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadUrl }}
                            />
                            { item.currentUserLike ?
                                (<Button title="DISLIKE" onPress={() => onDislikePress(item.user.uid, item.id)} />
                                ) : <Button title="LIKE" onPress={() => onLikePress(item.user.uid, item.id)} />

                            }
                            <Button title="View Comments..." onPress={() => props.navigation.navigate("Comment", { postId: item.id, uid: item.user.uid })} />
                        </View>)
                    }}

                />
            </View>

        </View>

    )


}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    containerInfo: {
        margin: 20,
    },
    containerGallery: {
        flex: 1
    },
    image: {
        flex: 1,
        aspectRatio: 1
    },
    containerImage: {
        flex: 1 / 3
    }

})


export default connect(mapStateToProps, null)(FeedScreen)