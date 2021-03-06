import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import reducers from "./reducers"

const initialState = {}

const middleWare = [thunk]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export default createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(...middleWare))
)
