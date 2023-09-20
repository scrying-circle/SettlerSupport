'use client';
import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import BackArrow from '../components/BackArrow';
import Dice from '../components/Dice';
import BarbarianRating from '../components/BarbarianRating';
import TurnCount from '../components/TurnCount';
import Button from '../components/Button';
export default function TurnBased() {
    const [white_face, setWhiteFace] = useState('1.svg')
    const [red_face, setRedFace] = useState('1.svg')
    const [event_face, setEventFace] = useState('yellow.svg')
    const [turn_count, setTurnCount] = useState(0)
    const [barbarian_count, setBarbarianCount] = useState(0)
    const limits = 5
    const [settings, setSettings] = useState({
        volume: 5.0,
        bg_primary_color: '#000000',
        bg_secondary_color: '#93c5fd',
        turn_length_formula: '30 + t*0',
        fair_dice: false,
        cities_and_knights: false
    })
    function create_deck(remove = 0) {
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
        if (settings['fair_dice']) {
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
        } else {
            return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
        }

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
        return [`${white}.svg`, `${red}.svg`, `${event}.svg`]
    }

    function roll(alchemist: boolean) {
        setTurnCount(turn_count + 1)
        let white = 0
        let red = 0
        if (!alchemist) {
            [white, red] = get_roll(deck)
        }
        const current_score = sessionStorage.getItem('scores')
        if (current_score) {
            let scores = JSON.parse(current_score)
            scores.push(white + red)
            sessionStorage.setItem('scores', JSON.stringify(scores))
        }
        const event = get_event()
        if (event == 'ship') {
            setBarbarianCount(barbarian_count + 1)
        }
        const faces = roll_to_svg(white, red, event)
        setWhiteFace(faces[0])
        setRedFace(faces[1])
        setEventFace(faces[2])

    }
    useEffect(() => {
        sessionStorage.setItem('scores', JSON.stringify([]))
        let stored_settings = localStorage.getItem('settings')
        if (stored_settings) {
            setSettings(JSON.parse(stored_settings))
        }

    }, [])

    return (
        <main className="grid min-h-screen grid-cols-3 items-center justify-around p-24 -z-10">
            <BackArrow href='/' />

            <div className='col-span-3 flex flex-box items-center place-content-evenly'>
                <TurnCount turn_count={turn_count} />
                <BarbarianRating barbarian_count={barbarian_count} turn_count={turn_count} enabled={settings['cities_and_knights']} />
            </div>

            <Dice src={[white_face, red_face, event_face]} cities_and_knights={settings['cities_and_knights']} />

            <div className='col-span-3 flex flex-box items-center place-content-evenly'>
                <Button onClick={() => roll(false)} enabled={true}>Roll All</Button>
                <Button onClick={() => roll(true)} enabled={settings['cities_and_knights']}>Roll Event</Button>
            </div>
        </main>
    )
}