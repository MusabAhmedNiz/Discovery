'use client';

import { useState, useCallback } from 'react';
import type { GeoState } from '@/types/geo';

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    coords: null,
    status: 'idle',
    error: null,
  });

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        coords: null,
        status: 'error',
        error: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setState((prev) => ({ ...prev, status: 'requesting', error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: position.coords,
          status: 'granted',
          error: null,
        });
      },
      (err) => {
        const denied = err.code === err.PERMISSION_DENIED;
        setState({
          coords: null,
          status: denied ? 'denied' : 'error',
          error: err.message,
        });
      },
      { maximumAge: 0, timeout: 10_000 },
    );
  }, []);

  return { ...state, request };
}
