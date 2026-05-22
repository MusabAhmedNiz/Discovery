'use client';

import { useEffect, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { usePois } from '@/hooks/usePois';
import { PoiGrid } from '@/components/PoiGrid';
import { CATEGORIES } from '@/lib/categories';

const RADIUS_OPTIONS = [
  { label: '750 m', value: 750 },
  { label: '1.5 km', value: 1500 },
];

export default function Home() {
  const { coords, status, request } = useGeolocation();
  const [categoryKey, setCategoryKey] = useState('all');
  const [radiusMeters, setRadiusMeters] = useState(1500);

  // Trigger geolocation on mount
  useEffect(() => {
    request();
  }, [request]);

  const { pois, isLoading, error: poisError } = usePois({
    coords,
    categoryKey,
    radiusMeters,
  });

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-6 py-10'>

        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900'>Discovery</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Places near you, sorted by distance.
          </p>
        </div>

        {/* Requesting location */}
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

        {/* Generic error */}
        {status === 'error' && (
          <div className='rounded-xl border border-gray-100 bg-white p-8 shadow-sm'>
            <p className='text-sm font-semibold text-gray-900'>
              Could not determine your location.
            </p>
            <button
              onClick={request}
              className='mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700'>
              Retry
            </button>
          </div>
        )}

        {/* Main content — location granted */}
        {status === 'granted' && coords && (
          <>
            {/* Controls */}
            <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
              {/* Category pills */}
              <div className='flex flex-wrap gap-2'>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCategoryKey(cat.key)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      categoryKey === cat.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Radius toggle */}
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-400'>Radius</span>
                <div className='flex rounded-full border border-gray-200 bg-white overflow-hidden'>
                  {RADIUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRadiusMeters(opt.value)}
                      className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                        radiusMeters === opt.value
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* POI fetch error */}
            {poisError && (
              <p className='mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>
                {poisError}
              </p>
            )}

            {/* Loading POIs */}
            {isLoading && (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-28 animate-pulse rounded-xl border border-gray-100 bg-white shadow-sm'
                  />
                ))}
              </div>
            )}

            {/* Results */}
            {!isLoading && <PoiGrid pois={pois} />}

            {/* Result count */}
            {!isLoading && pois.length > 0 && (
              <p className='mt-6 text-center text-xs text-gray-400'>
                {pois.length} place{pois.length !== 1 ? 's' : ''} found within{' '}
                {radiusMeters >= 1000
                  ? `${radiusMeters / 1000} km`
                  : `${radiusMeters} m`}
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
