'use client';

import { useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

export default function Home() {
  const { coords, status, error, request } = useGeolocation();

  // Request location as soon as the page mounts
  useEffect(() => {
    request();
  }, [request]);

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-6 py-12'>
        <h1 className='mb-8 text-2xl font-bold text-gray-900'>Discovery</h1>

        {/* Requesting */}
        {status === 'requesting' && (
          <div className='flex items-center gap-3 text-gray-500'>
            <span className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
            <span className='text-sm'>Requesting location access…</span>
          </div>
        )}

        {/* Denied */}
        {status === 'denied' && (
          <div className='rounded-xl border border-gray-100 bg-white p-8 shadow-sm'>
            <p className='text-sm font-semibold text-gray-900'>
              Geolocation access denied.
            </p>
            <p className='mt-1 text-sm text-gray-500'>
              Allow location access in your browser settings and try again.
            </p>
            <button
              onClick={request}
              className='mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700'>
              Try Again
            </button>
          </div>
        )}

        {/* Error (non-permission) */}
        {status === 'error' && (
          <div className='rounded-xl border border-gray-100 bg-white p-8 shadow-sm'>
            <p className='text-sm font-semibold text-gray-900'>
              Something went wrong.
            </p>
            <p className='mt-1 text-sm text-gray-500'>{error}</p>
            <button
              onClick={request}
              className='mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700'>
              Retry
            </button>
          </div>
        )}

        {/* Granted — show coords */}
        {status === 'granted' && coords && (
          <div className='rounded-xl border border-gray-100 bg-white p-8 shadow-sm'>
            <p className='mb-1 text-xs font-medium uppercase tracking-wide text-gray-400'>
              Your location
            </p>
            <p className='text-sm text-gray-700'>
              <span className='font-medium'>Latitude:</span>{' '}
              {coords.latitude.toFixed(6)}
            </p>
            <p className='mt-1 text-sm text-gray-700'>
              <span className='font-medium'>Longitude:</span>{' '}
              {coords.longitude.toFixed(6)}
            </p>
            {coords.accuracy && (
              <p className='mt-1 text-sm text-gray-700'>
                <span className='font-medium'>Accuracy:</span>{' '}
                ±{Math.round(coords.accuracy)} m
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
