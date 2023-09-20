import React from "react";
export default function TurnCount(props: { turn_count: number }) {
    const { turn_count } = props;
    return (
    <div className="flex flex-box items-center place-content-evenly">
        <div>Turn Count: {turn_count}</div>
    </div>
    )
}