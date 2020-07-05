import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import "../../styles/signup.css"
import { login } from "../../redux/auth/authActions"
import { clearErrors } from "../../redux/error/errorActions"

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            msg: null,
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props
        if (error !== prevProps.error) {
            // Check for a signup error
            if (error.id === "LOGIN_FAIL") {
                this.setState({ msg: error.msg.msg })
            } else {
                this.setState({ msg: null })
            }
        }

        if (isAuthenticated) {
            window.location = "/"
        }
    }

    onChange(e) {
        const { name, value } = e.target
        this.setState({
            [name]: value,
        })
    }

    onSubmit(e) {
        e.preventDefault()

        const { username, password } = this.state
        const user = {
            username,
            password,
        }

        // Attempt to log in
        this.props.login(user)
    }

    render() {
        return (
            <div className="text-center">
                <h1>Log in</h1>
                <form onSubmit={this.onSubmit} className="form-signin">
                    <input
                        name="username"
                        type="text"
                        value={this.state.username}
                        onChange={this.onChange}
                        placeholder="Username"
                        autoFocus
                        className="form-control"
                    />
                    <input
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.onChange}
                        placeholder="Password"
                        className="form-control"
                    />

                    {this.state.msg ? (
                        <div className="alert alert-danger">
                            {this.state.msg}
                        </div>
                    ) : null}

                    <button
                        className="btn btn-lg btn-primary btn-block"
                        disabled={this.props.loadingSubmit}
                    >
                        {this.props.loadingSubmit ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            "Submit"
                        )}
                    </button>
                </form>

                <p>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    loadingSubmit: state.auth.loadingSubmit,
})

export default connect(mapStateToProps, { login, clearErrors })(Login)
