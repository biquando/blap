import axios from "axios"

import {
    ALL_POSTS,
    FOLLOWING_POSTS,
    LOADING_POSTS,
    AUTH_ERROR,
    USER_POSTS,
    USER_NOT_FOUND,
    SEARCH_POSTS,
} from "../actionTypes"
import { returnErrors } from "../error/errorActions"

// Get all posts
export const allPosts = (before, after) => dispatch => {
    dispatch({ type: LOADING_POSTS })

    // Body
    const body = JSON.stringify({
        before,
        after,
    })

    // Headers
    const config = {
        headers: {
            "Content-type": "application/json",
        },
    }

    axios
        .post("/posts/all", body, config)
        .then(res => {
            const list = [...res.data.posts]
            dispatch({
                type: ALL_POSTS,
                payload: {
                    list,
                    last: res.data.last,
                },
            })
        })
        .catch()
}

// Get posts from followed users
export const followingPosts = (before, after) => (dispatch, getState) => {
    dispatch({ type: LOADING_POSTS })

    // Body
    const body = JSON.stringify({
        before,
        after,
    })

    axios
        .post("/posts/following", body, tokenConfig(getState))
        .then(res => {
            const list = [...res.data.posts]
            dispatch({
                type: FOLLOWING_POSTS,
                payload: {
                    list,
                    noFollowing: res.data.noFollowing,
                    last: res.data.last,
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
export const userPosts = (username, before, after) => dispatch => {
    dispatch({ type: LOADING_POSTS })

    // Body
    const body = JSON.stringify({
        before,
        after,
    })

    // Headers
    const config = {
        headers: {
            "Content-type": "application/json",
        },
    }

    axios
        .post("/users/" + username + "/posts", body, config)
        .then(res => {
            const list = [...res.data.posts]
            dispatch({
                type: USER_POSTS,
                payload: {
                    list,
                    last: res.data.last,
                },
            })
        })
        .catch(() => {
            dispatch({ type: USER_NOT_FOUND })
        })
}

// Get a list of posts based on a search
export const searchPosts = (target, before, after) => dispatch => {
    dispatch({ type: LOADING_POSTS })

    // Body
    const body = JSON.stringify({
        target,
        before,
        after,
    })

    // Headers
    const config = {
        headers: {
            "Content-type": "application/json",
        },
    }

    axios
        .post("/posts/search", body, config)
        .then(res => {
            const list = [...res.data.posts]
            dispatch({
                type: SEARCH_POSTS,
                payload: {
                    list,
                    last: res.data.last,
                },
            })
        })
        .catch()
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
