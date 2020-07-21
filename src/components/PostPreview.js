import React from "react"
import { Link } from "react-router-dom"
import "../styles/postPreview.css"

export default function PostPreview(props) {
    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">
                        <Link
                            to={props.data.postDestination}
                            className="text-dark stretched-link"
                        >
                            {props.data.title}
                        </Link>
                    </h2>
                    <div className="card-subtitle">
                        <Link
                            to={props.data.userDestination}
                            className="author text-secondary"
                        >
                            {props.data.author}
                        </Link>{" "}
                        <p
                            style={{ display: "inline" }}
                            className="small date text-secondary"
                        >
                            {props.data.date}
                        </p>
                    </div>
                </div>
            </div>
            <br />
        </div>
    )
}
