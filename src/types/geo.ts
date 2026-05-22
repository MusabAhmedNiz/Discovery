export type GeoStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

export interface GeoState {
  coords: GeolocationCoordinates | null;
  status: GeoStatus;
  error: string | null;
}

/** Minimal coordinate pair — used as the single source of truth for fetching.
 *  Either comes from the Geolocation API or entered manually by the user. */
export interface Coords {
  latitude: number;
  longitude: number;
}
