import React from "react"
import { connect } from "react-redux"

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
                <div className="row">
                    <h1 className="col col-md-auto">
                        {this.props.match.params.username}
                    </h1>
                    {this.state.isFollowing !== null &&
                    this.props.self &&
                    this.props.self.username !==
                        this.props.match.params.username ? (
                        this.state.isFollowing ? (
                            <button
                                className="follow-btn col btn btn-sm btn-secondary btn-block"
                                onClick={this.toggleFollow}
                            >
                                Unfollow
                            </button>
                        ) : (
                            <button
                                className="follow-btn col btn btn-sm btn-primary btn-block"
                                onClick={this.toggleFollow}
                            >
                                Follow
                            </button>
                        )
                    ) : null}
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
