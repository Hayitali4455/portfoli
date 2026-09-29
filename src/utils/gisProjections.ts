import proj4 from 'proj4';

// Register standard projections commonly used in Uzbekistan, Central Asia, and Global GIS
export const PROJECTION_DEFINITIONS: Record<string, string> = {
  'EPSG:4326': '+proj=longlat +datum=WGS84 +no_defs',
  'EPSG:3857': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs',
  // UTM zones covering Uzbekistan
  'EPSG:32640': '+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs', // Qoraqalpog'iston / Xorazm g'arbi
  'EPSG:32641': '+proj=utm +zone=41 +datum=WGS84 +units=m +no_defs', // Buxoro, Navoiy, G'arbiy Qashqadaryo
  'EPSG:32642': '+proj=utm +zone=42 +datum=WGS84 +units=m +no_defs', // Qashqadaryo, Samarqand, Toshkent, Surxondaryo, Vodiy
  // Pulkovo 1942 / Gauss-Kruger (with 6-digit zone prefix standard in Post-Soviet Cadastre)
  'EPSG:28410': '+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=10500000 +y_0=0 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs',
  'EPSG:28411': '+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=11500000 +y_0=0 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs',
  'EPSG:28412': '+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=12500000 +y_0=0 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs',
  'EPSG:28413': '+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=13500000 +y_0=0 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs',
  // Pulkovo 1942 / Gauss-Kruger without zone prefix (false easting 500,000)
  'EPSG:28471': '+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs',
  'EPSG:28472': '+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs'
};

// Initialize proj4 definitions once
Object.entries(PROJECTION_DEFINITIONS).forEach(([code, def]) => {
  try {
    proj4.defs(code, def);
  } catch (e) {
    console.warn(`Proj4 def error for ${code}:`, e);
  }
});

export interface CRSOption {
  code: string;
  name: string;
  region: string;
}

export const POPULAR_CRS_OPTIONS: CRSOption[] = [
  { code: 'EPSG:4326', name: 'WGS 84 (Gradus)', region: 'Standart GPS / Web (Lat/Lng)' },
  { code: 'EPSG:32642', name: 'UTM Zone 42N (WGS 84)', region: "O'zbekiston Sharqiy (Qashqadaryo, Samarqand, Toshkent)" },
  { code: 'EPSG:32641', name: 'UTM Zone 41N (WGS 84)', region: "O'zbekiston G'arbiy (Buxoro, Navoiy, G'arbiy Qashqadaryo)" },
  { code: 'EPSG:28411', name: 'Pulkovo 1942 / GK 11', region: 'SK-42 Kadastr (11-zona, Buxoro/Qashqadaryo)' },
  { code: 'EPSG:28412', name: 'Pulkovo 1942 / GK 12', region: 'SK-42 Kadastr (12-zona, Samarqand/Toshkent)' },
  { code: 'EPSG:3857', name: 'Web Mercator', region: 'Metr (Google, OSM, Esri standart)' },
  { code: 'EPSG:32640', name: 'UTM Zone 40N (WGS 84)', region: "Qoraqalpog'iston / Xorazm" }
];

/**
 * Extracts sample coordinates from GeoJSON to detect geometry coordinate range
 */
export function extractSampleCoordinates(geojson: any): [number, number] | null {
  if (!geojson) return null;

  let sample: [number, number] | null = null;

  const findCoord = (item: any) => {
    if (sample) return;
    if (Array.isArray(item)) {
      if (typeof item[0] === 'number' && typeof item[1] === 'number') {
        sample = [item[0], item[1]];
        return;
      }
      for (const sub of item) {
        findCoord(sub);
        if (sample) return;
      }
    }
  };

  if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
    for (const f of geojson.features) {
      if (f?.geometry?.coordinates) {
        findCoord(f.geometry.coordinates);
        if (sample) break;
      }
    }
  } else if (geojson.type === 'Feature' && geojson.geometry?.coordinates) {
    findCoord(geojson.geometry.coordinates);
  } else if (geojson.coordinates) {
    findCoord(geojson.coordinates);
  }

  return sample;
}

/**
 * Automatically detects whether coordinates are in degrees (WGS 84) or projected meters,
 * and identifies the most likely Uzbekistan or global projection.
 */
export function detectCoordinateSystem(sampleCoord: [number, number], prjString?: string): {
  crs: string;
  isProjected: boolean;
  isSwappedLatLng: boolean;
  description: string;
} {
  let [x, y] = sampleCoord;

  // Handle case where X and Y are inverted (e.g. Northing 4.3M in X, Easting 500k in Y)
  let swapped = false;
  if (x > 3000000 && y < 1000000) {
    [x, y] = [y, x];
    swapped = true;
  }

  // Check if coordinates are standard geographic degrees
  if (Math.abs(x) <= 180 && Math.abs(y) <= 90) {
    // Check if user has [lat, lng] instead of [lng, lat] for Uzbekistan
    // Uzbekistan latitude: ~37 to ~45. Longitude: ~56 to ~73
    if (x >= 36 && x <= 46 && y >= 55 && y <= 75) {
      return {
        crs: 'EPSG:4326',
        isProjected: false,
        isSwappedLatLng: true,
        description: 'WGS 84 (Kenglik va Uzunlik teskari almashtirilgan)'
      };
    }

    return {
      crs: 'EPSG:4326',
      isProjected: false,
      isSwappedLatLng: false,
      description: 'WGS 84 (Standart Geografik Gradus)'
    };
  }

  // If user provided a .prj text in shapefile
  if (prjString && typeof prjString === 'string') {
    const prjLower = prjString.toLowerCase();
    if (prjLower.includes('utm') && prjLower.includes('42')) {
      return { crs: 'EPSG:32642', isProjected: true, isSwappedLatLng: swapped, description: 'UTM Zone 42N (PRJ faylidan)' };
    }
    if (prjLower.includes('utm') && prjLower.includes('41')) {
      return { crs: 'EPSG:32641', isProjected: true, isSwappedLatLng: swapped, description: 'UTM Zone 41N (PRJ faylidan)' };
    }
    if (prjLower.includes('pulkovo') || prjLower.includes('1942') || prjLower.includes('krassovsky') || prjLower.includes('sk-42')) {
      if (x >= 11000000 && x < 12000000) {
        return { crs: 'EPSG:28411', isProjected: true, isSwappedLatLng: swapped, description: 'Pulkovo 1942 / GK Zone 11' };
      }
      if (x >= 12000000 && x < 13000000) {
        return { crs: 'EPSG:28412', isProjected: true, isSwappedLatLng: swapped, description: 'Pulkovo 1942 / GK Zone 12' };
      }
    }
    if (prjLower.includes('3857') || prjLower.includes('mercator') || prjLower.includes('pseudomercator')) {
      return { crs: 'EPSG:3857', isProjected: true, isSwappedLatLng: swapped, description: 'Web Mercator (PRJ faylidan)' };
    }
  }

  // Heuristic detection based on coordinates values:
  // 1. Gauss-Kruger (SK-42 / Pulkovo-1942) with zone prefix (e.g. 11,500,000 or 12,500,000)
  if (x >= 10000000 && x < 14000000 && y >= 3500000 && y <= 5500000) {
    const zone = Math.floor(x / 1000000);
    const crsCode = `EPSG:284${zone}`;
    return {
      crs: crsCode,
      isProjected: true,
      isSwappedLatLng: swapped,
      description: `Pulkovo 1942 / Gauss-Kruger ${zone}-zona (Kadastr koordinatalari)`
    };
  }

  // 2. UTM zones 41N and 42N (Uzbekistan standard: Easting 150k - 850k, Northing 4.0M - 5.0M)
  if (x >= 100000 && x <= 950000 && y >= 3500000 && y <= 5500000) {
    // Try both UTM 41N and UTM 42N and evaluate which yields the most accurate Uzbekistan location
    try {
      const p41 = proj4('EPSG:32641', 'EPSG:4326', [x, y]);
      const p42 = proj4('EPSG:32642', 'EPSG:4326', [x, y]);

      const p41InUz = p41[0] >= 56 && p41[0] <= 73 && p41[1] >= 37 && p41[1] <= 46;
      const p42InUz = p42[0] >= 56 && p42[0] <= 73 && p42[1] >= 37 && p42[1] <= 46;

      // Qashqadaryo is around 65.2° - 67.5° Longitude and 38.0° - 39.5° Latitude
      // UTM 42N central meridian is 69° E (covers 66° - 72° E, west border around 65.5°)
      // UTM 41N central meridian is 63° E (covers 60° - 66° E, east border around 66.5°)
      if (p42InUz && !p41InUz) {
        return { crs: 'EPSG:32642', isProjected: true, isSwappedLatLng: swapped, description: 'UTM Zone 42N (WGS 84)' };
      }
      if (p41InUz && !p42InUz) {
        return { crs: 'EPSG:32641', isProjected: true, isSwappedLatLng: swapped, description: 'UTM Zone 41N (WGS 84)' };
      }
      if (p41InUz && p42InUz) {
        // If x < 400,000, in UTM 42 this gives 65° - 67° (Qashqadaryo / Qarshi / Shahrisabz)
        // In UTM 41, x < 400,000 gives 61° - 62° (Bukhara/Turkmenistan border)
        if (x < 450000) {
          return { crs: 'EPSG:32642', isProjected: true, isSwappedLatLng: swapped, description: 'UTM Zone 42N (Sharqiy O\'zbekiston, Qashqadaryo)' };
        } else {
          return { crs: 'EPSG:32641', isProjected: true, isSwappedLatLng: swapped, description: 'UTM Zone 41N (G\'arbiy O\'zbekiston, Qashqadaryo g\'arbi)' };
        }
      }
    } catch {
      // fallback
    }

    return { crs: 'EPSG:32642', isProjected: true, isSwappedLatLng: swapped, description: 'UTM Zone 42N (WGS 84)' };
  }

  // 3. Web Mercator (EPSG:3857)
  if (x >= 5000000 && x <= 9000000 && y >= 3500000 && y <= 6500000) {
    return {
      crs: 'EPSG:3857',
      isProjected: true,
      isSwappedLatLng: swapped,
      description: 'Web Mercator (EPSG:3857)'
    };
  }

  // Default fallback for meters in Uzbekistan
  return {
    crs: 'EPSG:32642',
    isProjected: true,
    isSwappedLatLng: swapped,
    description: 'UTM Zone 42N (Taxminiy proeksiya)'
  };
}

/**
 * Transforms a single coordinate pair [x, y] to [lng, lat] in EPSG:4326
 */
export function transformCoordinate(
  coord: [number, number],
  fromCRS: string,
  swapXY = false
): [number, number] {
  let [x, y] = coord;
  if (swapXY) {
    [x, y] = [y, x];
  }

  if (fromCRS === 'EPSG:4326') {
    return [x, y];
  }

  try {
    const result = proj4(fromCRS, 'EPSG:4326', [x, y]);
    // Ensure coordinates are valid numbers and inside world boundaries
    if (typeof result[0] === 'number' && typeof result[1] === 'number' && !isNaN(result[0]) && !isNaN(result[1])) {
      return [result[0], result[1]];
    }
  } catch (err) {
    console.error(`Proj4 transformation failed from ${fromCRS} to EPSG:4326 for [${x}, ${y}]:`, err);
  }

  return [x, y];
}

/**
 * Deep clones and reprojects all coordinates of a GeoJSON object from fromCRS to EPSG:4326
 */
export function reprojectGeoJSON(geojson: any, fromCRS: string, swapXY = false): any {
  if (!geojson) return geojson;

  const transformArray = (coords: any): any => {
    if (!Array.isArray(coords)) return coords;
    if (coords.length >= 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      const transformed = transformCoordinate([coords[0], coords[1]], fromCRS, swapXY);
      return coords.length > 2 ? [transformed[0], transformed[1], ...coords.slice(2)] : transformed;
    }
    return coords.map(transformArray);
  };

  const transformGeometry = (geom: any): any => {
    if (!geom || !geom.coordinates) return geom;
    return {
      ...geom,
      coordinates: transformArray(geom.coordinates)
    };
  };

  const transformFeature = (feature: any): any => {
    if (!feature) return feature;
    return {
      ...feature,
      geometry: transformGeometry(feature.geometry)
    };
  };

  if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
    return {
      ...geojson,
      features: geojson.features.map(transformFeature)
    };
  } else if (geojson.type === 'Feature') {
    return transformFeature(geojson);
  } else if (geojson.type && geojson.coordinates) {
    return transformGeometry(geojson);
  }

  return geojson;
}

/**
 * High-level helper: Analyzes GeoJSON, detects projection, and converts to WGS-84 if needed.
 * Returns both the reprojected GeoJSON and the original raw GeoJSON for future CRS switching.
 */
export function ensureGeoJSONInWGS84(geojson: any, prjString?: string): {
  geoJSON: any;
  originalGeoJSON: any;
  detectedCRS: string;
  wasReprojected: boolean;
  description: string;
} {
  const sample = extractSampleCoordinates(geojson);

  if (!sample) {
    return {
      geoJSON: geojson,
      originalGeoJSON: geojson,
      detectedCRS: 'EPSG:4326',
      wasReprojected: false,
      description: 'WGS 84 (Bo\'sh yoki koordinata aniqlanmadi)'
    };
  }

  const { crs, isProjected, isSwappedLatLng, description } = detectCoordinateSystem(sample, prjString);

  if (!isProjected && !isSwappedLatLng) {
    return {
      geoJSON: geojson,
      originalGeoJSON: geojson,
      detectedCRS: 'EPSG:4326',
      wasReprojected: false,
      description
    };
  }

  // Coordinate transformation is needed
  console.log(`Reprojecting layer from ${crs} (${description}) to EPSG:4326...`);
  const reprojected = reprojectGeoJSON(geojson, crs, isSwappedLatLng);

  return {
    geoJSON: reprojected,
    originalGeoJSON: geojson,
    detectedCRS: crs,
    wasReprojected: true,
    description
  };
}
