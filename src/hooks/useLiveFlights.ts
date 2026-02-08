import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LiveFlight, airlines, generateGreatCirclePath } from "@/data/liveFlights";
import { worldAirports } from "@/data/airports";

interface OpenSkyFlight {
  icao24: string;
  callsign: string;
  originCountry: string;
  position: {
    lat: number;
    lng: number;
    altitude: number;
    speed: number;
    heading: number;
    verticalRate: number;
  };
  lastContact: number;
  onGround: boolean;
  squawk: string | null;
  category: number | null;
}

interface UseLiveFlightsOptions {
  enabled?: boolean;
  refreshInterval?: number;
  bounds?: {
    lamin: number;
    lomin: number;
    lamax: number;
    lomax: number;
  };
}

// Map callsign prefixes to airlines
const airlineCodeMap: Record<string, typeof airlines[0]> = {
  "UAL": airlines.find(a => a.code === "UA")!,
  "AAL": airlines.find(a => a.code === "AA")!,
  "DAL": airlines.find(a => a.code === "DL")!,
  "SWA": airlines.find(a => a.code === "WN")!,
  "BAW": airlines.find(a => a.code === "BA")!,
  "AFR": airlines.find(a => a.code === "AF")!,
  "DLH": airlines.find(a => a.code === "LH")!,
  "UAE": airlines.find(a => a.code === "EK")!,
  "QFA": airlines.find(a => a.code === "QF")!,
  "SIA": airlines.find(a => a.code === "SQ")!,
  "ANA": airlines.find(a => a.code === "NH")!,
  "JAL": airlines.find(a => a.code === "JL")!,
  "KLM": airlines.find(a => a.code === "KL")!,
  "EZY": { code: "U2", name: "easyJet", color: "#FF6600" },
  "RYR": { code: "FR", name: "Ryanair", color: "#073590" },
  "THY": airlines.find(a => a.code === "TK")!,
  "CPA": airlines.find(a => a.code === "CX")!,
  "QTR": airlines.find(a => a.code === "QR")!,
  "ETD": airlines.find(a => a.code === "EY")!,
  "VIR": airlines.find(a => a.code === "VS")!,
  "FIN": airlines.find(a => a.code === "AY")!,
  "SAS": airlines.find(a => a.code === "SK")!,
  "TAP": airlines.find(a => a.code === "TP")!,
  "IBE": airlines.find(a => a.code === "IB")!,
  "AZA": airlines.find(a => a.code === "AZ")!,
  "ACA": airlines.find(a => a.code === "AC")!,
  "CCA": airlines.find(a => a.code === "CA")!,
  "CES": airlines.find(a => a.code === "MU")!,
  "CSN": airlines.find(a => a.code === "CZ")!,
  "KAL": airlines.find(a => a.code === "KE")!,
  "AAR": airlines.find(a => a.code === "OZ")!,
  "THA": airlines.find(a => a.code === "TG")!,
  "MAS": airlines.find(a => a.code === "MH")!,
  "GIA": airlines.find(a => a.code === "GA")!,
  "PAL": airlines.find(a => a.code === "PR")!,
  "HVN": airlines.find(a => a.code === "VN")!,
  "AIC": airlines.find(a => a.code === "AI")!,
  "ETH": airlines.find(a => a.code === "ET")!,
};

// Aircraft type guessing based on category
const aircraftTypes = [
  { type: "B737", name: "Boeing 737 MAX 8", speed: 521 },
  { type: "A320", name: "Airbus A320neo", speed: 515 },
  { type: "B777", name: "Boeing 777-300ER", speed: 560 },
  { type: "A350", name: "Airbus A350-1000", speed: 568 },
  { type: "B787", name: "Boeing 787-9 Dreamliner", speed: 570 },
  { type: "A380", name: "Airbus A380-800", speed: 560 },
];

const categoryToAircraft: Record<number, typeof aircraftTypes[0]> = {
  1: { type: "C172", name: "Cessna 172", speed: 140 },
  2: { type: "B350", name: "Beechcraft King Air", speed: 310 },
  3: aircraftTypes[0],
  4: { type: "B757", name: "Boeing 757-200", speed: 528 },
  5: aircraftTypes[2],
  6: { type: "G650", name: "Gulfstream G650", speed: 560 },
  7: { type: "H160", name: "Airbus H160", speed: 180 },
};

// Find nearest airport to a position
function findNearestAirport(lat: number, lng: number): typeof worldAirports[0] {
  let nearest = worldAirports[0];
  let minDist = Infinity;
  
  for (const airport of worldAirports) {
    const dist = Math.sqrt(
      Math.pow(airport.lat - lat, 2) + 
      Math.pow(airport.lng - lng, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = airport;
    }
  }
  
  return nearest;
}

// Get airline from callsign
function getAirlineFromCallsign(callsign: string): typeof airlines[0] {
  const prefix = callsign.substring(0, 3).toUpperCase();
  const mapped = airlineCodeMap[prefix];
  if (mapped) return mapped;
  
  // Return a random airline for unknown callsigns
  return airlines[Math.floor(Math.random() * airlines.length)];
}

// Calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Track position history for trails
const positionHistory = new Map<string, Array<{ lat: number; lng: number; altitude: number; timestamp: number }>>();

export function useLiveFlights(options: UseLiveFlightsOptions = {}) {
  const { 
    enabled = true, 
    refreshInterval = 10000, // 10 seconds default
    bounds 
  } = options;

  const [flights, setFlights] = useState<LiveFlight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const retryCount = useRef(0);
  const maxRetries = 3;

  const fetchFlights = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (bounds) {
        params.append("lamin", bounds.lamin.toString());
        params.append("lomin", bounds.lomin.toString());
        params.append("lamax", bounds.lamax.toString());
        params.append("lomax", bounds.lomax.toString());
      }

      const { data, error: fetchError } = await supabase.functions.invoke("opensky-flights", {
        body: null,
        method: "GET",
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const openSkyFlights: OpenSkyFlight[] = data.flights || [];
      
      // Transform to LiveFlight format
      const liveFlights: LiveFlight[] = openSkyFlights.map((osf) => {
        const airline = getAirlineFromCallsign(osf.callsign);
        const aircraft = categoryToAircraft[osf.category || 3] || aircraftTypes[0];
        
        // Estimate origin and destination based on heading and position
        const headingRad = osf.position.heading * Math.PI / 180;
        const origin = findNearestAirport(
          osf.position.lat - Math.cos(headingRad) * 5,
          osf.position.lng - Math.sin(headingRad) * 5
        );
        const destination = findNearestAirport(
          osf.position.lat + Math.cos(headingRad) * 10,
          osf.position.lng + Math.sin(headingRad) * 10
        );

        // Update position history for trails
        const historyKey = osf.icao24;
        const currentHistory = positionHistory.get(historyKey) || [];
        currentHistory.push({
          lat: osf.position.lat,
          lng: osf.position.lng,
          altitude: osf.position.altitude,
          timestamp: Date.now(),
        });
        // Keep last 30 positions
        if (currentHistory.length > 30) {
          currentHistory.shift();
        }
        positionHistory.set(historyKey, currentHistory);

        // Calculate progress based on altitude (cruising = middle of flight)
        let progress = 50;
        let status: LiveFlight["status"] = "cruising";
        if (osf.position.altitude < 10000) {
          if (osf.position.verticalRate > 500) {
            progress = 10;
            status = "climbing";
          } else if (osf.position.verticalRate < -500) {
            progress = 90;
            status = "descending";
          }
        } else if (osf.position.altitude > 30000) {
          progress = 50;
          status = "cruising";
        }

        // Calculate distance and remaining
        const totalDistance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
        const remainingDistance = totalDistance * (1 - progress / 100);

        // Calculate times
        const flightDuration = (totalDistance / aircraft.speed) * 60;
        const departureTime = new Date();
        departureTime.setMinutes(departureTime.getMinutes() - (flightDuration * progress / 100));
        const arrivalTime = new Date(departureTime);
        arrivalTime.setMinutes(arrivalTime.getMinutes() + flightDuration);

        // Calculate ETA
        const remainingMinutes = Math.round(remainingDistance / aircraft.speed * 60);
        const etaHours = Math.floor(remainingMinutes / 60);
        const etaMins = remainingMinutes % 60;
        const eta = etaHours > 0 ? `${etaHours}h ${etaMins}m` : `${etaMins}m`;

        // Generate great circle path
        const greatCirclePath = generateGreatCirclePath(
          { lat: origin.lat, lng: origin.lng },
          { lat: destination.lat, lng: destination.lng },
          100
        );

        return {
          id: osf.icao24,
          flightNumber: osf.callsign,
          callsign: osf.callsign,
          airline,
          aircraft,
          origin: {
            code: origin.code,
            name: origin.name,
            city: origin.city,
            country: origin.country,
            region: origin.region,
            lat: origin.lat,
            lng: origin.lng,
            size: origin.size,
          },
          destination: {
            code: destination.code,
            name: destination.name,
            city: destination.city,
            country: destination.country,
            region: destination.region,
            lat: destination.lat,
            lng: destination.lng,
            size: destination.size,
          },
          position: {
            lat: osf.position.lat,
            lng: osf.position.lng,
            altitude: osf.position.altitude,
            speed: osf.position.speed,
            heading: osf.position.heading,
            verticalSpeed: osf.position.verticalRate,
          },
          progress,
          status,
          departureTime,
          arrivalTime,
          distance: Math.round(totalDistance),
          remainingDistance: Math.round(remainingDistance),
          eta,
          trail: currentHistory,
          greatCirclePath,
        };
      });

      setFlights(liveFlights);
      setLastUpdate(new Date());
      setIsLive(true);
      retryCount.current = 0;

    } catch (err) {
      console.error("Error fetching live flights:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsLive(false);
      
      // Retry logic
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        console.log(`Retrying... (${retryCount.current}/${maxRetries})`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [enabled, bounds]);

  // Initial fetch and interval
  useEffect(() => {
    if (!enabled) return;

    fetchFlights();
    const interval = setInterval(fetchFlights, refreshInterval);
    
    return () => clearInterval(interval);
  }, [enabled, refreshInterval, fetchFlights]);

  return {
    flights,
    isLoading,
    error,
    lastUpdate,
    isLive,
    refetch: fetchFlights,
  };
}
