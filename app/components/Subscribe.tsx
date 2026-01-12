'use client'

import { useState } from 'react'

export default function Subscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setEmail('')
    } catch (error: any) {
      console.error(error)
      setStatus('error')
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-12">
      <div className="max-w-xl">
        <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-2">
          Subscribe to updates
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Get the latest actuarial insights and AI trends directly to your inbox. No spam, ever.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 w-full md:w-auto whitespace-nowrap">
        <div className="relative w-full md:w-72">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-md px-4 py-2 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all placeholder:text-zinc-400"
            disabled={status === 'loading' || status === 'success'}
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="w-full md:w-auto bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
        </button>

        {status === 'error' && (
          <p className="absolute -bottom-6 left-0 text-red-500 text-xs">{errorMessage}</p>
        )}
        {status === 'success' && (
          <p className="absolute -bottom-6 left-0 text-green-600 text-xs">Thanks for subscribing!</p>
        )}
      </form>
    </div>
  )
}
