import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, MapPin, Calendar, Users, ArrowRightLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { airports } from "@/data/mockFlights";

interface FlightSearchProps {
  compact?: boolean;
}

const FlightSearch = ({ compact = false }: FlightSearchProps) => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [travelClass, setTravelClass] = useState("economy");

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (origin) params.set("origin", origin);
    if (destination) params.set("destination", destination);
    if (departureDate) params.set("date", departureDate);
    if (passengers) params.set("passengers", passengers);
    
    navigate(`/flights?${params.toString()}`);
  };

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <Label className="text-xs">From</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger>
                  <SelectValue placeholder="Origin" />
                </SelectTrigger>
                <SelectContent>
                  {airports.map(airport => (
                    <SelectItem key={airport.code} value={airport.code}>
                      {airport.code} - {airport.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="ghost" size="icon" onClick={swapLocations} className="shrink-0">
              <ArrowRightLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 min-w-[150px]">
              <Label className="text-xs">To</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Destination" />
                </SelectTrigger>
                <SelectContent>
                  {airports.map(airport => (
                    <SelectItem key={airport.code} value={airport.code}>
                      {airport.code} - {airport.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[140px]">
              <Label className="text-xs">Date</Label>
              <Input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
            </div>
            
            <Button onClick={handleSearch} className="shrink-0">
              <Search className="w-4 h-4 mr-2" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        {/* Trip Type */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={tripType === "roundtrip" ? "default" : "outline"}
            size="sm"
            onClick={() => setTripType("roundtrip")}
          >
            Round Trip
          </Button>
          <Button
            variant={tripType === "oneway" ? "default" : "outline"}
            size="sm"
            onClick={() => setTripType("oneway")}
          >
            One Way
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Origin */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> From
            </Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger>
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                {airports.map(airport => (
                  <SelectItem key={airport.code} value={airport.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{airport.code}</span>
                      <span className="text-muted-foreground">{airport.city}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button (desktop) */}
          <div className="hidden lg:flex items-end justify-center pb-2">
            <Button variant="ghost" size="icon" onClick={swapLocations}>
              <ArrowRightLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> To
            </Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {airports.map(airport => (
                  <SelectItem key={airport.code} value={airport.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{airport.code}</span>
                      <span className="text-muted-foreground">{airport.city}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Departure Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Departure
            </Label>
            <Input 
              type="date" 
              value={departureDate} 
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Return Date (if roundtrip) */}
          {tripType === "roundtrip" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Return
              </Label>
              <Input 
                type="date"
                min={departureDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          )}

          {/* Passengers */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Passengers
            </Label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Passenger" : "Passengers"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Plane className="w-4 h-4" /> Class
            </Label>
            <Select value={travelClass} onValueChange={setTravelClass}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6">
          <Button onClick={handleSearch} size="lg" className="w-full md:w-auto">
            <Search className="w-5 h-5 mr-2" />
            Search Flights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightSearch;
