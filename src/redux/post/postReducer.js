import {
    GET_POST,
    GET_POST_ERROR,
    POST_LOADING,
    DELETE_POST,
    NO_POST_ID,
} from "../actionTypes"

const initialState = {
    title: null,
    content: null,
    author: null,
    createdAt: null,
    isLoading: null,
    foundPost: null,
    deletedPost: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_POST:
            return {
                ...action.payload,
                foundPost: true,
                isLoading: false,
            }
        case GET_POST_ERROR:
        case NO_POST_ID:
            return {
                ...state,
                foundPost: false,
                isLoading: false,
            }
        case POST_LOADING:
            return {
                ...state,
                isLoading: true,
            }
        case DELETE_POST:
            return {
                ...initialState,
                deletedPost: true,
            }
        default:
            return state
    }
}
