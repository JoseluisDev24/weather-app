"use client";

import { useState, useCallback, useEffect } from "react";
import { AxiosError } from "axios";
import weatherClient from "../services/httpClient";

interface WeatherData {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
}

interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface ForecastResponse {
  list: ForecastItem[];
  cod: string;
  message?: string;
}

interface ForecastData {
  date: string;
  icon: string;
  tempMin: number;
  tempMax: number;
  description: string;
}

interface WeatherErrorResponse {
  message: string;
}

const useWeatherQuery = (city: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWeather = useCallback(async () => {
    if (!city.trim()) return;
    setError(null);
    setForecast([]);
    setLoading(true);

    try {
      const weatherResponse = await weatherClient.get("weather", {
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

      const forecastResponse = await weatherClient.get<ForecastResponse>(
        "forecast",
        {
          params: {
            q: city,
            appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
            units: "metric",
            lang: "es",
          },
        }
      );

      if (forecastResponse.data.cod !== "200")
        throw new Error(forecastResponse.data.message);

      // Agrupar por día
      const groupedByDay: { [date: string]: ForecastItem[] } = {};

      forecastResponse.data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0]; // yyyy-mm-dd
        if (!groupedByDay[date]) {
          groupedByDay[date] = [];
        }
        groupedByDay[date].push(item);
      });

      // Procesar cada día
      const dailyForecast = Object.keys(groupedByDay)
        .slice(1, 6) // siguientes 5 días, salteando hoy
        .map((dateStr) => {
          const items = groupedByDay[dateStr];
          const tempsMin = items.map((i) => i.main.temp_min);
          const tempsMax = items.map((i) => i.main.temp_max);

          const midDayItem =
            items.find((i) => i.dt_txt.includes("12:00:00")) || items[0];

          const dateObj = new Date(midDayItem.dt * 1000);

          return {
            date: dateObj.toLocaleDateString("es-ES", {
              weekday: "long",
            }),
            icon: midDayItem.weather[0].icon,
            tempMin: Math.round(Math.min(...tempsMin)),
            tempMax: Math.round(Math.max(...tempsMax)),
            description: midDayItem.weather[0].description,
          };
        });

      setForecast(dailyForecast);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<WeatherErrorResponse>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError("Error al obtener el clima");
      }
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    if (city.trim()) {
      fetchWeather();
    }
  }, [city, fetchWeather]);

  return { weather, forecast, error, loading, fetchWeather };
};

export default useWeatherQuery;
