import { combineReducers } from "redux"

import errorReducer from "./error/errorReducer"
import authReducer from "./auth/authReducer"
import postReducer from "./post/postReducer"
import postListReducer from "./postList/postListReducer"
import createPostReducer from "./createPost/createPostReducer"

export default combineReducers({
    error: errorReducer,
    auth: authReducer,
    post: postReducer,
    postList: postListReducer,
    createPost: createPostReducer,
})
