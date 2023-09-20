'use client';
import Link from 'next/link'
import { useAudioPlayer } from 'react-use-audio-player';
import { useEffect, useRef, useState } from 'react';
export default function Settings() {
    const { load } = useAudioPlayer()
    const didUpdate = useRef(false)
    const defaults = {
        volume: 5.0,
        bg_primary_color: '#000000',
        bg_secondary_color: '#93c5fd',
        turn_length_formula: '30 + t*0',
        fair_dice: true,
        cities_and_knights: false
    }
    const [settings, setSettings] = useState(defaults);
    function change_settings(field: string, value: number | string | boolean) {
        let temp: {
            [key: string]: number | string | boolean
        } = settings;
        temp[field] = value;
        setSettings({...settings, ...temp});
    }
    useEffect(() => {
        if (didUpdate.current) {
            localStorage.setItem('settings', JSON.stringify(settings))
        } else {
            didUpdate.current = true
        }
    }, [settings])
    useEffect(() => {
        let stored_settings = localStorage.getItem('settings')
        if (stored_settings) {
            setSettings(JSON.parse(stored_settings))
        }
    }, [])
    return (
        <main className="flex min-h-screen flex-col items-center place-content-evenly p-24">
            <Link href="/" className='absolute top-10 left-10'>←</Link>
            <div className='flex flex-row items-center'>
                <div className='pr-5'>Volume</div>
                <input className='text-black text-xs w-20 border-radius-5 border-white' placeholder={`Current: ${settings['volume']}`} type='number' onInput={(e) => {change_settings('volume', parseFloat((e.target as HTMLInputElement).value))}}/>
                <img className='ml-5 border-2 border-white w-7 h-7 cursor-pointer' src='\speaker.svg' onClick={() => {
                    load('/bell.wav', {
                    autoplay: true,
                    initialVolume: settings['volume'] || defaults['volume'],
                })}
                }></img>
            </div>
            <div className='flex flex-row items-center'>
                <div className='pr-5'>Cities and Knights features: </div>
                <button onClick={_ => change_settings('cities_and_knights', !settings['cities_and_knights'])}>{settings['cities_and_knights'] ? 'Yes': 'No'}</button>
            </div>
            <div className='flex flex-row items-center'>
                <div className='pr-5'>Primary Background Colour</div>
                <input className='border-2 border-white cursor-pointer' value={`${settings['bg_primary_color']}`} type='color' onInput={(e) => {change_settings('bg_primary_color', (e.target as HTMLInputElement).value)}}/>
            </div>
            <div className='flex flex-row items-center'>
                <div className='pr-5'>Secondary Background Colour</div>
                <input className='border-2 border-white cursor-pointer' value={`${settings['bg_secondary_color']}`} type='color' onInput={(e) => {change_settings('bg_secondary_color', (e.target as HTMLInputElement).value)}}/>
            </div>
            <div className='flex flex-row items-center'>
                <div className='pr-5'>Turn Length by Turn Count(t) = </div>
                <input className='text-black text-lg w-50 border-radius-5 border-white' placeholder={`Current: ${settings['turn_length_formula']}`} type='text' onInput={(e) => {change_settings('turn_length_formula', (e.target as HTMLInputElement).value)}}/>
            </div>
            <div className='flex flex-row items-center'>
                <div className='pr-5'>Fair Dice: </div>
                <button onClick={_ => change_settings('fair_dice', !settings['fair_dice'])}>{settings['fair_dice'] ? 'Yes': 'No'}</button>
            </div>
            <button onClick={_ => setSettings(defaults)}>Reset to Defaults</button>
        </main> 
    )
}