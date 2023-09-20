import React from "react";
export default function BarbarianRating(props: { barbarian_count: number, turn_count: number, enabled: boolean }) {
    const { barbarian_count, turn_count, enabled } = props;
    if (!enabled) {
        return <></>
    }
    return <div>Barbarian Rating: {turn_count != 0 ? Math.round(barbarian_count*20/turn_count)/10: 0}</div>
}