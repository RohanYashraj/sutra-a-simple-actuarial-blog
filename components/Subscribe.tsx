'use client'

import { useActionState, useEffect, useState } from 'react'
import { subscribeAction } from '@/app/actions/subscribe'

export default function Subscribe({ minimal = false }: { minimal?: boolean }) {
  const [state, action, isPending] = useActionState(subscribeAction, null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (state?.success) {
      setEmail('')
    }
  }, [state])

  return (
    <div 
      id={!minimal ? "footer-subscribe" : undefined} 
      className={`w-full flex ${minimal ? 'flex-row items-center justify-center' : 'flex-col md:flex-row md:items-center md:justify-between'} gap-6 md:gap-12`}
    >
      {!minimal && (
        <div className="max-w-xl">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-2">
            Subscribe to updates
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Join 1,000+ actuaries for high-impact insights every Tuesday, Thursday, and Sunday. No spam, ever.
          </p>
        </div>
      )}
      
      <form action={action} className={`flex ${minimal ? 'flex-row' : 'flex-col md:flex-row'} gap-2 w-full md:w-auto whitespace-nowrap`}>
        <div className={`relative ${minimal ? 'w-full md:w-64' : 'w-full md:w-72'}`}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-md px-4 py-2 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all placeholder:text-zinc-500"
            disabled={isPending || state?.success}
          />
        </div>
        
        <button
          type="submit"
          disabled={isPending || state?.success}
          className={`${minimal ? 'px-4' : 'px-6'} bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPending ? '...' : state?.success ? '✓' : 'Subscribe'}
        </button>

        {state?.error && (
          <p className="absolute -bottom-6 left-0 text-red-500 text-xs">{state.error}</p>
        )}
      </form>
    </div>
  )
}
