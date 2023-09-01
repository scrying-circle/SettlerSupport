'use client';
import './styles.css'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'
export default function TurnBased() {
    const [white_face, setWhiteFace] = useState('w1.svg')
    const [red_face, setRedFace] = useState('r1.svg')
    const [event_face, setEventFace] = useState('yellow.svg')
    const [turn_count, setTurnCount] = useState(0)
    const [barbarian_count, setBarbarianCount] = useState(0)
    const limits = 5
    function create_deck(remove=0) {
        let output = []
        for (let i = 1; i < 7; i++) {
            for (let j = 1; j < 7; j++) {
                output.push([i, j])
            }
        }
        for (let i = 0; i < remove; i++) {
            output.splice(Math.floor(Math.random() * output.length), 1)
        }
        return output
    }

    const [deck, setDeck] = useState(create_deck(Math.floor(Math.random() * limits)))

    function get_roll(stack: Array<Array<number>>) {
        let roll = stack[Math.floor(Math.random() * stack.length)]
        stack.splice(stack.indexOf(roll), 1)
        if (stack.length == 0) {
            if (Math.random() < 0.5) {
                stack = create_deck()
            } else {
                stack = [[Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]]
            }
        }
        setDeck(stack)
        return roll
    }
    function get_event() {
        let event = Math.floor(Math.random() * 6)
        if (event == 0) {
            return 'yellow'
        } else if (event == 1) {
            return 'blue'
        } else if (event == 2) {
            return 'green'
        } else {
            return 'ship'
        }
    }

    function roll_to_svg(white: number, red: number, event: string) {
        return [`w${white}.svg`, `r${red}.svg`, `${event}.svg`]
    }

    function roll(alchemist: boolean) {
        setTurnCount(turn_count + 1)
        let white = 0
        let red = 0
        if (!alchemist) {
            [white, red] = get_roll(deck)
        }
        let current_score = sessionStorage.getItem('scores')
        if (current_score) {
            let scores = JSON.parse(current_score)
            scores.push(white + red)
            sessionStorage.setItem('scores', JSON.stringify(scores))
        }
        let event = get_event()
        if (event == 'ship') {
            setBarbarianCount(barbarian_count + 1)
        }
        let faces = roll_to_svg(white, red, event)
        setWhiteFace(faces[0])
        setRedFace(faces[1])
        setEventFace(faces[2])

    }
    useEffect(() => {
        sessionStorage.setItem('scores', JSON.stringify([]))
    }, [])


    return (
        <main className="flex min-h-screen flex-col items-center justify-around p-24">
            <Link href="/" className='absolute top-10 left-10'>←</Link>
            <div className="flex min-h-fit min-w-full flex-row items-center place-content-evenly">
                 <div>Turn Count: {turn_count}</div>
                 <div>Barbarian Rating: {turn_count != 0 ? Math.round(barbarian_count*20/turn_count)/10: 0}</div>
            </div>

            <div className="flex min-h-fit min-w-full flex-row items-center justify-evenly z-0">
                <div className="items-center relative" style={{width: '30vh', height: '30vh'}}>
                    <img className='m-0 absolute bottom-[50%] right-[50%] translate-x-1/2 translate-y-1/2 w-full h-full' src={white_face} alt='white_face.jpg'/>
                </div>
                <div className="items-center relative" style={{width: '30vh', height: '30vh'}}>
                    <img className='m-0 absolute bottom-[50%] right-[50%] translate-x-1/2 translate-y-1/2 w-full h-full' src={red_face} alt='red_face.jpg'/>
                </div>
                <div className="items-center bg-[url('/bg.svg')] bg-cover text-center bg-center relative" style={{width: '30vh', height: '30vh'}}>
                    <img className='m-0 absolute bottom-[50%] right-[50%] translate-x-1/2 translate-y-1/2' style={{width: '20vh', height: '20vh'}} src={event_face} alt='event_face.jpg'/>
                </div>
            </div>
            <div className="flex min-h-fit min-w-full flex-row items-center place-content-evenly">
                <button onClick={_ => roll(false)}>Roll All</button>
                <button onClick={_ => roll(true)}>Roll Event</button>
            </div>
        </main>
    )
}