import type { Poi } from '@/types/poi';

interface PoiCardProps {
  poi: Poi;
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function PoiCard({ poi }: PoiCardProps) {
  return (
    <div className='flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md'>
      <div className='mb-3 flex items-start justify-between gap-2'>
        <span className='text-xs text-gray-400'>{poi.categoryLabel}</span>
        <span className='shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600'>
          {formatDistance(poi.distanceKm)}
        </span>
      </div>

      <div>
        <p className='text-sm font-semibold text-gray-900'>{poi.name}</p>
        {poi.address && (
          <p className='mt-1 text-xs text-gray-500'>{poi.address}</p>
        )}
      </div>
    </div>
  );
}
