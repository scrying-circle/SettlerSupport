'use client';
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react';
export default function Settings() {
    const [data, setData] = useState([])
    const [cumulative_data, setCumulativeData] = useState(Array(11).fill(0))
    function createDataPoint(turn: number) {
        let style = {
            left: `${turn / data.length * 60 + 20}%`,
            bottom: `${(data[turn] - 2) * 5 + 40}%`
        }
        if (data[turn] != 0) {
            return (
                <div className='absolute rounded-full bg-orange-400 border-orange-400 h-3 w-3 z-10' style={style} key={turn}></div>
            )
        }
    }
    function createGrid(value: number) {
        let height = value + 2
        let style_line = {
            bottom: `${value * 5 + 40.5}%`
        }
        let style_legend = {
            fontSize: '3vh',
            bottom: `${value * 5 + 38.5}%`
        }
        return (
            <div key={value}>
                <div className='absolute right-[81%] text-right text-gray-400' style={style_legend}>{height}</div>
                <div className='absolute border-gray-700 border-2 w-[60%] left-[20%] -z-5' style={style_line}></div>
            </div>
        )
    }

    function createBars(value: number) {
        let style_bar = {
            left: `${value / 11 * 100}%`,
            width: `9.09090909090909vw`,
            bottom: '0',
            height: `${cumulative_data[value] / Math.max(...cumulative_data) * 30}%`,
            backgroundColor: 'rgba(225, 255, 255, 0.8)'
        }
        let style_label = {
            bottom: '5vh',
            left: `${(value + 0.5) / 11 * 100}%`,
            fontSize: '2vh'
        }
        let style_feature = {
            bottom: '25vh',
            left: `${(value + 0.5) / 11 * 100}%`,
            fontSize: '2vh'
        }
        let style_boundary = {
            left: `${((value + 1) / 11) * 100 - 0.1}%`,
            bottom: '0',
            height: `${value == 10 ? '0' : '35vh'}`,
            borderColor: 'rgba(255, 255, 255, 0.5)'
        }
        return (
            <div key={value}>
                <div className='absolute z-10' style={style_bar}></div>
                <div className='absolute z-20 border-2' style={style_boundary}></div>
                <div className='absolute z-30 text-center text-gray-400 mix-blend-difference' style={style_label}>{value + 2}</div>
                <div className='absolute z-30 text-center text-gray-400 mix-blend-difference' style={style_feature}>{cumulative_data[value]}</div>
            </div>
        )
    }

    useEffect(() => {
        const stored_data = sessionStorage.getItem('scores');
        let parsed_data = [];
        let temp_cumulative: Array<number> = Array(11).fill(0);
        if (stored_data) {
            parsed_data = JSON.parse(stored_data);
            setData(parsed_data);
            for (let i = 0; i < parsed_data.length; i++) {
                temp_cumulative[parsed_data[i] - 2] += 1
            }
            setCumulativeData(temp_cumulative);
        }
    }, [])
    return (
        <main className="flex min-h-screen flex-col items-center place-content-evenly p-24">
            <Link href="/" className='absolute top-10 left-10'>←</Link>
            <div className='w-1/2 h-1/2'>
                {[...Array(data.length).keys()].map(createDataPoint)}
                {[...Array(11).keys()].map(createGrid)}
            </div>
            <div>
                {[...Array(11).keys()].map(createBars)}
            </div>
        </main>
    )
}