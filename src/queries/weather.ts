"use client";

import { useState, useCallback, useEffect } from "react";
import weatherService from "../services/httpClient/weatherService";

interface WeatherData {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
}

interface ForecastData {
  date: string;
  icon: string;
  tempMin: number;
  tempMax: number;
  description: string;
}

const useWeatherQuery = (city: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]); // Tipo actualizado
  const [error, setError] = useState<string | null>(null);

  // Hacemos que fetchWeather sea una función que no cambie a menos que `city` cambie.
  const fetchWeather = useCallback(async () => {
    if (!city.trim()) return;
    setError(null);
    setForecast([]); // Limpiar pronóstico previo

    try {
      const weatherResponse = await weatherService.get("weather", {
        params: {
          q: city,
          appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
          units: "metric",
          lang: "es",
        },
      });

      if (weatherResponse.data.cod !== 200)
        throw new Error(weatherResponse.data.message);

      setWeather(weatherResponse.data);

      const forecastResponse = await weatherService.get("forecast", {
        params: {
          q: city,
          appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
          units: "metric",
          lang: "es",
        },
      });

      if (forecastResponse.data.cod !== "200")
        throw new Error(forecastResponse.data.message);

      // Filtrar y transformar los datos del pronóstico
      const dailyForecast = forecastResponse.data.list
        .filter((item: any) => item.dt_txt.includes("12:00:00"))
        .map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleDateString("es-ES", {
            weekday: "long",
          }),
          icon: item.weather[0].icon,
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          description: item.weather[0].description,
        }));

      setForecast(dailyForecast);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al obtener el clima");
    }
  }, [city]); // Usamos `useCallback` para que esta función no cambie a menos que cambie `city`

  // Usamos `useEffect` solo cuando `city` cambie
  useEffect(() => {
    if (city.trim()) {
      fetchWeather();
    }
  }, [city, fetchWeather]); // Solo se vuelve a ejecutar cuando `city` cambia

  return { weather, forecast, error, fetchWeather };
};

export default useWeatherQuery;
