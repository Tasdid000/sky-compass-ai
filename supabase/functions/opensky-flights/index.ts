import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OpenSkyState {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number;
  category: number | null;
}

interface OpenSkyResponse {
  time: number;
  states: (string | number | boolean | null | number[])[][] | null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const lamin = url.searchParams.get("lamin");
    const lomin = url.searchParams.get("lomin");
    const lamax = url.searchParams.get("lamax");
    const lomax = url.searchParams.get("lomax");

    // Build OpenSky API URL
    let openSkyUrl = "https://opensky-network.org/api/states/all";
    const params = new URLSearchParams();
    
    if (lamin && lomin && lamax && lomax) {
      params.append("lamin", lamin);
      params.append("lomin", lomin);
      params.append("lamax", lamax);
      params.append("lomax", lomax);
    }

    if (params.toString()) {
      openSkyUrl += `?${params.toString()}`;
    }

    console.log("Fetching from OpenSky:", openSkyUrl);

    const response = await fetch(openSkyUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "SkyVoyage-FlightTracker/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenSky API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenSkyResponse = await response.json();

    // Transform the state vectors into a more usable format
    const flights = data.states?.map((state) => {
      const [
        icao24,
        callsign,
        origin_country,
        time_position,
        last_contact,
        longitude,
        latitude,
        baro_altitude,
        on_ground,
        velocity,
        true_track,
        vertical_rate,
        sensors,
        geo_altitude,
        squawk,
        spi,
        position_source,
        category,
      ] = state;

      // Skip aircraft without valid position
      if (latitude === null || longitude === null) {
        return null;
      }

      // Skip aircraft on ground
      if (on_ground) {
        return null;
      }

      return {
        icao24: icao24 as string,
        callsign: ((callsign as string) || "").trim() || `UNKNOWN-${icao24}`,
        originCountry: origin_country as string,
        position: {
          lat: latitude as number,
          lng: longitude as number,
          altitude: Math.round(((baro_altitude as number) || 0) * 3.28084), // meters to feet
          speed: Math.round(((velocity as number) || 0) * 2.237), // m/s to mph
          heading: (true_track as number) || 0,
          verticalRate: Math.round(((vertical_rate as number) || 0) * 196.85), // m/s to ft/min
        },
        lastContact: last_contact as number,
        onGround: on_ground as boolean,
        squawk: squawk as string | null,
        category: category as number | null,
      };
    }).filter(Boolean) || [];

    console.log(`Processed ${flights.length} airborne aircraft`);

    return new Response(
      JSON.stringify({
        time: data.time,
        flights,
        totalCount: flights.length,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=5", // Cache for 5 seconds
        },
      }
    );
  } catch (error) {
    console.error("Error fetching OpenSky data:", error);
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
