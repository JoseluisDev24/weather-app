// src/queries/geocoding.ts
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

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
        const res = await axios.get(
          "https://api.openweathermap.org/geo/1.0/direct",
          {
            params: {
              q: query,
              limit: 5,
              appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
            },
          }
        );

        setSuggestions(res.data);
      } catch (err) {
        console.error("Error al obtener sugerencias:", err);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 500); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return suggestions;
}
