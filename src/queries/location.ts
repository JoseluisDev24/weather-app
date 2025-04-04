import { useState, useEffect } from "react";

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
      setError("La geolocalización no está soportada en este navegador.");
      return;
    }

    const fetchLocation = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos de ubicación.");
        }

        const data = await response.json();

        setLocation({
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Desconocido",
          address: [
            data.address.road,
            data.address.house_number,
            data.address.neighbourhood,
          ]
            .filter(Boolean) // Elimina valores `undefined` o vacíos
            .join(" "),
          postalCode: data.address.postcode || "N/A",
        });
      } catch (err) {
        setError("No se pudo obtener la ubicación.");
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocation(latitude, longitude);
      },
      () => {
        setError("Permiso de ubicación denegado.");
      }
    );
  }, []);

  return { location, error };
}
