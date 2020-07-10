import React from "react"
import { connect } from "react-redux"
import qs from "qs"

import PostList from "../PostList"

class SearchPosts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            target: null,
        }
    }

    componentDidMount() {
        const target = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true,
        }).target
        if (target === "") {
            window.location = "/blap/#/"
        }
        this.setState({ target })
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated === false) {
            window.location = "/blap/#/login"
        }
    }

    render() {
        if (this.state.target !== "") {
            return (
                <div>
                    <h1>{'Search - "' + this.state.target + '"'}</h1>
                    <br />
                    <PostList
                        listType="search"
                        location={this.props.location}
                        target={this.state.target}
                    />
                </div>
            )
        } else {
            return <div />
        }
    }
}

export default connect()(SearchPosts)
