import React from "react"
import { connect } from "react-redux"

import PostPreview from "./PostPreview"
import {
    allPosts,
    followingPosts,
    userPosts,
} from "../redux/postList/postListActions"

class PostList extends React.Component {
    componentDidMount() {
        switch (this.props.listType) {
            case "all":
                this.props.allPosts()
                break
            case "following":
                this.props.followingPosts()
                break
            case "user":
                this.props.userPosts(this.props.username)
                break
            default:
                this.props.allPosts()
        }
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
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.postList.isLoading,
    list: state.postList.list,
})

export default connect(mapStateToProps, {
    allPosts,
    followingPosts,
    userPosts,
})(PostList)
