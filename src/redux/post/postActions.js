import axios from "axios"

import {
    GET_POST,
    GET_POST_ERROR,
    POST_LOADING,
    DELETE_POST,
    AUTH_ERROR,
    NO_POST_ID,
} from "../actionTypes"
import { returnErrors } from "../error/errorActions"

export const getPost = id => dispatch => {
    dispatch({ type: POST_LOADING })

    axios
        .get("/posts/id/" + id.toString())
        .then(res => {
            dispatch({
                type: GET_POST,
                payload: res.data,
            })
        })
        .catch(() => {
            dispatch({
                type: GET_POST_ERROR,
            })
        })
}

export const deletePost = id => (dispatch, getState) => {
    if (!id) {
        window.location = "/"
        return
    }

    axios
        .delete("/posts/id/" + id.toString(), tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_POST,
                payload: res.data,
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
            dispatch({
                type: AUTH_ERROR,
            })
        })
}

export const noPostId = () => {
    return {
        type: NO_POST_ID,
    }
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
