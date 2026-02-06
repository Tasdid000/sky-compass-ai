import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LiveFlight } from "@/data/liveFlights";

// Public access token for demo - works for development
mapboxgl.accessToken = "pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNsdjVxdnNpODBhMHYyam1ubzV6NTVxeWsifQ.HjKQyBqLlvQ-n8LNeuKzBQ";

interface FlightRadarMapProps {
  flights: LiveFlight[];
  selectedFlight: LiveFlight | null;
  onFlightSelect: (flight: LiveFlight | null) => void;
  mapStyle?: "dark" | "light" | "satellite";
}

export function FlightRadarMap({ 
  flights, 
  selectedFlight, 
  onFlightSelect,
  mapStyle = "dark" 
}: FlightRadarMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Map style URLs
  const styleUrls = {
    dark: "mapbox://styles/mapbox/dark-v11",
    light: "mapbox://styles/mapbox/light-v11",
    satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleUrls[mapStyle],
      center: [0, 30],
      zoom: 2,
      projection: "mercator",
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Click on map to deselect
    map.current.on("click", (e) => {
      // Check if clicked on a marker
      const target = e.originalEvent.target as HTMLElement;
      if (!target.closest(".flight-marker")) {
        onFlightSelect(null);
      }
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map style
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.setStyle(styleUrls[mapStyle]);
    }
  }, [mapStyle, mapLoaded]);

  // Create flight marker element
  const createMarkerElement = useCallback((flight: LiveFlight, isSelected: boolean) => {
    const el = document.createElement("div");
    el.className = "flight-marker";
    el.style.cssText = `
      cursor: pointer;
      transition: transform 0.15s ease;
    `;

    // Airplane icon color based on altitude
    const altitudeColor = flight.position.altitude > 30000 
      ? "#fbbf24" // yellow for high altitude
      : flight.position.altitude > 15000 
        ? "#22c55e" // green for mid altitude
        : "#3b82f6"; // blue for low altitude

    const size = isSelected ? 28 : 20;
    const glowSize = isSelected ? 40 : 0;

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
            background: radial-gradient(circle, ${altitudeColor}40 0%, transparent 70%);
            border-radius: 50%;
            animation: pulse 2s infinite;
          "></div>
        ` : ''}
        <svg 
          viewBox="0 0 24 24" 
          width="${size}" 
          height="${size}" 
          fill="${isSelected ? '#ffffff' : altitudeColor}"
          style="
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
            position: relative;
            z-index: 1;
          "
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    `;

    // Add pulse animation style
    if (!document.getElementById("flight-marker-styles")) {
      const style = document.createElement("style");
      style.id = "flight-marker-styles";
      style.textContent = `
        @keyframes pulse {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.2); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    return el;
  }, []);

  // Update markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const existingIds = new Set(markersRef.current.keys());
    const newIds = new Set(flights.map(f => f.id));

    // Remove markers for flights that no longer exist
    existingIds.forEach(id => {
      if (!newIds.has(id)) {
        markersRef.current.get(id)?.remove();
        markersRef.current.delete(id);
      }
    });

    // Add or update markers
    flights.forEach(flight => {
      const isSelected = selectedFlight?.id === flight.id;
      const existingMarker = markersRef.current.get(flight.id);

      if (existingMarker) {
        // Update position
        existingMarker.setLngLat([flight.position.lng, flight.position.lat]);
        
        // Update element if selection changed
        const el = existingMarker.getElement();
        const wasSelected = el.dataset.selected === "true";
        if (wasSelected !== isSelected) {
          const newEl = createMarkerElement(flight, isSelected);
          newEl.dataset.selected = String(isSelected);
          newEl.onclick = (e) => {
            e.stopPropagation();
            onFlightSelect(flight);
          };
          existingMarker.getElement().replaceWith(newEl);
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
        el.dataset.selected = String(isSelected);
        el.onclick = (e) => {
          e.stopPropagation();
          onFlightSelect(flight);
        };

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([flight.position.lng, flight.position.lat])
          .addTo(map.current!);

        markersRef.current.set(flight.id, marker);
      }
    });
  }, [flights, selectedFlight, mapLoaded, createMarkerElement, onFlightSelect]);

  // Fly to selected flight
  useEffect(() => {
    if (!map.current || !selectedFlight || !mapLoaded) return;

    map.current.flyTo({
      center: [selectedFlight.position.lng, selectedFlight.position.lat],
      zoom: 5,
      duration: 1000,
    });

    // Draw flight path
    const sourceId = "selected-flight-path";
    const layerId = "selected-flight-path-line";

    // Remove existing path
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }
    if (map.current.getSource(sourceId)) {
      map.current.removeSource(sourceId);
    }

    // Add new path
    map.current.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [selectedFlight.origin.lng, selectedFlight.origin.lat],
            [selectedFlight.position.lng, selectedFlight.position.lat],
            [selectedFlight.destination.lng, selectedFlight.destination.lat],
          ],
        },
      },
    });

    map.current.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": ["interpolate", ["linear"], ["line-progress"], 
          0, "#3b82f6",
          selectedFlight.progress / 100, "#fbbf24",
          1, "#3b82f6"
        ],
        "line-width": 3,
        "line-opacity": 0.8,
        "line-dasharray": [0, 4, 3],
      },
    });

    // Add origin marker
    const originMarkerId = "origin-marker";
    if (map.current.getLayer(originMarkerId)) {
      map.current.removeLayer(originMarkerId);
    }
    if (map.current.getSource(originMarkerId)) {
      map.current.removeSource(originMarkerId);
    }

    map.current.addSource(originMarkerId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: { code: selectedFlight.origin.code },
        geometry: {
          type: "Point",
          coordinates: [selectedFlight.origin.lng, selectedFlight.origin.lat],
        },
      },
    });

    map.current.addLayer({
      id: originMarkerId,
      type: "circle",
      source: originMarkerId,
      paint: {
        "circle-radius": 8,
        "circle-color": "#22c55e",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    // Add destination marker
    const destMarkerId = "dest-marker";
    if (map.current.getLayer(destMarkerId)) {
      map.current.removeLayer(destMarkerId);
    }
    if (map.current.getSource(destMarkerId)) {
      map.current.removeSource(destMarkerId);
    }

    map.current.addSource(destMarkerId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: { code: selectedFlight.destination.code },
        geometry: {
          type: "Point",
          coordinates: [selectedFlight.destination.lng, selectedFlight.destination.lat],
        },
      },
    });

    map.current.addLayer({
      id: destMarkerId,
      type: "circle",
      source: destMarkerId,
      paint: {
        "circle-radius": 8,
        "circle-color": "#ef4444",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

  }, [selectedFlight, mapLoaded]);

  // Cleanup flight path when deselected
  useEffect(() => {
    if (!map.current || !mapLoaded || selectedFlight) return;

    const layersToRemove = ["selected-flight-path-line", "origin-marker", "dest-marker"];
    const sourcesToRemove = ["selected-flight-path", "origin-marker", "dest-marker"];

    layersToRemove.forEach(id => {
      if (map.current?.getLayer(id)) {
        map.current.removeLayer(id);
      }
    });

    sourcesToRemove.forEach(id => {
      if (map.current?.getSource(id)) {
        map.current.removeSource(id);
      }
    });
  }, [selectedFlight, mapLoaded]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: "100%" }}
    />
  );
}
