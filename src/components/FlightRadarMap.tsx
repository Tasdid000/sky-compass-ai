import { useEffect, useRef, useState, useCallback, forwardRef, memo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LiveFlight } from "@/data/liveFlights";
import { worldAirports, Airport } from "@/data/airports";

const MAP_STYLES = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  satellite: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
};

interface FlightRadarMapProps {
  flights: LiveFlight[];
  selectedFlight: LiveFlight | null;
  onFlightSelect: (flight: LiveFlight | null) => void;
  mapStyle?: "dark" | "light" | "satellite";
  showAirports?: boolean;
}

export const FlightRadarMap = memo(forwardRef<HTMLDivElement, FlightRadarMapProps>(
  function FlightRadarMap({ 
    flights, 
    selectedFlight, 
    onFlightSelect, 
    mapStyle = "dark",
    showAirports = true 
  }, ref) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
    const airportMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
    const [mapLoaded, setMapLoaded] = useState(false);
    const styleLoadedRef = useRef(false);

    // Initialize map
    useEffect(() => {
      if (!mapContainer.current || map.current) return;

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[mapStyle],
        center: [20, 25],
        zoom: 2,
        minZoom: 1,
        maxZoom: 18,
        attributionControl: false,
        antialias: true,
      });

      map.current.addControl(new maplibregl.NavigationControl(), "top-right");
      map.current.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        "bottom-right"
      );

      map.current.on("load", () => {
        setMapLoaded(true);
        styleLoadedRef.current = true;
      });

      map.current.on("styledata", () => {
        styleLoadedRef.current = true;
      });

      // Click on map to deselect
      map.current.on("click", (e) => {
        const target = e.originalEvent.target as HTMLElement;
        if (!target.closest(".flight-marker") && !target.closest(".airport-marker")) {
          onFlightSelect(null);
        }
      });

      // Add styles
      if (!document.getElementById("flight-radar-styles")) {
        const style = document.createElement("style");
        style.id = "flight-radar-styles";
        style.textContent = `
          @keyframes pulse {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.4); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes plane-glow {
            0%, 100% { filter: drop-shadow(0 0 8px currentColor); }
            50% { filter: drop-shadow(0 0 16px currentColor); }
          }
          .flight-marker { z-index: 10; cursor: pointer; }
          .flight-marker.selected { z-index: 100; }
          .airport-marker { z-index: 5; cursor: pointer; }
          .airport-marker:hover .airport-label { opacity: 1; }
          .airport-label { 
            position: absolute;
            top: -24px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
          }
          .airport-marker.large .airport-label { opacity: 1; }
        `;
        document.head.appendChild(style);
      }

      return () => {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current.clear();
        airportMarkersRef.current.forEach((marker) => marker.remove());
        airportMarkersRef.current.clear();
        map.current?.remove();
        map.current = null;
      };
    }, []);

    // Update map style
    useEffect(() => {
      if (map.current && mapLoaded) {
        styleLoadedRef.current = false;
        map.current.setStyle(MAP_STYLES[mapStyle]);
      }
    }, [mapStyle, mapLoaded]);

    // Create airport marker element
    const createAirportMarker = useCallback((airport: Airport, zoom: number) => {
      const el = document.createElement("div");
      el.className = `airport-marker ${airport.size}`;
      
      const isLarge = airport.size === "large";
      const isMedium = airport.size === "medium";
      const showLabel = zoom >= 4 || (isLarge && zoom >= 2) || (isMedium && zoom >= 3);
      
      // Size based on airport importance and zoom
      let dotSize = 6;
      if (isLarge) {
        dotSize = zoom >= 4 ? 14 : zoom >= 3 ? 12 : 10;
      } else if (isMedium) {
        dotSize = zoom >= 5 ? 10 : 8;
      } else {
        dotSize = zoom >= 6 ? 8 : 6;
      }
      
      const borderColor = mapStyle === "light" ? "#1f2937" : "#ffffff";
      const fillColor = isLarge ? "#3b82f6" : isMedium ? "#8b5cf6" : mapStyle === "light" ? "#6b7280" : "#9ca3af";
      
      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          ${showLabel ? `
            <div class="airport-label" style="
              position: absolute;
              top: -${dotSize + 18}px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.85);
              color: white;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              pointer-events: none;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              opacity: 1;
            ">${airport.code}</div>
          ` : ""}
          <div style="
            width: ${dotSize}px;
            height: ${dotSize}px;
            background: ${fillColor};
            border: 2px solid ${borderColor};
            border-radius: 50%;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          "></div>
        </div>
      `;
      
      el.title = `${airport.code} - ${airport.name}, ${airport.city}, ${airport.country}`;
      
      el.addEventListener("mouseenter", () => {
        const dot = el.querySelector("div > div:last-child") as HTMLElement;
        if (dot) {
          dot.style.transform = "scale(1.5)";
          dot.style.boxShadow = `0 4px 12px ${fillColor}80`;
        }
        // Show label on hover even if not visible by default
        const label = el.querySelector(".airport-label") as HTMLElement;
        if (!label) {
          const newLabel = document.createElement("div");
          newLabel.className = "airport-label-hover";
          newLabel.style.cssText = `
            position: absolute;
            top: -${dotSize + 18}px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1000;
          `;
          newLabel.textContent = airport.code;
          el.querySelector("div")?.appendChild(newLabel);
        }
      });
      el.addEventListener("mouseleave", () => {
        const dot = el.querySelector("div > div:last-child") as HTMLElement;
        if (dot) {
          dot.style.transform = "scale(1)";
          dot.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)";
        }
        const hoverLabel = el.querySelector(".airport-label-hover");
        hoverLabel?.remove();
      });
      
      return el;
    }, [mapStyle]);

    // Add airport markers based on zoom level
    useEffect(() => {
      if (!map.current || !mapLoaded || !showAirports) return;

      const updateAirportMarkers = () => {
        if (!map.current) return;
        
        const zoom = map.current.getZoom();
        
        // Major hub codes that should always be visible
        const majorHubs = new Set(["JFK", "LHR", "DXB", "SIN", "HKG", "FRA", "LAX", "CDG", "PEK", "SYD", "ATL", "ORD", "DFW", "AMS", "ICN", "NRT"]);
        
        // Show airports at different zoom levels - more generous thresholds
        let airportsToShow: Airport[] = [];
        if (zoom >= 5) {
          airportsToShow = worldAirports; // All airports
        } else if (zoom >= 4) {
          airportsToShow = worldAirports.filter(a => a.size === "large" || a.size === "medium");
        } else if (zoom >= 3) {
          airportsToShow = worldAirports.filter(a => a.size === "large");
        } else if (zoom >= 1.5) {
          // Show major hubs at any reasonable zoom
          airportsToShow = worldAirports.filter(a => majorHubs.has(a.code));
        }
        
        const airportCodes = new Set(airportsToShow.map(a => a.code));
        
        // Remove airports no longer visible
        airportMarkersRef.current.forEach((marker, code) => {
          if (!airportCodes.has(code)) {
            marker.remove();
            airportMarkersRef.current.delete(code);
          }
        });
        
        // Add or update airport markers
        airportsToShow.forEach(airport => {
          const existing = airportMarkersRef.current.get(airport.code);
          if (existing) {
            // Update existing marker element for zoom changes
            const newEl = createAirportMarker(airport, zoom);
            const oldEl = existing.getElement();
            oldEl.innerHTML = newEl.innerHTML;
            oldEl.title = newEl.title;
          } else {
            // Create new marker
            const el = createAirportMarker(airport, zoom);
            
            const marker = new maplibregl.Marker({ element: el })
              .setLngLat([airport.lng, airport.lat])
              .addTo(map.current!);
            
            airportMarkersRef.current.set(airport.code, marker);
          }
        });
      };

      updateAirportMarkers();
      map.current.on("zoom", updateAirportMarkers);
      map.current.on("zoomend", updateAirportMarkers);

      return () => {
        map.current?.off("zoom", updateAirportMarkers);
        map.current?.off("zoomend", updateAirportMarkers);
      };
    }, [mapLoaded, mapStyle, showAirports, createAirportMarker]);

    // Create flight marker element
    const createMarkerElement = useCallback(
      (flight: LiveFlight, isSelected: boolean) => {
        const el = document.createElement("div");
        el.className = `flight-marker ${isSelected ? "selected" : ""}`;

        const altitudeColor =
          flight.position.altitude > 30000
            ? "#fbbf24"
            : flight.position.altitude > 15000
              ? "#22c55e"
              : "#3b82f6";

        const size = isSelected ? 36 : 24;

        el.innerHTML = `
          <div style="
            position: relative;
            width: ${size}px;
            height: ${size}px;
            transform: rotate(${flight.position.heading}deg);
            transition: transform 0.3s ease;
          ">
            ${isSelected ? `
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                background: radial-gradient(circle, ${altitudeColor}50 0%, transparent 70%);
                border-radius: 50%;
                animation: pulse 2s infinite;
              "></div>
            ` : ""}
            <svg 
              viewBox="0 0 24 24" 
              width="${size}" 
              height="${size}" 
              fill="${isSelected ? "#ffffff" : altitudeColor}"
              style="
                filter: drop-shadow(0 2px 6px rgba(0,0,0,0.7));
                position: relative;
                z-index: 1;
                ${isSelected ? "animation: plane-glow 2s infinite;" : ""}
              "
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
        `;

        return el;
      },
      []
    );

    // Update flight markers
    useEffect(() => {
      if (!map.current || !mapLoaded) return;

      const existingIds = new Set(markersRef.current.keys());
      const newIds = new Set(flights.map((f) => f.id));

      // Remove markers for flights that no longer exist
      existingIds.forEach((id) => {
        if (!newIds.has(id)) {
          markersRef.current.get(id)?.remove();
          markersRef.current.delete(id);
        }
      });

      // Add or update markers
      flights.forEach((flight) => {
        const isSelected = selectedFlight?.id === flight.id;
        const existingMarker = markersRef.current.get(flight.id);

        if (existingMarker) {
          const el = existingMarker.getElement();
          const wasSelected = el.classList.contains("selected");
          if (wasSelected !== isSelected) {
            // Remove old marker and create a new one to avoid detached element issues
            existingMarker.remove();
            markersRef.current.delete(flight.id);

            const newEl = createMarkerElement(flight, isSelected);
            newEl.dataset.flightId = flight.id;
            newEl.onclick = (e) => {
              e.stopPropagation();
              onFlightSelect(flight);
            };

            const newMarker = new maplibregl.Marker({ element: newEl })
              .setLngLat([flight.position.lng, flight.position.lat])
              .addTo(map.current!);

            markersRef.current.set(flight.id, newMarker);
          } else {
            existingMarker.setLngLat([flight.position.lng, flight.position.lat]);
            const innerDiv = el.querySelector("div") as HTMLElement;
            if (innerDiv) {
              innerDiv.style.transform = `rotate(${flight.position.heading}deg)`;
            }
          }
        } else {
          const el = createMarkerElement(flight, isSelected);
          el.dataset.flightId = flight.id;
          el.onclick = (e) => {
            e.stopPropagation();
            onFlightSelect(flight);
          };

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([flight.position.lng, flight.position.lat])
            .addTo(map.current!);

          markersRef.current.set(flight.id, marker);
        }
      });
    }, [flights, selectedFlight, mapLoaded, createMarkerElement, onFlightSelect]);

    // Draw flight path and trail for selected flight
    useEffect(() => {
      if (!map.current || !mapLoaded) return;

      const drawFlightPath = () => {
        if (!map.current || !styleLoadedRef.current) return;

        const sourceIds = ["flight-route", "flight-trail", "flight-future", "origin-point", "dest-point"];
        const layerIds = [
          "flight-route-line", "flight-route-glow",
          "flight-trail-line", "flight-trail-glow",
          "flight-future-line",
          "origin-circle", "origin-pulse",
          "dest-circle", "dest-pulse"
        ];

        // Clean up existing layers and sources
        layerIds.forEach((id) => {
          try {
            if (map.current?.getLayer(id)) {
              map.current.removeLayer(id);
            }
          } catch (e) {}
        });
        sourceIds.forEach((id) => {
          try {
            if (map.current?.getSource(id)) {
              map.current.removeSource(id);
            }
          } catch (e) {}
        });

        if (!selectedFlight) return;

        // Use actual recorded trail positions for the real path
        const trailCoords = selectedFlight.trail && selectedFlight.trail.length > 1
          ? selectedFlight.trail.map(p => [p.lng, p.lat])
          : [];

        // Add current position to trail if not already there
        const currentPos = [selectedFlight.position.lng, selectedFlight.position.lat];
        if (trailCoords.length > 0) {
          const last = trailCoords[trailCoords.length - 1];
          if (last[0] !== currentPos[0] || last[1] !== currentPos[1]) {
            trailCoords.push(currentPos);
          }
        } else {
          trailCoords.push(currentPos);
        }

        // Draw the real recorded trail - bright green
        if (trailCoords.length > 1) {
          map.current.addSource("flight-trail", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: trailCoords },
            },
          });

          map.current.addLayer({
            id: "flight-trail-glow",
            type: "line",
            source: "flight-trail",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#22c55e",
              "line-width": 12,
              "line-opacity": 0.3,
              "line-blur": 6,
            },
          });

          map.current.addLayer({
            id: "flight-trail-line",
            type: "line",
            source: "flight-trail",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#22c55e",
              "line-width": 4,
              "line-opacity": 1,
            },
          });
        }

        // Future route (remaining path) - dashed purple
        const futureCoords = routeCoords.slice(currentIndex);
        if (futureCoords.length > 1) {
          map.current.addSource("flight-future", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: futureCoords },
            },
          });

          map.current.addLayer({
            id: "flight-future-line",
            type: "line",
            source: "flight-future",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#a855f7",
              "line-width": 3,
              "line-opacity": 0.7,
              "line-dasharray": [4, 4],
            },
          });
        }

        // Origin marker - green with pulse
        map.current.addSource("origin-point", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [selectedFlight.origin.lng, selectedFlight.origin.lat],
            },
          },
        });

        map.current.addLayer({
          id: "origin-pulse",
          type: "circle",
          source: "origin-point",
          paint: {
            "circle-radius": 20,
            "circle-color": "#22c55e",
            "circle-opacity": 0.2,
          },
        });

        map.current.addLayer({
          id: "origin-circle",
          type: "circle",
          source: "origin-point",
          paint: {
            "circle-radius": 12,
            "circle-color": "#22c55e",
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Destination marker - red with pulse
        map.current.addSource("dest-point", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [selectedFlight.destination.lng, selectedFlight.destination.lat],
            },
          },
        });

        map.current.addLayer({
          id: "dest-pulse",
          type: "circle",
          source: "dest-point",
          paint: {
            "circle-radius": 20,
            "circle-color": "#ef4444",
            "circle-opacity": 0.2,
          },
        });

        map.current.addLayer({
          id: "dest-circle",
          type: "circle",
          source: "dest-point",
          paint: {
            "circle-radius": 12,
            "circle-color": "#ef4444",
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });
      };

      if (map.current.isStyleLoaded() && styleLoadedRef.current) {
        drawFlightPath();
      } else {
        const handleStyleLoad = () => {
          styleLoadedRef.current = true;
          drawFlightPath();
        };
        map.current.once("styledata", handleStyleLoad);
        return () => {
          map.current?.off("styledata", handleStyleLoad);
        };
      }
    }, [selectedFlight, selectedFlight?.progress, mapLoaded]);

    // Fly to selected flight
    useEffect(() => {
      if (!map.current || !selectedFlight || !mapLoaded) return;

      // Calculate bounds to show entire flight path
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([selectedFlight.origin.lng, selectedFlight.origin.lat]);
      bounds.extend([selectedFlight.destination.lng, selectedFlight.destination.lat]);
      bounds.extend([selectedFlight.position.lng, selectedFlight.position.lat]);

      map.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 100, right: 400 },
        duration: 1500,
        maxZoom: 6,
      });
    }, [selectedFlight?.id, mapLoaded]);

    return (
      <div
        ref={(node) => {
          mapContainer.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className="w-full h-full"
        style={{ minHeight: "100%" }}
      />
    );
  }
));
