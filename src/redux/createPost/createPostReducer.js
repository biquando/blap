import {
    POST_SUCCESS,
    POST_TOO_SHORT,
    POST_NO_TITLE,
    CREATE_POST_ERROR,
    CREATING_POST,
    EDIT_POST,
    DIFF_TITLE,
} from "../actionTypes"

const initialState = {
    error: null,
    creatingPost: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATING_POST:
            return {
                ...state,
                creatingPost: true,
                error: null,
            }
        case POST_SUCCESS:
        case EDIT_POST:
            window.location = "/blap/#/post?id=" + action.payload.newPostId
            return {
                ...state,
                creatingPost: false,
            }
        case POST_TOO_SHORT:
            return {
                ...state,
                error: {
                    msg: "Your post must have at least 2 elements",
                },
                creatingPost: false,
            }
        case POST_NO_TITLE:
            return {
                ...state,
                error: {
                    msg:
                        "The first element of your post must be the title (H1)",
                },
                creatingPost: false,
            }
        case CREATE_POST_ERROR:
            return {
                ...state,
                error: {
                    msg: "An unknown error occured",
                },
                creatingPost: false,
            }
        case DIFF_TITLE:
            return {
                ...state,
                error: {
                    msg:
                        'You cannot edit the title of "' +
                        action.payload.oldTitle +
                        '"',
                },
                creatingPost: false,
            }
        default:
            return state
    }
}
