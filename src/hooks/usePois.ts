'use client';

import { useQuery } from '@tanstack/react-query';
import type { Poi, OverpassResponse } from '@/types/poi';
import type { Coords } from '@/types/geo';
import { ALL_POI_FILTERS, labelFromTags } from '@/lib/categories';
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

async function fetchAllPois(
  coords: Coords,
  radiusMeters: number,
  signal: AbortSignal,
): Promise<Poi[]> {
  const { latitude: lat, longitude: lon } = coords;
  // Always fetch everything — category filtering happens client-side
  const query = buildOverpassQuery(lat, lon, radiusMeters, ALL_POI_FILTERS);

  const res = await fetchPois(query, signal);
  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);

  const data: OverpassResponse = await res.json();

  return data.elements
    .map((el) => {
      const lat2 = el.type === 'node' ? el.lat : el.center?.lat;
      const lon2 = el.type === 'node' ? el.lon : el.center?.lon;
      if (!lat2 || !lon2 || !el.tags?.name) return null;

      return {
        id: el.id,
        type: el.type,
        lat: lat2,
        lon: lon2,
        name: el.tags.name,
        categoryLabel: labelFromTags(el.tags),
        address: deriveAddress(el.tags),
        distanceKm: haversine(lat, lon, lat2, lon2),
        tags: el.tags,
      } satisfies Poi;
    })
    .filter((p): p is Poi => p !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export interface UsePoisOptions {
  coords: Coords | null;
  radiusMeters: number;
}

export function usePois({ coords, radiusMeters }: UsePoisOptions) {
  return useQuery({
    // Key includes lat/lon/radius — category is intentionally excluded
    // because we filter the cached data client-side instead of re-fetching
    queryKey: [
      'pois',
      coords?.latitude.toFixed(4),
      coords?.longitude.toFixed(4),
      radiusMeters,
    ],
    queryFn: ({ signal }) => fetchAllPois(coords!, radiusMeters, signal),
    enabled: !!coords,
  });
}
