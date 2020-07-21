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
            showMenu: false,
        }
        this.onChange = this.onChange.bind(this)
        this.submitSearch = this.submitSearch.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
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

    toggleMenu() {
        this.setState(prevState => ({
            showMenu: !prevState.showMenu,
        }))
    }

    render() {
        let showMenuText = ""
        let collapseRightSpacing = ""
        let collapseButtonPadding = ""
        if (this.state.showMenu) {
            showMenuText = " show"
            collapseRightSpacing = " mr-3"
            collapseButtonPadding = " px-2"
        }

        return (
            <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
                <Link
                    to="/"
                    className="navbar-brand"
                    onClick={() => this.setState({ showMenu: false })}
                >
                    <span className="font-weight-bold text-light">blap</span>
                </Link>

                <button className="navbar-toggler" onClick={this.toggleMenu}>
                    <span className="navbar-toggler-icon" />
                </button>

                <div className={"collapse navbar-collapse" + showMenuText}>
                    <ul className="left-nav navbar-nav">
                        <li className="create-link navbar-item mr-2">
                            <Link
                                to={
                                    this.props.isAuthenticated
                                        ? "/create"
                                        : "/login"
                                }
                                className="nav-link btn btn-primary btn-sm"
                                onClick={() =>
                                    this.setState({ showMenu: false })
                                }
                            >
                                <span className="text-light">Create Post</span>
                            </Link>
                        </li>
                        <li className="all-link navbar-item">
                            <Link
                                to={this.props.isAuthenticated ? "/all" : "/"}
                                className="nav-link"
                                onClick={() =>
                                    this.setState({ showMenu: false })
                                }
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
                                onClick={() =>
                                    this.setState({ showMenu: false })
                                }
                            >
                                Following
                            </Link>
                        </li>
                    </ul>
                    {!this.props.isLoading ? (
                        <ul className="right-nav navbar-nav ml-md-auto">
                            <div className="search-bar">
                                <form
                                    className="form-inline my-2 my-lg-0"
                                    autoComplete="off"
                                    onSubmit={this.submitSearch}
                                >
                                    <input
                                        className="form-control mr-2"
                                        placeholder="Search"
                                        value={this.state.searchTarget}
                                        onChange={this.onChange}
                                        name="searchTarget"
                                    />
                                    {/* <button
                                        className="btn btn-outline-light my-2 my-sm-0 mr-3"
                                        onClick={this.submitSearch}
                                    >
                                        Search
                                    </button> */}
                                </form>
                            </div>

                            {!this.props.isAuthenticated ? (
                                <div className="logged-out">
                                    <li className="navbar-item">
                                        <Link
                                            to="/login"
                                            className="nav-link"
                                            onClick={() =>
                                                this.setState({
                                                    showMenu: false,
                                                })
                                            }
                                        >
                                            <span
                                                className={
                                                    collapseButtonPadding
                                                }
                                            >
                                                <svg
                                                    width="1.5em"
                                                    height="1.5em"
                                                    viewBox="0 0 16 16"
                                                    className="bi bi-box-arrow-in-right text-success"
                                                    fill="currentColor"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8.146 11.354a.5.5 0 0 1 0-.708L10.793 8 8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M1 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 1 8z"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M13.5 14.5A1.5 1.5 0 0 0 15 13V3a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 4 3v1.5a.5.5 0 0 0 1 0V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 5 13v-1.5a.5.5 0 0 0-1 0V13a1.5 1.5 0 0 0 1.5 1.5h8z"
                                                    />
                                                </svg>
                                            </span>
                                        </Link>{" "}
                                    </li>
                                </div>
                            ) : (
                                <div className="logged-in">
                                    <li className="navbar-item">
                                        <Link
                                            to={
                                                "/user/" +
                                                this.props.user.username
                                            }
                                            className={
                                                "nav-link" +
                                                collapseRightSpacing
                                            }
                                            onClick={() =>
                                                this.setState({
                                                    showMenu: false,
                                                })
                                            }
                                        >
                                            <svg
                                                width="1.3em"
                                                height="1.3em"
                                                viewBox="0 0 16 16"
                                                className="bi bi-person-circle"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                                                />
                                            </svg>
                                        </Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link
                                            to="/settings"
                                            className={
                                                "nav-link" +
                                                collapseRightSpacing
                                            }
                                            onClick={() =>
                                                this.setState({
                                                    showMenu: false,
                                                })
                                            }
                                        >
                                            <svg
                                                width="1.3em"
                                                height="1.3em"
                                                viewBox="0 0 16 16"
                                                className="bi bi-gear-fill"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"
                                                />
                                            </svg>
                                        </Link>
                                    </li>
                                    <li className={"navbar-item"}>
                                        <Link
                                            to="/"
                                            className="nav-link"
                                            onClick={() => {
                                                this.props.logout()
                                                this.setState({
                                                    showMenu: false,
                                                })
                                            }}
                                        >
                                            <svg
                                                width="1.5em"
                                                height="1.5em"
                                                viewBox="0 0 16 16"
                                                className="bi bi-box-arrow-in-right text-danger"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.146 11.354a.5.5 0 0 1 0-.708L10.793 8 8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M1 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 1 8z"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M13.5 14.5A1.5 1.5 0 0 0 15 13V3a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 4 3v1.5a.5.5 0 0 0 1 0V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 5 13v-1.5a.5.5 0 0 0-1 0V13a1.5 1.5 0 0 0 1.5 1.5h8z"
                                                />
                                            </svg>
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
