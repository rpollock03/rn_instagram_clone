import React, { useState, useEffect } from "react"
import { Text, View, Button, StatusBar, Image, StyleSheet, FlatList } from "react-native"

import MainHeader from "../components/MainHeader"
import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"


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

    return (
        <View style={styles.container}>
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


export default connect(mapStateToProps, null)(ProfileScreen)