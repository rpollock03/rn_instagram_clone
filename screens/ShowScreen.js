import React, { useEffect, useState } from "react"
import { StyleSheet, FlatList, ScrollView } from "react-native"
import { Text, Header, Image, Input, ListItem, Avatar } from 'react-native-elements'

import Spacer from "../components/Spacer"

import { useSelector, useDispatch } from "react-redux"
import { updatePostComments } from "../redux/actions/index"





const ShowScreen = (props) => {

    const dispatch = useDispatch()

    const currentUser = useSelector(store => store.userState.currentUser)
    const feed = useSelector(store => store.usersState.feed)

    const [newComment, setNewComment] = useState("")

    const [post, setPost] = useState({})

    useEffect(() => {
        const post = feed.find(el => el.id === props.route.params.postId)
        setPost(post)
    }, [feed])



    const handleNewComment = () => {
        dispatch(updatePostComments(props.route.params.userId, //id of user that posted.
            post.id, //id of post
            newComment, //content of comment 
            currentUser.name, //author of comment
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

        <FlatList
            ListHeaderComponent={<Spacer>
                <Image
                    style={styles.image}
                    source={{ uri: post.downloadUrl }}
                />
                <Text>{post.caption}</Text>

            </Spacer>}
            numColumns={1}
            horizontal={false}
            ListFooterComponent={<Spacer>

                <Input
                    placeholder="Add a new comment"
                    rightIcon={{ type: 'font-awesome', name: 'plus', onPress: handleNewComment }}
                    value={newComment}
                    onChangeText={newText => setNewComment(newText)}
                />
            </Spacer>}
            keyExtractor={(item, index) => index.toString()}
            data={post.comments}
            renderItem={({ item }) => {


                return (<ListItem bottomDivider >
                    <Avatar size="small" title="MT" rounded containerStyle={{ backgroundColor: "blue" }} />
                    <ListItem.Content>
                        <ListItem.Title><Text style={{ fontWeight: "bold" }}>{item.authorName}</Text>{item.comment}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron name="heart" />
                </ListItem>
                )
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

