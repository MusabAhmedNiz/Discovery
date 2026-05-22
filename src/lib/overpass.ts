import type { OsmFilter } from './categories';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export function buildOverpassQuery(
  lat: number,
  lon: number,
  radiusMeters: number,
  filters: OsmFilter[],
): string {
  const around = `(around:${radiusMeters},${lat},${lon})`;

  const parts = filters.flatMap((f) => [
    `  node["${f.tagKey}"="${f.tagValue}"]${around};`,
    `  way["${f.tagKey}"="${f.tagValue}"]${around};`,
  ]);

  return `[out:json][timeout:15];\n(\n${parts.join('\n')}\n);\nout center;`;
}

export async function fetchPois(
  query: string,
  signal: AbortSignal,
): Promise<Response> {
  return fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
    signal,
  });
}
