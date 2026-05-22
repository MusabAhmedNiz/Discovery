'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { usePois } from '@/hooks/usePois';
import { PoiGrid } from '@/components/PoiGrid';
import { ManualCoordsForm } from '@/components/ManualCoordsForm';
import type { Coords } from '@/types/geo';

const RADIUS_OPTIONS = [
  { label: '750 m', value: 750 },
  { label: '1.5 km', value: 1500 },
  { label: '3 km', value: 3000 },
  { label: '5 km', value: 5000 },
  { label: '10 km', value: 10000 },
];

const ALL_KEY = 'All';

export default function Home() {
  const { coords: geoCoords, status, request } = useGeolocation();
  const [manualCoords, setManualCoords] = useState<Coords | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [categoryKey, setCategoryKey] = useState(ALL_KEY);
  const [radiusMeters, setRadiusMeters] = useState(1500);

  useEffect(() => {
    request();
  }, [request]);

  // Effective coords: manual entry overrides geolocation
  const effectiveCoords: Coords | null = manualCoords ??
    (geoCoords
      ? { latitude: geoCoords.latitude, longitude: geoCoords.longitude }
      : null);

  const { data: allPois = [], isLoading, error: poisError } = usePois({
    coords: effectiveCoords,
    radiusMeters,
  });

  // Derive category pills from actual POI data
  const categories = useMemo(() => {
    const labels = new Set(allPois.map((p) => p.categoryLabel));
    return [ALL_KEY, ...[...labels].sort()];
  }, [allPois]);

  // Reset to "All" if selected category disappears after radius/location change
  useEffect(() => {
    if (categoryKey !== ALL_KEY && !categories.includes(categoryKey)) {
      setCategoryKey(ALL_KEY);
    }
  }, [categories, categoryKey]);

  // Client-side filter — no network request
  const filteredPois = useMemo(
    () =>
      categoryKey === ALL_KEY
        ? allPois
        : allPois.filter((poi) => poi.categoryLabel === categoryKey),
    [allPois, categoryKey],
  );

  function handleManualCoords(coords: Coords) {
    setManualCoords(coords);
    setShowManualForm(false);
    setCategoryKey(ALL_KEY);
  }

  function resetManualCoords() {
    setManualCoords(null);
    setShowManualForm(false);
    setCategoryKey(ALL_KEY);
  }

  const isGrantedOrManual = status === 'granted' || manualCoords !== null;

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-6 py-10'>

        {/* Header */}
        <div className='mb-8 flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Discovery</h1>
            <p className='mt-1 text-sm text-gray-500'>
              Places near you, sorted by distance.
            </p>
          </div>

          {/* Change location — visible once coords are active */}
          {isGrantedOrManual && (
            <div className='flex flex-col items-end gap-1'>
              {manualCoords && (
                <span className='text-xs text-gray-400'>
                  Custom location ({manualCoords.latitude.toFixed(4)},{' '}
                  {manualCoords.longitude.toFixed(4)})
                </span>
              )}
              <div className='flex gap-3'>
                <button
                  onClick={() => setShowManualForm((v) => !v)}
                  className='text-xs text-blue-600 hover:underline'>
                  {showManualForm ? 'Cancel' : 'Change location'}
                </button>
                {manualCoords && (
                  <button
                    onClick={resetManualCoords}
                    className='text-xs text-gray-400 hover:text-gray-600 hover:underline'>
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Inline change-location form */}
        {isGrantedOrManual && showManualForm && (
          <div className='mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm'>
            <p className='mb-3 text-sm font-medium text-gray-700'>
              Enter coordinates
            </p>
            <ManualCoordsForm onSubmit={handleManualCoords} />
          </div>
        )}

        {/* Requesting location */}
        {status === 'requesting' && !manualCoords && (
          <div className='flex items-center gap-3 text-gray-500'>
            <span className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
            <span className='text-sm'>Requesting location access…</span>
          </div>
        )}

        {/* Denied — show retry + manual entry option */}
        {status === 'denied' && !manualCoords && (
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

            <div className='my-6 flex items-center gap-3'>
              <div className='h-px flex-1 bg-gray-100' />
              <span className='text-xs text-gray-400'>or</span>
              <div className='h-px flex-1 bg-gray-100' />
            </div>

            <p className='mb-3 text-sm font-medium text-gray-700'>
              Enter coordinates manually
            </p>
            <ManualCoordsForm onSubmit={handleManualCoords} />
          </div>
        )}

        {/* Generic geolocation error */}
        {status === 'error' && !manualCoords && (
          <div className='rounded-xl border border-gray-100 bg-white p-8 shadow-sm'>
            <p className='text-sm font-semibold text-gray-900'>
              Could not determine your location.
            </p>
            <button
              onClick={request}
              className='mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700'>
              Retry
            </button>

            <div className='my-6 flex items-center gap-3'>
              <div className='h-px flex-1 bg-gray-100' />
              <span className='text-xs text-gray-400'>or</span>
              <div className='h-px flex-1 bg-gray-100' />
            </div>

            <p className='mb-3 text-sm font-medium text-gray-700'>
              Enter coordinates manually
            </p>
            <ManualCoordsForm onSubmit={handleManualCoords} />
          </div>
        )}

        {/* Main content */}
        {isGrantedOrManual && (
          <>
            {/* Controls */}
            <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
              {/* Category pills */}
              <div className='flex flex-wrap gap-2'>
                {(isLoading ? [ALL_KEY] : categories).map((label) => (
                  <button
                    key={label}
                    onClick={() => setCategoryKey(label)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      categoryKey === label
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Radius toggle */}
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-400'>Radius</span>
                <div className='flex overflow-hidden rounded-full border border-gray-200 bg-white'>
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

            {/* Overpass fetch error */}
            {poisError && (
              <p className='mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>
                {(poisError as Error).message}
              </p>
            )}

            {/* Skeleton while loading */}
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
            {!isLoading && <PoiGrid pois={filteredPois} />}

            {/* Count */}
            {!isLoading && filteredPois.length > 0 && (
              <p className='mt-6 text-center text-xs text-gray-400'>
                {filteredPois.length} place
                {filteredPois.length !== 1 ? 's' : ''} within{' '}
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
