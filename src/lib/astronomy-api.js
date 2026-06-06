import axios from 'axios';

const EXOPLANET_API = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
const NASA_API_KEY = import.meta.env.PUBLIC_NASA_API_KEY || 'demo';

// Fetch exoplanets from NASA Exoplanet Archive
export async function getExoplanets() {
  try {
    const query = `SELECT pl_name, hostname, pl_bmassj, pl_radj, pl_orbper, sy_dist
                   FROM ps
                   WHERE pl_name IS NOT NULL
                   LIMIT 100`;

    const response = await axios.get(EXOPLANET_API, {
      params: {
        query: query,
        format: 'json'
      }
    });

    return response.data || [];
  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    // Return mock data for demo purposes
    return getMockExoplanets();
  }
}

// Fetch Astronomy Picture of the Day
export async function getAPOD() {
  try {
    const response = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching APOD:', error);
    return null;
  }
}

// Mock exoplanet data for demo/fallback
function getMockExoplanets() {
  return [
    {
      pl_name: 'Proxima Centauri b',
      hostname: 'Proxima Centauri',
      pl_bmassj: 0.27,
      pl_radj: 0.14,
      pl_orbper: 11.186,
      sy_dist: 1.3
    },
    {
      pl_name: 'TRAPPIST-1e',
      hostname: 'TRAPPIST-1',
      pl_bmassj: 0.62,
      pl_radj: 0.92,
      pl_orbper: 6.099,
      sy_dist: 12.1
    },
    {
      pl_name: 'Kepler-452b',
      hostname: 'Kepler-452',
      pl_bmassj: 5.0,
      pl_radj: 1.6,
      pl_orbper: 384.8,
      sy_dist: 430
    },
    {
      pl_name: 'WASP-12b',
      hostname: 'WASP-12',
      pl_bmassj: 1.47,
      pl_radj: 1.79,
      pl_orbper: 1.0914,
      sy_dist: 206.5
    },
    {
      pl_name: 'HD 209458 b',
      hostname: 'HD 209458',
      pl_bmassj: 0.69,
      pl_radj: 1.38,
      pl_orbper: 3.52,
      sy_dist: 47.5
    }
  ];
}

// Stellar data helpers
export function getHabitabilityIndex(planet) {
  // Simplified habitability calculation
  if (!planet.pl_radj) return 0;

  const radius = planet.pl_radj;
  if (radius < 0.5 || radius > 2) return 0;

  const orbitalDistance = planet.pl_orbsmax || 1;
  const earthDistance = 1;

  const distanceFactor = Math.abs(orbitalDistance - earthDistance);
  return Math.max(0, 1 - distanceFactor);
}
