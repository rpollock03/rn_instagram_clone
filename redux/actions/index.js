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

// UPDATES USER PROFILE INFORMATION
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


// FETCHES LOGGED IN USER'S POSTS
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


// FETCHES LIST OF USERS THAT CURRENT USER FOLLOWS
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

// IF CALLED BY FUNCTION ABOVE (fetchUserFollowing) THIS WILL RETURN LIST OF USERS AND ALL THEIR POSTS
// ELSE IF NOT CALLED BY THE ABOVE FUNCTION, IT WILL ONLY RETURN A LISTS OF USER IDS 
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
            // IF CALLED BY FETCHUSERFOLLOWING, RETRIEVES EACH USERS POSTS AS WELL
            if (getPosts) {
                dispatch(fetchUsersFollowingPosts(uid))
            }
        }
    })
}

// RETRIEVES ALL POSTS OF A USER
export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc") // ascending order
            .get()
            .then((snapshot) => {
                const uid = snapshot.query.EP.path.segments[1] //user of data we want (firebase is async so we use uid argument
                const user = getState().usersState.users.find(el => el.uid === uid) //find user in existing state
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

// RETRIEVE LIKES - CALLED BY ABOVE FUNCTION FOR EACH POST
export function fetchUsersFollowingLikes(uid, postId) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            //anytime the above changes, the below will be called so realtime loading
            .onSnapshot((snapshot) => {
                const postId = snapshot.ZE.path.segments[3] //user ID - firebase function above is async so we lose UID otherwise
                let currentUserLike = false
                if (snapshot.exists) {
                    currentUserLike = true
                }
                dispatch({ type: "USERS_LIKES_STATE_CHANGE", postId, currentUserLike })
                //console.log(getState())
            })
    })
}

// RETRIEVE COMMENTS - CALLED BY ABOVE FUNCTION FOR EACH POST
export function fetchUsersFollowingComments(uid, postId) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("comments")
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

// CREATE NEW POST FUNCTION
export function addNewPost(downloadUrl, caption, location) {
    return ((dispatch) => {

        const newPost = {
            downloadUrl,
            caption,
            location,
            creation: firebase.firestore.FieldValue.serverTimestamp()
        }

        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add(newPost)

        dispatch({ type: "USER_POSTS_STATE_ADD", newPost })
    })
}

//CREATE NEW COMMENT FUNCTION
export function updatePostComments(postAuthorId, postId, comment, authorUserName, authorProfilePic) {

    const newComment = {
        authorUserName: authorUserName,
        authorId: firebase.auth().currentUser.uid,
        comment: comment,
        profilePic: authorProfilePic,
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
            type: "USERS_COMMENTS_STATE_CHANGE", postId, newComment
        })
    }
    )
}

