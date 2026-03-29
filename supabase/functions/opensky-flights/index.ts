import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Key regions to fetch flights from (lat, lon, radius in nm)
const REGIONS = [
  { lat: 40, lon: -40, dist: 250, name: "North Atlantic" },
  { lat: 51, lon: 0, dist: 250, name: "Europe West" },
  { lat: 48, lon: 15, dist: 250, name: "Europe Central" },
  { lat: 40, lon: -90, dist: 250, name: "US Central" },
  { lat: 35, lon: -118, dist: 250, name: "US West" },
  { lat: 40, lon: -74, dist: 250, name: "US East" },
  { lat: 25, lon: 55, dist: 250, name: "Middle East" },
  { lat: 1, lon: 104, dist: 250, name: "Southeast Asia" },
  { lat: 35, lon: 140, dist: 250, name: "Japan" },
  { lat: 22, lon: 114, dist: 250, name: "China South" },
  { lat: 40, lon: 116, dist: 250, name: "China North" },
  { lat: -33, lon: 151, dist: 250, name: "Australia" },
  { lat: 19, lon: -99, dist: 250, name: "Mexico" },
  { lat: 25, lon: 75, dist: 250, name: "India" },
  { lat: 37, lon: 127, dist: 250, name: "Korea" },
  { lat: 6, lon: 3, dist: 250, name: "West Africa" },
  { lat: -1, lon: 37, dist: 250, name: "East Africa" },
  { lat: -23, lon: -46, dist: 250, name: "Brazil" },
];

async function fetchRegion(region: typeof REGIONS[0], signal: AbortSignal): Promise<any[]> {
  const url = `https://api.adsb.lol/v2/lat/${region.lat}/lon/${region.lon}/dist/${region.dist}`;
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "SkyVoyage-FlightTracker/1.0",
    },
    signal,
  });

  if (!response.ok) {
    console.warn(`Region ${region.name} failed: ${response.status}`);
    return [];
  }

  const data = await response.json();
  return data.ac || [];
}

function transformAircraft(ac: any) {
  const altitude = typeof ac.alt_baro === "number" ? ac.alt_baro : 0;
  const speed = typeof ac.gs === "number" ? Math.round(ac.gs * 1.151) : 0;
  const heading = typeof ac.track === "number" ? ac.track : 0;
  const verticalRate = typeof ac.baro_rate === "number" ? Math.round(ac.baro_rate) : 0;

  return {
    icao24: ac.hex || "",
    callsign: (ac.flight || "").trim() || `UNKNOWN-${ac.hex}`,
    originCountry: ac.r || "Unknown",
    position: {
      lat: ac.lat,
      lng: ac.lon,
      altitude,
      speed,
      heading,
      verticalRate,
    },
    lastContact: Math.floor(Date.now() / 1000),
    onGround: ac.alt_baro === "ground",
    squawk: ac.squawk || null,
    category: ac.category ? parseInt(ac.category, 16) : null,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Fetching flights from ADSB.lol regions...");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    // Fetch all regions in parallel
    const results = await Promise.allSettled(
      REGIONS.map(r => fetchRegion(r, controller.signal))
    );
    clearTimeout(timeout);

    // Merge and deduplicate by icao24
    const seen = new Set<string>();
    const flights: any[] = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        for (const ac of result.value) {
          if (
            ac.lat != null && ac.lon != null &&
            ac.alt_baro !== "ground" &&
            ac.flight &&
            !seen.has(ac.hex)
          ) {
            seen.add(ac.hex);
            flights.push(transformAircraft(ac));
          }
        }
      }
    }

    console.log(`Processed ${flights.length} airborne aircraft from ${REGIONS.length} regions`);

    return new Response(
      JSON.stringify({
        time: Math.floor(Date.now() / 1000),
        flights,
        totalCount: flights.length,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=5",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching flight data:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to fetch flight data",
        flights: [],
        totalCount: 0,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
