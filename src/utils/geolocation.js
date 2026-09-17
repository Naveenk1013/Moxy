/**
 * Moxy User Geolocation Utility
 * Manages automatic device geolocation detection, reverse geocoding to human-readable
 * city/locality names, local caching, and custom manual location overrides.
 */

const STORAGE_KEY = 'moxy_user_location_v1';

export const DEFAULT_LOCATION = {
  city: 'Hyderabad',
  locality: 'Hafeezpet',
  state: 'Telangana',
  country: 'India',
  address: 'IIHM Hyderabad, Hafeezpet',
  latitude: 17.4937,
  longitude: 78.3428,
  source: 'default',
  updatedAt: Date.now(),
};

export const POPULAR_LOCATIONS = [
  {
    city: 'Hyderabad',
    locality: 'Hafeezpet (IIHM Campus)',
    address: 'IIHM Hyderabad, Hafeezpet, Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.4937,
    longitude: 78.3428,
    badge: 'IIHM Flagship Hub',
  },
  {
    city: 'Secunderabad',
    locality: 'Twin City Railway Hub',
    address: 'Secunderabad Jn, Telangana',
    state: 'Telangana',
    country: 'India',
    latitude: 17.4399,
    longitude: 78.4983,
    badge: 'Transit Hub',
  },
  {
    city: 'Bengaluru',
    locality: 'Indiranagar / MG Road',
    address: 'Bengaluru, Karnataka',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    badge: 'IIHM Campus',
  },
  {
    city: 'New Delhi',
    locality: 'Connaught Place / South Ex',
    address: 'New Delhi, Delhi NCR',
    state: 'Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    badge: 'IIHM Campus',
  },
  {
    city: 'Mumbai',
    locality: 'Bandra / Marine Drive',
    address: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    country: 'India',
    latitude: 19.076,
    longitude: 72.8777,
    badge: 'Financial Capital',
  },
  {
    city: 'Kolkata',
    locality: 'Salt Lake Sector V',
    address: 'Salt Lake, Kolkata (IIHM Global HQ)',
    state: 'West Bengal',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
    badge: 'IIHM Global HQ',
  },
  {
    city: 'Goa',
    locality: 'Panaji / Candolim',
    address: 'Goa, India',
    state: 'Goa',
    country: 'India',
    latitude: 15.2993,
    longitude: 74.124,
    badge: 'IIHM Campus',
  },
  {
    city: 'Pune',
    locality: 'Viman Nagar / Koregaon Park',
    address: 'Pune, Maharashtra',
    state: 'Maharashtra',
    country: 'India',
    latitude: 18.5204,
    longitude: 73.8567,
    badge: 'IIHM Campus',
  },
  {
    city: 'London',
    locality: 'Ealing (Univ of West London)',
    address: 'London, United Kingdom',
    state: 'England',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    badge: 'UWL Partner',
  },
];

/**
 * Get active user location from local storage or fallback to default
 */
export function getStoredLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.city) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read cached location:', err);
  }
  return DEFAULT_LOCATION;
}

/**
 * Save user location object to localStorage
 */
export function saveLocation(loc) {
  try {
    const data = {
      ...loc,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn('Failed to save location to cache:', err);
    return loc;
  }
}

/**
 * Reverse geocode latitude/longitude coordinates into a clean address & city
 */
export async function reverseGeocodeCoords(lat, lon) {
  let locationResult = null;

  // Primary: OpenStreetMap Nominatim reverse geocoder
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
        signal: AbortSignal.timeout(6000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city =
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.county ||
        addr.state_district ||
        addr.state ||
        'Current City';
      const locality =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.quarter ||
        addr.road ||
        '';
      const state = addr.state || '';
      const country = addr.country || 'India';

      const shortAddress = [locality, city, state]
        .filter(Boolean)
        .join(', ');

      locationResult = {
        city,
        locality: locality || city,
        state,
        country,
        address: shortAddress || data.display_name || `${city}, ${country}`,
        latitude: parseFloat(lat.toFixed(4)),
        longitude: parseFloat(lon.toFixed(4)),
        source: 'gps',
      };
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode failed, trying fallback:', err);
  }

  // Fallback: BigDataCloud free client reverse geocoding API
  if (!locationResult) {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || 'Hyderabad';
        const locality = data.locality || '';
        const state = data.principalSubdivision || '';
        const country = data.countryName || 'India';

        const shortAddress = [locality, city, state]
          .filter(Boolean)
          .join(', ');

        locationResult = {
          city,
          locality: locality || city,
          state,
          country,
          address: shortAddress || `${city}, ${country}`,
          latitude: parseFloat(lat.toFixed(4)),
          longitude: parseFloat(lon.toFixed(4)),
          source: 'gps',
        };
      }
    } catch (err) {
      console.warn('BigDataCloud reverse geocode failed:', err);
    }
  }

  // Final fallback with raw coordinates
  if (!locationResult) {
    locationResult = {
      city: 'Current Location',
      locality: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      state: '',
      country: '',
      address: `Coordinates (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
      latitude: parseFloat(lat.toFixed(4)),
      longitude: parseFloat(lon.toFixed(4)),
      source: 'gps',
    };
  }

  return locationResult;
}

/**
 * Trigger browser GPS location request and reverse geocode
 */
export async function detectBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const loc = await reverseGeocodeCoords(lat, lon);
          const saved = saveLocation(loc);
          resolve(saved);
        } catch (err) {
          reject(err);
        }
      },
      (err) => {
        let msg = 'Unable to retrieve your location.';
        if (err.code === 1) msg = 'Location permission was denied.';
        else if (err.code === 2) msg = 'Location position is unavailable.';
        else if (err.code === 3) msg = 'Location request timed out.';
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}

/**
 * Manually set user location from presets or user input
 */
export function setManualLocation(customLoc) {
  let locationData;
  if (typeof customLoc === 'string') {
    const matchedPreset = POPULAR_LOCATIONS.find(
      (p) => p.city.toLowerCase() === customLoc.toLowerCase()
    );
    if (matchedPreset) {
      locationData = { ...matchedPreset, source: 'manual' };
    } else {
      locationData = {
        city: customLoc.trim(),
        locality: customLoc.trim(),
        state: '',
        country: 'India',
        address: customLoc.trim(),
        latitude: null,
        longitude: null,
        source: 'manual',
      };
    }
  } else {
    locationData = {
      ...customLoc,
      source: 'manual',
    };
  }

  return saveLocation(locationData);
}
