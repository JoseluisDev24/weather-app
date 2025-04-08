"use client";

import { useEffect, useState } from "react";
import geoClient from "../services/httpClient/geoClient";

interface Suggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export default function useCitySuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await geoClient.get("direct", {
          params: {
            q: query,
            limit: 5,
            appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
          },
        });
        setSuggestions(res.data);
      } catch (error) {
        console.error("Error al obtener sugerencias:", error);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  return suggestions;
}
