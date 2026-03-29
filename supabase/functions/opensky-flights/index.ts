import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use ADSB.lol free API - no auth required, reliable
    const apiUrl = "https://api.adsb.lol/v2/ladd";
    
    console.log("Fetching from ADSB.lol:", apiUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    let flights: any[] = [];

    try {
      // Try primary: all aircraft feed
      response = await fetch("https://api.adsb.lol/v2/all", {
        headers: {
          "Accept": "application/json",
          "User-Agent": "SkyVoyage-FlightTracker/1.0",
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`ADSB.lol API error: ${response.status}`);
      }

      const data = await response.json();
      const acList = data.ac || [];

      // Transform ADS-B data to our format
      flights = acList
        .filter((ac: any) => {
          // Must have valid position and be airborne
          return ac.lat != null && ac.lon != null && ac.alt_baro !== "ground" && ac.flight;
        })
        .slice(0, 3000) // Limit to 3000 flights for performance
        .map((ac: any) => {
          const altitude = typeof ac.alt_baro === "number" ? ac.alt_baro : 0;
          const speed = typeof ac.gs === "number" ? Math.round(ac.gs * 1.151) : 0; // knots to mph
          const heading = typeof ac.track === "number" ? ac.track : 0;
          const verticalRate = typeof ac.baro_rate === "number" ? Math.round(ac.baro_rate) : 0;

          return {
            icao24: ac.hex || "",
            callsign: (ac.flight || "").trim() || `UNKNOWN-${ac.hex}`,
            originCountry: ac.r || "Unknown",
            position: {
              lat: ac.lat,
              lng: ac.lon,
              altitude: altitude,
              speed: speed,
              heading: heading,
              verticalRate: verticalRate,
            },
            lastContact: Math.floor(Date.now() / 1000),
            onGround: ac.alt_baro === "ground",
            squawk: ac.squawk || null,
            category: ac.category ? parseInt(ac.category, 16) : null,
          };
        });
    } catch (fetchErr) {
      clearTimeout(timeout);
      console.error("Primary API failed, trying fallback:", fetchErr);

      // Fallback: try OpenSky as secondary
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 10000);
      
      try {
        response = await fetch("https://opensky-network.org/api/states/all", {
          headers: {
            "Accept": "application/json",
            "User-Agent": "SkyVoyage-FlightTracker/1.0",
          },
          signal: controller2.signal,
        });
        clearTimeout(timeout2);

        if (!response.ok) throw new Error(`OpenSky error: ${response.status}`);

        const data = await response.json();
        flights = (data.states || [])
          .filter((s: any[]) => s[6] != null && s[5] != null && !s[8])
          .slice(0, 3000)
          .map((state: any[]) => ({
            icao24: state[0],
            callsign: ((state[1] as string) || "").trim() || `UNKNOWN-${state[0]}`,
            originCountry: state[2],
            position: {
              lat: state[6],
              lng: state[5],
              altitude: Math.round((state[7] || 0) * 3.28084),
              speed: Math.round((state[9] || 0) * 2.237),
              heading: state[10] || 0,
              verticalRate: Math.round((state[11] || 0) * 196.85),
            },
            lastContact: state[4],
            onGround: state[8],
            squawk: state[14],
            category: state[17],
          }));
      } catch (fallbackErr) {
        clearTimeout(timeout2);
        throw new Error(`All flight data sources failed. Primary: ${fetchErr.message}. Fallback: ${fallbackErr.message}`);
      }
    }

    console.log(`Processed ${flights.length} airborne aircraft`);

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
