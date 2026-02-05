import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Search, Clock, MapPin, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockFlights, airports } from "@/data/mockFlights";
import type { FlightTrackingData } from "@/types/flight";

const Tracking = () => {
  const [searchParams] = useSearchParams();
  const [flightNumber, setFlightNumber] = useState(searchParams.get("flight") || "");
  const [trackingData, setTrackingData] = useState<FlightTrackingData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);

  const searchFlight = async () => {
    if (!flightNumber.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find matching flight from mock data
    const flight = mockFlights.find(f => 
      f.flightNumber.toLowerCase() === flightNumber.toLowerCase()
    );
    
    if (flight) {
      // Calculate mock position based on "progress"
      const progress = Math.random() * 100;
      const lat = flight.origin.lat + (flight.destination.lat - flight.origin.lat) * (progress / 100);
      const lng = flight.origin.lng + (flight.destination.lng - flight.origin.lng) * (progress / 100);
      
      const statuses = ["scheduled", "boarding", "departed", "in-flight", "landed"];
      const status = progress < 10 ? "boarding" : progress < 20 ? "departed" : progress < 90 ? "in-flight" : "landed";
      
      setTrackingData({
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        status,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        currentPosition: {
          lat,
          lng,
          altitude: status === "in-flight" ? 35000 + Math.random() * 5000 : 0,
          speed: status === "in-flight" ? 450 + Math.random() * 100 : 0,
          heading: 90,
        },
        progress,
        gate: `A${Math.floor(Math.random() * 30) + 1}`,
        terminal: Math.random() > 0.5 ? "1" : "2",
        delay: Math.random() > 0.7 ? Math.floor(Math.random() * 45) : 0,
      });
    } else {
      setTrackingData(null);
    }
    
    setIsSearching(false);
  };

  useEffect(() => {
    if (searchParams.get("flight")) {
      searchFlight();
    }
  }, []);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-500";
      case "boarding": return "bg-yellow-500";
      case "departed": return "bg-purple-500";
      case "in-flight": return "bg-green-500";
      case "landed": return "bg-green-600";
      case "delayed": return "bg-orange-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-flight": return <Plane className="w-4 h-4" />;
      case "landed": return <CheckCircle className="w-4 h-4" />;
      case "delayed": return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
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
              <Link to="/flights" className="text-muted-foreground hover:text-foreground transition-colors">
                Search Flights
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

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Track Your Flight</h1>
          <p className="text-muted-foreground mb-6">Enter your flight number to get real-time tracking information</p>
          
          <div className="flex max-w-md mx-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter flight number (e.g., AA1234)"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && searchFlight()}
                className="pl-10"
              />
            </div>
            <Button onClick={searchFlight} disabled={isSearching}>
              {isSearching ? (
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground" />
              ) : (
                "Track"
              )}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <p className="text-sm text-muted-foreground">Try:</p>
            {["AA1234", "BA456", "EK789", "DL567"].map(fn => (
              <Button
                key={fn}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFlightNumber(fn);
                  setTimeout(searchFlight, 100);
                }}
              >
                {fn}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Tracking Results */}
        {trackingData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Flight Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {trackingData.airline}
                      <Badge variant="outline">{trackingData.flightNumber}</Badge>
                    </CardTitle>
                    <CardDescription>{formatDate(trackingData.departureTime)}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(trackingData.status)} text-white flex items-center gap-1`}>
                    {getStatusIcon(trackingData.status)}
                    {trackingData.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Route */}
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{trackingData.origin.code}</p>
                    <p className="text-sm text-muted-foreground">{trackingData.origin.city}</p>
                    <p className="text-lg font-semibold mt-2">{formatTime(trackingData.departureTime)}</p>
                    <p className="text-xs text-muted-foreground">Departure</p>
                  </div>
                  
                  <div className="flex-1 px-4">
                    <div className="relative">
                      <Progress value={trackingData.progress} className="h-2" />
                      <Plane className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary transition-all"
                        style={{ left: `${Math.min(trackingData.progress, 95)}%` }} />
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      {Math.round(trackingData.progress)}% Complete
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold">{trackingData.destination.code}</p>
                    <p className="text-sm text-muted-foreground">{trackingData.destination.city}</p>
                    <p className="text-lg font-semibold mt-2">{formatTime(trackingData.arrivalTime)}</p>
                    <p className="text-xs text-muted-foreground">Arrival</p>
                  </div>
                </div>

                {/* Delay Warning */}
                {trackingData.delay && trackingData.delay > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-orange-800 dark:text-orange-200">Flight Delayed</p>
                      <p className="text-sm text-orange-600 dark:text-orange-300">
                        This flight is delayed by approximately {trackingData.delay} minutes
                      </p>
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Terminal</p>
                    <p className="text-xl font-semibold">{trackingData.terminal || "—"}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Gate</p>
                    <p className="text-xl font-semibold">{trackingData.gate || "—"}</p>
                  </div>
                  {trackingData.currentPosition && trackingData.status === "in-flight" && (
                    <>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Altitude</p>
                        <p className="text-xl font-semibold">
                          {Math.round(trackingData.currentPosition.altitude).toLocaleString()} ft
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Ground Speed</p>
                        <p className="text-xl font-semibold">
                          {Math.round(trackingData.currentPosition.speed)} mph
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Flight Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={mapContainer}
                  className="h-80 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center relative overflow-hidden"
                >
                  {/* Stylized map background */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 400 300">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                  
                  {/* Flight path visualization */}
                  <div className="relative z-10 w-full px-8">
                    <div className="flex items-center justify-between">
                      <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                      <div className="flex-1 h-0.5 bg-primary/30 relative mx-4">
                        <div 
                          className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000"
                          style={{ width: `${trackingData.progress}%` }}
                        />
                        <motion.div
                          animate={{ x: `${trackingData.progress}%` }}
                          className="absolute top-1/2 -translate-y-1/2"
                          style={{ left: '-8px' }}
                        >
                          <Plane className="w-6 h-6 text-primary rotate-90" />
                        </motion.div>
                      </div>
                      <div className="w-4 h-4 bg-accent rounded-full" />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>{trackingData.origin.code}</span>
                      <span>{trackingData.destination.code}</span>
                    </div>
                  </div>
                  
                  <p className="absolute bottom-4 text-sm text-muted-foreground">
                    Interactive map available with Mapbox integration
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* No Results */}
        {!trackingData && flightNumber && !isSearching && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8">
              <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Flight Not Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find flight {flightNumber}. Please check the flight number and try again.
              </p>
              <Button variant="outline" onClick={() => setFlightNumber("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Sample Flights */}
        {!trackingData && !flightNumber && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">Sample Flights to Track</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockFlights.slice(0, 4).map(flight => (
                <Card 
                  key={flight.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setFlightNumber(flight.flightNumber);
                    setTimeout(searchFlight, 100);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{flight.flightNumber}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{flight.airline}</p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span>{flight.origin.code}</span>
                      <span>→</span>
                      <span>{flight.destination.code}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Tracking;
