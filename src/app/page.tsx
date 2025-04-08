"use client";

import { useState, useEffect } from "react";
import useWeatherQuery from "../queries/weather";
import useLocationQuery from "../queries/location";
import Header from "../components/header/Header";
import ForecastSlider from "../components/forecast/ForecastSlider";
import Image from "next/image";

export default function Home() {
  const [city, setCity] = useState<string>("");
  const { weather, forecast, error, fetchWeather } = useWeatherQuery(city);
  const { location } = useLocationQuery();

  const handleSearch = (newCity: string) => {
    setCity(newCity);
    fetchWeather();
  };

  useEffect(() => {
    if (location?.city && !city) {
      setCity(location.city);
    }
  }, [location, city]);

  useEffect(() => {
    if (city) {
      fetchWeather();
    }
  }, [city, fetchWeather]);

  return (
    <div className="flex flex-col md:min-h-screen">
      <Header location={location} onSearch={handleSearch} />
      <div className="max-w-md w-full p-6 pt-24 flex flex-col items-center mx-auto">
        {error && <p className="text-center text-red-500">{error}</p>}

        {weather && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold">{weather.name}</h2>
            {weather.weather && weather.weather[0]?.icon && (
              <Image
                width={100}
                height={100}
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto"
                priority={true}
              />
            )}
            <p className="text-xl">{weather.weather?.[0]?.description}</p>
            <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
            <p className="text-sm mt-2">Humedad: {weather.main.humidity}%</p>
            <p className="text-sm">Viento: {weather.wind.speed} km/h</p>
          </div>
        )}
      </div>

      {forecast.length > 0 && <ForecastSlider forecast={forecast} />}
    </div>
  );
}
