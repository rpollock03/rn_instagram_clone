import firebase from "firebase"


// RESTORE BOTH USER AND USERS STATES TO DEFAULT
export function clearData() {
    return ((dispatch) => {
        dispatch({ type: "CLEAR_DATA" })
    })
}

// FETCH DATA FOR A SINGLE USER EG PROFILE SCREEN
export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: "USER_STATE_CHANGE", currentUser: snapshot.data() })
                } else {
                    console.log("does not exist")
                }
            })
    })
}

export function updateUserProfile(name, userName, bio, profilePic) {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({ name: name, bio: bio, userName: userName, profilePic: profilePic })
        dispatch({
            type: "USER_PROFILE_STATE_CHANGE", name, bio, userName, profilePic
        })
    })
}



export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc") //ascending order
            .get()
            .then((snapshot) => {

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return { id, ...data }
                })
                dispatch({ type: "USER_POSTS_STATE_CHANGE", posts })
            })
    })
}


//gets list of users following
export function fetchUserFollowing() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id
                    return id
                })
                dispatch({ type: "USER_FOLLOWING_STATE_CHANGE", following })
                for (let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i], true))
                }
            })
    })
}

//called by above, for every user following call this function and returns posts too
//if called NOT by the above function, it will only return user ids of users following. 
export function fetchUsersData(uid, getPosts) {
    return ((dispatch, getState) => {

        const found = getState().usersState.users.some(el => el.uid === uid)
        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data()
                        user.uid = snapshot.id
                        dispatch({ type: "USERS_DATA_STATE_CHANGE", user })

                    } else {
                        console.log("does not exist")
                    }
                })
            //above only returns ID list of user, below also triggers posts getting
            if (getPosts) {
                dispatch(fetchUsersFollowingPosts(uid))
            }
        }
    })
}

//called by above functions - for every user following, this will be called. 
export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc") //all of a users posts by ascending order.
            .get()
            .then((snapshot) => {
                //firebase function above is async so we lose UID

                const uid = snapshot.query.EP.path.segments[1]//user of data we want

                const user = getState().usersState.users.find(el => el.uid === uid)//find user in existing state
                //create new array, posts, that 
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return { id, ...data, user }
                })

                for (let i = 0; i < posts.length; i++) {
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
                    dispatch(fetchUsersFollowingComments(uid, posts[i].id))
                }
                dispatch({ type: "USERS_POSTS_STATE_CHANGE", posts, uid })
                //console.log(getState())
            })
    })
}


export function fetchUsersFollowingLikes(uid, postId) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            //anytime the above changes, the below will be called
            .onSnapshot((snapshot) => {
                //firebase function above is async so we lose UID
                const postId = snapshot.ZE.path.segments[3]
                let currentUserLike = false
                if (snapshot.exists) {
                    currentUserLike = true
                }

                dispatch({ type: "USERS_LIKES_STATE_CHANGE", postId, currentUserLike })
                //console.log(getState())
            })
    })
}

export function fetchUsersFollowingComments(uid, postId) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("comments")
            //anytime the above changes, the below will be called
            .get()
            .then((snapshot) => {
                //convert snapshot into array of comments for each post

                let comments = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return { id, ...data }
                })

                //will go through each post in the state and add the comments. 
                dispatch({ type: "USERS_COMMENT_STATE_CHANGE", postId, comments })

            })
    })
}




export function updatePostComments(postAuthorId, postId, comment, authorName) {

    const newComment = {
        authorName: authorName,
        authorId: firebase.auth().currentUser.uid,
        comment: comment,
        created: firebase.firestore.FieldValue.serverTimestamp()
    }


    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(postAuthorId)
            .collection("userPosts")
            .doc(postId)
            .collection("comments")
            .add(newComment)
        dispatch({
            type: "USERS_COMMENTS_STATE_CHANGE", newComment
        })
    }
    )

}

