// REACT REDUX STORE
import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"

import { userReducer } from "./reducers/user"
import { usersReducer } from "./reducers/users"

const store = createStore(
    //essentially properties of the store, each managed by its own reducer
    combineReducers({
        userState: userReducer,
        usersState: usersReducer
    }),
    applyMiddleware(thunk)
)

// Note - combineReducers can be set up in separate file and exported
//        combined reducers will BOTH receive and check for any dispatched action

export default store





