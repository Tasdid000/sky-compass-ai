import type { FlightTrackingData } from "@/types/flight";

// Major airports with coordinates
export const majorAirports = [
  { code: "JFK", city: "New York", country: "USA", lat: 40.6413, lng: -73.7781 },
  { code: "LAX", city: "Los Angeles", country: "USA", lat: 33.9425, lng: -118.4081 },
  { code: "LHR", city: "London", country: "UK", lat: 51.4700, lng: -0.4543 },
  { code: "CDG", city: "Paris", country: "France", lat: 49.0097, lng: 2.5479 },
  { code: "DXB", city: "Dubai", country: "UAE", lat: 25.2532, lng: 55.3657 },
  { code: "HND", city: "Tokyo", country: "Japan", lat: 35.5494, lng: 139.7798 },
  { code: "SIN", city: "Singapore", country: "Singapore", lat: 1.3644, lng: 103.9915 },
  { code: "SYD", city: "Sydney", country: "Australia", lat: -33.9399, lng: 151.1753 },
  { code: "FRA", city: "Frankfurt", country: "Germany", lat: 50.0379, lng: 8.5622 },
  { code: "AMS", city: "Amsterdam", country: "Netherlands", lat: 52.3105, lng: 4.7683 },
  { code: "HKG", city: "Hong Kong", country: "China", lat: 22.3080, lng: 113.9185 },
  { code: "ICN", city: "Seoul", country: "South Korea", lat: 37.4602, lng: 126.4407 },
  { code: "BKK", city: "Bangkok", country: "Thailand", lat: 13.6900, lng: 100.7501 },
  { code: "IST", city: "Istanbul", country: "Turkey", lat: 41.2753, lng: 28.7519 },
  { code: "MEX", city: "Mexico City", country: "Mexico", lat: 19.4361, lng: -99.0719 },
  { code: "GRU", city: "São Paulo", country: "Brazil", lat: -23.4356, lng: -46.4731 },
  { code: "JNB", city: "Johannesburg", country: "South Africa", lat: -26.1367, lng: 28.2460 },
  { code: "DEL", city: "Delhi", country: "India", lat: 28.5562, lng: 77.1000 },
  { code: "PEK", city: "Beijing", country: "China", lat: 40.0799, lng: 116.6031 },
  { code: "ORD", city: "Chicago", country: "USA", lat: 41.9742, lng: -87.9073 },
];

const airlines = [
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
];

const aircraftTypes = [
  { type: "B777", name: "Boeing 777-300ER", speed: 560 },
  { type: "B787", name: "Boeing 787 Dreamliner", speed: 570 },
  { type: "A380", name: "Airbus A380", speed: 560 },
  { type: "A350", name: "Airbus A350-1000", speed: 568 },
  { type: "B747", name: "Boeing 747-8", speed: 570 },
  { type: "A320", name: "Airbus A320neo", speed: 515 },
  { type: "B737", name: "Boeing 737 MAX", speed: 521 },
  { type: "A330", name: "Airbus A330-900neo", speed: 560 },
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

// Generate realistic flight routes
function generateFlightRoutes(): Array<{
  origin: typeof majorAirports[0];
  destination: typeof majorAirports[0];
}> {
  const routes: Array<{ origin: typeof majorAirports[0]; destination: typeof majorAirports[0] }> = [];
  
  // Create realistic route pairs
  const routePairs = [
    ["JFK", "LHR"], ["LAX", "HND"], ["LHR", "DXB"], ["CDG", "JFK"],
    ["SIN", "SYD"], ["FRA", "PEK"], ["AMS", "HKG"], ["DXB", "BKK"],
    ["ICN", "LAX"], ["IST", "DEL"], ["MEX", "GRU"], ["JNB", "LHR"],
    ["ORD", "FRA"], ["HND", "SIN"], ["SYD", "LAX"], ["PEK", "CDG"],
    ["DEL", "DXB"], ["BKK", "HKG"], ["HKG", "JFK"], ["LHR", "SIN"],
    ["DXB", "SYD"], ["JFK", "CDG"], ["LAX", "ICN"], ["FRA", "HND"],
    ["AMS", "JFK"], ["IST", "LHR"], ["SIN", "LHR"], ["GRU", "LHR"],
    ["ORD", "LHR"], ["DEL", "SIN"], ["BKK", "SYD"], ["MEX", "JFK"],
  ];
  
  routePairs.forEach(([originCode, destCode]) => {
    const origin = majorAirports.find(a => a.code === originCode);
    const destination = majorAirports.find(a => a.code === destCode);
    if (origin && destination) {
      routes.push({ origin, destination });
    }
  });
  
  return routes;
}

export interface LiveFlight {
  id: string;
  flightNumber: string;
  callsign: string;
  airline: typeof airlines[0];
  aircraft: typeof aircraftTypes[0];
  origin: typeof majorAirports[0];
  destination: typeof majorAirports[0];
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
}

// Generate initial live flights
export function generateLiveFlights(count: number = 50): LiveFlight[] {
  const routes = generateFlightRoutes();
  const flights: LiveFlight[] = [];
  
  for (let i = 0; i < count; i++) {
    const route = routes[i % routes.length];
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    
    // Random progress along route (0-100%)
    const progress = Math.random() * 100;
    
    // Calculate current position based on progress
    const lat = route.origin.lat + (route.destination.lat - route.origin.lat) * (progress / 100);
    const lng = route.origin.lng + (route.destination.lng - route.origin.lng) * (progress / 100);
    
    // Calculate heading
    const heading = calculateBearing(route.origin.lat, route.origin.lng, route.destination.lat, route.destination.lng);
    
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
    
    flights.push({
      id: `${airline.code}${flightNum}-${i}`,
      flightNumber: `${airline.code}${flightNum}`,
      callsign: `${airline.code}${flightNum}`,
      airline,
      aircraft,
      origin: route.origin,
      destination: route.destination,
      position: {
        lat,
        lng,
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
    });
  }
  
  return flights;
}

// Update flight positions (simulate movement)
export function updateFlightPositions(flights: LiveFlight[], deltaTime: number = 1): LiveFlight[] {
  return flights.map(flight => {
    // Calculate new progress (deltaTime is in seconds, convert to percentage of total flight)
    const flightDuration = flight.distance / flight.position.speed * 3600; // in seconds
    const progressIncrement = (deltaTime / flightDuration) * 100;
    let newProgress = flight.progress + progressIncrement;
    
    // If flight completed, reset with new random progress
    if (newProgress >= 100) {
      newProgress = Math.random() * 20; // Start near beginning
    }
    
    // Calculate new position
    const lat = flight.origin.lat + (flight.destination.lat - flight.origin.lat) * (newProgress / 100);
    const lng = flight.origin.lng + (flight.destination.lng - flight.origin.lng) * (newProgress / 100);
    
    // Update altitude and status based on progress
    let status: LiveFlight["status"];
    let altitude: number;
    let verticalSpeed: number;
    
    if (newProgress < 10) {
      status = "climbing";
      altitude = 5000 + (newProgress / 10) * 30000;
      verticalSpeed = 2000 + Math.random() * 1000;
    } else if (newProgress > 90) {
      status = "descending";
      altitude = 35000 - ((newProgress - 90) / 10) * 30000;
      verticalSpeed = -(1500 + Math.random() * 500);
    } else {
      status = "cruising";
      altitude = 32000 + Math.random() * 8000;
      verticalSpeed = Math.random() * 200 - 100;
    }
    
    const remainingDistance = flight.distance * (1 - newProgress / 100);
    const remainingMinutes = Math.round(remainingDistance / flight.position.speed * 60);
    const etaHours = Math.floor(remainingMinutes / 60);
    const etaMins = remainingMinutes % 60;
    const eta = etaHours > 0 ? `${etaHours}h ${etaMins}m` : `${etaMins}m`;
    
    return {
      ...flight,
      progress: newProgress,
      status,
      position: {
        ...flight.position,
        lat,
        lng,
        altitude: Math.round(altitude),
        verticalSpeed: Math.round(verticalSpeed),
        // Add slight heading variation
        heading: Math.round(flight.position.heading + (Math.random() - 0.5) * 2) % 360,
      },
      remainingDistance: Math.round(remainingDistance),
      eta,
    };
  });
}
