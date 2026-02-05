import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, MapPin, Shield, Clock, Star, ArrowRight, Globe, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FlightSearch from "@/components/FlightSearch";
import { mockFlights } from "@/data/mockFlights";

const Index = () => {
  const popularDestinations = [
    { city: "Paris", country: "France", image: "🗼", price: 450 },
    { city: "Tokyo", country: "Japan", image: "🗾", price: 890 },
    { city: "Dubai", country: "UAE", image: "🏙️", price: 650 },
    { city: "London", country: "UK", image: "🎡", price: 520 },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your payments are protected with industry-leading security",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your flights live on an interactive map",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our travel experts are always here to help",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access flights to over 500 destinations worldwide",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/90 backdrop-blur rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary-foreground">SkyVoyage</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/flights" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Flights
              </Link>
              <Link to="/tracking" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Track Flight
              </Link>
              <Link to="/dashboard" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                My Trips
              </Link>
              <Link to="/auth">
                <Button variant="secondary" size="sm">Sign In</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>

        {/* Animated Planes */}
        <motion.div
          animate={{ x: ["-100%", "200%"], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 opacity-20"
        >
          <Plane className="w-8 h-8 text-primary-foreground rotate-45" />
        </motion.div>
        <motion.div
          animate={{ x: ["200%", "-100%"], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute bottom-1/3 opacity-20"
        >
          <Plane className="w-6 h-6 text-primary-foreground -rotate-45" />
        </motion.div>

        <div className="container mx-auto px-4 pt-20 relative z-10">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4"
            >
              Discover Your Next
              <br />
              <span className="text-secondary">Adventure</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-primary-foreground/80 max-w-2xl mx-auto"
            >
              Book flights to over 500 destinations worldwide with real-time tracking and premium service
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <FlightSearch />
          </motion.div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose SkyVoyage</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience seamless travel booking with features designed for modern travelers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Destinations</h2>
              <p className="text-muted-foreground">Explore our most booked destinations</p>
            </div>
            <Link to="/flights">
              <Button variant="outline">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, index) => (
              <motion.div
                key={dest.city}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl">
                    {dest.image}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{dest.city}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {dest.country}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">from</p>
                        <p className="font-bold text-primary">${dest.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Today's Best Deals</h2>
            <p className="text-muted-foreground">Limited time offers on premium flights</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFlights.slice(0, 3).map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-primary to-accent p-4 text-primary-foreground">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{flight.airline}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">4.8</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{flight.origin.code}</p>
                          <p className="text-sm text-muted-foreground">{flight.origin.city}</p>
                        </div>
                        <div className="flex-1 px-4">
                          <div className="border-t-2 border-dashed border-muted relative">
                            <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary rotate-90" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{flight.destination.code}</p>
                          <p className="text-sm text-muted-foreground">{flight.destination.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {Math.floor(flight.duration / 60)}h {flight.duration % 60}m • {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop`}
                        </p>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${flight.price}</p>
                          <p className="text-xs text-muted-foreground">per person</p>
                        </div>
                      </div>
                      <Link to={`/booking/${flight.id}`} className="block mt-4">
                        <Button className="w-full">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of travelers who trust SkyVoyage for their flight bookings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/flights">
                <Button size="lg" variant="secondary">
                  Search Flights <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Plane className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">SkyVoyage</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for seamless flight booking and real-time tracking.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/flights" className="hover:text-foreground transition-colors">Search Flights</Link></li>
                <li><Link to="/tracking" className="hover:text-foreground transition-colors">Track Flight</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">My Trips</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2026 SkyVoyage. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
