import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, Search, MapPin, Layers, Filter, X, 
  Sun, Moon, Satellite, ChevronDown, Menu,
  Gauge, Navigation, Clock, Users, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FlightRadarMap } from "@/components/FlightRadarMap";
import { FlightDetailsPanel } from "@/components/FlightDetailsPanel";
import { generateLiveFlights, updateFlightPositions, LiveFlight, majorAirports } from "@/data/liveFlights";

const Tracking = () => {
  const [flights, setFlights] = useState<LiveFlight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<LiveFlight | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapStyle, setMapStyle] = useState<"dark" | "light" | "satellite">("dark");
  const [isFlightListOpen, setIsFlightListOpen] = useState(false);
  const [filterAirline, setFilterAirline] = useState<string | null>(null);

  // Initialize flights
  useEffect(() => {
    const initialFlights = generateLiveFlights(60);
    setFlights(initialFlights);
  }, []);

  // Update flight positions every second
  useEffect(() => {
    const interval = setInterval(() => {
      setFlights(prev => updateFlightPositions(prev, 5));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update selected flight reference when positions update
  useEffect(() => {
    if (selectedFlight) {
      const updated = flights.find(f => f.id === selectedFlight.id);
      if (updated) {
        setSelectedFlight(updated);
      }
    }
  }, [flights, selectedFlight?.id]);

  // Filter flights based on search
  const filteredFlights = flights.filter(flight => {
    const matchesSearch = searchQuery === "" || 
      flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.origin.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.destination.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.origin.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.destination.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.airline.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAirline = !filterAirline || flight.airline.code === filterAirline;
    
    return matchesSearch && matchesAirline;
  });

  // Get unique airlines
  const uniqueAirlines = Array.from(new Set(flights.map(f => f.airline.code)))
    .map(code => flights.find(f => f.airline.code === code)?.airline)
    .filter(Boolean);

  const handleFlightSelect = useCallback((flight: LiveFlight | null) => {
    setSelectedFlight(flight);
  }, []);

  const getMapStyleIcon = () => {
    switch (mapStyle) {
      case "dark": return <Moon className="w-4 h-4" />;
      case "light": return <Sun className="w-4 h-4" />;
      case "satellite": return <Satellite className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-card/95 backdrop-blur-md border-b z-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold hidden sm:block">SkyVoyage</span>
          </Link>
          
          <div className="h-6 w-px bg-border hidden sm:block" />
          
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {flights.length} Active Flights
            </Badge>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-md mx-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search flight, airport, or airline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Map Style Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="hidden sm:flex">
                {getMapStyleIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Map Style</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setMapStyle("dark")}>
                <Moon className="w-4 h-4 mr-2" /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMapStyle("light")}>
                <Sun className="w-4 h-4 mr-2" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMapStyle("satellite")}>
                <Satellite className="w-4 h-4 mr-2" /> Satellite
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Airline Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {filterAirline || "All Airlines"}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
              <DropdownMenuLabel>Filter by Airline</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterAirline(null)}>
                All Airlines
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {uniqueAirlines.map(airline => airline && (
                <DropdownMenuItem 
                  key={airline.code}
                  onClick={() => setFilterAirline(airline.code)}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: airline.color }}
                  />
                  {airline.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Flight List Sheet */}
          <Sheet open={isFlightListOpen} onOpenChange={setIsFlightListOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline">Flights</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-96 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Active Flights ({filteredFlights.length})
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-[calc(100vh-80px)]">
                {filteredFlights.map(flight => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedFlight?.id === flight.id ? "bg-primary/10" : ""
                    }`}
                    onClick={() => {
                      handleFlightSelect(flight);
                      setIsFlightListOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: flight.airline.color }}
                        />
                        <span className="font-semibold">{flight.flightNumber}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {flight.aircraft.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{flight.origin.code}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{flight.destination.code}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {flight.position.altitude.toLocaleString()} ft
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>{flight.airline.name}</span>
                      <span>ETA: {flight.eta}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <nav className="hidden lg:flex items-center gap-4 ml-4">
            <Link to="/flights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Book Flight
            </Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              My Trips
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Map Area */}
      <main className="flex-1 relative">
        <FlightRadarMap
          flights={filteredFlights}
          selectedFlight={selectedFlight}
          onFlightSelect={handleFlightSelect}
          mapStyle={mapStyle}
        />

        {/* Stats Overlay */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 flex items-center gap-2 border shadow-lg">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <div className="text-xs">
              <p className="text-muted-foreground">Avg. Altitude</p>
              <p className="font-semibold">
                {Math.round(flights.reduce((acc, f) => acc + f.position.altitude, 0) / flights.length).toLocaleString()} ft
              </p>
            </div>
          </div>
          <div className="bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 flex items-center gap-2 border shadow-lg hidden sm:flex">
            <Navigation className="w-4 h-4 text-muted-foreground" />
            <div className="text-xs">
              <p className="text-muted-foreground">Avg. Speed</p>
              <p className="font-semibold">
                {Math.round(flights.reduce((acc, f) => acc + f.position.speed, 0) / flights.length)} mph
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-md rounded-lg p-3 border shadow-lg hidden sm:block">
          <p className="text-xs font-semibold mb-2">Altitude Legend</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>&gt; 30,000 ft</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>15,000 - 30,000 ft</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>&lt; 15,000 ft</span>
            </div>
          </div>
        </div>

        {/* Flight Details Panel */}
        <FlightDetailsPanel 
          flight={selectedFlight} 
          onClose={() => setSelectedFlight(null)} 
        />
      </main>
    </div>
  );
};

export default Tracking;
