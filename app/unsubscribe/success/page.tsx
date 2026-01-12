import Link from 'next/link'

export default function UnsubscribeSuccess() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 font-outfit">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="text-4xl font-bold tracking-tighter text-zinc-950">
                    sutra<span className="text-zinc-400">.</span>
                </div>
                <h1 className="text-2xl font-semibold text-zinc-900 font-cormorantGaramond">
                    You've been unsubscribed
                </h1>
                <p className="text-zinc-500 text-sm leading-relaxed">
                    We're sorry to see you go. You will no longer receive the daily digest or updates from Sutra.
                </p>
                <div className="pt-4">
                    <Link 
                        href="/"
                        className="inline-block bg-zinc-900 text-white text-sm font-medium py-2 px-6 rounded-md hover:bg-zinc-800 transition-colors"
                    >
                        Return to Blog
                    </Link>
                </div>
            </div>
        </main>
    )
}
