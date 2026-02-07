// Comprehensive worldwide airport database
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  size: "large" | "medium" | "small";
}

export const worldAirports: Airport[] = [
  // North America - USA
  { code: "JFK", name: "John F. Kennedy International", city: "New York", country: "USA", region: "North America", lat: 40.6413, lng: -73.7781, size: "large" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "USA", region: "North America", lat: 33.9425, lng: -118.4081, size: "large" },
  { code: "ORD", name: "O'Hare International", city: "Chicago", country: "USA", region: "North America", lat: 41.9742, lng: -87.9073, size: "large" },
  { code: "DFW", name: "Dallas/Fort Worth International", city: "Dallas", country: "USA", region: "North America", lat: 32.8998, lng: -97.0403, size: "large" },
  { code: "DEN", name: "Denver International", city: "Denver", country: "USA", region: "North America", lat: 39.8561, lng: -104.6737, size: "large" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International", city: "Atlanta", country: "USA", region: "North America", lat: 33.6407, lng: -84.4277, size: "large" },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", country: "USA", region: "North America", lat: 37.6213, lng: -122.3790, size: "large" },
  { code: "SEA", name: "Seattle-Tacoma International", city: "Seattle", country: "USA", region: "North America", lat: 47.4502, lng: -122.3088, size: "large" },
  { code: "MIA", name: "Miami International", city: "Miami", country: "USA", region: "North America", lat: 25.7959, lng: -80.2870, size: "large" },
  { code: "BOS", name: "Boston Logan International", city: "Boston", country: "USA", region: "North America", lat: 42.3656, lng: -71.0096, size: "large" },
  { code: "EWR", name: "Newark Liberty International", city: "Newark", country: "USA", region: "North America", lat: 40.6895, lng: -74.1745, size: "large" },
  { code: "MSP", name: "Minneapolis-Saint Paul International", city: "Minneapolis", country: "USA", region: "North America", lat: 44.8848, lng: -93.2223, size: "medium" },
  { code: "DTW", name: "Detroit Metropolitan", city: "Detroit", country: "USA", region: "North America", lat: 42.2124, lng: -83.3534, size: "medium" },
  { code: "PHX", name: "Phoenix Sky Harbor International", city: "Phoenix", country: "USA", region: "North America", lat: 33.4373, lng: -112.0078, size: "large" },
  { code: "LAS", name: "Harry Reid International", city: "Las Vegas", country: "USA", region: "North America", lat: 36.0840, lng: -115.1537, size: "large" },
  { code: "MCO", name: "Orlando International", city: "Orlando", country: "USA", region: "North America", lat: 28.4312, lng: -81.3081, size: "large" },
  { code: "IAH", name: "George Bush Intercontinental", city: "Houston", country: "USA", region: "North America", lat: 29.9902, lng: -95.3368, size: "large" },
  { code: "CLT", name: "Charlotte Douglas International", city: "Charlotte", country: "USA", region: "North America", lat: 35.2140, lng: -80.9431, size: "large" },
  { code: "PHL", name: "Philadelphia International", city: "Philadelphia", country: "USA", region: "North America", lat: 39.8744, lng: -75.2424, size: "large" },
  { code: "IAD", name: "Washington Dulles International", city: "Washington D.C.", country: "USA", region: "North America", lat: 38.9531, lng: -77.4565, size: "large" },
  { code: "SAN", name: "San Diego International", city: "San Diego", country: "USA", region: "North America", lat: 32.7338, lng: -117.1933, size: "medium" },
  { code: "ANC", name: "Ted Stevens Anchorage International", city: "Anchorage", country: "USA", region: "North America", lat: 61.1743, lng: -149.9963, size: "medium" },
  { code: "HNL", name: "Daniel K. Inouye International", city: "Honolulu", country: "USA", region: "North America", lat: 21.3187, lng: -157.9225, size: "large" },
  
  // North America - Canada
  { code: "YYZ", name: "Toronto Pearson International", city: "Toronto", country: "Canada", region: "North America", lat: 43.6777, lng: -79.6248, size: "large" },
  { code: "YVR", name: "Vancouver International", city: "Vancouver", country: "Canada", region: "North America", lat: 49.1967, lng: -123.1815, size: "large" },
  { code: "YUL", name: "Montréal-Trudeau International", city: "Montreal", country: "Canada", region: "North America", lat: 45.4706, lng: -73.7408, size: "large" },
  { code: "YYC", name: "Calgary International", city: "Calgary", country: "Canada", region: "North America", lat: 51.1215, lng: -114.0076, size: "medium" },
  { code: "YEG", name: "Edmonton International", city: "Edmonton", country: "Canada", region: "North America", lat: 53.3097, lng: -113.5800, size: "medium" },
  
  // North America - Mexico
  { code: "MEX", name: "Mexico City International", city: "Mexico City", country: "Mexico", region: "North America", lat: 19.4361, lng: -99.0719, size: "large" },
  { code: "CUN", name: "Cancún International", city: "Cancún", country: "Mexico", region: "North America", lat: 21.0365, lng: -86.8771, size: "large" },
  { code: "GDL", name: "Guadalajara International", city: "Guadalajara", country: "Mexico", region: "North America", lat: 20.5218, lng: -103.3111, size: "medium" },
  
  // Europe - United Kingdom
  { code: "LHR", name: "London Heathrow", city: "London", country: "UK", region: "Europe", lat: 51.4700, lng: -0.4543, size: "large" },
  { code: "LGW", name: "London Gatwick", city: "London", country: "UK", region: "Europe", lat: 51.1537, lng: -0.1821, size: "large" },
  { code: "MAN", name: "Manchester Airport", city: "Manchester", country: "UK", region: "Europe", lat: 53.3537, lng: -2.2750, size: "large" },
  { code: "EDI", name: "Edinburgh Airport", city: "Edinburgh", country: "UK", region: "Europe", lat: 55.9500, lng: -3.3725, size: "medium" },
  { code: "STN", name: "London Stansted", city: "London", country: "UK", region: "Europe", lat: 51.8860, lng: 0.2389, size: "large" },
  
  // Europe - France
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France", region: "Europe", lat: 49.0097, lng: 2.5479, size: "large" },
  { code: "ORY", name: "Paris Orly", city: "Paris", country: "France", region: "Europe", lat: 48.7262, lng: 2.3652, size: "large" },
  { code: "NCE", name: "Nice Côte d'Azur", city: "Nice", country: "France", region: "Europe", lat: 43.6584, lng: 7.2159, size: "medium" },
  { code: "LYS", name: "Lyon-Saint Exupéry", city: "Lyon", country: "France", region: "Europe", lat: 45.7256, lng: 5.0811, size: "medium" },
  
  // Europe - Germany
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", region: "Europe", lat: 50.0379, lng: 8.5622, size: "large" },
  { code: "MUC", name: "Munich Airport", city: "Munich", country: "Germany", region: "Europe", lat: 48.3537, lng: 11.7750, size: "large" },
  { code: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "Germany", region: "Europe", lat: 52.3667, lng: 13.5033, size: "large" },
  { code: "DUS", name: "Düsseldorf Airport", city: "Düsseldorf", country: "Germany", region: "Europe", lat: 51.2895, lng: 6.7668, size: "medium" },
  { code: "HAM", name: "Hamburg Airport", city: "Hamburg", country: "Germany", region: "Europe", lat: 53.6304, lng: 10.0065, size: "medium" },
  
  // Europe - Netherlands
  { code: "AMS", name: "Amsterdam Schiphol", city: "Amsterdam", country: "Netherlands", region: "Europe", lat: 52.3105, lng: 4.7683, size: "large" },
  
  // Europe - Spain
  { code: "MAD", name: "Madrid Barajas", city: "Madrid", country: "Spain", region: "Europe", lat: 40.4983, lng: -3.5676, size: "large" },
  { code: "BCN", name: "Barcelona El Prat", city: "Barcelona", country: "Spain", region: "Europe", lat: 41.2971, lng: 2.0785, size: "large" },
  { code: "PMI", name: "Palma de Mallorca", city: "Palma", country: "Spain", region: "Europe", lat: 39.5517, lng: 2.7388, size: "medium" },
  
  // Europe - Italy
  { code: "FCO", name: "Rome Fiumicino", city: "Rome", country: "Italy", region: "Europe", lat: 41.8003, lng: 12.2389, size: "large" },
  { code: "MXP", name: "Milan Malpensa", city: "Milan", country: "Italy", region: "Europe", lat: 45.6306, lng: 8.7281, size: "large" },
  { code: "VCE", name: "Venice Marco Polo", city: "Venice", country: "Italy", region: "Europe", lat: 45.5053, lng: 12.3519, size: "medium" },
  
  // Europe - Other
  { code: "ZRH", name: "Zurich Airport", city: "Zurich", country: "Switzerland", region: "Europe", lat: 47.4647, lng: 8.5492, size: "large" },
  { code: "VIE", name: "Vienna International", city: "Vienna", country: "Austria", region: "Europe", lat: 48.1103, lng: 16.5697, size: "large" },
  { code: "CPH", name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark", region: "Europe", lat: 55.6180, lng: 12.6508, size: "large" },
  { code: "OSL", name: "Oslo Gardermoen", city: "Oslo", country: "Norway", region: "Europe", lat: 60.1976, lng: 11.1004, size: "medium" },
  { code: "ARN", name: "Stockholm Arlanda", city: "Stockholm", country: "Sweden", region: "Europe", lat: 59.6498, lng: 17.9238, size: "large" },
  { code: "HEL", name: "Helsinki-Vantaa", city: "Helsinki", country: "Finland", region: "Europe", lat: 60.3172, lng: 24.9633, size: "medium" },
  { code: "DUB", name: "Dublin Airport", city: "Dublin", country: "Ireland", region: "Europe", lat: 53.4213, lng: -6.2701, size: "large" },
  { code: "LIS", name: "Lisbon Portela", city: "Lisbon", country: "Portugal", region: "Europe", lat: 38.7756, lng: -9.1354, size: "large" },
  { code: "ATH", name: "Athens International", city: "Athens", country: "Greece", region: "Europe", lat: 37.9364, lng: 23.9445, size: "large" },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey", region: "Europe", lat: 41.2753, lng: 28.7519, size: "large" },
  { code: "SAW", name: "Istanbul Sabiha Gökçen", city: "Istanbul", country: "Turkey", region: "Europe", lat: 40.8986, lng: 29.3092, size: "large" },
  { code: "WAW", name: "Warsaw Chopin", city: "Warsaw", country: "Poland", region: "Europe", lat: 52.1657, lng: 20.9671, size: "medium" },
  { code: "PRG", name: "Prague Václav Havel", city: "Prague", country: "Czech Republic", region: "Europe", lat: 50.1008, lng: 14.2600, size: "medium" },
  { code: "BUD", name: "Budapest Ferenc Liszt", city: "Budapest", country: "Hungary", region: "Europe", lat: 47.4298, lng: 19.2611, size: "medium" },
  { code: "BRU", name: "Brussels Airport", city: "Brussels", country: "Belgium", region: "Europe", lat: 50.9014, lng: 4.4844, size: "large" },
  
  // Middle East
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE", region: "Middle East", lat: 25.2532, lng: 55.3657, size: "large" },
  { code: "AUH", name: "Abu Dhabi International", city: "Abu Dhabi", country: "UAE", region: "Middle East", lat: 24.4330, lng: 54.6511, size: "large" },
  { code: "DOH", name: "Hamad International", city: "Doha", country: "Qatar", region: "Middle East", lat: 25.2731, lng: 51.6080, size: "large" },
  { code: "RUH", name: "King Khalid International", city: "Riyadh", country: "Saudi Arabia", region: "Middle East", lat: 24.9576, lng: 46.6988, size: "large" },
  { code: "JED", name: "King Abdulaziz International", city: "Jeddah", country: "Saudi Arabia", region: "Middle East", lat: 21.6796, lng: 39.1565, size: "large" },
  { code: "BAH", name: "Bahrain International", city: "Manama", country: "Bahrain", region: "Middle East", lat: 26.2708, lng: 50.6336, size: "medium" },
  { code: "KWI", name: "Kuwait International", city: "Kuwait City", country: "Kuwait", region: "Middle East", lat: 29.2266, lng: 47.9689, size: "medium" },
  { code: "TLV", name: "Ben Gurion International", city: "Tel Aviv", country: "Israel", region: "Middle East", lat: 32.0055, lng: 34.8854, size: "large" },
  { code: "AMM", name: "Queen Alia International", city: "Amman", country: "Jordan", region: "Middle East", lat: 31.7226, lng: 35.9932, size: "medium" },
  
  // Asia - East Asia
  { code: "HND", name: "Tokyo Haneda", city: "Tokyo", country: "Japan", region: "Asia", lat: 35.5494, lng: 139.7798, size: "large" },
  { code: "NRT", name: "Narita International", city: "Tokyo", country: "Japan", region: "Asia", lat: 35.7720, lng: 140.3929, size: "large" },
  { code: "KIX", name: "Kansai International", city: "Osaka", country: "Japan", region: "Asia", lat: 34.4347, lng: 135.2441, size: "large" },
  { code: "ICN", name: "Incheon International", city: "Seoul", country: "South Korea", region: "Asia", lat: 37.4602, lng: 126.4407, size: "large" },
  { code: "GMP", name: "Gimpo International", city: "Seoul", country: "South Korea", region: "Asia", lat: 37.5583, lng: 126.7906, size: "large" },
  { code: "PEK", name: "Beijing Capital International", city: "Beijing", country: "China", region: "Asia", lat: 40.0799, lng: 116.6031, size: "large" },
  { code: "PKX", name: "Beijing Daxing International", city: "Beijing", country: "China", region: "Asia", lat: 39.5098, lng: 116.4105, size: "large" },
  { code: "PVG", name: "Shanghai Pudong International", city: "Shanghai", country: "China", region: "Asia", lat: 31.1443, lng: 121.8083, size: "large" },
  { code: "SHA", name: "Shanghai Hongqiao International", city: "Shanghai", country: "China", region: "Asia", lat: 31.1979, lng: 121.3363, size: "large" },
  { code: "CAN", name: "Guangzhou Baiyun International", city: "Guangzhou", country: "China", region: "Asia", lat: 23.3924, lng: 113.2988, size: "large" },
  { code: "SZX", name: "Shenzhen Bao'an International", city: "Shenzhen", country: "China", region: "Asia", lat: 22.6393, lng: 113.8106, size: "large" },
  { code: "CTU", name: "Chengdu Tianfu International", city: "Chengdu", country: "China", region: "Asia", lat: 30.3195, lng: 104.4397, size: "large" },
  { code: "HKG", name: "Hong Kong International", city: "Hong Kong", country: "China", region: "Asia", lat: 22.3080, lng: 113.9185, size: "large" },
  { code: "TPE", name: "Taiwan Taoyuan International", city: "Taipei", country: "Taiwan", region: "Asia", lat: 25.0777, lng: 121.2325, size: "large" },
  
  // Asia - Southeast Asia
  { code: "SIN", name: "Singapore Changi", city: "Singapore", country: "Singapore", region: "Asia", lat: 1.3644, lng: 103.9915, size: "large" },
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand", region: "Asia", lat: 13.6900, lng: 100.7501, size: "large" },
  { code: "DMK", name: "Don Mueang International", city: "Bangkok", country: "Thailand", region: "Asia", lat: 13.9126, lng: 100.6068, size: "large" },
  { code: "KUL", name: "Kuala Lumpur International", city: "Kuala Lumpur", country: "Malaysia", region: "Asia", lat: 2.7456, lng: 101.7099, size: "large" },
  { code: "CGK", name: "Soekarno-Hatta International", city: "Jakarta", country: "Indonesia", region: "Asia", lat: -6.1256, lng: 106.6558, size: "large" },
  { code: "DPS", name: "Ngurah Rai International", city: "Bali", country: "Indonesia", region: "Asia", lat: -8.7482, lng: 115.1671, size: "large" },
  { code: "MNL", name: "Ninoy Aquino International", city: "Manila", country: "Philippines", region: "Asia", lat: 14.5086, lng: 121.0198, size: "large" },
  { code: "SGN", name: "Tan Son Nhat International", city: "Ho Chi Minh City", country: "Vietnam", region: "Asia", lat: 10.8188, lng: 106.6520, size: "large" },
  { code: "HAN", name: "Noi Bai International", city: "Hanoi", country: "Vietnam", region: "Asia", lat: 21.2212, lng: 105.8072, size: "large" },
  
  // Asia - South Asia
  { code: "DEL", name: "Indira Gandhi International", city: "Delhi", country: "India", region: "Asia", lat: 28.5562, lng: 77.1000, size: "large" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International", city: "Mumbai", country: "India", region: "Asia", lat: 19.0896, lng: 72.8656, size: "large" },
  { code: "BLR", name: "Kempegowda International", city: "Bangalore", country: "India", region: "Asia", lat: 13.1986, lng: 77.7066, size: "large" },
  { code: "MAA", name: "Chennai International", city: "Chennai", country: "India", region: "Asia", lat: 12.9941, lng: 80.1709, size: "large" },
  { code: "HYD", name: "Rajiv Gandhi International", city: "Hyderabad", country: "India", region: "Asia", lat: 17.2403, lng: 78.4294, size: "large" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International", city: "Kolkata", country: "India", region: "Asia", lat: 22.6547, lng: 88.4467, size: "large" },
  { code: "CMB", name: "Bandaranaike International", city: "Colombo", country: "Sri Lanka", region: "Asia", lat: 7.1808, lng: 79.8841, size: "medium" },
  { code: "DAC", name: "Hazrat Shahjalal International", city: "Dhaka", country: "Bangladesh", region: "Asia", lat: 23.8433, lng: 90.3978, size: "large" },
  { code: "KTM", name: "Tribhuvan International", city: "Kathmandu", country: "Nepal", region: "Asia", lat: 27.6966, lng: 85.3591, size: "medium" },
  
  // Oceania
  { code: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", country: "Australia", region: "Oceania", lat: -33.9399, lng: 151.1753, size: "large" },
  { code: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "Australia", region: "Oceania", lat: -37.6690, lng: 144.8410, size: "large" },
  { code: "BNE", name: "Brisbane Airport", city: "Brisbane", country: "Australia", region: "Oceania", lat: -27.3842, lng: 153.1175, size: "large" },
  { code: "PER", name: "Perth Airport", city: "Perth", country: "Australia", region: "Oceania", lat: -31.9403, lng: 115.9670, size: "large" },
  { code: "AKL", name: "Auckland Airport", city: "Auckland", country: "New Zealand", region: "Oceania", lat: -37.0082, lng: 174.7850, size: "large" },
  { code: "WLG", name: "Wellington International", city: "Wellington", country: "New Zealand", region: "Oceania", lat: -41.3272, lng: 174.8051, size: "medium" },
  { code: "CHC", name: "Christchurch International", city: "Christchurch", country: "New Zealand", region: "Oceania", lat: -43.4894, lng: 172.5322, size: "medium" },
  { code: "NAN", name: "Nadi International", city: "Nadi", country: "Fiji", region: "Oceania", lat: -17.7553, lng: 177.4432, size: "medium" },
  
  // South America
  { code: "GRU", name: "São Paulo/Guarulhos International", city: "São Paulo", country: "Brazil", region: "South America", lat: -23.4356, lng: -46.4731, size: "large" },
  { code: "GIG", name: "Rio de Janeiro/Galeão International", city: "Rio de Janeiro", country: "Brazil", region: "South America", lat: -22.8100, lng: -43.2505, size: "large" },
  { code: "BSB", name: "Brasília International", city: "Brasília", country: "Brazil", region: "South America", lat: -15.8711, lng: -47.9186, size: "large" },
  { code: "EZE", name: "Ministro Pistarini International", city: "Buenos Aires", country: "Argentina", region: "South America", lat: -34.8222, lng: -58.5358, size: "large" },
  { code: "SCL", name: "Arturo Merino Benítez International", city: "Santiago", country: "Chile", region: "South America", lat: -33.3930, lng: -70.7858, size: "large" },
  { code: "LIM", name: "Jorge Chávez International", city: "Lima", country: "Peru", region: "South America", lat: -12.0219, lng: -77.1143, size: "large" },
  { code: "BOG", name: "El Dorado International", city: "Bogotá", country: "Colombia", region: "South America", lat: 4.7016, lng: -74.1469, size: "large" },
  { code: "MDE", name: "José María Córdova International", city: "Medellín", country: "Colombia", region: "South America", lat: 6.1645, lng: -75.4231, size: "medium" },
  { code: "UIO", name: "Mariscal Sucre International", city: "Quito", country: "Ecuador", region: "South America", lat: -0.1292, lng: -78.3575, size: "medium" },
  { code: "CCS", name: "Simón Bolívar International", city: "Caracas", country: "Venezuela", region: "South America", lat: 10.6031, lng: -66.9906, size: "large" },
  
  // Africa
  { code: "JNB", name: "O.R. Tambo International", city: "Johannesburg", country: "South Africa", region: "Africa", lat: -26.1367, lng: 28.2460, size: "large" },
  { code: "CPT", name: "Cape Town International", city: "Cape Town", country: "South Africa", region: "Africa", lat: -33.9715, lng: 18.6021, size: "large" },
  { code: "CAI", name: "Cairo International", city: "Cairo", country: "Egypt", region: "Africa", lat: 30.1219, lng: 31.4056, size: "large" },
  { code: "ADD", name: "Bole International", city: "Addis Ababa", country: "Ethiopia", region: "Africa", lat: 8.9779, lng: 38.7993, size: "large" },
  { code: "NBO", name: "Jomo Kenyatta International", city: "Nairobi", country: "Kenya", region: "Africa", lat: -1.3192, lng: 36.9278, size: "large" },
  { code: "LOS", name: "Murtala Muhammed International", city: "Lagos", country: "Nigeria", region: "Africa", lat: 6.5774, lng: 3.3212, size: "large" },
  { code: "CMN", name: "Mohammed V International", city: "Casablanca", country: "Morocco", region: "Africa", lat: 33.3675, lng: -7.5898, size: "large" },
  { code: "ALG", name: "Houari Boumediene Airport", city: "Algiers", country: "Algeria", region: "Africa", lat: 36.6910, lng: 3.2154, size: "medium" },
  { code: "TUN", name: "Tunis-Carthage International", city: "Tunis", country: "Tunisia", region: "Africa", lat: 36.8510, lng: 10.2272, size: "medium" },
  { code: "ACC", name: "Kotoka International", city: "Accra", country: "Ghana", region: "Africa", lat: 5.6052, lng: -0.1668, size: "medium" },
  { code: "DSS", name: "Blaise Diagne International", city: "Dakar", country: "Senegal", region: "Africa", lat: 14.6700, lng: -17.0733, size: "medium" },
  { code: "DAR", name: "Julius Nyerere International", city: "Dar es Salaam", country: "Tanzania", region: "Africa", lat: -6.8781, lng: 39.2026, size: "medium" },
  { code: "MRU", name: "Sir Seewoosagur Ramgoolam International", city: "Mauritius", country: "Mauritius", region: "Africa", lat: -20.4302, lng: 57.6836, size: "medium" },
];

// Get airports by region
export function getAirportsByRegion(region: string): Airport[] {
  return worldAirports.filter(a => a.region === region);
}

// Get large airports only (for markers at low zoom)
export function getLargeAirports(): Airport[] {
  return worldAirports.filter(a => a.size === "large");
}

// Find airport by code
export function findAirport(code: string): Airport | undefined {
  return worldAirports.find(a => a.code === code);
}
