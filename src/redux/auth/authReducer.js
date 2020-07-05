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

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: null,
    user: null,
    loadingSubmit: false,
    followingList: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true,
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
            }
        case LOADING_SUBMIT:
            return {
                ...state,
                loadingSubmit: true,
            }
        case LOGIN_SUCCESS:
        case SIGNUP_SUCCESS:
            localStorage.setItem("token", action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
                loadingSubmit: false,
            }
        case LOGOUT_SUCCESS:
        case DELETE_USER:
            localStorage.removeItem("token")
            window.location.reload(true)
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            }
        case LOAD_FOLLOWING:
            return {
                ...state,
                followingList: action.payload.followingList,
            }
        case FOLLOW:
        case UNFOLLOW:
            return {
                ...state,
                followingList: action.payload.newFollowing,
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case SIGNUP_FAIL:
            localStorage.removeItem("token")
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                loadingSubmit: false,
            }
        default:
            return state
    }
}
