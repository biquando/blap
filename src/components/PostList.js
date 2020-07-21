import React from "react"
import { connect } from "react-redux"
import qs from "qs"
import { Link } from "react-router-dom"

import PostPreview from "./PostPreview"
import {
    allPosts,
    followingPosts,
    userPosts,
    searchPosts,
} from "../redux/postList/postListActions"
import "../styles/postlist.css"

class PostList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: null,
            before: null,
            after: null,
        }
        this.updateList = this.updateList.bind(this)
    }

    componentDidMount() {
        const query = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true,
        })
        this.updateList(query)
    }

    componentDidUpdate() {
        const query = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true,
        })
        if (
            query.page !== this.state.page ||
            query.before !== this.state.before ||
            query.after !== this.state.after
        ) {
            this.updateList(query)
        }
    }

    updateList(query) {
        this.setState(
            {
                page: query.page,
                before: query.before,
                after: query.after,
            },
            () => {
                switch (this.props.listType) {
                    case "all":
                        this.props.allPosts(this.state.before, this.state.after)
                        break
                    case "following":
                        this.props.followingPosts(
                            this.state.before,
                            this.state.after
                        )
                        break
                    case "user":
                        this.props.userPosts(
                            this.props.username,
                            this.state.before,
                            this.state.after
                        )
                        break
                    case "search":
                        this.props.searchPosts(
                            this.props.target,
                            this.state.before,
                            this.state.after
                        )
                        break
                    default:
                        this.props.allPosts(this.before, this.after)
                }
            }
        )
    }

    render() {
        if (this.props.isLoading) {
            return (
                <div className="text-center">
                    <div className="spinner-border" />
                </div>
            )
        }

        if (this.props.list.length === 0) {
            return <h3 className="text-center">There's nothing here!</h3>
        }

        const previousModifier = this.props.last ? "" : " previous"
        const nextModifier = this.state.page > "1" ? " next" : ""
        return (
            <div>
                {this.props.list.map(post => (
                    <PostPreview
                        key={post._id}
                        data={{
                            title: post.title,
                            author: post.username,
                            date: post.createdAt.substring(0, 10),
                            postDestination: "/post?id=" + post._id,
                            userDestination: "/user/" + post.username,
                        }}
                    />
                ))}

                <nav>
                    <ul className="pagination">
                        {this.state.page > "1" && (
                            <li className="page-item">
                                <Link
                                    className=""
                                    to={
                                        "/" +
                                        this.props.listType +
                                        (this.props.listType === "user"
                                            ? "/" + this.props.username
                                            : "") +
                                        "?page=" +
                                        (parseInt(
                                            this.state.page
                                                ? this.state.page
                                                : "1"
                                        ) -
                                            1) +
                                        "&after=" +
                                        (this.props.list.length > 0
                                            ? this.props.list[0].createdAt
                                            : "")
                                    }
                                >
                                    <button
                                        className={
                                            "btn btn-outline-dark" +
                                            previousModifier
                                        }
                                    >
                                        Previous
                                    </button>
                                </Link>
                            </li>
                        )}
                        {!this.props.last && (
                            <li className="page-item">
                                <Link
                                    className=""
                                    to={
                                        "/" +
                                        this.props.listType +
                                        (this.props.listType === "user"
                                            ? "/" + this.props.username
                                            : "") +
                                        "?page=" +
                                        (parseInt(
                                            this.state.page
                                                ? this.state.page
                                                : "1"
                                        ) +
                                            1) +
                                        "&before=" +
                                        this.props.list[
                                            this.props.list.length - 1
                                        ].createdAt
                                    }
                                >
                                    <button
                                        className={
                                            "btn btn-outline-dark" +
                                            nextModifier
                                        }
                                    >
                                        Next
                                    </button>
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.postList.isLoading,
    list: state.postList.list,
    last: state.postList.last,
})

export default connect(mapStateToProps, {
    allPosts,
    followingPosts,
    userPosts,
    searchPosts,
})(PostList)
