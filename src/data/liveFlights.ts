import type { FlightTrackingData } from "@/types/flight";
import { worldAirports, Airport } from "./airports";

// Re-export airports for backward compatibility
export const majorAirports = worldAirports;

export const airlines = [
  { code: "AA", name: "American Airlines", color: "#0078D2" },
  { code: "UA", name: "United Airlines", color: "#002244" },
  { code: "DL", name: "Delta Air Lines", color: "#003366" },
  { code: "BA", name: "British Airways", color: "#075AAA" },
  { code: "LH", name: "Lufthansa", color: "#05164D" },
  { code: "AF", name: "Air France", color: "#002157" },
  { code: "EK", name: "Emirates", color: "#D71921" },
  { code: "QF", name: "Qantas", color: "#E0001B" },
  { code: "SQ", name: "Singapore Airlines", color: "#00215E" },
  { code: "CX", name: "Cathay Pacific", color: "#006564" },
  { code: "NH", name: "All Nippon Airways", color: "#00467F" },
  { code: "TK", name: "Turkish Airlines", color: "#C8102E" },
  { code: "QR", name: "Qatar Airways", color: "#5C0632" },
  { code: "EY", name: "Etihad Airways", color: "#BD8B13" },
  { code: "VS", name: "Virgin Atlantic", color: "#E10A0A" },
  { code: "KL", name: "KLM Royal Dutch", color: "#00A1DE" },
  { code: "IB", name: "Iberia", color: "#D90714" },
  { code: "AZ", name: "ITA Airways", color: "#01426A" },
  { code: "LX", name: "Swiss International", color: "#E2001A" },
  { code: "OS", name: "Austrian Airlines", color: "#E10019" },
  { code: "SK", name: "Scandinavian Airlines", color: "#000080" },
  { code: "AY", name: "Finnair", color: "#0B1560" },
  { code: "EI", name: "Aer Lingus", color: "#006272" },
  { code: "TP", name: "TAP Portugal", color: "#FF0000" },
  { code: "CA", name: "Air China", color: "#E30D17" },
  { code: "MU", name: "China Eastern", color: "#0F4C8C" },
  { code: "CZ", name: "China Southern", color: "#008BD0" },
  { code: "JL", name: "Japan Airlines", color: "#C6002C" },
  { code: "KE", name: "Korean Air", color: "#0064B4" },
  { code: "OZ", name: "Asiana Airlines", color: "#C60C30" },
  { code: "TG", name: "Thai Airways", color: "#6B2C91" },
  { code: "MH", name: "Malaysia Airlines", color: "#ED1C24" },
  { code: "GA", name: "Garuda Indonesia", color: "#008C99" },
  { code: "PR", name: "Philippine Airlines", color: "#0033A0" },
  { code: "VN", name: "Vietnam Airlines", color: "#00447C" },
  { code: "AI", name: "Air India", color: "#E22D36" },
  { code: "ET", name: "Ethiopian Airlines", color: "#006747" },
  { code: "SA", name: "South African Airways", color: "#006847" },
  { code: "MS", name: "EgyptAir", color: "#173B7A" },
  { code: "RJ", name: "Royal Jordanian", color: "#00529F" },
  { code: "SV", name: "Saudia", color: "#046A38" },
  { code: "GF", name: "Gulf Air", color: "#AF1F2D" },
  { code: "WN", name: "Southwest Airlines", color: "#304CB2" },
  { code: "AC", name: "Air Canada", color: "#F01428" },
  { code: "AM", name: "Aeromexico", color: "#0B2343" },
  { code: "LA", name: "LATAM Airlines", color: "#ED1A3A" },
  { code: "AV", name: "Avianca", color: "#E31837" },
  { code: "CM", name: "Copa Airlines", color: "#005DAA" },
  { code: "AR", name: "Aerolíneas Argentinas", color: "#1C75BC" },
];

const aircraftTypes = [
  { type: "B777", name: "Boeing 777-300ER", speed: 560 },
  { type: "B787", name: "Boeing 787-9 Dreamliner", speed: 570 },
  { type: "A380", name: "Airbus A380-800", speed: 560 },
  { type: "A350", name: "Airbus A350-1000", speed: 568 },
  { type: "B747", name: "Boeing 747-8", speed: 570 },
  { type: "A320", name: "Airbus A320neo", speed: 515 },
  { type: "B737", name: "Boeing 737 MAX 8", speed: 521 },
  { type: "A330", name: "Airbus A330-900neo", speed: 560 },
  { type: "B767", name: "Boeing 767-300ER", speed: 530 },
  { type: "A321", name: "Airbus A321neo", speed: 515 },
  { type: "B757", name: "Boeing 757-200", speed: 528 },
  { type: "E190", name: "Embraer E190-E2", speed: 470 },
  { type: "A220", name: "Airbus A220-300", speed: 470 },
];

// Calculate bearing between two points
function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

// Calculate distance between two points using Haversine formula
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

// Calculate intermediate point on great circle path
function getGreatCirclePoint(
  lat1: number, lng1: number, 
  lat2: number, lng2: number, 
  fraction: number
): { lat: number; lng: number } {
  const lat1Rad = lat1 * Math.PI / 180;
  const lng1Rad = lng1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const lng2Rad = lng2 * Math.PI / 180;
  
  const d = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin((lat2Rad - lat1Rad) / 2), 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow(Math.sin((lng2Rad - lng1Rad) / 2), 2)
  ));
  
  if (d === 0) return { lat: lat1, lng: lng1 };
  
  const A = Math.sin((1 - fraction) * d) / Math.sin(d);
  const B = Math.sin(fraction * d) / Math.sin(d);
  
  const x = A * Math.cos(lat1Rad) * Math.cos(lng1Rad) + B * Math.cos(lat2Rad) * Math.cos(lng2Rad);
  const y = A * Math.cos(lat1Rad) * Math.sin(lng1Rad) + B * Math.cos(lat2Rad) * Math.sin(lng2Rad);
  const z = A * Math.sin(lat1Rad) + B * Math.sin(lat2Rad);
  
  const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
  const lng = Math.atan2(y, x) * 180 / Math.PI;
  
  return { lat, lng };
}

// Generate great circle path points
export function generateGreatCirclePath(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  numPoints: number = 50
): Array<{ lat: number; lng: number }> {
  const points: Array<{ lat: number; lng: number }> = [];
  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints;
    points.push(getGreatCirclePoint(origin.lat, origin.lng, destination.lat, destination.lng, fraction));
  }
  return points;
}

// Generate realistic flight routes between airports
function generateFlightRoutes(count: number): Array<{
  origin: Airport;
  destination: Airport;
}> {
  const routes: Array<{ origin: Airport; destination: Airport }> = [];
  const largeAirports = worldAirports.filter(a => a.size === "large");
  const allAirports = worldAirports;
  
  // Create hub-and-spoke routes from major hubs
  const majorHubs = ["JFK", "LHR", "DXB", "SIN", "HKG", "FRA", "LAX", "CDG", "PEK", "SYD", "ATL", "ORD"];
  
  for (let i = 0; i < count; i++) {
    let origin: Airport;
    let destination: Airport;
    
    if (i % 3 === 0) {
      // Hub to hub (long haul international)
      const hubCode = majorHubs[Math.floor(Math.random() * majorHubs.length)];
      const otherHubCode = majorHubs.filter(h => h !== hubCode)[Math.floor(Math.random() * (majorHubs.length - 1))];
      origin = worldAirports.find(a => a.code === hubCode) || largeAirports[0];
      destination = worldAirports.find(a => a.code === otherHubCode) || largeAirports[1];
    } else if (i % 3 === 1) {
      // Regional flights (same continent)
      const regions = ["North America", "Europe", "Asia", "Middle East", "Oceania", "South America", "Africa"];
      const region = regions[Math.floor(Math.random() * regions.length)];
      const regionalAirports = worldAirports.filter(a => a.region === region);
      if (regionalAirports.length >= 2) {
        origin = regionalAirports[Math.floor(Math.random() * regionalAirports.length)];
        destination = regionalAirports.filter(a => a.code !== origin.code)[Math.floor(Math.random() * (regionalAirports.length - 1))];
      } else {
        origin = largeAirports[Math.floor(Math.random() * largeAirports.length)];
        destination = largeAirports.filter(a => a.code !== origin.code)[Math.floor(Math.random() * (largeAirports.length - 1))];
      }
    } else {
      // Random long haul
      origin = allAirports[Math.floor(Math.random() * allAirports.length)];
      destination = allAirports.filter(a => a.code !== origin.code && a.region !== origin.region)[Math.floor(Math.random() * (allAirports.length - 1))] || largeAirports[0];
    }
    
    if (origin && destination && origin.code !== destination.code) {
      routes.push({ origin, destination });
    }
  }
  
  return routes;
}

export interface FlightTrailPoint {
  lat: number;
  lng: number;
  altitude: number;
  timestamp: number;
}

export interface LiveFlight {
  id: string;
  flightNumber: string;
  callsign: string;
  airline: typeof airlines[0];
  aircraft: typeof aircraftTypes[0];
  origin: Airport;
  destination: Airport;
  position: {
    lat: number;
    lng: number;
    altitude: number;
    speed: number;
    heading: number;
    verticalSpeed: number;
  };
  progress: number;
  status: "climbing" | "cruising" | "descending" | "on-ground";
  departureTime: Date;
  arrivalTime: Date;
  distance: number;
  remainingDistance: number;
  eta: string;
  trail: FlightTrailPoint[]; // Flight trail for live path
  greatCirclePath: Array<{ lat: number; lng: number }>; // Full route path
}

// Generate initial live flights
export function generateLiveFlights(count: number = 150): LiveFlight[] {
  const routes = generateFlightRoutes(count);
  const flights: LiveFlight[] = [];
  
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    
    // Random progress along route (5-95%)
    const progress = 5 + Math.random() * 90;
    
    // Generate great circle path
    const greatCirclePath = generateGreatCirclePath(
      { lat: route.origin.lat, lng: route.origin.lng },
      { lat: route.destination.lat, lng: route.destination.lng },
      100
    );
    
    // Calculate current position on great circle
    const pathIndex = Math.floor((progress / 100) * (greatCirclePath.length - 1));
    const currentPos = greatCirclePath[pathIndex];
    
    // Calculate heading to next point
    const nextIndex = Math.min(pathIndex + 1, greatCirclePath.length - 1);
    const heading = calculateBearing(currentPos.lat, currentPos.lng, greatCirclePath[nextIndex].lat, greatCirclePath[nextIndex].lng);
    
    // Calculate distance
    const totalDistance = calculateDistance(route.origin.lat, route.origin.lng, route.destination.lat, route.destination.lng);
    const remainingDistance = totalDistance * (1 - progress / 100);
    
    // Determine status and altitude based on progress
    let status: LiveFlight["status"];
    let altitude: number;
    let verticalSpeed: number;
    
    if (progress < 10) {
      status = "climbing";
      altitude = 5000 + (progress / 10) * 30000;
      verticalSpeed = 2000 + Math.random() * 1000;
    } else if (progress > 90) {
      status = "descending";
      altitude = 35000 - ((progress - 90) / 10) * 30000;
      verticalSpeed = -(1500 + Math.random() * 500);
    } else {
      status = "cruising";
      altitude = 32000 + Math.random() * 8000;
      verticalSpeed = Math.random() * 200 - 100;
    }
    
    // Calculate times
    const flightDuration = (totalDistance / aircraft.speed) * 60; // minutes
    const departureTime = new Date();
    departureTime.setMinutes(departureTime.getMinutes() - (flightDuration * progress / 100));
    const arrivalTime = new Date(departureTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + flightDuration);
    
    // Calculate ETA
    const remainingMinutes = Math.round(remainingDistance / aircraft.speed * 60);
    const etaHours = Math.floor(remainingMinutes / 60);
    const etaMins = remainingMinutes % 60;
    const eta = etaHours > 0 ? `${etaHours}h ${etaMins}m` : `${etaMins}m`;
    
    const flightNum = Math.floor(Math.random() * 9000) + 1000;
    
    // Generate initial trail (past 20 points of flight path)
    const trail: FlightTrailPoint[] = [];
    const trailStart = Math.max(0, pathIndex - 20);
    for (let j = trailStart; j <= pathIndex; j++) {
      const trailProgress = (j / (greatCirclePath.length - 1)) * 100;
      let trailAltitude: number;
      if (trailProgress < 10) {
        trailAltitude = 5000 + (trailProgress / 10) * 30000;
      } else if (trailProgress > 90) {
        trailAltitude = 35000 - ((trailProgress - 90) / 10) * 30000;
      } else {
        trailAltitude = 32000 + Math.random() * 2000;
      }
      trail.push({
        lat: greatCirclePath[j].lat,
        lng: greatCirclePath[j].lng,
        altitude: trailAltitude,
        timestamp: Date.now() - (pathIndex - j) * 30000, // 30 seconds between points
      });
    }
    
    flights.push({
      id: `${airline.code}${flightNum}-${i}`,
      flightNumber: `${airline.code}${flightNum}`,
      callsign: `${airline.code}${flightNum}`,
      airline,
      aircraft,
      origin: route.origin,
      destination: route.destination,
      position: {
        lat: currentPos.lat,
        lng: currentPos.lng,
        altitude: Math.round(altitude),
        speed: Math.round(aircraft.speed * (0.9 + Math.random() * 0.2)),
        heading: Math.round(heading),
        verticalSpeed: Math.round(verticalSpeed),
      },
      progress,
      status,
      departureTime,
      arrivalTime,
      distance: Math.round(totalDistance),
      remainingDistance: Math.round(remainingDistance),
      eta,
      trail,
      greatCirclePath,
    });
  }
  
  return flights;
}

// Update flight positions (simulate movement)
export function updateFlightPositions(flights: LiveFlight[], deltaTime: number = 1): LiveFlight[] {
  return flights.map(flight => {
    // Calculate new progress
    const flightDuration = flight.distance / flight.position.speed * 3600; // in seconds
    const progressIncrement = (deltaTime / flightDuration) * 100;
    let newProgress = flight.progress + progressIncrement;
    
    // If flight completed, reset with new random progress
    if (newProgress >= 98) {
      newProgress = 5 + Math.random() * 15;
      // Clear trail for reset flights
      return {
        ...flight,
        progress: newProgress,
        trail: [],
      };
    }
    
    // Calculate new position on great circle path
    const pathIndex = Math.floor((newProgress / 100) * (flight.greatCirclePath.length - 1));
    const currentPos = flight.greatCirclePath[Math.min(pathIndex, flight.greatCirclePath.length - 1)];
    
    // Calculate heading to next point
    const nextIndex = Math.min(pathIndex + 1, flight.greatCirclePath.length - 1);
    const heading = calculateBearing(
      currentPos.lat, currentPos.lng,
      flight.greatCirclePath[nextIndex].lat, flight.greatCirclePath[nextIndex].lng
    );
    
    // Update altitude and status based on progress
    let status: LiveFlight["status"];
    let altitude: number;
    let verticalSpeed: number;
    
    if (newProgress < 10) {
      status = "climbing";
      altitude = 5000 + (newProgress / 10) * 30000;
      verticalSpeed = 2000 + Math.random() * 500;
    } else if (newProgress > 90) {
      status = "descending";
      altitude = 35000 - ((newProgress - 90) / 10) * 30000;
      verticalSpeed = -(1500 + Math.random() * 300);
    } else {
      status = "cruising";
      altitude = flight.position.altitude + (Math.random() - 0.5) * 500;
      altitude = Math.max(30000, Math.min(42000, altitude));
      verticalSpeed = Math.random() * 200 - 100;
    }
    
    const remainingDistance = flight.distance * (1 - newProgress / 100);
    const remainingMinutes = Math.round(remainingDistance / flight.position.speed * 60);
    const etaHours = Math.floor(remainingMinutes / 60);
    const etaMins = remainingMinutes % 60;
    const eta = etaHours > 0 ? `${etaHours}h ${etaMins}m` : `${etaMins}m`;
    
    // Update trail (keep last 30 points for smooth animation)
    const newTrail = [...flight.trail];
    
    // Add new point if position changed significantly
    const lastTrailPoint = newTrail[newTrail.length - 1];
    if (!lastTrailPoint || 
        Math.abs(lastTrailPoint.lat - currentPos.lat) > 0.01 || 
        Math.abs(lastTrailPoint.lng - currentPos.lng) > 0.01) {
      newTrail.push({
        lat: currentPos.lat,
        lng: currentPos.lng,
        altitude: Math.round(altitude),
        timestamp: Date.now(),
      });
    }
    
    // Keep only last 30 trail points
    while (newTrail.length > 30) {
      newTrail.shift();
    }
    
    return {
      ...flight,
      progress: newProgress,
      status,
      position: {
        lat: currentPos.lat,
        lng: currentPos.lng,
        altitude: Math.round(altitude),
        speed: flight.position.speed + Math.round((Math.random() - 0.5) * 10),
        heading: Math.round(heading),
        verticalSpeed: Math.round(verticalSpeed),
      },
      remainingDistance: Math.round(remainingDistance),
      eta,
      trail: newTrail,
    };
  });
}
