import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, MapPin, Maximize2, Minimize2, UploadCloud, RefreshCw, 
  Compass, Eye, EyeOff, Trash2, Download, Focus, FileText, CheckCircle2, 
  AlertCircle, Sparkles, SlidersHorizontal, X, ChevronRight, HelpCircle,
  Globe, RotateCw
} from 'lucide-react';
import { GISProject } from '../types';
import { parseGISFile, parseKML, ParsedGISLayer, calculateGeoJSONStats } from '../utils/gisParsers';
import { POPULAR_CRS_OPTIONS, reprojectGeoJSON } from '../utils/gisProjections';

interface InteractiveMapViewerProps {
  projects: GISProject[];
  selectedProject: GISProject | null;
  onSelectProject: (project: GISProject) => void;
  onOpenProjectModal: (project: GISProject) => void;
  isInsideModal?: boolean;
  className?: string;
}

export interface ActiveCustomGISLayer {
  id: string;
  name: string;
  format: 'shp' | 'shapefile-zip' | 'kml' | 'kmz' | 'geojson';
  color: string;
  visible: boolean;
  featureCount: number;
  geometryTypes: string[];
  attributeFields: string[];
  geoJSON: any;
  originalGeoJSON?: any;
  crs?: string;
  crsDescription?: string;
  wasReprojected?: boolean;
  bounds?: [number, number, number, number];
  center?: [number, number];
  leafletLayer?: L.GeoJSON;
}

type BasemapType = 'osm' | 'satellite' | 'topo' | 'dark';

const LAYER_COLORS = [
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#f43f5e', // rose
  '#3b82f6', // blue
  '#eab308'  // yellow
];

const SAMPLE_KML_DATA = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Toshkent Geofazoviy Namuna Qatlami (KML)</name>
    <Placemark>
      <name>Alisher Navoiy Milliy Bog'i</name>
      <description>Shahar markazidagi yashil rekreatsiya zonasi va suv havzasi hududi</description>
      <ExtendedData>
        <Data name="Turi"><value>Yashil Park / Rekreatsiya</value></Data>
        <Data name="Maydoni_Ga"><value>65.4</value></Data>
        <Data name="Monitoring_Holati"><value>Faol muhofazada</value></Data>
      </ExtendedData>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              69.238,41.308,0 69.248,41.309,0 69.247,41.298,0 69.237,41.299,0 69.238,41.308,0
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
    <Placemark>
      <name>Anhor Suv Kanali (Magistral)</name>
      <description>Toshkent shahrini suv bilan ta'minlovchi asosiy gidrografik kanal tarmog'i</description>
      <ExtendedData>
        <Data name="Gidro_Turi"><value>Ochiq kanal</value></Data>
        <Data name="Uzunligi_Km"><value>12.8</value></Data>
        <Data name="Oqim_Tezligi"><value>1.2 m/s</value></Data>
      </ExtendedData>
      <LineString>
        <coordinates>
          69.245,41.332,0 69.249,41.320,0 69.252,41.308,0 69.256,41.295,0 69.259,41.282,0
        </coordinates>
      </LineString>
    </Placemark>
    <Placemark>
      <name>Toshkent Doimiy Geodezik GNSS Stansiyasi</name>
      <description>Davlat geodezik tarmog'i va RTK tuzatishlar uzatuvchi tayanch nuqtasi</description>
      <ExtendedData>
        <Data name="Klass"><value>1-darajali GNSS</value></Data>
        <Data name="Balandlik_m"><value>452.1</value></Data>
        <Data name="CRS"><value>WGS-84 / Pulkovo-42</value></Data>
      </ExtendedData>
      <Point>
        <coordinates>69.240562,41.311081,0</coordinates>
      </Point>
    </Placemark>
    <Placemark>
      <name>Botanika Bog'i Ilmiy-Tadqiqot Maydoni</name>
      <description>O'simliklar genofondi va turli daraxtzorlarning vegetatsiya indeksi monitoringi</description>
      <ExtendedData>
        <Data name="NDVI_O'rtacha"><value>0.74</value></Data>
        <Data name="Maydoni_Ga"><value>66.0</value></Data>
      </ExtendedData>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              69.310,41.345,0 69.324,41.346,0 69.323,41.336,0 69.309,41.335,0 69.310,41.345,0
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;

export default function InteractiveMapViewer({
  projects,
  selectedProject,
  onSelectProject,
  onOpenProjectModal,
  isInsideModal = false,
  className = ''
}: InteractiveMapViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const canvasRendererRef = useRef<L.Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [basemap, setBasemap] = useState<BasemapType>('satellite');
  const [showMarkers, setShowMarkers] = useState(true);
  const [showPolygons, setShowPolygons] = useState(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(true);

  // Custom User Uploaded Layers (SHP, KML, KMZ, GeoJSON)
  const [customLayers, setCustomLayers] = useState<ActiveCustomGISLayer[]>([]);
  const customLayersRef = useRef<Map<string, L.GeoJSON>>(new Map());

  // Active layer for CRS reprojection modal
  const [activeCrsLayerId, setActiveCrsLayerId] = useState<string | null>(null);

  // Upload status & notification
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Basemap Tile Providers
  const basemapUrls: Record<BasemapType, { url: string; attribution: string; maxZoom: number }> = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri, USGS, NOAA',
      maxZoom: 18
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap (CC-BY-SA)',
      maxZoom: 17
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB',
      maxZoom: 19
    }
  };

  // Helper: Create Attribute Table Popup for Features
  const createAttributePopup = (properties: any, title?: string) => {
    if (!properties || Object.keys(properties).length === 0) {
      return `<div class="p-2 text-xs font-mono text-slate-300">${title || "Geofazoviy ob'ekt"}</div>`;
    }

    const rows = Object.entries(properties)
      .filter(([k]) => k !== 'projectId' && k !== 'projectTitle' && k !== 'styleUrl' && k !== 'styleHash')
      .map(([key, val]) => {
        let displayVal = String(val ?? '');
        if (typeof val === 'object') {
          displayVal = JSON.stringify(val);
        }
        return `
          <tr class="text-[11px]">
            <td class="py-1.5 pr-2 font-mono font-semibold text-emerald-400 align-top">${key}:</td>
            <td class="py-1.5 text-slate-200 break-words font-sans">${displayVal}</td>
          </tr>
        `;
      }).join('');

    return `
      <div class="p-2.5 min-w-[240px] max-w-[340px] max-h-[260px] overflow-y-auto bg-slate-900 text-slate-100 rounded-xl shadow-xl">
        <div class="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2 pb-1 flex items-center justify-between">
          <span>${title || "Ob'ekt Atributlari"}</span>
          <span class="text-[9px] text-slate-400 font-normal">GIS Tahlili</span>
        </div>
        <table class="w-full text-left">
          <tbody>
            ${rows || '<tr><td class="text-xs text-slate-400 py-1">Atributlar mavjud emas</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Uzbekistan
    const map = L.map(mapContainerRef.current, {
      center: [41.3775, 64.5853],
      zoom: 6,
      zoomControl: false,
      preferCanvas: true
    });

    // Shared high-performance Canvas renderer for tens of thousands of features (e.g. 62k+ polygons)
    canvasRendererRef.current = L.canvas({ padding: 0.5, tolerance: 3 });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const initialConfig = basemapUrls['satellite'];
    const tileLayer = L.tileLayer(initialConfig.url, {
      attribution: initialConfig.attribution,
      maxZoom: initialConfig.maxZoom
    }).addTo(map);
    currentTileLayerRef.current = tileLayer;

    markersLayerRef.current = L.layerGroup().addTo(map);

    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5))
      });
    });

    mapInstanceRef.current = map;

    // ResizeObserver ensures Leaflet updates its tile grid as soon as container expands or changes size
    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size when fullscreen toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // Update Basemap Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const config = basemapUrls[basemap];
    const newTile = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom
    }).addTo(map);

    currentTileLayerRef.current = newTile;
  }, [basemap]);

  // Update Projects Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (!showMarkers) return;

    projects.forEach((proj) => {
      const customIcon = L.divIcon({
        className: 'custom-gis-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <span class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></span>
            <div class="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-lg text-emerald-400 group-hover:scale-125 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span class="absolute top-9 px-2 py-0.5 rounded-lg text-[11px] font-semibold tracking-wide bg-slate-950/95 text-emerald-300 whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
              ${proj.title.slice(0, 26)}...
            </span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([proj.coordinates[0], proj.coordinates[1]], { icon: customIcon });

      const popupContent = `
        <div class="p-2 min-w-[220px] max-w-[280px]">
          <div class="text-[10px] uppercase font-mono tracking-wider text-emerald-400 mb-1 font-semibold">
            ${proj.year} • ${proj.category.toUpperCase()}
          </div>
          <h4 class="font-bold text-sm text-white leading-tight mb-2">${proj.title}</h4>
          <p class="text-xs text-slate-300 mb-2 line-clamp-2">${proj.shortDescription}</p>
          <div class="flex flex-wrap gap-1 mb-3">
            ${proj.tools.slice(0, 3).map(t => `<span class="text-[9px] bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded shadow-xs">${t}</span>`).join('')}
          </div>
          <button id="popup-btn-${proj.id}" class="w-full text-center text-xs py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded transition">
            Batafsil ko'rish
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => onSelectProject(proj));
      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${proj.id}`);
        if (btn) {
          btn.onclick = () => onOpenProjectModal(proj);
        }
      });

      markersGroup.addLayer(marker);
    });
  }, [projects, showMarkers]);

  // Update Standard Project Polygons
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
      geojsonLayerRef.current = null;
    }

    if (!showPolygons) return;

    const features = projects
      .filter((p) => p.geojsonSample)
      .map((p) => ({
        ...p.geojsonSample,
        properties: {
          ...p.geojsonSample.properties,
          projectId: p.id,
          projectTitle: p.title
        }
      }));

    if (features.length === 0) return;

    const featureCollection = {
      type: 'FeatureCollection',
      features
    };

    const newGeoLayer = (L.geoJSON as any)(featureCollection as any, {
      renderer: canvasRendererRef.current || undefined,
      style: (feature: any) => {
        const isSelected = selectedProject && feature?.properties?.projectId === selectedProject.id;
        return {
          renderer: canvasRendererRef.current || undefined,
          color: isSelected ? '#10b981' : '#38bdf8',
          weight: isSelected ? 3 : 2,
          opacity: 0.9,
          fillColor: isSelected ? '#10b981' : '#0284c7',
          fillOpacity: isSelected ? 0.35 : 0.2,
          dashArray: feature?.geometry?.type === 'LineString' ? '6, 6' : undefined
        };
      },
      onEachFeature: (feature: any, layer: any) => {
        if (feature.properties && feature.properties.name) {
          layer.bindTooltip(
            `<div class="font-mono text-xs"><strong>${feature.properties.name}</strong><br/>${feature.properties.projectTitle || ''}</div>`,
            { sticky: true }
          );
        }
        layer.on('click', () => {
          const matched = projects.find((p) => p.id === feature.properties.projectId);
          if (matched) {
            onSelectProject(matched);
          }
        });
      }
    }).addTo(map);

    geojsonLayerRef.current = newGeoLayer;
  }, [projects, showPolygons, selectedProject]);

  // Center on selectedProject when clicked
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedProject) return;

    map.flyTo([selectedProject.coordinates[0], selectedProject.coordinates[1]], 9, {
      animate: true,
      duration: 1.2
    });
  }, [selectedProject]);

  // Synchronize Custom Uploaded Layers on the Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    customLayers.forEach((customLayer) => {
      let existingLeafletLayer = customLayersRef.current.get(customLayer.id);

      if (!customLayer.visible) {
        if (existingLeafletLayer && map.hasLayer(existingLeafletLayer)) {
          map.removeLayer(existingLeafletLayer);
        }
        return;
      }

      // If already on map with same layer, ensure visible & re-style
      if (existingLeafletLayer) {
        if (!map.hasLayer(existingLeafletLayer)) {
          existingLeafletLayer.addTo(map);
        }
        existingLeafletLayer.setStyle({
          color: customLayer.color,
          fillColor: customLayer.color
        });
        return;
      }

      // For massive layers (e.g. 62,567 features like qash_70.shp), use Canvas & dynamic popups
      const isMassive = customLayer.featureCount > 1000;

      const leafletGeo = (L.geoJSON as any)(customLayer.geoJSON, {
        renderer: canvasRendererRef.current || undefined,
        smoothFactor: isMassive ? 1.4 : 1.0,
        pointToLayer: (_feature: any, latlng: any) => {
          return L.circleMarker(latlng, {
            renderer: canvasRendererRef.current || undefined,
            radius: isMassive ? 4 : 7,
            fillColor: customLayer.color,
            color: '#ffffff',
            weight: isMassive ? 1 : 2,
            opacity: 0.9,
            fillOpacity: 0.85
          });
        },
        style: (feature: any) => {
          return {
            renderer: canvasRendererRef.current || undefined,
            color: customLayer.color,
            weight: isMassive ? 1.5 : 2.5,
            opacity: 0.85,
            fillColor: customLayer.color,
            fillOpacity: isMassive ? 0.3 : 0.35,
            dashArray: feature?.geometry?.type === 'LineString' ? '4, 4' : undefined
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          if (isMassive) {
            // Lazy click listener for high performance on 10,000+ features
            layer.on('click', (e: any) => {
              const popupHtml = createAttributePopup(
                feature.properties,
                feature.properties?.name || feature.properties?.Name || customLayer.name
              );
              L.popup({ maxWidth: 360 })
                .setLatLng(e.latlng)
                .setContent(popupHtml)
                .openOn(map);
            });
          } else {
            const popupHtml = createAttributePopup(
              feature.properties,
              feature.properties?.name || feature.properties?.Name || customLayer.name
            );
            layer.bindPopup(popupHtml, { maxWidth: 360 });

            if (feature.properties?.name || feature.properties?.Name) {
              layer.bindTooltip(
                `<div class="text-xs font-mono"><strong>${feature.properties.name || feature.properties.Name}</strong> (${customLayer.name})</div>`,
                { sticky: true }
              );
            }
          }
        }
      }).addTo(map);

      customLayersRef.current.set(customLayer.id, leafletGeo);
    });

    // Cleanup deleted layers
    customLayersRef.current.forEach((leafletGeo, id) => {
      const stillExists = customLayers.some((cl) => cl.id === id);
      if (!stillExists) {
        if (map.hasLayer(leafletGeo)) {
          map.removeLayer(leafletGeo);
        }
        customLayersRef.current.delete(id);
      }
    });
  }, [customLayers]);

  // Master Function: Process & Add Uploaded File (SHP, KML, KMZ, GeoJSON)
  const processUploadedFile = async (file: File) => {
    setIsLoadingFile(true);
    setStatusMessage(null);

    try {
      const parsed: ParsedGISLayer = await parseGISFile(file);
      const map = mapInstanceRef.current;

      if (!parsed.geoJSON) {
        throw new Error("Fayldan geofazoviy ob'ektlar topilmadi.");
      }

      // Pick next color from palette
      const color = LAYER_COLORS[customLayers.length % LAYER_COLORS.length];

      const newLayer: ActiveCustomGISLayer = {
        id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: parsed.name,
        format: parsed.format,
        color,
        visible: true,
        featureCount: parsed.featureCount,
        geometryTypes: parsed.geometryTypes,
        attributeFields: parsed.attributeFields,
        geoJSON: parsed.geoJSON,
        originalGeoJSON: parsed.originalGeoJSON,
        crs: parsed.crs,
        crsDescription: parsed.crsDescription,
        wasReprojected: parsed.wasReprojected,
        bounds: parsed.bounds,
        center: parsed.center
      };

      setCustomLayers((prev) => [newLayer, ...prev]);

      // Direct bounds fitting (Zero CPU lag even with 62k+ polygons)
      if (map) {
        if (parsed.bounds) {
          map.fitBounds([
            [parsed.bounds[1], parsed.bounds[0]],
            [parsed.bounds[3], parsed.bounds[2]]
          ], { padding: [50, 50], maxZoom: 16 });
        } else if (parsed.center) {
          map.flyTo([parsed.center[0], parsed.center[1]], 10);
        }
      }

      const crsDetail = parsed.wasReprojected
        ? ` (Koordinatalar avtomatik ${parsed.crs || 'UTM'} dan WGS-84 ga muvofiqlashtirildi)`
        : '';

      setStatusMessage({
        type: 'success',
        text: `"${parsed.name}" muvaffaqiyatli yuklandi: ${parsed.featureCount} ta ob'ekt (${parsed.geometryTypes.join(', ') || 'Geometriya'}) xaritaga joylandi!${crsDetail}`
      });

      // Auto-clear notification after 7 seconds
      setTimeout(() => setStatusMessage(null), 7000);
    } catch (err: any) {
      console.error("GIS file parsing error:", err);
      setStatusMessage({
        type: 'error',
        text: err?.message || "Faylni tahlil qilishda xatolik yuz berdi. Iltimos standart .shp, .zip (shapefile), .kml, .kmz yoki .geojson yuklang."
      });
    } finally {
      setIsLoadingFile(false);
    }
  };

  // Load Sample KML Data
  const handleLoadSampleKML = () => {
    try {
      const parsed = parseKML(SAMPLE_KML_DATA, 'Toshkent_Namunasi.kml');
      const color = '#06b6d4'; // cyan

      const newLayer: ActiveCustomGISLayer = {
        id: `sample-kml-${Date.now()}`,
        name: 'Toshkent_Namunasi.kml',
        format: 'kml',
        color,
        visible: true,
        featureCount: parsed.featureCount,
        geometryTypes: parsed.geometryTypes,
        attributeFields: parsed.attributeFields,
        geoJSON: parsed.geoJSON,
        originalGeoJSON: parsed.originalGeoJSON,
        crs: parsed.crs,
        crsDescription: parsed.crsDescription,
        wasReprojected: parsed.wasReprojected,
        bounds: parsed.bounds,
        center: parsed.center
      };

      setCustomLayers((prev) => [newLayer, ...prev]);

      const map = mapInstanceRef.current;
      if (map && parsed.bounds) {
        map.fitBounds([
          [parsed.bounds[1], parsed.bounds[0]],
          [parsed.bounds[3], parsed.bounds[2]]
        ], { padding: [50, 50], maxZoom: 13 });
      }

      setStatusMessage({
        type: 'success',
        text: "Namuna KML qatlami (Toshkent parklari, kanallar, GNSS nuqta) xaritaga yuklandi!"
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e?.message || 'Namuna yuklashda xatolik.' });
    }
  };

  // Layer Controls: Zoom to Layer
  const handleZoomToLayer = (layer: ActiveCustomGISLayer) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (layer.bounds) {
      map.fitBounds([
        [layer.bounds[1], layer.bounds[0]],
        [layer.bounds[3], layer.bounds[2]]
      ], { padding: [50, 50], maxZoom: 16 });
      return;
    }

    const existing = customLayersRef.current.get(layer.id);
    if (existing) {
      const bounds = existing.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }
  };

  // Layer Controls: Change Projection / CRS
  const handleReprojectLayer = (layerId: string, targetCRS: string) => {
    const map = mapInstanceRef.current;

    // Remove existing Leaflet layer to force recreation
    const existing = customLayersRef.current.get(layerId);
    if (existing && map) {
      map.removeLayer(existing);
      customLayersRef.current.delete(layerId);
    }

    setCustomLayers((prev) =>
      prev.map((l) => {
        if (l.id !== layerId) return l;
        const sourceData = l.originalGeoJSON || l.geoJSON;
        const reprojected = reprojectGeoJSON(sourceData, targetCRS);
        const stats = calculateGeoJSONStats(reprojected);
        const crsOption = POPULAR_CRS_OPTIONS.find((c) => c.code === targetCRS);

        if (map && stats.bounds) {
          map.fitBounds([
            [stats.bounds[1], stats.bounds[0]],
            [stats.bounds[3], stats.bounds[2]]
          ], { padding: [50, 50], maxZoom: 16 });
        }

        return {
          ...l,
          crs: targetCRS,
          crsDescription: crsOption ? `${crsOption.name} (${crsOption.region})` : targetCRS,
          wasReprojected: targetCRS !== 'EPSG:4326',
          geoJSON: reprojected,
          bounds: stats.bounds,
          center: stats.center,
          featureCount: stats.featureCount
        };
      })
    );

    setActiveCrsLayerId(null);
    setStatusMessage({
      type: 'info',
      text: `Qatlam koordinatalari ${targetCRS} proeksiyasiga o'girildi va xaritaga qayta joylandi.`
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Layer Controls: Toggle Visibility
  const handleToggleLayerVisibility = (id: string) => {
    setCustomLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  // Layer Controls: Change Layer Color
  const handleChangeLayerColor = (id: string, newColor: string) => {
    setCustomLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, color: newColor } : l))
    );
  };

  // Layer Controls: Delete Layer
  const handleDeleteLayer = (id: string) => {
    const map = mapInstanceRef.current;
    const existing = customLayersRef.current.get(id);
    if (existing && map) {
      map.removeLayer(existing);
      customLayersRef.current.delete(id);
    }
    setCustomLayers((prev) => prev.filter((l) => l.id !== id));
  };

  // Layer Controls: Export Layer as GeoJSON
  const handleExportLayerGeoJSON = (layer: ActiveCustomGISLayer) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(layer.geoJSON, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${layer.name.replace(/\.[^/.]+$/, "")}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reset Map View to Center of Uzbekistan
  const resetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([41.3775, 64.5853], 6, { duration: 1.2 });
  };

  return (
    <div
      id="map-viewer-container"
      className={`relative w-full overflow-hidden bg-slate-950 transition-all duration-300 shadow-2xl ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen'
          : isInsideModal
            ? 'h-full w-full rounded-none'
            : 'h-[85vh] min-h-[720px] max-h-[1050px] rounded-none sm:rounded-2xl'
      } ${className}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          processUploadedFile(e.dataTransfer.files[0]);
        }
      }}
    >
      {/* Drag & Drop Fullscreen Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-150 shadow-2xl">
          <UploadCloud className="w-16 h-16 text-emerald-400 mb-3 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-1">Geofazoviy faylni tashlang</h3>
          <p className="text-sm text-emerald-200 max-w-md">
            Shapefile (.shp, .zip), KML (.kml), KMZ (.kmz) yoki GeoJSON (.geojson, .json) fayllari avtomatik tahlil qilinadi, koordinata tizimi (UTM, Gauss-Kruger, WGS-84) aniqlanadi va xaritada aks ettiriladi.
          </p>
        </div>
      )}

      {/* Actual Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Side: Title & Realtime Coordinates */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-200">GIS Xarita Konsoli</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            {cursorCoords ? (
              <span>
                Lat: <span className="text-slate-200">{cursorCoords.lat}°</span>, Lng: <span className="text-slate-200">{cursorCoords.lng}°</span>
              </span>
            ) : (
              <span>Kursorni harakatlantiring</span>
            )}
          </div>
        </div>

        {/* Right Side: Basemaps, Layer Manager Toggle, Fullscreen */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
          {/* Basemap Picker */}
          <div className="flex items-center bg-slate-900/95 backdrop-blur-md p-1 rounded-xl shadow-lg text-xs">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                basemap === 'satellite'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Sun'iy Yo'ldosh
            </button>
            <button
              onClick={() => setBasemap('osm')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                basemap === 'osm'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Ko'cha
            </button>
            <button
              onClick={() => setBasemap('topo')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                basemap === 'topo'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Relyef/Topo
            </button>
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                basemap === 'dark'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Qora (GIS)
            </button>
          </div>

          {/* Toggle Layers Panel Button */}
          <button
            onClick={() => setIsLayersPanelOpen(!isLayersPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg transition ${
              isLayersPanelOpen
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900/95 text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Qatlamlar {customLayers.length > 0 && `(${customLayers.length})`}</span>
          </button>

          {/* Reset & Fullscreen buttons */}
          <div className="flex items-center gap-1 bg-slate-900/95 backdrop-blur-md p-1 rounded-xl shadow-lg">
            <button
              onClick={resetView}
              title="Respublika ko'rinishiga qaytish"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Kichraytirish" : "To'liq ekran"}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Status Notification Toast */}
      {statusMessage && (
        <div
          className={`absolute top-16 right-4 z-30 pointer-events-auto p-3 rounded-xl shadow-2xl max-w-md text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-red-950/95 text-red-200'
              : 'bg-slate-900/95 text-cyan-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : statusMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="leading-snug">{statusMessage.text}</p>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Left/Bottom Interactive GIS Layer Manager Panel */}
      {isLayersPanelOpen && (
        <div className="absolute bottom-4 left-4 z-20 pointer-events-auto w-84 sm:w-96 max-h-[82%] flex flex-col bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-3 bg-slate-900">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-xs">Geofazoviy Qatlamlar Boshqaruvi</span>
            </div>
            <button
              onClick={() => setIsLayersPanelOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 overflow-y-auto space-y-3 scrollbar-thin">
            {/* Direct Upload Buttons for SHP, KML, GeoJSON */}
            <div className="p-2.5 bg-slate-950/80 rounded-xl space-y-2 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-cyan-400" /> Yangi Qatlam Qo'shish
                </span>
                <span className="text-[10px] font-mono text-emerald-400">SHP • KML • KMZ • GeoJSON</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* File Upload Trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoadingFile}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition shadow"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isLoadingFile ? 'O\'qilmoqda...' : 'Fayl Tanlash'}</span>
                </button>

                {/* Sample KML Test Button */}
                <button
                  type="button"
                  onClick={handleLoadSampleKML}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-lg text-xs transition shadow-sm"
                  title="Toshkent parklari va kanallari namuna KML qatlamini yuklash"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Namuna KML</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".shp,.zip,.kml,.kmz,.geojson,.json"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processUploadedFile(e.target.files[0]);
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              <p className="text-[10px] text-slate-400 leading-tight">
                * Shapefile (.shp yoki .zip arxivi), Google Earth KML/KMZ yoki GeoJSON fayllarini tanlang yoki xaritaga tashlang.
              </p>
            </div>

            {/* Default Project Layers Section */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Asosiy Portfolio Qatlamlari
              </span>
              <div className="space-y-1 text-xs">
                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/60 cursor-pointer transition shadow-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <input
                      type="checkbox"
                      checked={showMarkers}
                      onChange={(e) => setShowMarkers(e.target.checked)}
                      className="rounded border-none text-emerald-500 focus:ring-emerald-400 w-3.5 h-3.5 bg-slate-800"
                    />
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Loyiha nishonlari</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{projects.length} ta</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/60 cursor-pointer transition shadow-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <input
                      type="checkbox"
                      checked={showPolygons}
                      onChange={(e) => setShowPolygons(e.target.checked)}
                      className="rounded border-none text-cyan-500 focus:ring-cyan-400 w-3.5 h-3.5 bg-slate-800"
                    />
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Portfolio poligonlari</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">Faol</span>
                </label>
              </div>
            </div>

            {/* Custom Uploaded Layers List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Yuklangan Qatlamlar ({customLayers.length})
                </span>
                {customLayers.length > 0 && (
                  <button
                    onClick={() => {
                      customLayers.forEach((l) => handleDeleteLayer(l.id));
                    }}
                    className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Barchasini tozalash
                  </button>
                )}
              </div>

              {customLayers.length === 0 ? (
                <div className="p-4 text-center rounded-xl bg-slate-950/40 text-slate-500 text-xs shadow-inner">
                  Hali qo'shimcha SHP yoki KML qatlam yuklanmadi.
                  <br />
                  Faylni tanlang yoki <span className="text-cyan-400 cursor-pointer" onClick={handleLoadSampleKML}>Namuna KML</span> ni sinab ko'ring.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5">
                  {customLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 transition space-y-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2 overflow-hidden">
                          {/* Visibility toggle button */}
                          <button
                            onClick={() => handleToggleLayerVisibility(layer.id)}
                            className={`p-1 rounded transition ${
                              layer.visible ? 'text-emerald-400 hover:bg-emerald-950/50' : 'text-slate-600 hover:bg-slate-800'
                            }`}
                            title={layer.visible ? "Qatlamni yashirish" : "Qatlamni ko'rsatish"}
                          >
                            {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {/* Format Badge */}
                          <span
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold text-slate-950"
                            style={{ backgroundColor: layer.color }}
                          >
                            {layer.format === 'shapefile-zip' ? 'SHP ZIP' : layer.format.toUpperCase()}
                          </span>

                          {/* Layer Name */}
                          <span className="text-xs font-semibold text-white truncate max-w-[120px]" title={layer.name}>
                            {layer.name}
                          </span>
                        </div>

                        {/* Actions: Zoom, CRS Reproject, Download, Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleZoomToLayer(layer)}
                            title="Qatlam chegarasiga yaqinlashtirish (Zoom)"
                            className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                          >
                            <Focus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setActiveCrsLayerId(activeCrsLayerId === layer.id ? null : layer.id)}
                            title="Koordinata tizimi (CRS) ni sozlash / o'zgartirish"
                            className={`p-1 rounded transition ${
                              activeCrsLayerId === layer.id
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800'
                            }`}
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleExportLayerGeoJSON(layer)}
                            title="GeoJSON formatida yuklab olish"
                            className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteLayer(layer.id)}
                            title="O'chirish"
                            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* CRS Badge & Reprojection Notice */}
                      <div className="flex items-center justify-between text-[9px] font-mono bg-slate-900/80 px-2 py-1 rounded shadow-xs">
                        <span className="text-slate-400">
                          CRS: <strong className="text-cyan-300">{layer.crs || 'WGS 84'}</strong>
                        </span>
                        {layer.wasReprojected ? (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            ✨ WGS-84 ga moslandi
                          </span>
                        ) : (
                          <span className="text-slate-500">Standart Lon/Lat</span>
                        )}
                      </div>

                      {/* Interactive CRS Selector Dropdown when toggled */}
                      {activeCrsLayerId === layer.id && (
                        <div className="p-2 bg-slate-900 rounded-lg space-y-1.5 animate-in fade-in duration-150 shadow-md">
                          <div className="flex items-center justify-between text-[10px] text-cyan-300 font-semibold">
                            <span className="flex items-center gap-1">
                              <RotateCw className="w-3 h-3" /> Koordinata tizimi (CRS):
                            </span>
                            <button
                              onClick={() => setActiveCrsLayerId(null)}
                              className="text-slate-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="space-y-1 max-h-36 overflow-y-auto">
                            {POPULAR_CRS_OPTIONS.map((opt) => (
                              <button
                                key={opt.code}
                                onClick={() => handleReprojectLayer(layer.id, opt.code)}
                                className={`w-full text-left p-1.5 rounded text-[10px] transition flex flex-col ${
                                  layer.crs === opt.code
                                    ? 'bg-cyan-500/20 text-cyan-200'
                                    : 'hover:bg-slate-800 text-slate-300'
                                }`}
                              >
                                <span className="font-semibold text-white">{opt.name}</span>
                                <span className="text-slate-400 text-[9px]">{opt.region}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Layer Stats & Color Palette Picker */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">{layer.featureCount} ta ob'ekt</span>
                          {layer.geometryTypes.length > 0 && (
                            <span className="text-cyan-400 truncate max-w-[100px]">
                              {layer.geometryTypes.join(', ')}
                            </span>
                          )}
                        </div>

                        {/* Color Selector Pills */}
                        <div className="flex items-center gap-1">
                          {LAYER_COLORS.slice(0, 5).map((col) => (
                            <button
                              key={col}
                              onClick={() => handleChangeLayerColor(layer.id, col)}
                              style={{ backgroundColor: col }}
                              className={`w-3 h-3 rounded-full transition-transform ${
                                layer.color === col ? 'scale-125 ring-1 ring-white' : 'opacity-60 hover:opacity-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Project Info Pill (if any selected) */}
      {selectedProject && (
        <div className="absolute top-16 left-4 z-20 pointer-events-auto bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-xl max-w-sm text-xs animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                Tanlangan Hudud:
              </span>
              <h4 className="font-bold text-white text-sm mt-0.5 leading-snug">{selectedProject.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{selectedProject.locationName}</p>
            </div>
            <button
              onClick={() => onOpenProjectModal(selectedProject)}
              className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs whitespace-nowrap transition shadow"
            >
              Tahlilni ko'rish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
