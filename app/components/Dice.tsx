import React from "react";
import Die from "./Die";
export default function Dice(props: { src: Array<string>, cities_and_knights: boolean }) {
    const { src, cities_and_knights } = props;
    function EventDie(props: { src: string, cities_and_knights: boolean }) {
        if (cities_and_knights) {
            return (
                <Die src={'bg.svg'} color={''}>
                    <img className='m-0 absolute bottom-[50%] right-[50%] translate-x-1/2 translate-y-1/2' style={{ width: '20vh', height: '20vh' }} src={props.src} alt='event_face.jpg' />
                </Die>
            )
        }
    }
    return (
        <div className="col-span-3 flex flex-row items-center justify-around">
            <Die src={src[0]} color={'w'} />
            <Die src={src[1]} color={cities_and_knights ? 'r' : 'w'} />
            <EventDie src={src[src.length - 1]} cities_and_knights={cities_and_knights} />
        </div>
    )
}