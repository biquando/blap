import React from "react"
import { Link } from "react-router-dom"
import "../styles/postPreview.css"

export default function PostPreview(props) {
    return (
        <div>
            <div className="card border-dark">
                <div className="card-body">
                    <h2 className="card-title">
                        <Link
                            to={props.data.postDestination}
                            className="text-dark stretched-link"
                        >
                            {props.data.title}
                        </Link>
                    </h2>
                    <div className="card-subtitle text-muted">
                        <Link
                            to={props.data.userDestination}
                            className="text-muted author"
                        >
                            {props.data.author}
                        </Link>{" "}
                        <p style={{ display: "inline" }} className="small date">
                            {props.data.date}
                        </p>
                    </div>
                </div>
            </div>
            <br />
        </div>
    )
}
