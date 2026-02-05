import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Clock, ArrowRight, Filter, SortAsc, Wifi, Utensils, Tv, Plug, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { mockFlights, airports } from "@/data/mockFlights";
import type { Flight } from "@/types/flight";
import FlightSearch from "@/components/FlightSearch";

const Flights = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price");
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [stopsFilter, setStopsFilter] = useState<string>("any");
  const [showFilters, setShowFilters] = useState(false);

  const origin = searchParams.get("origin") || "";
  const destination = searchParams.get("destination") || "";

  const airlines = useMemo(() => {
    return [...new Set(mockFlights.map(f => f.airline))];
  }, []);

  const filteredFlights = useMemo(() => {
    let flights = [...mockFlights];

    // Filter by origin
    if (origin) {
      flights = flights.filter(f => 
        f.origin.code.toLowerCase() === origin.toLowerCase() ||
        f.origin.city.toLowerCase().includes(origin.toLowerCase())
      );
    }

    // Filter by destination
    if (destination) {
      flights = flights.filter(f => 
        f.destination.code.toLowerCase() === destination.toLowerCase() ||
        f.destination.city.toLowerCase().includes(destination.toLowerCase())
      );
    }

    // Filter by price
    flights = flights.filter(f => f.price <= maxPrice);

    // Filter by airlines
    if (selectedAirlines.length > 0) {
      flights = flights.filter(f => selectedAirlines.includes(f.airline));
    }

    // Filter by stops
    if (stopsFilter === "nonstop") {
      flights = flights.filter(f => f.stops === 0);
    } else if (stopsFilter === "1stop") {
      flights = flights.filter(f => f.stops === 1);
    } else if (stopsFilter === "2plus") {
      flights = flights.filter(f => f.stops >= 2);
    }

    // Sort
    flights.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "duration") return a.duration - b.duration;
      return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
    });

    return flights;
  }, [origin, destination, maxPrice, selectedAirlines, stopsFilter, sortBy]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes("wifi")) return <Wifi className="w-4 h-4" />;
    if (amenity.toLowerCase().includes("meal") || amenity.toLowerCase().includes("dining")) return <Utensils className="w-4 h-4" />;
    if (amenity.toLowerCase().includes("entertainment")) return <Tv className="w-4 h-4" />;
    if (amenity.toLowerCase().includes("power")) return <Plug className="w-4 h-4" />;
    return null;
  };

  const toggleAirline = (airline: string) => {
    setSelectedAirlines(prev => 
      prev.includes(airline) 
        ? prev.filter(a => a !== airline)
        : [...prev, airline]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SkyVoyage</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/tracking" className="text-muted-foreground hover:text-foreground transition-colors">
                Track Flight
              </Link>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                My Trips
              </Link>
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="container mx-auto px-4">
          <FlightSearch />
        </div>
      </section>

      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 space-y-6">
            <div className="flex items-center justify-between lg:hidden">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? "Hide" : "Show"}
              </Button>
            </div>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Sort */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <SortAsc className="w-4 h-4" /> Sort By
                  </h3>
                  <Select value={sortBy} onValueChange={(v: "price" | "duration" | "departure") => setSortBy(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price (Low to High)</SelectItem>
                      <SelectItem value="duration">Duration (Shortest)</SelectItem>
                      <SelectItem value="departure">Departure Time</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Price Range */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      value={[maxPrice]}
                      onValueChange={(v) => setMaxPrice(v[0])}
                      max={2000}
                      min={100}
                      step={50}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>$100</span>
                      <span className="font-semibold text-foreground">${maxPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stops */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Stops</h3>
                  <Select value={stopsFilter} onValueChange={setStopsFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="nonstop">Nonstop</SelectItem>
                      <SelectItem value="1stop">1 Stop</SelectItem>
                      <SelectItem value="2plus">2+ Stops</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Airlines */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Airlines</h3>
                  <div className="space-y-2">
                    {airlines.map(airline => (
                      <div key={airline} className="flex items-center space-x-2">
                        <Checkbox
                          id={airline}
                          checked={selectedAirlines.includes(airline)}
                          onCheckedChange={() => toggleAirline(airline)}
                        />
                        <label htmlFor={airline} className="text-sm cursor-pointer">
                          {airline}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Flight Results */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {filteredFlights.length} flights found
                {origin && destination && (
                  <span className="text-muted-foreground font-normal">
                    {" "}from {origin} to {destination}
                  </span>
                )}
              </h2>
            </div>

            {filteredFlights.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No flights found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredFlights.map((flight, index) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Flight Info */}
                        <div className="flex-1 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                <Plane className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-semibold">{flight.airline}</p>
                                <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                              </div>
                            </div>
                            <Badge variant={flight.class === "first" ? "default" : flight.class === "business" ? "secondary" : "outline"}>
                              {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <p className="text-2xl font-bold">{formatTime(flight.departureTime)}</p>
                              <p className="text-sm font-medium">{flight.origin.code}</p>
                              <p className="text-xs text-muted-foreground">{flight.origin.city}</p>
                            </div>

                            <div className="flex-1 px-4">
                              <div className="relative">
                                <div className="border-t-2 border-dashed border-muted"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {formatDuration(flight.duration)}
                                  </div>
                                </div>
                              </div>
                              <p className="text-center text-xs text-muted-foreground mt-1">
                                {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</p>
                              <p className="text-sm font-medium">{flight.destination.code}</p>
                              <p className="text-xs text-muted-foreground">{flight.destination.city}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            {flight.amenities.slice(0, 4).map((amenity, i) => (
                              <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                                {getAmenityIcon(amenity)}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price & Book */}
                        <div className="md:w-48 bg-muted/30 p-6 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l">
                          <p className="text-sm text-muted-foreground">from</p>
                          <p className="text-3xl font-bold text-primary">${flight.price}</p>
                          <p className="text-xs text-muted-foreground mb-4">per person</p>
                          <Link to={`/booking/${flight.id}`} className="w-full">
                            <Button className="w-full">
                              Select <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                          <p className="text-xs text-muted-foreground mt-2">
                            {flight.availableSeats} seats left
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Flights;
