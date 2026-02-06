import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Plane, Clock, Navigation, Gauge, ArrowUp, ArrowDown, 
  MapPin, Calendar, Timer, Route, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { LiveFlight } from "@/data/liveFlights";

interface FlightDetailsPanelProps {
  flight: LiveFlight | null;
  onClose: () => void;
}

export function FlightDetailsPanel({ flight, onClose }: FlightDetailsPanelProps) {
  if (!flight) return null;

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "climbing": return "bg-blue-500";
      case "cruising": return "bg-green-500";
      case "descending": return "bg-orange-500";
      default: return "bg-muted";
    }
  };

  const getVerticalSpeedIcon = () => {
    if (flight.position.verticalSpeed > 100) {
      return <ArrowUp className="w-4 h-4 text-blue-500" />;
    } else if (flight.position.verticalSpeed < -100) {
      return <ArrowDown className="w-4 h-4 text-orange-500" />;
    }
    return null;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-0 right-0 h-full w-full sm:w-96 bg-card/95 backdrop-blur-md border-l z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-md p-4 border-b z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: flight.airline.color }}
              >
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{flight.flightNumber}</h2>
                <p className="text-sm text-muted-foreground">{flight.airline.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(flight.status)} text-white`}>
              {flight.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Aircraft: {flight.aircraft.name}
            </span>
          </div>

          {/* Route Display */}
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{flight.origin.code}</p>
                <p className="text-xs text-muted-foreground">{flight.origin.city}</p>
                <p className="text-sm font-medium mt-1">{formatTime(flight.departureTime)}</p>
              </div>
              
              <div className="flex-1 px-4">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Route className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{flight.distance} mi</span>
                </div>
                <Progress value={flight.progress} className="h-2" />
                <p className="text-center text-xs text-muted-foreground mt-1">
                  {Math.round(flight.progress)}% complete
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold">{flight.destination.code}</p>
                <p className="text-xs text-muted-foreground">{flight.destination.city}</p>
                <p className="text-sm font-medium mt-1">{formatTime(flight.arrivalTime)}</p>
              </div>
            </div>
          </div>

          {/* ETA */}
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              <span className="font-medium">Estimated Arrival</span>
            </div>
            <span className="text-lg font-bold text-primary">{flight.eta}</span>
          </div>

          <Separator />

          {/* Flight Data Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Navigation className="w-4 h-4" />
                <span className="text-xs">Altitude</span>
              </div>
              <p className="text-lg font-semibold">
                {flight.position.altitude.toLocaleString()} ft
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Gauge className="w-4 h-4" />
                <span className="text-xs">Ground Speed</span>
              </div>
              <p className="text-lg font-semibold">{flight.position.speed} mph</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Navigation className="w-4 h-4 transform rotate-45" />
                <span className="text-xs">Heading</span>
              </div>
              <p className="text-lg font-semibold">{flight.position.heading}°</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                {getVerticalSpeedIcon() || <ArrowUp className="w-4 h-4" />}
                <span className="text-xs">Vertical Speed</span>
              </div>
              <p className="text-lg font-semibold">
                {flight.position.verticalSpeed > 0 ? "+" : ""}
                {flight.position.verticalSpeed} ft/min
              </p>
            </div>
          </div>

          <Separator />

          {/* Origin Details */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              Departure
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Airport</span>
                <span className="font-medium">{flight.origin.code} - {flight.origin.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Country</span>
                <span className="font-medium">{flight.origin.country}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="font-medium">{formatTime(flight.departureTime)}</span>
              </div>
            </div>
          </div>

          {/* Destination Details */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              Arrival
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Airport</span>
                <span className="font-medium">{flight.destination.code} - {flight.destination.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Country</span>
                <span className="font-medium">{flight.destination.country}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="font-medium">{flight.remainingDistance} mi</span>
              </div>
            </div>
          </div>

          {/* Aircraft Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Aircraft
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="font-medium">{flight.aircraft.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Model</span>
                <span className="font-medium">{flight.aircraft.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Callsign</span>
                <span className="font-medium">{flight.callsign}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
