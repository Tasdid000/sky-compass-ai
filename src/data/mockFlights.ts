import type { Flight, Airport } from "@/types/flight";

export const airports: Airport[] = [
  { code: "JFK", name: "John F. Kennedy International", city: "New York", country: "USA", lat: 40.6413, lng: -73.7781 },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "USA", lat: 33.9425, lng: -118.4081 },
  { code: "LHR", name: "Heathrow", city: "London", country: "UK", lat: 51.4700, lng: -0.4543 },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France", lat: 49.0097, lng: 2.5479 },
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE", lat: 25.2532, lng: 55.3657 },
  { code: "SIN", name: "Changi", city: "Singapore", country: "Singapore", lat: 1.3644, lng: 103.9915 },
  { code: "HND", name: "Haneda", city: "Tokyo", country: "Japan", lat: 35.5494, lng: 139.7798 },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", country: "USA", lat: 37.6213, lng: -122.3790 },
  { code: "MIA", name: "Miami International", city: "Miami", country: "USA", lat: 25.7959, lng: -80.2870 },
  { code: "ORD", name: "O'Hare International", city: "Chicago", country: "USA", lat: 41.9742, lng: -87.9073 },
];

export const mockFlights: Flight[] = [
  {
    id: "FL001",
    flightNumber: "AA1234",
    airline: "American Airlines",
    origin: airports[0], // JFK
    destination: airports[1], // LAX
    departureTime: new Date("2026-02-15T08:00:00"),
    arrivalTime: new Date("2026-02-15T11:30:00"),
    duration: 330,
    price: 450,
    currency: "USD",
    availableSeats: 45,
    totalSeats: 180,
    aircraft: "Boeing 777-300ER",
    class: "economy",
    stops: 0,
    amenities: ["WiFi", "Entertainment", "Meals", "Power outlets"],
    status: "scheduled",
  },
  {
    id: "FL002",
    flightNumber: "BA456",
    airline: "British Airways",
    origin: airports[0], // JFK
    destination: airports[2], // LHR
    departureTime: new Date("2026-02-15T19:00:00"),
    arrivalTime: new Date("2026-02-16T07:00:00"),
    duration: 420,
    price: 890,
    currency: "USD",
    availableSeats: 32,
    totalSeats: 250,
    aircraft: "Airbus A380",
    class: "business",
    stops: 0,
    amenities: ["WiFi", "Lie-flat seats", "Premium dining", "Lounge access"],
    status: "scheduled",
  },
  {
    id: "FL003",
    flightNumber: "EK789",
    airline: "Emirates",
    origin: airports[0], // JFK
    destination: airports[4], // DXB
    departureTime: new Date("2026-02-15T22:00:00"),
    arrivalTime: new Date("2026-02-16T18:30:00"),
    duration: 750,
    price: 1250,
    currency: "USD",
    availableSeats: 28,
    totalSeats: 350,
    aircraft: "Airbus A380",
    class: "first",
    stops: 0,
    amenities: ["WiFi", "Private suite", "Shower spa", "Onboard lounge", "Fine dining"],
    status: "scheduled",
  },
  {
    id: "FL004",
    flightNumber: "DL567",
    airline: "Delta Airlines",
    origin: airports[1], // LAX
    destination: airports[6], // HND
    departureTime: new Date("2026-02-16T14:00:00"),
    arrivalTime: new Date("2026-02-17T18:00:00"),
    duration: 720,
    price: 980,
    currency: "USD",
    availableSeats: 52,
    totalSeats: 280,
    aircraft: "Boeing 787 Dreamliner",
    class: "business",
    stops: 0,
    amenities: ["WiFi", "Lie-flat seats", "Entertainment", "Premium meals"],
    status: "scheduled",
  },
  {
    id: "FL005",
    flightNumber: "UA321",
    airline: "United Airlines",
    origin: airports[7], // SFO
    destination: airports[0], // JFK
    departureTime: new Date("2026-02-15T06:00:00"),
    arrivalTime: new Date("2026-02-15T14:30:00"),
    duration: 330,
    price: 320,
    currency: "USD",
    availableSeats: 78,
    totalSeats: 200,
    aircraft: "Boeing 757-200",
    class: "economy",
    stops: 0,
    amenities: ["WiFi", "Entertainment", "Snacks"],
    status: "scheduled",
  },
  {
    id: "FL006",
    flightNumber: "AF123",
    airline: "Air France",
    origin: airports[3], // CDG
    destination: airports[5], // SIN
    departureTime: new Date("2026-02-16T10:00:00"),
    arrivalTime: new Date("2026-02-17T06:00:00"),
    duration: 780,
    price: 1100,
    currency: "USD",
    availableSeats: 40,
    totalSeats: 300,
    aircraft: "Airbus A350-900",
    class: "business",
    stops: 0,
    amenities: ["WiFi", "Lie-flat seats", "French cuisine", "Premium wine selection"],
    status: "scheduled",
  },
  {
    id: "FL007",
    flightNumber: "SQ456",
    airline: "Singapore Airlines",
    origin: airports[5], // SIN
    destination: airports[2], // LHR
    departureTime: new Date("2026-02-17T01:00:00"),
    arrivalTime: new Date("2026-02-17T08:00:00"),
    duration: 780,
    price: 1450,
    currency: "USD",
    availableSeats: 18,
    totalSeats: 280,
    aircraft: "Airbus A380",
    class: "first",
    stops: 0,
    amenities: ["WiFi", "Private suite", "Book the cook", "Dom Pérignon champagne"],
    status: "scheduled",
  },
  {
    id: "FL008",
    flightNumber: "AA789",
    airline: "American Airlines",
    origin: airports[8], // MIA
    destination: airports[1], // LAX
    departureTime: new Date("2026-02-15T09:00:00"),
    arrivalTime: new Date("2026-02-15T11:30:00"),
    duration: 330,
    price: 280,
    currency: "USD",
    availableSeats: 95,
    totalSeats: 180,
    aircraft: "Airbus A321",
    class: "economy",
    stops: 0,
    amenities: ["WiFi", "Entertainment", "Snacks"],
    status: "scheduled",
  },
  {
    id: "FL009",
    flightNumber: "JL101",
    airline: "Japan Airlines",
    origin: airports[6], // HND
    destination: airports[7], // SFO
    departureTime: new Date("2026-02-18T17:00:00"),
    arrivalTime: new Date("2026-02-18T10:00:00"),
    duration: 600,
    price: 1380,
    currency: "USD",
    availableSeats: 24,
    totalSeats: 240,
    aircraft: "Boeing 787-9 Dreamliner",
    class: "first",
    stops: 0,
    amenities: ["WiFi", "Private suite", "Japanese kaiseki cuisine", "Sake selection"],
    status: "scheduled",
  },
  {
    id: "FL010",
    flightNumber: "LH400",
    airline: "Lufthansa",
    origin: airports[9], // ORD
    destination: airports[3], // CDG
    departureTime: new Date("2026-02-16T18:00:00"),
    arrivalTime: new Date("2026-02-17T08:30:00"),
    duration: 510,
    price: 720,
    currency: "USD",
    availableSeats: 56,
    totalSeats: 260,
    aircraft: "Airbus A340-600",
    class: "business",
    stops: 1,
    stopLocations: [airports[2]],
    amenities: ["WiFi", "Lie-flat seats", "German efficiency", "Beer selection"],
    status: "scheduled",
  },
];

export const getAirportByCode = (code: string): Airport | undefined => {
  return airports.find(airport => airport.code.toLowerCase() === code.toLowerCase());
};

export const searchFlights = (
  origin?: string,
  destination?: string,
  date?: Date,
  passengers: number = 1
): Flight[] => {
  return mockFlights.filter(flight => {
    if (origin && flight.origin.code.toLowerCase() !== origin.toLowerCase()) return false;
    if (destination && flight.destination.code.toLowerCase() !== destination.toLowerCase()) return false;
    if (passengers > flight.availableSeats) return false;
    return true;
  });
};
