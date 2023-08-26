'use client';
import Link from 'next/link'
import { useAudioPlayer } from 'react-use-audio-player';
export default function Settings() {
    const { load } = useAudioPlayer()
    const defaults = {
        volume: 2.0,
        bg_primary_color: '#f87171',
        bg_secondary_color: 'black'
    }
    let settings = defaults;
    return (
        <main className="flex min-h-screen flex-col items-center justify-around p-24">
            <Link href="/" className='absolute top-10 left-10'>←</Link>
            <div className='flex min-w-fit min-h-fit flex-row items-center justify-around p-24'>
                <div>Volume: </div>
                <input className='text-black' type='number' onInput={(e) => {settings['volume'] = parseFloat((e.target as HTMLInputElement).value)}}></input>
                <button onClick={() => {
                    load('/bell.wav', {
                    autoplay: true,
                    initialVolume: settings['volume']
                })}
                }>
                    🔊</button>
            </div>
        </main> 
    )
}