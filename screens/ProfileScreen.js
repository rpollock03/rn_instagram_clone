import React, { useState, useEffect } from "react"
import { Text, View, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"

import { Divider, Avatar, Header, ListItem, Button } from 'react-native-elements'
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import Spacer from "../components/Spacer"

const ProfileScreen = (props) => {

    //STATE FOR INFORMATION TO DISPLAY
    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)

    //TOGGLE FOLLOWING BUTTON
    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {

        //EXTRACT CURRENT USER INFO FROM PROPS
        const { currentUser, posts } = props



        //IF USER PRESSED THEIR PROFILE BUTTON, USE DATA ALREADY IN REDUX
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
            //ELSE IF USER SELECTED SOMEONE ELSES PROFILE RETRIEVE THAT USERS PROFILE DATA
        } else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data())
                    } else {
                        console.log("User does not exist")
                    }
                })

            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc") //ascending order
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id
                        return { id, ...data }
                    })
                    setUserPosts(posts)
                })

        }

        //PROPS.FOLLOWING AN ARRAY OF USERS BEING FOLLOWED BY CURRENT USER
        if (props.following.includes(props.route.params.uid)) {
            setIsFollowing(true)
        } else {
            setIsFollowing(false)
        }

    }, [props.route.params.uid, props.following, props.currentUser])


    const onFollow = () => {
        //add to following list
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
        //add to followers list
        firebase.firestore()
            .collection("following")
            .doc(props.route.params.uid)
            .collection("userFollowers")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }

    const onUnFollow = () => {
        //remove from following list
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
        //remove from followers list
        firebase.firestore()
            .collection("following")
            .doc(props.route.params.uid)
            .collection("userFollowers")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }


    if (user === null) {
        return <View />
    }

    return (<>
        {/* HEADER */}
        <Header
            placement="left"
            leftComponent={{ icon: 'menu', color: '#fff', size: 42 }}
            centerComponent={{ text: user.userName, style: { color: '#fff', fontSize: 32 } }}
            rightComponent={{ icon: 'settings', color: '#fff', size: 42, onPress: () => props.navigation.navigate("Settings") }}
            containerStyle={{
                backgroundColor: "rgb(40,90,135)",
                height: 100,
            }}
        />




        {/* PROFILE INFO */}
        <View style={styles.container}>
            <Spacer>
                <ListItem containerStyle={{ backgroundColor: "transparent" }}>
                    {props.currentUser.profilePic
                        ? (
                            <Avatar source={{ uri: props.currentUser.profilePic }} size="large" rounded>
                                {props.route.params.uid === firebase.auth().currentUser.uid ?
                                    <Avatar.Accessory
                                        size={22}
                                        onPress={() => props.navigation.navigate("EditBio")}
                                    />
                                    : null}
                            </Avatar>
                        )
                        : (<Avatar rounded icon={{ name: 'home' }} size="large" rounded overlayContainerStyle={{ backgroundColor: 'grey' }} >
                            {props.route.params.uid === firebase.auth().currentUser.uid ?
                                <Avatar.Accessory
                                    size={22}
                                    onPress={() => props.navigation.navigate("EditBio")}
                                />
                                : null}


                        </Avatar>
                        )
                    }


                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold' }}>{props.following.length}</ListItem.Title>
                        <ListItem.Subtitle>Following</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold' }}>0</ListItem.Title>
                        <ListItem.Subtitle>Followers</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold' }}>{userPosts.length}</ListItem.Title>
                        <ListItem.Subtitle>Posts</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>

                <Text style={{ padding: 2, paddingLeft: 15 }}>Name: {user.name}</Text>
                <Text style={{ padding: 2, paddingLeft: 15 }}>Email: {user.email}</Text>
                <Text style={{ padding: 2, paddingLeft: 15 }}>Bio:{user.bio}</Text>

                {/* SHOW EDIT BUTTON IF PROFILE OF CURRENT USER */}
                {props.route.params.uid === firebase.auth().currentUser.uid ? (
                    <Spacer>
                        <Button
                            title="Edit Profile"
                            type="outline"
                            onPress={() => props.navigation.navigate("EditBio")}
                        />
                    </Spacer>
                ) : null}

                <Divider style={{ backgroundColor: 'grey', height: 2, marginTop: 10 }} />
            </Spacer>
            {/* SHOW FOLLOW/UNFOLLOW BUTTON IF NOT PROFILE OF CURRENT USER */}
            <View style={styles.containerInfo}>
                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {isFollowing ? (<Button title="Following" onPress={() => onUnFollow()} />) : (<Button title="Follow" onPress={() => onFollow()} />)}
                    </View>
                ) : null}
            </View>

            {/* USER POSTS */}
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.containerImage}>
                                <TouchableOpacity onPress={() => props.navigation.navigate("Show", { postId: item.id, downloadUrl: item.downloadUrl })}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: item.downloadUrl }}
                                    />
                                </TouchableOpacity>
                            </View>)
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

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(ProfileScreen)