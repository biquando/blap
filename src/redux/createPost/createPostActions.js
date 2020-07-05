import axios from "axios"

import {
    POST_SUCCESS,
    POST_TOO_SHORT,
    POST_NO_TITLE,
    CREATING_POST,
    CREATE_POST_ERROR,
    EDIT_POST,
    DIFF_TITLE,
} from "../actionTypes"

export const postSuccess = output => (dispatch, getState) => {
    dispatch({ type: CREATING_POST })

    const newPost = {
        title: output.blocks[0].data.text,
        content: output,
    }
    const body = JSON.stringify(newPost)

    axios
        .post("/posts/create", body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: POST_SUCCESS,
                payload: {
                    newPostId: res.data.post._id,
                },
            })
        })
        .catch(() => {
            dispatch({ type: CREATE_POST_ERROR })
        })
}

export const editPost = (id, output) => (dispatch, getState) => {
    dispatch({ type: CREATING_POST })

    const newContent = { content: output }
    const body = JSON.stringify(newContent)

    axios
        .patch("/posts/id/" + id, body, tokenConfig(getState))
        .then(() => {
            dispatch({
                type: EDIT_POST,
                payload: {
                    newPostId: id,
                },
            })
        })
        .catch(() => {
            dispatch({ type: CREATE_POST_ERROR })
        })
}

export const postTooShort = () => {
    return { type: POST_TOO_SHORT }
}

export const postNoTitle = () => {
    return { type: POST_NO_TITLE }
}

export const diffTitle = oldTitle => {
    return {
        type: DIFF_TITLE,
        payload: {
            oldTitle,
        },
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
