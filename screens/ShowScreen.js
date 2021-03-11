import React, { useEffect, useState } from "react"
import { StyleSheet, FlatList, ScrollView, TouchableOpacity } from "react-native"
import { Text, Header, Image, Input, ListItem, Button, Avatar } from 'react-native-elements'

import Spacer from "../components/Spacer"

import { useSelector, useDispatch } from "react-redux"
import { fetchUsersData, updatePostComments } from "../redux/actions/index"





const ShowScreen = (props) => {

    const dispatch = useDispatch()

    const currentUser = useSelector(store => store.userState.currentUser)
    const feed = useSelector(store => store.usersState.feed)

    const [newComment, setNewComment] = useState("")

    const [post, setPost] = useState({ user: { profilePic: null } })
    const [showComments, setShowComments] = useState(false)


    useEffect(() => {
        const postFound = feed.find(el => el.id === props.route.params.postId)
        if (postFound) {
            setPost(postFound)
        }
    }, [feed])



    const handleNewComment = () => {
        dispatch(updatePostComments(props.route.params.userId, //id of user that posted.
            post.id, //id of post
            newComment, //content of comment 
            currentUser.userName, //author of comment
            currentUser.profilePic

        ))
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

        <ListItem>

            {post.user.profilePic
                ? <Avatar source={{ uri: post.user.profilePic }} size="medium" rounded onPress={() => props.navigation.navigate("Profile", { uid: post.user.uid })} />
                : <Avatar rounded icon={{ name: 'person', type: "ionicons" }} size="medium" rounded overlayContainerStyle={{ backgroundColor: 'grey' }} onPress={() => props.navigation.navigate("Profile", { uid: post.user.uid })} />}


            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "bold" }} onPress={() => props.navigation.navigate("Profile", { uid: post.user.uid })}>{"@" + post.user.userName}'s post</ListItem.Title>

            </ListItem.Content>

        </ListItem>




        <FlatList
            ListHeaderComponent={<Spacer>
                <Image
                    style={styles.image}
                    source={{ uri: post.downloadUrl }}
                />
                <Text style={{ marginTop: 6 }}><Text h5 style={{ fontWeight: "bold" }}>@{post.user.userName || "blank"}</Text> - {post.caption}</Text>
                <Input
                    style={{ marginTop: 12 }}
                    placeholder="Add new comment"
                    rightIcon={{ type: 'font-awesome', name: 'plus', onPress: handleNewComment }}
                    value={newComment}
                    onChangeText={newText => setNewComment(newText)}
                />
                <Button type="outline" title="Show comments" onPress={() => setShowComments(!showComments)} />
            </Spacer>}
            numColumns={1}
            horizontal={false}

            keyExtractor={(item, index) => index.toString()}
            data={post.comments}
            renderItem={({ item }) => {

                if (showComments) {
                    return (

                        <ListItem bottomDivider >
                            <TouchableOpacity onPress={() => props.navigation.navigate("Profile", { uid: item.authorId })}>
                                {post.hasOwnProperty("user") && item.profilePic ? <Avatar source={{ uri: item.profilePic }} size="small" rounded />
                                    : <Avatar rounded icon={{ name: 'person', type: "ionicons" }} size="small" rounded overlayContainerStyle={{ backgroundColor: 'grey' }} />}
                            </TouchableOpacity>
                            <ListItem.Content>
                                <ListItem.Title><TouchableOpacity onPress={() => props.navigation.navigate("Profile", { uid: item.authorId })}><Text style={{ fontWeight: "bold" }}>@{item.authorUserName || "blank"}</Text></TouchableOpacity> - {item.comment}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron name="heart" />
                        </ListItem>
                    )
                }

                return null
            }}


        />



    </>
}

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1
    }

})





export default ShowScreen

