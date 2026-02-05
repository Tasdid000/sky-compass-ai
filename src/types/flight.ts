export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineLogo?: string;
  origin: Airport;
  destination: Airport;
  departureTime: Date;
  arrivalTime: Date;
  duration: number; // in minutes
  price: number;
  currency: string;
  availableSeats: number;
  totalSeats: number;
  aircraft: string;
  class: "economy" | "business" | "first";
  stops: number;
  stopLocations?: Airport[];
  amenities: string[];
  status: "scheduled" | "boarding" | "departed" | "in-flight" | "landed" | "cancelled" | "delayed";
}

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  passportNumber?: string;
  nationality?: string;
}

export interface Booking {
  id: string;
  flight: Flight;
  passengers: Passenger[];
  seatNumbers: string[];
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  bookedAt: Date;
  paymentMethod?: string;
}

export interface FlightTrackingData {
  flightNumber: string;
  airline: string;
  status: string;
  origin: Airport;
  destination: Airport;
  departureTime: Date;
  arrivalTime: Date;
  currentPosition?: {
    lat: number;
    lng: number;
    altitude: number;
    speed: number;
    heading: number;
  };
  progress: number; // 0-100
  gate?: string;
  terminal?: string;
  delay?: number; // in minutes
}

export interface SearchFilters {
  origin?: string;
  destination?: string;
  departureDate?: Date;
  returnDate?: Date;
  passengers: number;
  class: "economy" | "business" | "first" | "any";
  maxPrice?: number;
  stops?: "any" | "nonstop" | "1stop" | "2plus";
  airlines?: string[];
}
