//defaults
const initialState = {
    currentUser: null,
    posts: [],
    following: []
}

export const currentUserReducer = (state = initialState, action) => {
    //action an object that will contain the type and any data or payload passed along

    switch (action.type) {
        case "USER_STATE_CHANGE":
            return {
                ...state,
                currentUser: action.currentUser
                //keep state same but update currentUser
                // cant use push because that changes object we just want to change value. mutability or whatever
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














