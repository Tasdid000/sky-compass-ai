import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Calendar, MapPin, Clock, CreditCard, Settings, User, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { mockFlights } from "@/data/mockFlights";
import type { Booking } from "@/types/flight";

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Mock bookings data
    const mockBookings: Booking[] = [
      {
        id: "BK001",
        flight: mockFlights[0],
        passengers: [
          { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "+1234567890" }
        ],
        seatNumbers: ["12A"],
        totalPrice: 450,
        status: "confirmed",
        bookedAt: new Date("2026-01-15"),
      },
      {
        id: "BK002",
        flight: mockFlights[2],
        passengers: [
          { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "+1234567890" }
        ],
        seatNumbers: ["8F"],
        totalPrice: 780,
        status: "confirmed",
        bookedAt: new Date("2026-01-20"),
      },
      {
        id: "BK003",
        flight: mockFlights[4],
        passengers: [
          { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "+1234567890" }
        ],
        seatNumbers: ["15C"],
        totalPrice: 320,
        status: "completed",
        bookedAt: new Date("2025-12-01"),
      },
    ];
    setBookings(mockBookings);
  }, []);

  const upcomingBookings = bookings.filter(b => b.status === "confirmed");
  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const BookingCard = ({ booking, isPast = false }: { booking: Booking; isPast?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${isPast ? 'opacity-75' : ''}`}>
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                <span className="font-semibold">{booking.flight.airline}</span>
                <span className="text-sm opacity-80">{booking.flight.flightNumber}</span>
              </div>
              <Badge variant={isPast ? "secondary" : "outline"} className="bg-white/20 text-white border-white/30">
                {booking.status}
              </Badge>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{booking.flight.origin.code}</p>
                <p className="text-sm text-muted-foreground">{booking.flight.origin.city}</p>
              </div>
              
              <div className="flex-1 px-4">
                <div className="relative">
                  <div className="border-t-2 border-dashed border-muted"></div>
                  <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary rotate-90" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{booking.flight.destination.code}</p>
                <p className="text-sm text-muted-foreground">{booking.flight.destination.city}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(booking.flight.departureTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(booking.flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Seat: {booking.seatNumbers.join(", ")}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Booking ID: {booking.id}</span>
              <Link to={`/tracking?flight=${booking.flight.flightNumber}`}>
                <Button variant="ghost" size="sm" className="group-hover:text-primary">
                  Track Flight <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

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
              <Link to="/tracking" className="text-muted-foreground hover:text-foreground transition-colors">
                Track Flight
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
              </h1>
              <p className="text-muted-foreground">Manage your trips and track your flights</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardDescription>Upcoming Trips</CardDescription>
                <CardTitle className="text-3xl">{upcomingBookings.length}</CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardHeader className="pb-2">
                <CardDescription>Total Flights</CardDescription>
                <CardTitle className="text-3xl">{bookings.length}</CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
              <CardHeader className="pb-2">
                <CardDescription>Total Spent</CardDescription>
                <CardTitle className="text-3xl">
                  ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
            <TabsTrigger value="past">Past Trips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming trips</h3>
                  <p className="text-muted-foreground mb-4">Start planning your next adventure!</p>
                  <Link to="/flights">
                    <Button>Search Flights</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastBookings.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isPast />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No past trips</h3>
                  <p className="text-muted-foreground">Your completed trips will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/flights">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Plane className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Search Flights</h3>
                    <p className="text-sm text-muted-foreground">Find your next destination</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/tracking">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <MapPin className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Track Flight</h3>
                    <p className="text-sm text-muted-foreground">Real-time flight tracking</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                  <CreditCard className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Payment Methods</h3>
                  <p className="text-sm text-muted-foreground">Manage your cards</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
