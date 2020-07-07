import React from "react"
import { connect } from "react-redux"
import qs from "qs"

import PostList from "./PostList"

class AllPosts extends React.Component {
    componentDidMount() {
        const query = qs.parse(this.props.location, {
            ignoreQueryPrefix: true,
        })
        this.page = query.page ? query.page : "null"
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated === false && this.page === "none") {
            window.location = "/blap/#/"
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
                <PostList listType="all" location={this.props.location} />
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
