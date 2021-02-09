// REACT REDUX STORE
import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"

import { currentUserReducer } from "./reducers/currentUser"
import { otherUsersReducer } from "./reducers/otherUsers"

const store = createStore(
    //essentially properties of the store, each managed by its own reducer
    combineReducers({
        userState: currentUserReducer,
        usersState: otherUsersReducer
    }),
    applyMiddleware(thunk)
)

// Note - combineReducers can be set up in separate file and exported
//        combined reducers will BOTH receive and check for any dispatched action

export default store





