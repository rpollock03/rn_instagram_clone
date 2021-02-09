//users current user is following

const initialState = {
    users: [], //objects of users containing arrays of posts
    feed: [],
    usersFollowingLoaded: 0,
}

export const otherUsersReducer = (state = initialState, action) => {

    switch (action.type) {
        case "USERS_DATA_STATE_CHANGE":
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case "USERS_POSTS_STATE_CHANGE":
            return {
                ...state,
                usersFollowingLoaded: state.usersFollowingLoaded + 1,
                feed: [...state.feed, ...action.posts]
            }
        case "USERS_LIKES_STATE_CHANGE":
            return {
                ...state,
                feed: state.feed.map(post => post.id == action.postId ? { ...post, currentUserLike: action.currentUserLike } : post)
            }
        case "CLEAR_DATA":
            return initialState
        default:
            return state;
    }


}


