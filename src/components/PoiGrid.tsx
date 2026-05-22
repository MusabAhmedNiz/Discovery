import type { Poi } from '@/types/poi';
import { PoiCard } from './PoiCard';

interface PoiGridProps {
  pois: Poi[];
}

export function PoiGrid({ pois }: PoiGridProps) {
  if (pois.length === 0) {
    return (
      <p className='py-12 text-center text-sm text-gray-400'>
        No places found nearby. Try increasing the radius or switching category.
      </p>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {pois.map((poi) => (
        <PoiCard key={poi.id} poi={poi} />
      ))}
    </div>
  );
}
