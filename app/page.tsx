import Link from 'next/link'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <Link href="/realtime">Real Time</Link>
      <Link href="/turnbased">Turn by Turn</Link>
      <Link href="/settings">Settings</Link>
    </main>
  )
}
