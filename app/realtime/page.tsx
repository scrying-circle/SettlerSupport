'use client';
import Link from 'next/link'
import { use, useEffect, useRef, useState } from 'react'
import { useAudioPlayer } from 'react-use-audio-player';
import Track from '../components/Track';
import BackArrow from '../components/BackArrow';
import TurnCount from '../components/TurnCount';
import Dice from '../components/Dice';
import Button from '../components/Button';
export default function RealTime() {
    const [settings, setSettings] = useState({
        volume: 5.0,
        bg_primary_color: '#000000',
        bg_secondary_color: '#93c5fd',
        turn_length_formula: '30 + t*0',
        fair_dice: false,
        cities_and_knights: false,
        auto_pause: true
    })
    useEffect(() => {
        const stored_defaults = localStorage.getItem('settings')
        if (stored_defaults) {
            setSettings(JSON.parse(stored_defaults))
        }
    }, [])
    const [white_face, setWhiteFace] = useState('1.svg')
    const [red_face, setRedFace] = useState('1.svg')
    const [event_face, setEventFace] = useState('yellow.svg')
    const [rolling, setRolling] = useState(false)
    const [button_text, setButtonText] = useState('Start')
    const alchemist = useRef(false)
    const [alchemist_button, setAlchemistButton] = useState(false)


    const turn_count = useRef(0)
    const turn_time = useRef(0)
    const timeStart = useRef(-1);
    const prevTime = useRef(-1);
    const [turn_percent, setTurnPercent] = useState(100)


    const [skip, setSkip] = useState(false)
    const isAlching = useRef('event')
    const limits = 5

    const period = useRef(setTimeout(() => { }, 0))
    const bg_animation_id = useRef(0)
    const pause_time = useRef(-1)
    const bg_color_options = [settings['bg_primary_color'], settings['bg_secondary_color']]
    const [bg_colors, setBgColors] = useState([0, 1])

    const track = useRef([false, false, false, false, false, false, false])
    const track_finished = useRef(false)
    const { load } = useAudioPlayer()

    function autoPause() {
        setTimeout(() => {
            setRolling(false)
        }, 200)
    }

    function time(t: number) {
        return (eval(settings['turn_length_formula']) * 1000) || 30000
    }
    function create_deck(remove: number = 0) {
        if (settings['fair_dice']) {
            let output = []
            for (let i = 1; i <= 6; i++) {
                for (let j = 1; j <= 6; j++) {
                    output.push([i, j])
                }
            }
            for (let i = 0; i < remove; i++) {
                output.splice(Math.floor(Math.random() * output.length), 1)
            }
            return output
        } else {
            return [[Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]]
        }

    }

    const deck = useRef(create_deck(Math.floor(Math.random() * limits)))

    function bg_animation(timeStamp: number) {
        if (timeStart.current == -1) {
            timeStart.current = timeStamp
            setBgColors(bg_colors.reverse())
        }
        if (prevTime.current != timeStamp) {
            turn_time.current = Math.min(timeStamp - timeStart.current, time(turn_count.current));
            setTurnPercent(turn_time.current / time(turn_count.current) * 100)
            if (turn_time.current < time(turn_count.current)) {
                bg_animation_id.current = window.requestAnimationFrame(bg_animation);
            } else {
                timeStart.current = -1;
                prevTime.current = -1;
                turn_time.current = 0;
                window.cancelAnimationFrame(bg_animation_id.current)
            }
            prevTime.current = timeStamp;
        }
    }



    function get_roll() {
        let index = Math.floor(Math.random() * deck.current.length)
        let roll = deck.current[index]
        if (deck.current.length == 1) {
            deck.current = create_deck()
        } else {
            deck.current.splice(index, 1)
        }
        console.log("turn: ", turn_count.current, " - roll: ", roll)
        return roll
    }
    function get_event() {
        const events = ['yellow', 'blue', 'green', 'ship', 'ship', 'ship']
        return events[Math.floor(Math.random() * events.length)]
    }

    function roll() {
        timeStart.current = -1;
        prevTime.current = -1;
        turn_time.current = 0;
        window.cancelAnimationFrame(bg_animation_id.current);
        bg_animation_id.current = window.requestAnimationFrame(bg_animation);
        let white = 0;
        let red = 0;
        let event = settings['cities_and_knights'] ? get_event() : 'yellow';
        if (track_finished.current) {
            track.current = [false, false, false, false, false, false, false]
            track_finished.current = false
        }
        if (event == 'ship') {
            let ship_position = track.current.indexOf(false)
            track.current[ship_position] = true
            if (ship_position == 6) {
                track_finished.current = true
                load('/boom.mp3', {
                    autoplay: true,
                    initialVolume: settings['volume'] || 5.0
                })
                if (settings['auto_pause']) {
                    autoPause()
                }
            }
        }
        if (!track_finished.current) {
            load('/bell.wav', {
                autoplay: true,
                initialVolume: settings['volume']
            })
        }

        if (!alchemist.current) {
            [white, red] = get_roll()
            setEventFace(`${event}.svg`)
            if (white + red == 7 && settings['auto_pause']) {
                autoPause()
            }
        } else {
            alchemist.current = false
            autoPause()
            setEventFace('no_event.svg')
            setTimeout(() => {
                isAlching.current = `${event}.svg`
            }, 250)
        }
        setWhiteFace(`${white}.svg`)
        setRedFace(`${red}.svg`)


        setAlchemistButton(false)


        turn_count.current += 1
        let current_score = sessionStorage.getItem('scores')
        if (current_score) {
            let scores = JSON.parse(current_score)
            scores.push(white + red)
            sessionStorage.setItem('scores', JSON.stringify(scores))
        }
    }
    function prep_roll() {
        roll()
        period.current = setTimeout(prep_roll, time(turn_count.current))
    }

    useEffect(() => {
        if (rolling) {
            setButtonText('Pause')
            if (isAlching.current != 'event') {
                setEventFace(isAlching.current)
                isAlching.current = 'event'
            }
            if (pause_time.current == -1) {
                pause_time.current = performance.now()
            }
            timeStart.current += performance.now() - pause_time.current
            let remaining_time = time(turn_count.current) - turn_time.current
            period.current = setTimeout(prep_roll, remaining_time)
            bg_animation_id.current = window.requestAnimationFrame(bg_animation)
            return () => clearTimeout(period.current)
        } else {
            setButtonText('Start')
            window.cancelAnimationFrame(bg_animation_id.current)
            if (pause_time.current != -1) pause_time.current = performance.now()
            if (isAlching.current != 'event') {
                setEventFace(isAlching.current)
                isAlching.current = 'event'
            }
        }
    }, [rolling])

    useEffect(() => {
        if (skip && rolling) {
            roll()
            clearTimeout(period.current)
            period.current = setTimeout(prep_roll, time(turn_count.current))
        }
        setSkip(false)
    }, [skip])

    useEffect(() => {
        sessionStorage.setItem('scores', JSON.stringify([]))
    }, [])

    return (
        <main className={`grid min-h-screen grid-cols-3 items-center justify-around p-24 -z-10`} style={{ background: `linear-gradient(to right, ${bg_color_options[bg_colors[0]]} ${turn_percent}%, ${bg_color_options[bg_colors[1]]} ${turn_percent}%)` }}>
            <BackArrow href='/' />

            <div className='col-span-3 flex flex-box items-center place-content-evenly'>
                <TurnCount turn_count={turn_count.current} />
                <Track track={track.current} enabled={settings['cities_and_knights']} />
            </div>

            <Dice src={[white_face, red_face, event_face]} cities_and_knights={settings['cities_and_knights']} />
            
            <div className='col-span-3 flex flex-box items-center place-content-evenly'>
                <Button onClick={() => setRolling(!rolling)} enabled={true}>{button_text}</Button>
                <Button className={`${alchemist_button ? 'text-green-500' : 'text-gray-500'}`} onClick={() => { setAlchemistButton(true); alchemist.current = true }} enabled={settings['cities_and_knights']}>Alchemist</Button>
                <Button onClick={() => setSkip(true)} enabled={true} >Next Roll</Button>
            </div>
        </main>
    )
}