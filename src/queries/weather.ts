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

  const fetchWeather = useCallback(async () => {
    if (!city.trim()) return;
    setError(null);
    setForecast([]);

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

      const dailyForecast = forecastResponse.data.list
        .filter((item: ForecastItem) => item.dt_txt.includes("12:00:00"))
        .map((item: ForecastItem) => ({
          date: new Date(item.dt * 1000).toLocaleDateString("es-ES", {
            weekday: "long",
          }),
          icon: item.weather[0].icon,
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          description: item.weather[0].description,
        }));

      setForecast(dailyForecast);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<WeatherErrorResponse>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError("Error al obtener el clima");
      }
    }
  }, [city]);

  useEffect(() => {
    if (city.trim()) {
      fetchWeather();
    }
  }, [city, fetchWeather]);

  return { weather, forecast, error, fetchWeather };
};

export default useWeatherQuery;
