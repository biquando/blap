import React from "react"
import { connect } from "react-redux"

import PostList from "../PostList"

class FollowingPosts extends React.Component {
    componentDidUpdate() {
        if (this.props.isAuthenticated === false) {
            window.location = "/blap/#/login"
        }
    }

    render() {
        if (this.props.isAuthenticated === null) {
            return (
                <div className="text-center">
                    <div className="spinner-border" />
                </div>
            )
        }

        if (this.props.noFollowing) {
            return (
                <div>
                    <h1>Following</h1>
                    <h3 className="text-center">There's nothing here!</h3>
                </div>
            )
        }

        return (
            <div>
                <h1 className="text-dark">Following</h1>
                <br />
                <PostList listType="following" location={this.props.location} />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    noFollowing: state.postList.noFollowing,
})

export default connect(mapStateToProps)(FollowingPosts)
