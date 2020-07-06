import React from "react"
import { connect } from "react-redux"
import EditorJS from "@editorjs/editorjs"
import qs from "qs"

import Header from "@editorjs/header"
import SimpleImage from "@editorjs/simple-image"
import Delimiter from "@editorjs/delimiter"
import List from "@editorjs/list"
import Underline from "@editorjs/underline"
import InlineCode from "@editorjs/inline-code"

import "../styles/createPost.css"
import {
    editPost,
    postTooShort,
    postNoTitle,
    diffTitle,
} from "../redux/createPost/createPostActions"
import { getPost, noPostId } from "../redux/post/postActions"

class EditPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editorIsReady: false,
        }
        this.handlePost = this.handlePost.bind(this)
    }

    componentDidMount() {
        // Load old post
        this.id = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true,
        }).id

        if (this.id) {
            this.props.getPost(this.id)
        } else {
            this.props.noPostId()
        }
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated === false) {
            window.location = "/blap/#/login"
        }

        if (!this.editor && this.props.foundPost) {
            this.editor = new EditorJS({
                holder: "editorjs",
                placeholder: "Click here to start writing!",

                tools: {
                    header: Header,
                    simpleImage: SimpleImage,
                    delimiter: Delimiter,
                    list: List,
                    underline: Underline,
                    inlineCode: InlineCode,
                },

                onReady: () => {
                    this.setState({
                        editorIsReady: true,
                    })
                },

                data: this.props.content,
            })
        }
    }

    handlePost() {
        this.editor
            .save()
            .then(output => {
                const { blocks } = output

                // There must be at least 2 blocks, and the first must be an h1
                if (blocks.length < 2) {
                    this.props.postTooShort()
                } else if (
                    blocks[0].type !== "header" ||
                    blocks[0].data.level !== 1
                ) {
                    this.props.postNoTitle()
                } else if (this.props.title !== blocks[0].data.text) {
                    this.props.diffTitle(this.props.title)
                } else {
                    this.props.editPost(this.id, output)
                }
            })
            .catch(err => {
                console.log("Saving failed: " + err)
            })
    }

    render() {
        if (this.props.foundPost === false) {
            return (
                <div>
                    <p className="text-center">Couldn't find post</p>
                    <button
                        className="retry-btn btn btn-sm btn-secondary btn-block"
                        onClick={() => window.location.reload(true)}
                    >
                        Retry
                    </button>
                </div>
            )
        }

        if (
            this.props.isAuthenticated &&
            this.props.author !== this.props.user.username
        ) {
            return (
                <div className="alert alert-danger text-center">
                    You are not authorized to edit this post.
                </div>
            )
        }

        return (
            <div>
                <div id="editorjs" />
                {this.state.editorIsReady ? (
                    <div>
                        {this.props.error ? (
                            <div className="alert alert-danger text-center">
                                {this.props.error.msg}
                            </div>
                        ) : null}

                        <button
                            className="post-button btn btn-lg btn-success btn-block"
                            onClick={this.handlePost}
                        >
                            {this.props.creatingPost ? (
                                <span className="spinner-border spinner-border-sm" />
                            ) : (
                                "Save"
                            )}
                        </button>
                    </div>
                ) : null}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    error: state.createPost.error,
    creatingPost: state.createPost.creatingPost,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,

    title: state.post.title,
    content: state.post.content,
    author: state.post.username,

    foundPost: state.post.foundPost,
})

export default connect(mapStateToProps, {
    editPost,
    postTooShort,
    postNoTitle,
    diffTitle,
    getPost,
    noPostId,
})(EditPost)
