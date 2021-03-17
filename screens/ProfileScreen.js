import React, { useState, useEffect } from "react"
import { View, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { useSelector } from "react-redux"

import { Divider, Avatar, Header, ListItem, Button, Text, Icon } from 'react-native-elements'
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Spacer from "../components/Spacer"
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = (props) => {

    //STATE FOR INFORMATION TO DISPLAY
    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)

    //TOGGLE FOLLOWING BUTTON
    const [isFollowing, setIsFollowing] = useState(false)

    const currentUser = useSelector(store => store.userState.currentUser)
    const posts = useSelector(store => store.userState.posts)
    const following = useSelector(store => store.userState.following)

    useEffect(() => {

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
        //FOLLOWING IS AN ARRAY OF USERS BEING FOLLOWED BY CURRENT USER
        if (following.includes(props.route.params.uid)) {
            setIsFollowing(true)
        } else {
            setIsFollowing(false)
        }

    }, [props.route.params.uid, following, currentUser])


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
            .collection("users")
            .doc(props.route.params.uid)
            .collection("followers")
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
            .collection("users")
            .doc(props.route.params.uid)
            .collection("followers")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }


    if (user === null) {
        return <View />
    }

    return (<>
        {/* HEADER */}
        <Header
            placement="center"
            centerComponent={{ text: 'Robstagram', style: { fontFamily: "Billabong", color: "#FFF", fontSize: 44 } }}
            containerStyle={{
                backgroundColor: "rgb(40,90,135)",
                height: 100,
            }}
        />

        {/* PROFILE INFO */}
        <View style={styles.container}>
            <Spacer>
                <ListItem containerStyle={{ backgroundColor: "transparent" }}>

                    {props.route.params.uid === firebase.auth().currentUser.uid && currentUser.profilePic
                        ? (<Avatar source={{ uri: currentUser.profilePic }} size="large" rounded>
                            <Avatar.Accessory
                                size={22}
                                onPress={() => props.navigation.navigate("EditBio")}
                            />
                        </Avatar>
                        )
                        : props.route.params.uid !== firebase.auth().currentUser.uid && user.profilePic
                            ? (<Avatar source={{ uri: user.profilePic }} size="large" rounded />
                            )
                            : (<Avatar rounded icon={{ name: 'person', type: "ionicons" }} size="large" rounded overlayContainerStyle={{ backgroundColor: 'grey' }} >
                            </Avatar>)
                    }



                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold' }}>{following.length - 1}</ListItem.Title>
                        <ListItem.Subtitle>Following</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold' }}>{user.followers ? user.followers.length : "0"}</ListItem.Title>
                        <ListItem.Subtitle>Followers</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold' }}>{userPosts.length}</ListItem.Title>
                        <ListItem.Subtitle>Posts</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <View style={{ display: "flex", flexDirection: "row", paddingLeft: 15, borderStyle: "solid", borderColor: "grey", borderWidth: 2, borderRadius: 6, padding: 9 }}>
                    <View style={{ paddingRight: 15, borderStyle: "solid", borderRightColor: "grey", borderRightWidth: 2 }}>
                        <Text h5 style={{ fontWeight: "bold" }}>@{user.userName || "blank"}</Text>
                        <Text h5 style={{ padding: 2, paddingTop: 4, paddingBottom: 4 }}>{user.name}</Text>
                        <Text style={{ padding: 2, textDecorationLine: "underline", color: "rgb(64,93,230)" }}>{user.email}</Text>
                    </View>
                    <Text style={{ display: "flex", flex: 1, padding: 2, paddingLeft: 10, flexWrap: "wrap", fontStyle: "italic" }}> {user.bio || "Here's to the crazy ones..."}</Text>
                </View>

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
                    keyExtractor={(item, index) => index.toString()}
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
                            </View>
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

export default ProfileScreen