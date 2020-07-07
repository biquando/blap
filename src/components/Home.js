import React from "react"
import { connect } from "react-redux"

import PostList from "./PostList"

class Home extends React.Component {
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
                <h1>
                    {this.props.isAuthenticated
                        ? this.props.noFollowing && !this.props.isLoading
                            ? "Discover"
                            : "Following"
                        : "All Posts"}
                </h1>
                <br />
                <PostList
                    listType={
                        this.props.isAuthenticated && !this.props.noFollowing
                            ? "following"
                            : "all"
                    }
                    location={this.props.location}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    noFollowing: state.postList.noFollowing,
    isLoading: state.postList.isLoading,
})

export default connect(mapStateToProps)(Home)
