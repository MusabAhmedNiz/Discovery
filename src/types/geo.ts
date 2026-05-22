type GeoStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

export interface GeoState {
  coords: GeolocationCoordinates | null;
  status: GeoStatus;
  error: string | null;
}
