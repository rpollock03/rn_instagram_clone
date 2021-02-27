import React, { useEffect, useState } from "react"
import { StyleSheet, FlatList } from "react-native"
import { Button, Text, Header, Image, Input } from 'react-native-elements'
import { View } from "react-native"
import Spacer from "../components/Spacer"

import firebase from "firebase"
require("firebase/firestore")
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { updatePostComments } from "../redux/actions/index"

const ShowScreen = (props) => {

    const [newComment, setNewComment] = useState("")

    const [post, setPost] = useState({})

    useEffect(() => {
        const post = props.feed.find(el => el.id === props.route.params.postId)
        setPost(post)
    }, [props.feed])


    //FIX THIS SO THAT NOT ALL COMING FROM ROUTE PARAMS, ALL SHOULD COME FROM REDUX STORE. INSTEAD OF COMMENTS STATE HAVE POST STATE THAT HAS EVERYTHING.

    const handleNewComment = () => {
        props.updatePostComments(props.route.params.userId, //id of user that posted.
            props.route.params.postId, //id of post
            newComment, //content of comment 
            props.currentUser.name, //author of comment
        )
        setNewComment("")
    }


    return <>
        <Header
            placement="center"

            centerComponent={{ text: 'Robstagram', style: { fontFamily: "Billabong", color: "#FFF", fontSize: 44 } }}

            containerStyle={{
                backgroundColor: "rgb(40,90,135)",
                height: 100,
            }}
        />

        <View style={styles.containerImage}>
            <Image
                style={styles.image}
                source={{ uri: props.route.params.downloadUrl }}
            />
            <Text>{post.caption}</Text>
            <Spacer>
                <Input
                    placeholder="Comment"
                    leftIcon={{ type: 'font-awesome', name: 'comment' }}
                    rightIcon={{ type: 'font-awesome', name: 'plus', onPress: handleNewComment }}
                    value={newComment}
                    onChangeText={newText => setNewComment(newText)}
                />
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    keyExtractor={(item, index) => index.toString()}
                    data={post.comments}
                    renderItem={({ item }) => {


                        return (<Text>{item.authorName} - {item.comment}</Text>)
                    }}

                />
            </Spacer>







        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginBottom: 100
    },
    containerImage: {
        flex: 1

    },
    image: {
        aspectRatio: 1
    },

})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    feed: store.usersState.feed
})
const mapDispatchProps = (dispatch) => bindActionCreators({ updatePostComments }, dispatch)


export default connect(mapStateToProps, mapDispatchProps)(ShowScreen)

