import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Clock, User, CreditCard, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockFlights } from "@/data/mockFlights";
import type { Passenger } from "@/types/flight";

type BookingStep = "passengers" | "seats" | "payment" | "confirmation";

const Booking = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const flight = mockFlights.find(f => f.id === flightId);
  
  const [step, setStep] = useState<BookingStep>("passengers");
  const [passengers, setPassengers] = useState<Passenger[]>([
    { firstName: "", lastName: "", email: "", phone: "" }
  ]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate seat map
  const seatMap = useMemo(() => {
    const rows = 20;
    const cols = ['A', 'B', 'C', '', 'D', 'E', 'F'];
    const seats: { id: string; available: boolean }[][] = [];
    
    for (let row = 1; row <= rows; row++) {
      const rowSeats = cols.map(col => {
        if (col === '') return { id: '', available: false };
        const seatId = `${row}${col}`;
        return {
          id: seatId,
          available: Math.random() > 0.3, // 70% available
        };
      });
      seats.push(rowSeats);
    }
    return seats;
  }, []);

  if (!flight) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Flight not found</h2>
          <Link to="/flights">
            <Button>Browse Flights</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else if (selectedSeats.length < passengers.length) {
      setSelectedSeats(prev => [...prev, seatId]);
    } else {
      toast({
        title: "Maximum seats selected",
        description: `You can only select ${passengers.length} seat(s) for ${passengers.length} passenger(s).`,
        variant: "destructive",
      });
    }
  };

  const totalPrice = flight.price * passengers.length;

  const validateStep = () => {
    if (step === "passengers") {
      const isValid = passengers.every(p => 
        p.firstName.trim() && p.lastName.trim() && p.email.trim() && p.phone.trim()
      );
      if (!isValid) {
        toast({
          title: "Missing information",
          description: "Please fill in all passenger details.",
          variant: "destructive",
        });
        return false;
      }
    }
    if (step === "seats") {
      if (selectedSeats.length !== passengers.length) {
        toast({
          title: "Select seats",
          description: `Please select ${passengers.length} seat(s) for your passengers.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    
    if (step === "passengers") setStep("seats");
    else if (step === "seats") setStep("payment");
    else if (step === "payment") handlePayment();
  };

  const prevStep = () => {
    if (step === "seats") setStep("passengers");
    else if (step === "payment") setStep("seats");
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStep("confirmation");
    
    toast({
      title: "Booking confirmed!",
      description: "Your flight has been booked successfully.",
    });
  };

  const steps = [
    { id: "passengers", label: "Passengers" },
    { id: "seats", label: "Seats" },
    { id: "payment", label: "Payment" },
    { id: "confirmation", label: "Confirmation" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/flights" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Book Your Flight</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
                ${step === s.id || steps.findIndex(st => st.id === step) > i
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }`}>
                {steps.findIndex(st => st.id === step) > i ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm hidden sm:inline ${step === s.id ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${steps.findIndex(st => st.id === step) > i ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Passengers Step */}
            {step === "passengers" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" /> Passenger Details
                    </CardTitle>
                    <CardDescription>Enter details for all passengers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {passengers.map((passenger, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <h4 className="font-medium">Passenger {index + 1}</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input
                              value={passenger.firstName}
                              onChange={(e) => updatePassenger(index, "firstName", e.target.value)}
                              placeholder="John"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input
                              value={passenger.lastName}
                              onChange={(e) => updatePassenger(index, "lastName", e.target.value)}
                              placeholder="Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={passenger.email}
                              onChange={(e) => updatePassenger(index, "email", e.target.value)}
                              placeholder="john@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                              type="tel"
                              value={passenger.phone}
                              onChange={(e) => updatePassenger(index, "phone", e.target.value)}
                              placeholder="+1 234 567 8900"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Seats Step */}
            {step === "seats" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Select Your Seats</CardTitle>
                    <CardDescription>
                      Select {passengers.length} seat{passengers.length > 1 ? 's' : ''} for your passengers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-muted rounded" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded" />
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-muted-foreground/20 rounded" />
                        <span>Occupied</span>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      <div className="flex justify-center mb-4">
                        <div className="bg-muted px-8 py-2 rounded-t-3xl text-sm text-muted-foreground">
                          Front
                        </div>
                      </div>
                      
                      {seatMap.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center items-center gap-1 mb-1">
                          <span className="w-6 text-xs text-muted-foreground text-right">
                            {rowIndex + 1}
                          </span>
                          {row.map((seat, colIndex) => (
                            seat.id === '' ? (
                              <div key={colIndex} className="w-8" />
                            ) : (
                              <button
                                key={seat.id}
                                disabled={!seat.available}
                                onClick={() => toggleSeat(seat.id)}
                                className={`w-8 h-8 rounded text-xs font-medium transition-colors
                                  ${selectedSeats.includes(seat.id)
                                    ? 'bg-primary text-primary-foreground'
                                    : seat.available
                                      ? 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                      : 'bg-muted-foreground/20 text-muted-foreground/50 cursor-not-allowed'
                                  }`}
                              >
                                {seat.id.slice(-1)}
                              </button>
                            )
                          ))}
                        </div>
                      ))}
                    </div>

                    {selectedSeats.length > 0 && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Selected seats: {selectedSeats.join(", ")}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" /> Payment Details
                    </CardTitle>
                    <CardDescription>Enter your payment information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVC</Label>
                        <Input placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Cardholder Name</Label>
                      <Input placeholder="John Doe" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is a demo. No actual payment will be processed.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Confirmation Step */}
            {step === "confirmation" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="text-center">
                  <CardContent className="pt-8">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                    <p className="text-muted-foreground mb-6">
                      Your booking reference is: <span className="font-mono font-bold">BK{Date.now().toString().slice(-6)}</span>
                    </p>
                    
                    <div className="bg-muted p-6 rounded-lg text-left mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-bold">{flight.origin.code}</p>
                          <p className="text-sm text-muted-foreground">{formatTime(flight.departureTime)}</p>
                        </div>
                        <Plane className="w-6 h-6 text-primary" />
                        <div className="text-right">
                          <p className="text-2xl font-bold">{flight.destination.code}</p>
                          <p className="text-sm text-muted-foreground">{formatTime(flight.arrivalTime)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {flight.airline} • {flight.flightNumber} • {formatDate(flight.departureTime)}
                      </p>
                      <p className="text-sm text-muted-foreground">Seats: {selectedSeats.join(", ")}</p>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Link to="/dashboard">
                        <Button>View My Trips</Button>
                      </Link>
                      <Link to="/flights">
                        <Button variant="outline">Book Another Flight</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            {step !== "confirmation" && (
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === "passengers"}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep} disabled={isProcessing}>
                  {isProcessing ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground" />
                  ) : step === "payment" ? (
                    <>Complete Booking <Check className="w-4 h-4 ml-2" /></>
                  ) : (
                    <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Flight Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{flight.origin.code}</p>
                    <p className="text-sm text-muted-foreground">{formatTime(flight.departureTime)}</p>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="border-t border-dashed relative">
                      <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary rotate-90" />
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      {formatDuration(flight.duration)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{flight.destination.code}</p>
                    <p className="text-sm text-muted-foreground">{formatTime(flight.arrivalTime)}</p>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span>{formatDate(flight.departureTime)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Airline</span>
                    <span>{flight.airline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Flight</span>
                    <span>{flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Class</span>
                    <Badge variant="outline">{flight.class}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Passengers</span>
                    <span>{passengers.length}</span>
                  </div>
                  {selectedSeats.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Seats</span>
                      <span>{selectedSeats.join(", ")}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      ${flight.price} x {passengers.length} passenger{passengers.length > 1 ? 's' : ''}
                    </span>
                    <span>${flight.price * passengers.length}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span>${Math.round(flight.price * passengers.length * 0.12)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">
                      ${Math.round(flight.price * passengers.length * 1.12)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
