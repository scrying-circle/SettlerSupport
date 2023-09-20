import React from "react";
export default function Button(props: { className?: string, onClick: () => void, enabled: boolean, children: string }) {
    if (!props.enabled) {
        return <></>
    }
    const { className, onClick, children } = props;
    return (
        <div className="flex flex-box items-center place-content-evenly">
            <button className={className || ''} onClick={onClick}>{children}</button>
        </div>
    )
}