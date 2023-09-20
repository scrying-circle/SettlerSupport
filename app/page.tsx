'use client';
import Link from 'next/link'
import { use, useEffect } from 'react'
export default function Home() {
  const defaults = {
    volume: 5.0,
    bg_primary_color: '#000000',
    bg_secondary_color: '#93c5fd',
    turn_length_formula: '30 + t*0',
    fair_dice: true,
    cities_and_knights: false
  }
  useEffect(() => {
    if (localStorage.getItem('settings') === null) {
      localStorage.setItem('settings', JSON.stringify(defaults))
    }
  }, [])
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <Link href="/realtime">Real Time</Link>
      <Link href="/turnbased">Turn by Turn</Link>
      <Link href="/stats">Game Stats</Link>
      <Link href="/settings">Settings</Link>
    </main>
  )
}
