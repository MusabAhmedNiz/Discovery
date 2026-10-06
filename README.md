# Discovery

Find nearby places using OpenStreetMap's Overpass API. Choose your browser location or enter coordinates, adjust the search radius, and browse places sorted by straight-line distance.

## Features

- Browser geolocation with retry and manual-coordinate fallbacks.
- Search radii from 750 metres to 10 kilometres.
- Category filters derived from the returned places.
- Place cards with names, categories, distances, and addresses when available.
- Loading, empty, and API-error states.
- Cached results through TanStack Query; switching categories filters locally without another API request.

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4 · TanStack Query · OpenStreetMap / Overpass

## Run locally

Requires Node.js 20.9+ and a current version of Bun. The repository includes `bun.lock`.

```bash
git clone git@github.com:MusabAhmedNiz/Discovery.git
cd Discovery
bun install --frozen-lockfile
bun run dev
```

Open [localhost:3000](http://localhost:3000), allow location access, or enter coordinates manually when prompted.

**No API key, database, or environment variables are required.** The browser queries the public Overpass endpoint directly. Browser geolocation requires HTTPS on deployed sites; localhost is supported for development.

## How it works

1. `useGeolocation` requests browser coordinates; manual coordinates can override them.
2. `buildOverpassQuery` constructs a query for supported OpenStreetMap node and way categories within the chosen radius.
3. `usePois` requests results, keeps named places with usable coordinates, calculates Haversine distances, and sorts nearest first.
4. TanStack Query caches results by coordinates (rounded to four decimal places) and radius. Results remain fresh for five minutes; unused cache entries are retained for ten minutes.
5. Category selection filters the cached results in the browser.

## Useful commands

```bash
bun run dev                 # Development server
bun run lint                # ESLint
bunx tsc --noEmit            # Type checking
bun run build               # Production build
bun run start               # Run the production build
bun run format              # Format the project with Prettier
```

## Project layout

```text
src/app/page.tsx             Location, radius, and category controls
src/components/              Place cards, grid, manual-coordinate form, query provider
src/hooks/useGeolocation.ts  Browser location state
src/hooks/usePois.ts         Fetching, result transformation, sorting, and caching
src/lib/overpass.ts          Query builder and API request
src/lib/categories.ts        Supported OpenStreetMap categories
src/lib/haversine.ts         Straight-line distance calculation
src/types/                  Coordinates and place types
```

## Deployment and limitations

Deploy as a Next.js application on a compatible host with HTTPS. A public demo URL has not been linked in this repository yet.

- Coverage and address quality depend on local OpenStreetMap contributions.
- Distances are straight-line estimates, not walking or driving routes.
- The public Overpass service can time out or rate-limit requests, especially for large radii in dense areas.
- Queries send the selected coordinates and search radius to the Overpass service.
- The current interface is a list of places; it does not include a map or saved places.
- Automated tests are not configured yet.

## Data attribution

Place data is © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the Open Database License (ODbL). Queries are served by the [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API).
