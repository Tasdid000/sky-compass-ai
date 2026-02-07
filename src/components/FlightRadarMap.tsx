import { useEffect, useRef, useState, useCallback, forwardRef, memo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LiveFlight } from "@/data/liveFlights";
import { worldAirports, getLargeAirports } from "@/data/airports";

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
}

// Airplane SVG icon as data URL
const createAirplaneIcon = (color: string, size: number = 24): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const FlightRadarMap = memo(forwardRef<HTMLDivElement, FlightRadarMapProps>(
  function FlightRadarMap({ flights, selectedFlight, onFlightSelect, mapStyle = "dark" }, ref) {
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
        center: [10, 30],
        zoom: 2.5,
        minZoom: 1.5,
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

      // Add pulse animation styles
      if (!document.getElementById("flight-radar-styles")) {
        const style = document.createElement("style");
        style.id = "flight-radar-styles";
        style.textContent = `
          @keyframes pulse {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.3); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes trail-fade {
            0% { opacity: 0.8; }
            100% { opacity: 0; }
          }
          .flight-marker { z-index: 10; }
          .flight-marker.selected { z-index: 100; }
          .airport-marker { z-index: 5; }
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

    // Add airport markers based on zoom level
    useEffect(() => {
      if (!map.current || !mapLoaded) return;

      const updateAirportMarkers = () => {
        if (!map.current) return;
        
        const zoom = map.current.getZoom();
        const showAirports = zoom >= 3;
        const showAllAirports = zoom >= 5;
        
        const airportsToShow = showAllAirports ? worldAirports : (showAirports ? getLargeAirports() : []);
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
          if (airportMarkersRef.current.has(airport.code)) return;
          
          const el = document.createElement("div");
          el.className = "airport-marker";
          const dotSize = airport.size === "large" ? 10 : 6;
          el.innerHTML = `
            <div style="
              width: ${dotSize}px;
              height: ${dotSize}px;
              background: ${mapStyle === "light" ? "#1f2937" : "#ffffff"};
              border: 2px solid ${mapStyle === "light" ? "#374151" : "#6b7280"};
              border-radius: 50%;
              cursor: pointer;
              transition: transform 0.2s;
            " title="${airport.code} - ${airport.city}"></div>
          `;
          
          el.addEventListener("mouseenter", () => {
            const inner = el.firstElementChild as HTMLElement;
            if (inner) inner.style.transform = "scale(1.5)";
          });
          el.addEventListener("mouseleave", () => {
            const inner = el.firstElementChild as HTMLElement;
            if (inner) inner.style.transform = "scale(1)";
          });
          
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([airport.lng, airport.lat])
            .addTo(map.current!);
          
          airportMarkersRef.current.set(airport.code, marker);
        });
      };

      updateAirportMarkers();
      map.current.on("zoom", updateAirportMarkers);

      return () => {
        map.current?.off("zoom", updateAirportMarkers);
      };
    }, [mapLoaded, mapStyle]);

    // Create flight marker element
    const createMarkerElement = useCallback(
      (flight: LiveFlight, isSelected: boolean) => {
        const el = document.createElement("div");
        el.className = `flight-marker ${isSelected ? "selected" : ""}`;
        el.style.cssText = `cursor: pointer; transition: transform 0.15s ease;`;

        const altitudeColor =
          flight.position.altitude > 30000
            ? "#fbbf24"
            : flight.position.altitude > 15000
              ? "#22c55e"
              : "#3b82f6";

        const size = isSelected ? 32 : 22;
        const glowSize = isSelected ? 50 : 0;

        el.innerHTML = `
          <div style="
            position: relative;
            width: ${size}px;
            height: ${size}px;
            transform: rotate(${flight.position.heading}deg);
          ">
            ${isSelected ? `
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${glowSize}px;
                height: ${glowSize}px;
                background: radial-gradient(circle, ${altitudeColor}60 0%, transparent 70%);
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
                filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6));
                position: relative;
                z-index: 1;
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
          // Update position smoothly
          existingMarker.setLngLat([flight.position.lng, flight.position.lat]);

          // Update element if selection changed
          const el = existingMarker.getElement();
          const wasSelected = el.classList.contains("selected");
          if (wasSelected !== isSelected) {
            const newEl = createMarkerElement(flight, isSelected);
            newEl.dataset.flightId = flight.id;
            newEl.onclick = (e) => {
              e.stopPropagation();
              onFlightSelect(flight);
            };
            el.replaceWith(newEl);
            existingMarker.getElement = () => newEl;
          } else {
            // Just update rotation
            const innerDiv = el.querySelector("div") as HTMLElement;
            if (innerDiv) {
              innerDiv.style.transform = `rotate(${flight.position.heading}deg)`;
            }
          }
        } else {
          // Create new marker
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

        const sourceIds = ["flight-route", "flight-trail", "origin-point", "dest-point", "current-point"];
        const layerIds = ["flight-route-line", "flight-trail-line", "flight-trail-glow", "origin-circle", "dest-circle", "current-circle"];

        // Clean up existing layers and sources
        layerIds.forEach((id) => {
          if (map.current?.getLayer(id)) {
            map.current.removeLayer(id);
          }
        });
        sourceIds.forEach((id) => {
          if (map.current?.getSource(id)) {
            map.current.removeSource(id);
          }
        });

        if (!selectedFlight) return;

        // Add full route path (dashed line)
        const routeCoords = selectedFlight.greatCirclePath.map(p => [p.lng, p.lat]);
        
        map.current.addSource("flight-route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoords,
            },
          },
        });

        map.current.addLayer({
          id: "flight-route-line",
          type: "line",
          source: "flight-route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#6366f1",
            "line-width": 2,
            "line-opacity": 0.4,
            "line-dasharray": [4, 4],
          },
        });

        // Add live trail (solid glowing line showing where plane has been)
        if (selectedFlight.trail.length > 1) {
          const trailCoords = selectedFlight.trail.map(p => [p.lng, p.lat]);
          
          map.current.addSource("flight-trail", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: trailCoords,
              },
            },
          });

          // Glow effect
          map.current.addLayer({
            id: "flight-trail-glow",
            type: "line",
            source: "flight-trail",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#22c55e",
              "line-width": 8,
              "line-opacity": 0.3,
              "line-blur": 4,
            },
          });

          map.current.addLayer({
            id: "flight-trail-line",
            type: "line",
            source: "flight-trail",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#22c55e",
              "line-width": 3,
              "line-opacity": 0.9,
            },
          });
        }

        // Origin marker
        map.current.addSource("origin-point", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: { label: selectedFlight.origin.code },
            geometry: {
              type: "Point",
              coordinates: [selectedFlight.origin.lng, selectedFlight.origin.lat],
            },
          },
        });

        map.current.addLayer({
          id: "origin-circle",
          type: "circle",
          source: "origin-point",
          paint: {
            "circle-radius": 10,
            "circle-color": "#22c55e",
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Destination marker
        map.current.addSource("dest-point", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: { label: selectedFlight.destination.code },
            geometry: {
              type: "Point",
              coordinates: [selectedFlight.destination.lng, selectedFlight.destination.lat],
            },
          },
        });

        map.current.addLayer({
          id: "dest-circle",
          type: "circle",
          source: "dest-point",
          paint: {
            "circle-radius": 10,
            "circle-color": "#ef4444",
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });
      };

      // Wait for style to be fully loaded
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
    }, [selectedFlight, mapLoaded]);

    // Fly to selected flight
    useEffect(() => {
      if (!map.current || !selectedFlight || !mapLoaded) return;

      map.current.flyTo({
        center: [selectedFlight.position.lng, selectedFlight.position.lat],
        zoom: 5,
        duration: 1500,
        essential: true,
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
