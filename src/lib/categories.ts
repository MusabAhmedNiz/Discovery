export interface OsmFilter {
  tagKey: string;
  tagValue: string;
}

/**
 * The OSM filters used when querying the Overpass API.
 * This fetches all relevant POI types in one request.
 * Category pills are derived from the returned data, not from this list.
 */
export const ALL_POI_FILTERS: OsmFilter[] = [
  { tagKey: 'amenity', tagValue: 'restaurant' },
  { tagKey: 'amenity', tagValue: 'cafe' },
  { tagKey: 'amenity', tagValue: 'fast_food' },
  { tagKey: 'amenity', tagValue: 'bar' },
  { tagKey: 'amenity', tagValue: 'pub' },
  { tagKey: 'amenity', tagValue: 'pharmacy' },
  { tagKey: 'amenity', tagValue: 'hospital' },
  { tagKey: 'amenity', tagValue: 'fuel' },
  { tagKey: 'amenity', tagValue: 'bank' },
  { tagKey: 'amenity', tagValue: 'atm' },
  { tagKey: 'leisure', tagValue: 'park' },
  { tagKey: 'tourism', tagValue: 'hotel' },
  { tagKey: 'shop', tagValue: 'supermarket' },
  { tagKey: 'shop', tagValue: 'mall' },
  { tagKey: 'shop', tagValue: 'convenience' },
];

/** Derive a human-readable category label from a POI's OSM tags. */
export function labelFromTags(tags: Record<string, string>): string {
  const map: Record<string, string> = {
    restaurant: 'Restaurant',
    cafe: 'Cafe',
    fast_food: 'Fast Food',
    bar: 'Bar',
    pub: 'Pub',
    pharmacy: 'Pharmacy',
    hospital: 'Hospital',
    fuel: 'Gas Station',
    bank: 'Bank',
    atm: 'ATM',
    park: 'Park',
    hotel: 'Hotel',
    supermarket: 'Supermarket',
    mall: 'Shopping Mall',
    convenience: 'Convenience Store',
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
