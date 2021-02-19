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

export function updateUserProfile(name, userName, bio) {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({ name: name, bio: bio, userName: userName })
        dispatch({
            type: "USER_PROFILE_STATE_CHANGE", name, bio, userName
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

//not current user
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
            if (getPosts) {
                dispatch(fetchUsersFollowingPosts(uid))
            }
        }
    })
}


export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc") //ascending order
            .get()
            .then((snapshot) => {
                //firebase function above is async so we lose UID
                const uid = snapshot.query.EP.path.segments[1]
                const user = getState().usersState.users.find(el => el.uid === uid)

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return { id, ...data, user }
                })

                for (let i = 0; i < posts.length; i++) {
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
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



