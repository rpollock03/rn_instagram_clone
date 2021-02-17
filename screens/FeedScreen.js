import React, { useState, useEffect } from "react"
import { Text, View, Button, StatusBar, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"
import { ListItem, Avatar, Header } from 'react-native-elements'

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const FeedScreen = (props) => {

    //STATE FOR FEED
    const [posts, setPosts] = useState([])


    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation
            })
            setPosts(props.feed)
        }

    }, [props.usersFollowingLoaded, props.feed])


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
            placement="left"
            leftComponent={{ icon: 'menu', color: '#fff', size: 42 }}
            centerComponent={{ text: "hi", style: { color: '#fff', fontSize: 32 } }}

            containerStyle={{
                backgroundColor: "rgb(40,90,135)",
                height: 100,
            }}
        />

        <View style={styles.container}>



            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => {
                        return (<>

                            <View style={styles.containerImage}>
                                <ListItem bottomDivider>
                                    <Avatar rounded title="MT" containerStyle={{ backgroundColor: "blue" }} />
                                    <ListItem.Content>
                                        <ListItem.Title>{item.user.name}</ListItem.Title>

                                    </ListItem.Content>
                                </ListItem>
                                <TouchableOpacity onPress={() => props.navigation.navigate("Show", { postId: item.id, downloadUrl: item.downloadUrl })}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: item.downloadUrl }}
                                    />
                                </TouchableOpacity>
                                <View style={styles.buttonContainer}>
                                    {item.currentUserLike
                                        ? <Ionicons name="heart-sharp" size={44} color="black" style={{ color: "red", marginLeft: 5, marginRight: 10 }} onPress={() => onDislikePress(item.user.uid, item.id)} />
                                        : <Ionicons name="heart-outline" size={44} color="black" style={{ color: "red", marginLeft: 5, marginRight: 10 }} onPress={() => onLikePress(item.user.uid, item.id)} />

                                    }
                                    <FontAwesome5 name="comment" size={40} color="black" onPress={() => props.navigation.navigate("Show", { postId: item.id, downloadUrl: item.downloadUrl })} />
                                </View>

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

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flex: 1 / 3,

    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row"
    }

})


export default connect(mapStateToProps, null)(FeedScreen)