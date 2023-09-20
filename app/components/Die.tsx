import React from "react";
export default function Die(props: { src: string, color: string, children?: React.ReactNode }) {
    const { src, color, children } = props;
    return <div className="items-center relative" style={{ width: '30vh', height: '30vh' }}>
        <img className='m-0 absolute bottom-[50%] right-[50%] translate-x-1/2 translate-y-1/2 w-full h-full' src={`${color}${src}`} alt='white_face.jpg' />
        {children}
    </div>
}