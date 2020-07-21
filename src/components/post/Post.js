import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import qs from "qs"

import "../../styles/post.css"
import { getPost, deletePost, noPostId } from "../../redux/post/postActions"
import PostRender from "./PostRender"

class Post extends React.Component {
    constructor(props) {
        super(props)
        this.deletePost = this.deletePost.bind(this)
    }

    componentDidMount() {
        this.id = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true,
        }).id

        if (this.id) {
            this.props.getPost(this.id)
        } else {
            this.props.noPostId()
        }
    }

    deletePost() {
        this.props.deletePost(this.id)
    }

    render() {
        if (this.props.isLoading) {
            return (
                <div className="text-center">
                    <div className="spinner-border" />
                </div>
            )
        }

        if (this.props.deletedPost) {
            return (
                <div className="blog-post">
                    <p className="text-center">Post deleted</p>
                </div>
            )
        }

        if (this.props.foundPost) {
            return (
                <div className="blog-post">
                    <div className="text-secondary">
                        <Link
                            to={"/user/" + this.props.author}
                            className="blog-post-meta author text-secondary"
                        >
                            {this.props.author}
                        </Link>{" "}
                        <p style={{ display: "inline" }} className="small">
                            {this.props.createdAt.substring(0, 10)}
                        </p>
                    </div>

                    {/* {JSON.stringify(this.props.content.blocks)} */}
                    <PostRender blocks={this.props.content.blocks} />

                    <br />
                    {this.props.user &&
                    this.props.user.username === this.props.author ? (
                        <div className="row post-btns">
                            <Link
                                to={"/edit?id=" + this.id}
                                className="edit-btn btn btn-sm btn-secondary btn-block"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={this.deletePost}
                                className="delete-btn btn btn-sm btn-danger btn-block"
                            >
                                Delete
                            </button>
                        </div>
                    ) : null}
                </div>
            )
        }

        return (
            <div className="blog-post">
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
}

const mapStateToProps = state => ({
    title: state.post.title,
    content: state.post.content,
    author: state.post.username,
    createdAt: state.post.createdAt,

    isLoading: state.post.isLoading,
    deletedPost: state.post.deletedPost,
    foundPost: state.post.foundPost,

    user: state.auth.user,
})

export default connect(mapStateToProps, { getPost, deletePost, noPostId })(Post)
