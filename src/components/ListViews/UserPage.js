import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import PostList from "../PostList"
import {
    loadFollowingList,
    follow,
    unfollow,
} from "../../redux/auth/authActions"
import { userPosts } from "../../redux/postList/postListActions"
import "../../styles/userPage.css"

class UserPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFollowing: null,
        }
        this.toggleFollow = this.toggleFollow.bind(this)
    }

    componentDidMount() {
        this.props.loadFollowingList()
    }

    componentDidUpdate() {
        // Check if the user is on the following list
        if (this.props.followingList && this.state.isFollowing === null) {
            let f = null
            this.props.followingList.forEach((followingItem, idx) => {
                if (followingItem === this.props.match.params.username) {
                    f = true
                    this.setState({ isFollowing: true })
                }
            })
            if (f === null) {
                this.setState({ isFollowing: false })
            }
        }
    }

    toggleFollow() {
        if (this.state.isFollowing) {
            this.props.unfollow(this.props.match.params.username)
        } else {
            this.props.follow(this.props.match.params.username)
        }
        this.setState(prevState => ({
            isFollowing: !prevState.isFollowing,
        }))
    }

    render() {
        if (this.props.userNotFound === null) {
            this.props.userPosts(this.props.match.params.username)
            return (
                <div className="text-center">
                    <div className="spinner-border" />
                </div>
            )
        }

        if (this.props.userNotFound) {
            return (
                <div>
                    <p className="text-center">Couldn't find user</p>
                    <button
                        className="retry-btn btn btn-sm btn-secondary btn-block"
                        onClick={() => window.location.reload(true)}
                    >
                        Retry
                    </button>
                </div>
            )
        }

        return (
            <div>
                <div>
                    <h1 className="d-inline text-dark">
                        {this.props.match.params.username}
                    </h1>
                    {this.state.isFollowing !== null &&
                    this.props.self &&
                    this.props.self.username !==
                        this.props.match.params.username ? (
                        this.state.isFollowing ? (
                            <button
                                className="follow-btn d-inline mb-3 ml-3 btn btn-sm btn-secondary btn-block"
                                onClick={this.toggleFollow}
                            >
                                Unfollow
                            </button>
                        ) : (
                            <button
                                className="follow-btn d-inline mb-3 ml-3 btn btn-sm btn-info btn-block text-light"
                                onClick={this.toggleFollow}
                            >
                                Follow
                            </button>
                        )
                    ) : (
                        this.props.self &&
                        this.state.isFollowing !== null && (
                            <Link to="/settings" className="">
                                <svg
                                    width="1.5em"
                                    height="1.5em"
                                    viewBox="0 0 16 16"
                                    className="bi bi-gear-fill text-secondary mb-3 ml-2"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"
                                    />
                                </svg>
                            </Link>
                        )
                    )}
                </div>
                <br />
                <PostList
                    listType="user"
                    username={this.props.match.params.username}
                    location={this.props.location}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userNotFound: state.postList.userNotFound,
    followingList: state.auth.followingList,
    self: state.auth.user,
})

export default connect(mapStateToProps, {
    loadFollowingList,
    userPosts,
    follow,
    unfollow,
})(UserPage)
