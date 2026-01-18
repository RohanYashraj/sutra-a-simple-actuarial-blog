'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUnsubscribe = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unsubscribe');
      }

      setStatus('success');
    } catch (error: any) {
      console.error('Unsubscribe error:', error);
      setStatus('error');
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-4xl mb-6 text-zinc-900">Unsubscribed</h1>
        <p className="font-sans text-zinc-600 mb-8 text-lg">
          The thread has been severed. You have been successfully unsubscribed from all Sutra updates.
        </p>
        <Link 
          href="/"
          className="inline-block bg-zinc-900 text-white font-sans font-medium px-6 py-3 rounded hover:bg-zinc-800 transition-colors"
        >
          Return to Sutra
        </Link>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4 text-zinc-900">Invalid Link</h1>
        <p className="font-sans text-zinc-600 mb-8">
          No email address provided. Please use the link from your email.
        </p>
        <Link 
          href="/"
          className="inline-block bg-zinc-900 text-white font-sans font-medium px-6 py-3 rounded hover:bg-zinc-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (

    <div className="max-w-xl mx-auto px-4 py-32 flex flex-col items-center text-center">
      <h1 className="font-serif text-3xl mb-4 text-zinc-900 tracking-tight">Sever the Thread?</h1>
      
      <p className="font-sans text-zinc-500 mb-12 text-base leading-relaxed max-w-md">
        Unsubscribing means missing out on weekly Actuarial Intelligence insights, Market Pulse, and Code Sutra snippets.
      </p>

      {status === 'error' && (
        <div className="mb-8 text-red-600 text-sm">
          {errorMessage || 'Something went wrong. Please try again.'}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-8 py-6 sm:px-10 sm:py-4 border border-zinc-200 rounded-2xl sm:rounded-full">
        <Link
          href="/"
          className="text-zinc-900 font-sans font-medium text-sm hover:text-black hover:underline underline-offset-4 transition-colors text-center"
        >
          Keep the Connection
        </Link>
        
        <div className="w-full h-px bg-zinc-200 sm:hidden"></div>
        <div className="hidden sm:block w-px h-4 bg-zinc-200"></div>

        <button
          onClick={handleUnsubscribe}
          disabled={loading}
          className="text-zinc-400 font-sans text-sm hover:text-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Unsubscribe'}
        </button>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-white" />}>
      <UnsubscribeContent />
    </Suspense>
  );
}
