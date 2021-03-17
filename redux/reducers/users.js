//users current user is following

const initialState = {
    users: [], //objects of users 
    feed: [],
    usersFollowingLoaded: 0,
}

export const usersReducer = (state = initialState, action) => {

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
                feed: state.feed.map(post => post.id == action.postId ? ({ ...post, currentUserLike: action.currentUserLike }) : post)
            }

        //ADD NEW COMMENT TO A POST
        case "USERS_COMMENTS_STATE_CHANGE":
            return {
                ...state,
                feed: state.feed.map(post => post.id == action.postId ? ({
                    ...post, comments: [...post.comments, action.newComment]
                }) : post)
            }

        //MATCHING COMMENTS TO A POST (BASICALLY FETCH COMMENTS. CONSIDER RENAMING...)
        case "USERS_COMMENT_STATE_CHANGE":
            return {
                ...state,
                feed: state.feed.map(post => post.id == action.postId ? {
                    ...post, comments: action.comments
                } : post)
            }

        case "CLEAR_DATA":
            return initialState
        default:
            return state;
    }
}


