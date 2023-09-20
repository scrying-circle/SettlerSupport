import React from "react";
export default function Track(props: { track: Array<boolean>, enabled: boolean }) {
    if (!props.enabled) {
        return <></>
    }
    const track_positions = [[55, 18.3], [60, 25], [65, 18.3], [70, 11.6], [75, 5], [80, 11.6], [85, 18.3]]
    const { track } = props;
    function getTrackStyle(index: number) {
        return {
            backgroundColor: `${track[index] ? 'rgba(248, 113, 113, 0.5)' : (index == 6 ? 'rgba(252, 211, 77, 0.3)' : 'rgba(203, 213, 225, 0.3)')}`,
            borderColor: `${track[index] ? (index == 6 ? '#fcd34d' : '#292524') : '#f8fafc'}`,
            left: `${track_positions[index][0]}%`,
            top: `${track_positions[index][1]}%`,
            width: '8vh',
            height: '8vh'
        }
    }
    function createTrackSegment(index: number) {
        return (
            <div className={`border-solid border-4 rounded-full absolute`} style={getTrackStyle(index)} />
        )
    }
    function Track() {
        return (
            [...Array(7).keys()].map((i) => createTrackSegment(i))
        )
    }
    return (
        <div className='w-1/3 min-h-fit z-5 cols-span-2'>
            <div className='border-solid border-4 border-slate-50 rounded-full bg-stone-800/80 absolute left-[50%] top-[11.6%]' style={{ width: '8vh', height: '8vh' }} />
            <Track />
        </div>
    )
}