import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import {
    deleteUser,
    loadFollowingList,
    unfollow,
} from "../../redux/auth/authActions"
import "../../styles/settings.css"

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            deleteWarning: false,
            showFollowing: false,
        }
        this.deleteWarning = this.deleteWarning.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.openFollowing = this.openFollowing.bind(this)
    }

    componentDidMount() {
        this.props.loadFollowingList()
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated === false) {
            window.location = "/blap/#/"
        }
    }

    deleteWarning() {
        this.setState({
            deleteWarning: true,
        })
    }

    deleteUser() {
        this.props.deleteUser()
    }

    openFollowing() {
        this.setState(prevState => ({
            showFollowing: !prevState.showFollowing,
        }))
    }

    unfollow(target) {
        this.props.unfollow(target)
    }

    render() {
        const followingBtnStyling = this.state.showFollowing
            ? " btn-secondary"
            : " btn-info"
        return (
            <div>
                <h1>Settings</h1>
                <br />

                <div className="row following-header">
                    <h3 className="col">Following</h3>
                    <button
                        className={
                            "col following-btn btn btn-sm btn-block btn-" +
                            followingBtnStyling
                        }
                        onClick={this.openFollowing}
                    >
                        <span className="text-light">
                            {this.state.showFollowing ? "Hide" : "Show"}
                        </span>
                    </button>
                </div>

                {this.state.showFollowing ? (
                    <ul className="list-group">
                        {this.props.followingList.length > 0 ? (
                            this.props.followingList
                                .slice()
                                .reverse()
                                .map(username => (
                                    <li
                                        className="list-group-item"
                                        key={username}
                                    >
                                        <button className="remove-following-btn">
                                            <svg
                                                width="1.3em"
                                                height="1.3em"
                                                viewBox="0 0 16 16"
                                                className="bi bi-x-circle-fill text-danger"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                onClick={() =>
                                                    this.unfollow(username)
                                                }
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"
                                                />
                                            </svg>
                                        </button>
                                        <Link
                                            to={"/user/" + username}
                                            className="following-username text-dark"
                                        >
                                            {username}
                                        </Link>
                                    </li>
                                ))
                        ) : (
                            <li className="list-group-item">
                                You are not following any users
                            </li>
                        )}
                    </ul>
                ) : (
                    <ul className="list-group">
                        <li className="list-group-item">. . .</li>
                    </ul>
                )}

                <br />

                <h3>Delete Account</h3>
                {!this.state.deleteWarning ? (
                    <button
                        className="delete-acc-btn btn btn-danger btn-block"
                        onClick={this.deleteWarning}
                    >
                        Delete
                    </button>
                ) : (
                    <div>
                        <p>
                            Are you sure? Your account will be deleted
                            permanently.
                        </p>
                        <button
                            className="delete-acc-btn btn btn-danger btn-block"
                            onClick={this.deleteUser}
                        >
                            Yes, I'm sure
                        </button>
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    followingList: state.auth.followingList,
})

export default connect(mapStateToProps, {
    deleteUser,
    loadFollowingList,
    unfollow,
})(Settings)
