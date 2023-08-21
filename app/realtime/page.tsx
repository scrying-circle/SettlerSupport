'use client';
import './styles.css'
import Link from 'next/link'
import { use, useEffect, useRef, useState } from 'react'
export default function RealTime() {
    const [white_face, setWhiteFace] = useState('w1.svg')
    const [red_face, setRedFace] = useState('r1.svg')
    const [event_face, setEventFace] = useState('yellow.svg')
    const [rolling, setRolling] = useState(false)
    const [button_text, setButtonText] = useState('Start')
    const alchemist = useRef(false)
    const turn_count = useRef(0)
    const barbarian_count = useRef(0)
    const [skip, setSkip] = useState(false)
    const limits = 5
    let period: NodeJS.Timeout;
    /*
    const [twos, setTwos] = useState(0)
    const [threes, setThrees] = useState(0)
    const [fours, setFours] = useState(0)
    const [fives, setFives] = useState(0)
    const [sixes, setSixes] = useState(0)
    const [sevens, setSevens] = useState(0)
    const [eights, setEights] = useState(0)
    const [nines, setNines] = useState(0)
    const [tens, setTens] = useState(0)
    const [elevens, setElevens] = useState(0)
    const [twelves, setTwelves] = useState(0)
    */
    function time(turns: number) {
        let period = 30
        return period * 1000
    }
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

    function roll() {
        let white = 0
        let red = 0
        if (!alchemist.current) {
            [white, red] = get_roll(deck)
        } else {
            alchemist.current = false
        }
        let event = get_event()
        if (event == 'ship') {
            barbarian_count.current += 1
        }
        let faces = roll_to_svg(white, red, event)
        setWhiteFace(faces[0])
        setRedFace(faces[1])
        setEventFace(faces[2])
        turn_count.current += 1

        /*
        if (white + red == 2) {
            setTwos(twos + 1)
        } else if (white + red == 3) {
            setThrees(threes + 1)
        } else if (white + red == 4) {
            setFours(fours + 1)
        } else if (white + red == 5) {
            setFives(fives + 1)
        } else if (white + red == 6) {
            setSixes(sixes + 1)
        } else if (white + red == 7) {
            setSevens(sevens + 1)
        } else if (white + red == 8) {
            setEights(eights + 1)
        } else if (white + red == 9) {
            setNines(nines + 1)
        } else if (white + red == 10) {
            setTens(tens + 1)
        } else if (white + red == 11) {
            setElevens(elevens + 1)
        } else if (white + red == 12) {
            setTwelves(twelves + 1)
        }
        */
    }
    let prep_roll = () => {
        roll()
        period = setTimeout(prep_roll, time(turn_count.current))
    }
    useEffect(() => {
        if (rolling) {
            setButtonText('Pause')
            if (skip) {
                roll()
                setSkip(false)
            }
            period = setTimeout(prep_roll, time(turn_count.current))
            return () => clearTimeout(period)
        } else {
            setButtonText('Start')
        }
    }, [rolling, skip])

    return (
        <main className="flex min-h-screen flex-col items-center justify-around p-24">
            <Link href="/" className='absolute top-10 left-10'>←</Link>
            <div className="flex min-h-fit min-w-full flex-row items-center place-content-evenly">
                 <div>Turn Count: {turn_count.current}</div>
                 <div>Barbarian Rating: {Math.round(barbarian_count.current*20/turn_count.current)/10}</div>
            </div>
    {/*
            <div className="flex min-h-fit min-w-full flex-row items-center place-content-evenly">
                <div>2: {twos}</div>
                <div>3: {threes}</div>
                <div>4: {fours}</div>
                <div>5: {fives}</div>
                <div>6: {sixes}</div>
                <div>7: {sevens}</div>
                <div>8: {eights}</div>
                <div>9: {nines}</div>
                <div>10: {tens}</div>
                <div>11: {elevens}</div>
                <div>12: {twelves}</div>
            </div>
    */}
            <div className="flex min-h-fit min-w-full flex-row items-center justify-evenly">
                <div className="scale-50 w-1/3 h-1/3">
                    <img src={white_face} alt='white_face.jpg'/>
                </div>
                <div className="scale-50 w-1/3 h-1/3">
                    <img src={red_face} alt='red_face.jpg'/>
                </div>
                <div className="scale-50 w-1/3 h-1/3">
                    <img src='bg.svg' alt='background'/>
                    <img className='absolute top-0 scale-50' src={event_face} alt='event_face.jpg'/>
                </div>
            </div>
            <div className="flex min-h-fit min-w-full flex-row items-center place-content-evenly">
                <button onClick={_ => setRolling(!rolling)}>{button_text}</button>
                <button onClick={_ => alchemist.current = true}>Alchemist</button>
                <button onClick={_ => setSkip(true)}>Next Roll</button>
            </div>
        </main>
    )
}