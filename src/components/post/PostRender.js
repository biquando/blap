import React from "react"
import PostComponent from "./PostComponent"

export default function (props) {
    return (
        <div className="text-dark">
            {props.blocks.map((block, idx) => {
                return (
                    <PostComponent
                        key={idx}
                        type={block.type}
                        data={block.data}
                    />
                )
            })}
        </div>
    )
}
