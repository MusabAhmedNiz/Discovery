'use client';

import { useState } from 'react';
import type { Coords } from '@/types/geo';

interface ManualCoordsFormProps {
  onSubmit: (coords: Coords) => void;
}

interface FormErrors {
  lat?: string;
  lon?: string;
}

function validate(lat: string, lon: string): FormErrors {
  const errors: FormErrors = {};
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (!lat.trim() || isNaN(latNum)) {
    errors.lat = 'Enter a valid number';
  } else if (latNum < -90 || latNum > 90) {
    errors.lat = 'Must be between −90 and 90';
  }

  if (!lon.trim() || isNaN(lonNum)) {
    errors.lon = 'Enter a valid number';
  } else if (lonNum < -180 || lonNum > 180) {
    errors.lon = 'Must be between −180 and 180';
  }

  return errors;
}

export function ManualCoordsForm({ onSubmit }: ManualCoordsFormProps) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(lat, lon);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className='flex flex-col gap-3 sm:flex-row'>
        <div className='flex-1'>
          <label className='mb-1 block text-xs text-gray-500'>Latitude</label>
          <input
            type='number'
            step='any'
            placeholder='e.g. 40.7128'
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className='w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
          />
          {errors.lat && (
            <p className='mt-1 text-xs text-red-500'>{errors.lat}</p>
          )}
        </div>

        <div className='flex-1'>
          <label className='mb-1 block text-xs text-gray-500'>Longitude</label>
          <input
            type='number'
            step='any'
            placeholder='e.g. −74.0060'
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            className='w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
          />
          {errors.lon && (
            <p className='mt-1 text-xs text-red-500'>{errors.lon}</p>
          )}
        </div>

        <div className='flex items-end'>
          <button
            type='submit'
            className='rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700'>
            Use location
          </button>
        </div>
      </div>
    </form>
  );
}
