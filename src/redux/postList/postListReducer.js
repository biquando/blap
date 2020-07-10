import {
    ALL_POSTS,
    FOLLOWING_POSTS,
    LOADING_POSTS,
    USER_POSTS,
    USER_NOT_FOUND,
    SEARCH_POSTS,
} from "../actionTypes"

const initialState = {
    isLoading: null,
    list: [],
    noFollowing: null,
    userNotFound: null,
    last: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_POSTS:
            return {
                ...state,
                isLoading: true,
                last: true,
            }
        case ALL_POSTS:
            return {
                ...state,
                ...action.payload,
                isLoading: false,
                noFollowing: null,
            }
        case USER_POSTS:
            return {
                ...state,
                ...action.payload,
                isLoading: false,
                noFollowing: null,
                userNotFound: false,
            }
        case USER_NOT_FOUND:
            return {
                ...state,
                isLoading: false,
                userNotFound: true,
            }
        case FOLLOWING_POSTS:
        case SEARCH_POSTS:
            return {
                ...state,
                isLoading: false,
                ...action.payload,
            }
        default:
            return state
    }
}
