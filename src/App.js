import React from "react"
import { Provider } from "react-redux"
import store from "./redux/store"
import { HashRouter as Router, Route } from "react-router-dom"
// import "bootstrap/dist/css/bootstrap.min.css"
import "./scss/custom.scss"

import "./styles/app.css"
import { loadUser } from "./redux/auth/authActions"
import {
    Navbar,
    Signup,
    Login,
    Settings,
    Post,
    Home,
    CreatePost,
    UserPage,
    AllPosts,
    FollowingPosts,
    EditPost,
    SearchPosts,
} from "./components"

class App extends React.Component {
    componentDidMount() {
        store.dispatch(loadUser())
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="text-dark">
                        <Navbar />
                        <br />
                        <div className="container-fluid main">
                            <Route path="/" component={Home} exact />
                            <Route path="/all" component={AllPosts} />
                            <Route
                                path="/following"
                                component={FollowingPosts}
                            />
                            <Route path="/signup" component={Signup} />
                            <Route path="/login" component={Login} />
                            <Route path="/settings" component={Settings} />
                            <Route path="/post" component={Post} />
                            <Route path="/create" component={CreatePost} />
                            <Route path="/edit" component={EditPost} />
                            <Route
                                path="/user/:username"
                                component={UserPage}
                            />
                            <Route path="/search" component={SearchPosts} />
                        </div>
                    </div>
                </Router>
            </Provider>
        )
    }
}

export default App
