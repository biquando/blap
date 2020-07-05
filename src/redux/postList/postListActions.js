import axios from "axios"

import {
    ALL_POSTS,
    FOLLOWING_POSTS,
    LOADING_POSTS,
    AUTH_ERROR,
    USER_POSTS,
    USER_NOT_FOUND,
} from "../actionTypes"
import { returnErrors } from "../error/errorActions"

// Get all posts
export const allPosts = () => dispatch => {
    dispatch({ type: LOADING_POSTS })

    axios
        .get("/posts/all")
        .then(res => {
            const list = [...res.data]
            list.sort((a, b) => {
                return b.createdAt.localeCompare(a.createdAt)
            })
            dispatch({
                type: ALL_POSTS,
                payload: {
                    list,
                },
            })
        })
        .catch()
}

// Get posts from followed users
export const followingPosts = () => (dispatch, getState) => {
    dispatch({ type: LOADING_POSTS })

    axios
        .get("/posts/following", tokenConfig(getState))
        .then(res => {
            const list = [...res.data.posts]
            list.sort((a, b) => {
                return b.createdAt.localeCompare(a.createdAt)
            })
            dispatch({
                type: FOLLOWING_POSTS,
                payload: {
                    list,
                    noFollowing: res.data.noFollowing,
                },
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
            dispatch({
                type: AUTH_ERROR,
            })
        })
}

// Get all of a user's posts
export const userPosts = username => dispatch => {
    dispatch({ type: LOADING_POSTS })

    axios
        .get("/users/" + username + "/posts")
        .then(res => {
            const list = [...res.data]
            list.sort((a, b) => {
                return b.createdAt.localeCompare(a.createdAt)
            })
            dispatch({
                type: USER_POSTS,
                payload: {
                    list,
                },
            })
        })
        .catch(() => {
            dispatch({ type: USER_NOT_FOUND })
        })
}

// Setup config/headers and token
export const tokenConfig = getState => {
    // Get token from localStorage
    const token = getState().auth.token

    // Headers
    const config = {
        headers: {
            "Content-type": "application/json",
        },
    }

    // If token, add to headers
    if (token) {
        config.headers["x-auth-token"] = token
    }

    return config
}
