import axios from "axios"

import { returnErrors } from "../error/errorActions"
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    DELETE_USER,
    LOADING_SUBMIT,
    LOAD_FOLLOWING,
    FOLLOW,
    UNFOLLOW,
} from "../actionTypes"

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING })

    axios
        .get("/auth/user", tokenConfig(getState))
        .then(res =>
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            })
        )
        .catch(err => {
            if (err.response) {
                dispatch(returnErrors(err.response.data, err.response.status))
            }
            dispatch({
                type: AUTH_ERROR,
            })
        })
}

// Sign up user
export const signup = ({ username, password }) => dispatch => {
    dispatch({
        type: LOADING_SUBMIT,
    })

    // Headers
    const config = {
        headers: {
            "Content-type": "application/json",
        },
    }

    // Request body
    const body = JSON.stringify({ username, password })

    axios
        .post("/users/signup", body, config)
        .then(res =>
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: res.data,
            })
        )
        .catch(err => {
            dispatch(
                returnErrors(
                    err.response.data,
                    err.response.status,
                    "SIGNUP_FAIL"
                )
            )
            dispatch({
                type: SIGNUP_FAIL,
            })
        })
}

// Log in user
export const login = ({ username, password }) => dispatch => {
    dispatch({
        type: LOADING_SUBMIT,
    })

    // Headers
    const config = {
        headers: {
            "Content-type": "application/json",
        },
    }

    // Request body
    const body = JSON.stringify({ username, password })

    axios
        .post("/auth/login", body, config)
        .then(res =>
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            })
        )
        .catch(err => {
            dispatch(
                returnErrors(
                    err.response.data,
                    err.response.status,
                    "LOGIN_FAIL"
                )
            )
            dispatch({
                type: LOGIN_FAIL,
            })
        })
}

// Log out user
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS,
    }
}

// Delete the user
export const deleteUser = () => (dispatch, getState) => {
    axios
        .delete("/auth/delete", tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_USER,
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

// Load the user's following list
export const loadFollowingList = () => (dispatch, getState) => {
    axios
        .get("/auth/following", tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LOAD_FOLLOWING,
                payload: {
                    followingList: res.data.following,
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

// Follow a user
export const follow = target => (dispatch, getState) => {
    const body = JSON.stringify({ user: target })

    axios
        .patch("/auth/follow", body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: FOLLOW,
                payload: {
                    newFollowing: res.data.following,
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

// Unfollow a user
export const unfollow = target => (dispatch, getState) => {
    const body = JSON.stringify({ user: target })

    axios
        .patch("/auth/unfollow", body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: UNFOLLOW,
                payload: {
                    newFollowing: res.data.following,
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
