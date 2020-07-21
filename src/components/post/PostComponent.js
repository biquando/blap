import React from "react"

export default function (props) {
    let s = ""
    switch (props.type) {
        case "paragraph":
            s = "<p>" + props.data.text + "</p>"
            return createElement(s)

        case "header":
            s = "<h" + props.data.level + ">"
            s += props.data.text
            s += "</h" + props.data.level + ">"
            return createElement(s)

        case "simpleImage":
            let classModifications = ""
            let styleModifications = {}
            if (props.data.withBorder) {
                classModifications += "border "
            }
            if (props.data.stretched) {
                classModifications += "w-100 "
            } else {
                styleModifications = {
                    maxWidth: "100%",
                    margin: "auto",
                    display: "block",
                }
            }

            return (
                <div>
                    <img
                        src={props.data.url}
                        className={classModifications}
                        style={styleModifications}
                        alt={props.data.caption}
                    />
                    <p className="text-center text-muted">
                        {props.data.caption}
                    </p>
                </div>
            )

        case "delimiter":
            return <h3 className="text-center">* * *</h3>

        case "list":
            if (props.data.style === "ordered") {
                return (
                    <ol>
                        {props.data.items.map((text, idx) => (
                            <li key={idx}>
                                <p>{text}</p>
                            </li>
                        ))}
                    </ol>
                )
            } else {
                return (
                    <ul>
                        {props.data.items.map((text, idx) => (
                            <li key={idx}>
                                <p>{text}</p>
                            </li>
                        ))}
                    </ul>
                )
            }

        default:
            return <div />
    }
}

const createElement = element => (
    <div dangerouslySetInnerHTML={{ __html: element }} />
)
