'use client';
import './styles.css'
import Link from 'next/link'
import { use, useEffect, useRef, useState } from 'react'
import { useAudioPlayer } from 'react-use-audio-player';
export default function RealTime() {
    const [settings, setSettings] = useState({
        volume: 5.0,
        bg_primary_color: '#000000',
        bg_secondary_color: '#93c5fd',
        turn_length_formula: '30 + t*0'
    })
    useEffect(() => {
        const stored_defaults = localStorage.getItem('settings')
        if (stored_defaults) {
            setSettings(JSON.parse(stored_defaults))
        }
        console.log(settings)
    }, [])
    const [white_face, setWhiteFace] = useState('w1.svg')
    const [red_face, setRedFace] = useState('r1.svg')
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
    const limits = 5

    const period = useRef(setTimeout(() => {}, 0))
    const bg_animation_id = useRef(0)
    const pause_time = useRef(-1)
    const bg_color_options = [settings['bg_primary_color'], settings['bg_secondary_color']]
    const [bg_colors, setBgColors] = useState([0, 1])

    const track = useRef([false, false, false, false, false, false, false])
    const track_finished = useRef(false)
    const track_positions = [[55, 18.3], [60, 25], [65, 18.3], [70, 11.6], [75, 5], [80, 11.6], [85, 18.3]]
    const { load } = useAudioPlayer()
    
    function getTrackStyle(index: number) {
        return {
            backgroundColor: `${track.current[index] ? 'rgba(248, 113, 113, 0.5)': (index == 6 ? 'rgba(252, 211, 77, 0.3)': 'rgba(203, 213, 225, 0.3)')}`,
            borderColor: `${track.current[index] ? (index == 6 ? '#fcd34d': '#292524'): '#f8fafc'}`,
            left: `${track_positions[index][0]}%`,
            top: `${track_positions[index][1]}%`,
            width: '8vh',
            height: '8vh'
        }
    }
    function createTrackSegment(index: number) {
        return (
            <div className={`border-solid border-4 rounded-full absolute`} style={getTrackStyle(index)}/>
        )
    }
    function Track() {
        return (
            [...Array(7).keys()].map((i) => createTrackSegment(i))
        )
    }
    function time(t: number) {
        return eval(settings['turn_length_formula']) * 1000
    }
    function create_deck(remove: number=0) {
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
    }

    const [deck, setDeck] = useState(create_deck(Math.floor(Math.random() * limits)))

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



    function get_roll(stack: Array<Array<number>>) {
        let roll = stack[Math.floor(Math.random() * stack.length)]
        stack.splice(stack.indexOf(roll), 1)
        if (stack.length == 0) {
            stack = create_deck()
        }
        setDeck(stack)
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
        window.cancelAnimationFrame(bg_animation_id.current)
        bg_animation_id.current = window.requestAnimationFrame(bg_animation)
        load('/bell.wav', {
            autoplay: true,
            initialVolume: settings['volume']
        })
        let white = 0
        let red = 0
        let event = get_event()
        if (track_finished.current) {
            track.current = [false, false, false, false, false, false, false]
            track_finished.current = false
        }
        if (event == 'ship') {
            let ship_position = track.current.indexOf(false)
            track.current[ship_position] = true
            if (ship_position == 6) {
                track_finished.current = true
            }
        }
        
        if (!alchemist.current) {
            [white, red] = get_roll(deck)
            
        } else {
            alchemist.current = false
        }
        setWhiteFace(`w${white}.svg`)
        setRedFace(`r${red}.svg`)
        setEventFace(`${event}.svg`)
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
        <main className={`flex min-h-screen flex-col items-center justify-around p-24 -z-10`} style={{background: `linear-gradient(to right, ${bg_color_options[bg_colors[0]]} ${turn_percent}%, ${bg_color_options[bg_colors[1]]} ${turn_percent}%)`}}>
            <Link href="/" className='absolute top-10 left-10'>←</Link>
            <div className="flex min-h-fit min-w-full flex-row items-center place-content-evenly z-0">
                 <div>Turn Count: {turn_count.current}</div>
                 <div className='w-1/3 min-h-fit z-5'>
                    <div className='border-solid border-4 border-slate-50 rounded-full bg-stone-800/80 absolute left-[50%] top-[11.6%]' style={{width: '8vh', height: '8vh'}}/>
                    <Track />
                 </div>
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
            <div className="flex min-h-fit min-w-full flex-row items-center place-content-evenly z-0">
                <button onClick={_ => setRolling(!rolling)}>{button_text}</button>
                <button className={`${alchemist_button ? 'text-green-500': 'text-gray-500'}`} onClick={_ => {setAlchemistButton(true); alchemist.current = true}}>Alchemist</button>
                <button onClick={_ => setSkip(true)}>Next Roll</button>
            </div>
        </main>
    )
}