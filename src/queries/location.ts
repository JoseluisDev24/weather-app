"use client";

import { useState, useEffect } from "react";

interface Address {
  city?: string;
  town?: string;
  village?: string;
  road?: string;
  house_number?: string;
  neighbourhood?: string;
  postcode?: string;
}

interface NominatimResponse {
  address: Address;
}

interface LocationData {
  city: string;
  address: string;
  postalCode: string;
}

export default function useLocationQuery() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalización no soportada.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data: NominatimResponse = await res.json();

          const address = data.address;

          setLocation({
            city:
              address.city || address.town || address.village || "Desconocido",
            address: `${address.road || ""} ${address.house_number || ""}, ${
              address.neighbourhood || ""
            }`.trim(),
            postalCode: address.postcode || "N/A",
          });
        } catch (err) {
          console.error("Error fetching location data:", err);
          setError("No se pudo obtener la ubicación.");
        }
      },
      () => {
        setError("Permiso de ubicación denegado.");
      }
    );
  }, []);

  return { location, error };
}
