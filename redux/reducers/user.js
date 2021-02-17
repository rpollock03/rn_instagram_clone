// MANAGE STATE FOR AN INDIVIDUAL USER EG ON PROFILE PAGE


// default state
const initialState = {
    currentUser: null,
    posts: [],
    following: []
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "USER_STATE_CHANGE":
            return {
                ...state,
                currentUser: action.currentUser
            }
        case "USER_POSTS_STATE_CHANGE":
            return {
                ...state,
                posts: action.posts
            }
        case "USER_FOLLOWING_STATE_CHANGE":
            return {
                ...state,
                following: action.following
            }
        case "CLEAR_DATA":
            return initialState

        default:
            return state;
    }
}













