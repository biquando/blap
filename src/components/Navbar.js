import React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"

import "../styles/navbar.css"
import { logout } from "../redux/auth/authActions"

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchTarget: "",
        }
        this.onChange = this.onChange.bind(this)
        this.submitSearch = this.submitSearch.bind(this)
    }

    onChange(e) {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    submitSearch(e) {
        e.preventDefault()
        if (this.state.searchTarget.trim() === "") {
            return
        }

        window.location =
            "/blap/#/search?target=" + this.state.searchTarget.trim()
        window.location.reload(true)
    }

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg sticky-top">
                <Link to="/" className="navbar-brand">
                    blap
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="left-nav navbar-nav">
                        <li className="all-link navbar-item">
                            <Link
                                to={this.props.isAuthenticated ? "/all" : "/"}
                                className="nav-link"
                            >
                                All
                            </Link>
                        </li>
                        <li className="following-link navbar-item">
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
                        <li className="create-link navbar-item">
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
                    {!this.props.isLoading ? (
                        <ul className="right-nav navbar-nav ml-md-auto">
                            <div className="search-bar">
                                <form
                                    className="form-inline my-2 my-lg-0"
                                    autoComplete="off"
                                >
                                    <input
                                        className="form-control mr-sm-2"
                                        placeholder="Search"
                                        value={this.state.searchTarget}
                                        onChange={this.onChange}
                                        name="searchTarget"
                                    />
                                    <button
                                        className="btn btn-outline-success my-2 my-sm-0 mr-3"
                                        onClick={this.submitSearch}
                                    >
                                        Search
                                    </button>
                                </form>
                            </div>

                            {!this.props.isAuthenticated ? (
                                <div className="logged-in">
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
                                <div className="logged-out">
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
                            )}
                        </ul>
                    ) : null}
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
