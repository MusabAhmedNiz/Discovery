export interface Poi {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat: number;
  lon: number;
  name: string;
  categoryLabel: string;
  address: string | null;
  distanceKm: number;
  tags: Record<string, string>;
}

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export interface OverpassResponse {
  elements: OverpassElement[];
}
