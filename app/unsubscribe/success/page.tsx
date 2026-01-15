import Link from 'next/link'
import Subscribe from '@/components/Subscribe'

export default function UnsubscribeSuccess() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 font-outfit">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="space-y-6">
                    <div className="text-4xl font-bold tracking-tighter text-zinc-950">
                        sutra<span className="text-zinc-400">.</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-zinc-900 font-cormorantGaramond">
                        You've been unsubscribed
                    </h1>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                        We're sorry to see you go. You will no longer receive the weekly updates or insights from Sutra.
                    </p>
                </div>

                <div className="border-t border-zinc-100 pt-8 space-y-4">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                        Changed your mind?
                    </p>
                    <Subscribe minimal={true} />
                </div>

                <div className="pt-4">
                    <Link 
                        href="/"
                        className="text-zinc-400 hover:text-zinc-900 text-sm font-medium transition-colors"
                    >
                        &larr; Return to Blog
                    </Link>
                </div>
            </div>
        </main>
    )
}
