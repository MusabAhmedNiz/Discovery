export interface OsmFilter {
  tagKey: string;
  tagValue: string;
}

export interface Category {
  key: string;
  label: string;
  filters: OsmFilter[];
}

export const CATEGORIES: Category[] = [
  {
    key: 'all',
    label: 'All',
    filters: [
      { tagKey: 'amenity', tagValue: 'restaurant' },
      { tagKey: 'amenity', tagValue: 'cafe' },
      { tagKey: 'amenity', tagValue: 'fast_food' },
      { tagKey: 'amenity', tagValue: 'pharmacy' },
      { tagKey: 'amenity', tagValue: 'hospital' },
      { tagKey: 'amenity', tagValue: 'fuel' },
      { tagKey: 'leisure', tagValue: 'park' },
      { tagKey: 'tourism', tagValue: 'hotel' },
      { tagKey: 'shop', tagValue: 'supermarket' },
      { tagKey: 'shop', tagValue: 'mall' },
    ],
  },
  {
    key: 'food',
    label: 'Food & Drink',
    filters: [
      { tagKey: 'amenity', tagValue: 'restaurant' },
      { tagKey: 'amenity', tagValue: 'cafe' },
      { tagKey: 'amenity', tagValue: 'fast_food' },
    ],
  },
  {
    key: 'coffee',
    label: 'Coffee',
    filters: [{ tagKey: 'amenity', tagValue: 'cafe' }],
  },
  {
    key: 'park',
    label: 'Parks',
    filters: [{ tagKey: 'leisure', tagValue: 'park' }],
  },
  {
    key: 'shop',
    label: 'Shopping',
    filters: [
      { tagKey: 'shop', tagValue: 'supermarket' },
      { tagKey: 'shop', tagValue: 'mall' },
    ],
  },
  {
    key: 'health',
    label: 'Health',
    filters: [
      { tagKey: 'amenity', tagValue: 'pharmacy' },
      { tagKey: 'amenity', tagValue: 'hospital' },
    ],
  },
  {
    key: 'hotel',
    label: 'Hotels',
    filters: [{ tagKey: 'tourism', tagValue: 'hotel' }],
  },
  {
    key: 'fuel',
    label: 'Gas Stations',
    filters: [{ tagKey: 'amenity', tagValue: 'fuel' }],
  },
];

export function getCategoryFilters(key: string): OsmFilter[] {
  return CATEGORIES.find((c) => c.key === key)?.filters ?? CATEGORIES[0].filters;
}

/** Derive a human-readable category label from OSM tags */
export function labelFromTags(tags: Record<string, string>): string {
  const map: Record<string, string> = {
    restaurant: 'Restaurant',
    cafe: 'Cafe',
    fast_food: 'Fast Food',
    pharmacy: 'Pharmacy',
    hospital: 'Hospital',
    fuel: 'Gas Station',
    park: 'Park',
    hotel: 'Hotel',
    supermarket: 'Supermarket',
    mall: 'Shopping Mall',
  };

  const amenity = tags['amenity'];
  const leisure = tags['leisure'];
  const tourism = tags['tourism'];
  const shop = tags['shop'];

  return (
    map[amenity] ??
    map[leisure] ??
    map[tourism] ??
    map[shop] ??
    amenity ??
    leisure ??
    tourism ??
    shop ??
    'Place'
  );
}
