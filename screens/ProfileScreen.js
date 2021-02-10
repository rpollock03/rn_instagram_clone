import React, { useState, useEffect } from "react"
import { Text, View, StatusBar, Image, StyleSheet, FlatList } from "react-native"

import MainHeader from "../components/MainHeader"
import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"

import { Divider, Avatar, Header, ListItem, Button } from 'react-native-elements'
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import Spacer from "../components/Spacer"

const ProfileScreen = (props) => {

    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)


    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        const { currentUser, posts } = props

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        } else {

            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data())
                    } else {
                        console.log("does not exist")
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

        // note, following is an array from redux. 
        if (props.following.includes(props.route.params.uid)) {
            setIsFollowing(true)
        } else {
            setIsFollowing(false)
        }

    }, [props.route.params.uid, props.following])



    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }

    const onUnFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    const onLogout = () => {
        firebase.auth().signOut();
    }


    if (user === null) {
        return <View />
    }

    return (<>
        <Header
            placement="left"
            leftComponent={{ icon: 'menu', color: '#fff', size: 42 }}
            centerComponent={{ text: user.name, style: { color: '#fff', fontSize: 32 } }}
            rightComponent={{ icon: 'settings', color: '#fff', size: 42 }}
            containerStyle={{
                backgroundColor: "rgb(40,90,135)",
                height: 100,
            }}
        />
        <View style={styles.container}>

            <Spacer>
                <ListItem containerStyle={{ backgroundColor: "transparent" }}>
                    <Avatar
                        size="large"
                        overlayContainerStyle={{ backgroundColor: 'blue' }}
                        rounded
                        title="CR"
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                    >
                        <Avatar.Accessory size={22} />
                    </Avatar>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold' }}>0</ListItem.Title>
                        <ListItem.Subtitle>Following</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold' }}>0</ListItem.Title>
                        <ListItem.Subtitle>Followers</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold' }}>0</ListItem.Title>
                        <ListItem.Subtitle>Posts</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>

                <Text style={{ padding: 2, paddingLeft: 15 }}>Name: {user.name}</Text>
                <Text style={{ padding: 2, paddingLeft: 15 }}>Email: {user.email}</Text>
                <Text style={{ padding: 2, paddingLeft: 15 }}>Bio:</Text>
                {props.route.params.uid === firebase.auth().currentUser.uid ? (
                    <Spacer>
                        <Button
                            title="Edit Profile"
                            type="outline"
                        />
                    </Spacer>
                ) : null}


                <Divider style={{ backgroundColor: 'grey', height: 2, marginTop: 10 }} />



            </Spacer>

            <View style={styles.containerInfo}>
                <Text> {user.name}</Text>
                <Text> {user.email}</Text>



                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {isFollowing ? (<Button title="Following" onPress={() => onUnFollow()} />) : (<Button title="Follow" onPress={() => onFollow()} />)}
                    </View>
                ) : <Button title="Logout" onPress={() => onLogout()} />}
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => {
                        return (<View style={styles.containerImage}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadUrl }}
                            />
                        </View>)
                    }}

                />
            </View>
        </View>
    </>
    )


}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
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
        flex: 1 / 3
    }

})


export default connect(mapStateToProps, null)(ProfileScreen)