import { kml } from '@tmcw/togeojson';
import shp, { parseShp, parseDbf, combine } from 'shpjs';
import JSZip from 'jszip';
import { ensureGeoJSONInWGS84 } from './gisProjections';

export interface ParsedGISLayer {
  name: string;
  format: 'geojson' | 'kml' | 'kmz' | 'shp' | 'shapefile-zip';
  geoJSON: any;
  originalGeoJSON?: any;
  crs?: string;
  crsDescription?: string;
  wasReprojected?: boolean;
  featureCount: number;
  geometryTypes: string[];
  bounds?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  center?: [number, number]; // [lat, lng]
  attributeFields: string[];
  error?: string;
}

/**
 * Calculates bbox, center, featureCount, and attribute fields from a GeoJSON
 */
export function calculateGeoJSONStats(geojson: any) {
  let minLat = 90;
  let maxLat = -90;
  let minLng = 180;
  let maxLng = -180;
  let count = 0;
  const geomTypes = new Set<string>();
  const fields = new Set<string>();

  const processCoordinates = (coords: any, type: string) => {
    geomTypes.add(type);
    if (!coords) return;

    const traverse = (c: any) => {
      if (Array.isArray(c)) {
        if (typeof c[0] === 'number' && typeof c[1] === 'number') {
          const lng = c[0];
          const lat = c[1];
          if (!isNaN(lat) && !isNaN(lng)) {
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
          }
        } else {
          c.forEach(traverse);
        }
      }
    };

    traverse(coords);
  };

  const processFeature = (feature: any) => {
    if (!feature) return;
    count++;
    if (feature.properties && typeof feature.properties === 'object') {
      Object.keys(feature.properties).forEach((k) => fields.add(k));
    }
    if (feature.geometry && feature.geometry.coordinates) {
      processCoordinates(feature.geometry.coordinates, feature.geometry.type);
    }
  };

  if (geojson?.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
    geojson.features.forEach(processFeature);
  } else if (geojson?.type === 'Feature') {
    processFeature(geojson);
  } else if (geojson?.coordinates && geojson?.type) {
    count = 1;
    processCoordinates(geojson.coordinates, geojson.type);
  }

  const hasValidBounds = minLat <= maxLat && minLng <= maxLng && minLat >= -90 && maxLat <= 90;
  const center: [number, number] = hasValidBounds
    ? [(minLat + maxLat) / 2, (minLng + maxLng) / 2]
    : [41.311, 69.24];

  return {
    featureCount: count,
    geometryTypes: Array.from(geomTypes),
    attributeFields: Array.from(fields),
    bounds: hasValidBounds ? ([minLng, minLat, maxLng, maxLat] as [number, number, number, number]) : undefined,
    center
  };
}

/**
 * Parses KML text into GeoJSON
 */
export function parseKML(kmlText: string, fileName: string): ParsedGISLayer {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
  const parserError = xmlDoc.getElementsByTagName('parsererror');
  if (parserError.length > 0) {
    throw new Error('KML fayli XML sintaksis xatolariga ega.');
  }

  const rawGeojson = kml(xmlDoc);
  const { geoJSON, originalGeoJSON, detectedCRS, wasReprojected, description } = ensureGeoJSONInWGS84(rawGeojson);
  const stats = calculateGeoJSONStats(geoJSON);

  return {
    name: fileName,
    format: 'kml',
    geoJSON,
    originalGeoJSON,
    crs: detectedCRS,
    crsDescription: description,
    wasReprojected,
    ...stats
  };
}

/**
 * Parses KMZ (zipped KML) into GeoJSON using JSZip (avoiding any but-unzip bugs)
 */
export async function parseKMZ(buffer: ArrayBuffer, fileName: string): Promise<ParsedGISLayer> {
  const zip = await JSZip.loadAsync(buffer);

  // Find .kml file inside zip (ignoring macOS metadata folders)
  const kmlFile = Object.values(zip.files).find(
    (f) => !f.dir && !f.name.startsWith('__MACOSX/') && f.name.toLowerCase().endsWith('.kml')
  );

  if (!kmlFile) {
    throw new Error('KMZ arxivida .kml fayl topilmadi.');
  }

  const kmlText = await kmlFile.async('text');
  const parsed = parseKML(kmlText, fileName);
  parsed.format = 'kmz';
  return parsed;
}

/**
 * Parses a ZIP archive containing ESRI Shapefile components (.shp, .dbf, .prj, .cpg)
 * Uses JSZip directly to bypass shpjs internal `but-unzip` module and prevent `but-unzip~3` error.
 * Automatically detects CRS and reprojects into WGS-84 (EPSG:4326) for immediate Leaflet display.
 */
export async function parseShapefileZip(buffer: ArrayBuffer, fileName: string): Promise<ParsedGISLayer> {
  const zip = await JSZip.loadAsync(buffer);

  // Filter out system files and directories
  const validFileEntries = Object.entries(zip.files).filter(
    ([path, file]) => !file.dir && !path.includes('__MACOSX/') && !path.endsWith('/.DS_Store')
  );

  const filePaths = validFileEntries.map(([path]) => path);

  // Find all .shp files in the archive
  const shpFilePaths = filePaths.filter((p) => p.toLowerCase().endsWith('.shp'));

  if (shpFilePaths.length === 0) {
    // Check if user uploaded a zip containing .geojson or .json or .kml
    const geojsonPath = filePaths.find((p) => p.toLowerCase().endsWith('.geojson') || p.toLowerCase().endsWith('.json'));
    if (geojsonPath) {
      const text = await zip.files[geojsonPath].async('text');
      const rawGeoJSON = JSON.parse(text);
      const { geoJSON, originalGeoJSON, detectedCRS, wasReprojected, description } = ensureGeoJSONInWGS84(rawGeoJSON);
      const stats = calculateGeoJSONStats(geoJSON);
      return {
        name: fileName,
        format: 'geojson',
        geoJSON,
        originalGeoJSON,
        crs: detectedCRS,
        crsDescription: description,
        wasReprojected,
        ...stats
      };
    }

    const kmlPath = filePaths.find((p) => p.toLowerCase().endsWith('.kml'));
    if (kmlPath) {
      const text = await zip.files[kmlPath].async('text');
      const parsed = parseKML(text, fileName);
      return parsed;
    }

    throw new Error("Arxiv ichida .shp (Shapefile) yoki .kml / .geojson fayli topilmadi. Iltimos standart Shapefile arxivini yuklang.");
  }

  const allFeatures: any[] = [];
  let foundPrjText: string | undefined = undefined;

  for (const shpPath of shpFilePaths) {
    const basePath = shpPath.slice(0, -4);

    // Case-insensitive matching for companion files (.dbf, .prj, .cpg)
    const findCompanion = (ext: string) => {
      const target = (basePath + ext).toLowerCase();
      const match = filePaths.find((p) => p.toLowerCase() === target);
      return match ? zip.files[match] : null;
    };

    const shpFile = zip.files[shpPath];
    const dbfFile = findCompanion('.dbf');
    const prjFile = findCompanion('.prj');
    const cpgFile = findCompanion('.cpg');

    const shpBuffer = await shpFile.async('arraybuffer');
    const dbfBuffer = dbfFile ? await dbfFile.async('arraybuffer') : undefined;
    const prjText = prjFile ? await prjFile.async('text') : undefined;
    const cpgText = cpgFile ? await cpgFile.async('text') : undefined;

    if (prjText) {
      foundPrjText = prjText;
    }

    try {
      const parsed = await (shp as any)({
        shp: shpBuffer,
        dbf: dbfBuffer,
        prj: prjText,
        cpg: cpgText
      });

      if (parsed) {
        if (parsed.type === 'FeatureCollection' && Array.isArray(parsed.features)) {
          allFeatures.push(...parsed.features);
        } else if (parsed.type === 'Feature') {
          allFeatures.push(parsed);
        } else if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            if (item?.features) allFeatures.push(...item.features);
          });
        }
      }
    } catch (parseErr) {
      // Fallback: manually parse geometry and attributes if combined call fails
      console.warn("Retrying with manual parseShp + parseDbf for:", shpPath, parseErr);
      const geometries = (parseShp as any)(shpBuffer, prjText);
      let attributes: any[] = [];
      if (dbfBuffer) {
        try {
          attributes = (parseDbf as any)(dbfBuffer, cpgText);
        } catch {
          attributes = [];
        }
      }
      const combined = (combine as any)([geometries, attributes]);
      if (combined?.features) {
        allFeatures.push(...combined.features);
      }
    }
  }

  const rawFinalGeoJSON = {
    type: 'FeatureCollection',
    features: allFeatures
  };

  // Reproject to WGS-84 (EPSG:4326) if coordinates are in UTM/Gauss-Kruger/Mercator
  const { geoJSON, originalGeoJSON, detectedCRS, wasReprojected, description } = ensureGeoJSONInWGS84(
    rawFinalGeoJSON,
    foundPrjText
  );

  const stats = calculateGeoJSONStats(geoJSON);

  return {
    name: fileName,
    format: 'shapefile-zip',
    geoJSON,
    originalGeoJSON,
    crs: detectedCRS,
    crsDescription: description,
    wasReprojected,
    ...stats
  };
}

/**
 * Parses raw .shp file (without companion .dbf or .zip)
 * Automatically detects whether coordinates are UTM (e.g. Qashqadaryo UTM 41/42) or Gauss-Kruger,
 * and reprojects to WGS-84 so features immediately show on the map!
 */
export async function parseRawShp(buffer: ArrayBuffer, fileName: string): Promise<ParsedGISLayer> {
  let rawGeoJSON: any;

  try {
    rawGeoJSON = await (shp as any)({ shp: buffer });
  } catch {
    const geometries = (parseShp as any)(buffer);
    rawGeoJSON = (combine as any)([geometries, []]);
  }

  if (Array.isArray(rawGeoJSON)) {
    const allFeatures: any[] = [];
    rawGeoJSON.forEach((g) => {
      if (g?.features) allFeatures.push(...g.features);
    });
    rawGeoJSON = { type: 'FeatureCollection', features: allFeatures };
  }

  // Detect and reproject coordinates (e.g., UTM 41N/42N, Gauss-Kruger, etc.)
  const { geoJSON, originalGeoJSON, detectedCRS, wasReprojected, description } = ensureGeoJSONInWGS84(rawGeoJSON);

  const stats = calculateGeoJSONStats(geoJSON);

  return {
    name: fileName,
    format: 'shp',
    geoJSON,
    originalGeoJSON,
    crs: detectedCRS,
    crsDescription: description,
    wasReprojected,
    ...stats
  };
}

/**
 * Master parser for any GIS file (.geojson, .json, .kml, .kmz, .shp, .zip)
 * Fully hardened against corrupted or non-standard zip files and coordinate system mismatches.
 */
export async function parseGISFile(file: File): Promise<ParsedGISLayer> {
  const ext = file.name.toLowerCase().split('.').pop() || '';

  if (ext === 'geojson' || ext === 'json') {
    const text = await file.text();
    const rawGeojson = JSON.parse(text);
    const { geoJSON, originalGeoJSON, detectedCRS, wasReprojected, description } = ensureGeoJSONInWGS84(rawGeojson);
    const stats = calculateGeoJSONStats(geoJSON);
    return {
      name: file.name,
      format: 'geojson',
      geoJSON,
      originalGeoJSON,
      crs: detectedCRS,
      crsDescription: description,
      wasReprojected,
      ...stats
    };
  }

  if (ext === 'kml') {
    const text = await file.text();
    return parseKML(text, file.name);
  }

  if (ext === 'kmz') {
    const buffer = await file.arrayBuffer();
    return parseKMZ(buffer, file.name);
  }

  if (ext === 'zip') {
    const buffer = await file.arrayBuffer();
    return parseShapefileZip(buffer, file.name);
  }

  if (ext === 'shp') {
    const buffer = await file.arrayBuffer();
    return parseRawShp(buffer, file.name);
  }

  throw new Error(`Noma'lum format: .${ext}. Iltimos .shp, .zip (shapefile), .kml, .kmz yoki .geojson yuklang.`);
}
