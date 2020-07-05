import React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"

import "../styles/navbar.css"
import { logout } from "../redux/auth/authActions"

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg static-top">
                <Link to="/" className="navbar-brand">
                    blap
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="navbar-item">
                            <Link
                                to={this.props.isAuthenticated ? "/all" : "/"}
                                className="nav-link"
                            >
                                All
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link
                                to={
                                    this.props.isAuthenticated
                                        ? "/following"
                                        : "/login"
                                }
                                className="nav-link"
                            >
                                Following
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link
                                to={
                                    this.props.isAuthenticated
                                        ? "/create"
                                        : "/login"
                                }
                                className="nav-link"
                            >
                                Create Post
                            </Link>
                        </li>
                    </ul>
                    <ul className="right-nav navbar-nav ml-md-auto">
                        {!this.props.isLoading ? (
                            !this.props.isAuthenticated ? (
                                <div>
                                    <li className="navbar-item">
                                        <Link to="/signup" className="nav-link">
                                            Sign up
                                        </Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link to="/login" className="nav-link">
                                            Log in
                                        </Link>
                                    </li>
                                </div>
                            ) : (
                                <div>
                                    <li className="navbar-item">
                                        <Link
                                            to={
                                                "/user/" +
                                                this.props.user.username
                                            }
                                            className="nav-link"
                                        >
                                            {this.props.user.username}
                                        </Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link
                                            to="/settings"
                                            className="nav-link"
                                        >
                                            Settings
                                        </Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link
                                            to="/"
                                            className="nav-link"
                                            onClick={this.props.logout}
                                        >
                                            Log out
                                        </Link>
                                    </li>
                                </div>
                            )
                        ) : null}
                    </ul>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
})

export default connect(mapStateToProps, { logout })(Navbar)
