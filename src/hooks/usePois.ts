'use client';

import { useState, useEffect } from 'react';
import type { Poi, OverpassResponse } from '@/types/poi';
import { getCategoryFilters, labelFromTags } from '@/lib/categories';
import { buildOverpassQuery, fetchPois } from '@/lib/overpass';
import { haversine } from '@/lib/haversine';

function deriveAddress(tags: Record<string, string>): string | null {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:city'],
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

export interface UsePoisOptions {
  coords: GeolocationCoordinates | null;
  categoryKey: string;
  radiusMeters: number;
}

export interface UsePoisResult {
  pois: Poi[];
  isLoading: boolean;
  error: string | null;
}

export function usePois({
  coords,
  categoryKey,
  radiusMeters,
}: UsePoisOptions): UsePoisResult {
  const [pois, setPois] = useState<Poi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords) return;

    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const filters = getCategoryFilters(categoryKey);
        const query = buildOverpassQuery(
          coords!.latitude,
          coords!.longitude,
          radiusMeters,
          filters,
        );

        const res = await fetchPois(query, controller.signal);
        if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);

        const data: OverpassResponse = await res.json();

        const results: Poi[] = data.elements
          .map((el) => {
            const lat = el.type === 'node' ? el.lat : el.center?.lat;
            const lon = el.type === 'node' ? el.lon : el.center?.lon;
            if (!lat || !lon || !el.tags?.name) return null;

            return {
              id: el.id,
              type: el.type,
              lat,
              lon,
              name: el.tags.name,
              categoryLabel: labelFromTags(el.tags),
              address: deriveAddress(el.tags),
              distanceKm: haversine(
                coords!.latitude,
                coords!.longitude,
                lat,
                lon,
              ),
              tags: el.tags,
            } satisfies Poi;
          })
          .filter((p): p is Poi => p !== null)
          .sort((a, b) => a.distanceKm - b.distanceKm);

        setPois(results);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message ?? 'Failed to load nearby places.');
      } finally {
        setIsLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [coords, categoryKey, radiusMeters]);

  return { pois, isLoading, error };
}
