import React from "react"
import { connect } from "react-redux"

import PostList from "./PostList"

class AllPosts extends React.Component {
    componentDidUpdate() {
        if (this.props.isAuthenticated === false) {
            window.location = "/"
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

        return (
            <div>
                <h1>All Posts</h1>
                <br />
                <PostList listType="all" />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    noFollowing: state.postList.noFollowing,
    isLoading: state.postList.isLoading,
})

export default connect(mapStateToProps)(AllPosts)
