import React from "react"
import { connect } from "react-redux"
import EditorJS from "@editorjs/editorjs"

import Header from "@editorjs/header"
import SimpleImage from "@editorjs/simple-image"
import Delimiter from "@editorjs/delimiter"
import List from "@editorjs/list"
import Underline from "@editorjs/underline"
import InlineCode from "@editorjs/inline-code"

import "../styles/createPost.css"
import {
    postSuccess,
    postTooShort,
    postNoTitle,
} from "../redux/createPost/createPostActions"

class CreatePost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editorIsReady: false,
        }
        this.handlePost = this.handlePost.bind(this)
    }

    componentDidMount() {
        this.editor = new EditorJS({
            holder: "editorjs",
            placeholder: "New Post",
            autofocus: true,

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

            data: {
                time: 0,
                blocks: [
                    {
                        type: "header",
                        data: {
                            text: "New Post",
                            level: 1,
                        },
                    },
                ],
                version: "2.18.0",
            },
        })
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated === false) {
            window.location = "/blap/#/login"
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
                } else {
                    this.props.postSuccess(output)
                }
            })
            .catch(err => {
                console.log("Saving failed: " + err)
            })
    }

    render() {
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
                                "Post"
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
})

export default connect(mapStateToProps, {
    postSuccess,
    postTooShort,
    postNoTitle,
})(CreatePost)
