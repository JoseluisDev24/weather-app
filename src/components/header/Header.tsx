"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Ícono del sol
import SearchIcon from "@mui/icons-material/Search"; // Ícono de búsqueda
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import useCitySuggestions from "../../queries/geocoding"; // Importamos la query

interface HeaderProps {
  location: {
    city: string;
    address: string;
    postalCode: string;
  } | null;
  onSearch: (city: string) => void;
}

const Header: React.FC<HeaderProps> = ({ location, onSearch }) => {
  const [inputCity, setInputCity] = useState(""); // Estado para el input del usuario
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Estado para mostrar el campo de búsqueda
  const [selectedCity, setSelectedCity] = useState(""); // Estado para almacenar la ciudad seleccionada
  const suggestions = useCitySuggestions(inputCity); // Obtenemos las sugerencias usando la query

  const handleSearch = () => {
    if (selectedCity.trim()) {
      onSearch(selectedCity); // Realizamos la búsqueda con la ciudad seleccionada
      setInputCity(""); // Limpiamos el input después de buscar
      setSelectedCity(""); // Limpiamos el estado de la ciudad seleccionada
    }
  };

  const handleCitySelect = (city: string) => {
    setInputCity(city); // Actualizamos el input con la ciudad seleccionada
    setSelectedCity(city); // Actualizamos el estado de la ciudad seleccionada
    onSearch(city); // Ejecutamos la búsqueda automáticamente cuando se hace clic en la sugerencia
    setIsSearchVisible(false); // Ocultamos las sugerencias después de seleccionar una
  };

  const toggleSearchField = () => {
    setIsSearchVisible(!isSearchVisible); // Alternar la visibilidad del campo de búsqueda
  };

  return (
    <>
      <header className="w-full bg-gray-800 text-white p-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-6 w-full justify-between px-4">
            <div className="flex items-center gap-6">
<div className="flex items-center justify-center gap-2">
              <WbSunnyIcon fontSize="large" className="text-yellow-500" />
              <h1>Weather</h1>
            </div>
            <div>
              {location && (
                <div className="text-sm text-gray-300 flex gap-2">
                  <p>📍 {location.city}</p>
                  <p>📮 {location.postalCode}</p>
                </div>
              )}
            </div>
            </div>
            {!isSearchVisible && (
              <SearchIcon
                fontSize="large"
                className="text-white cursor-pointer"
                onClick={toggleSearchField}
              />
            )}
          </div>

          {isSearchVisible && (
            <div className="w-full flex flex-col items-center mt-2 relative">
              <div className="flex gap-2 w-full max-w-md">
                <TextField
                  variant="outlined"
                  size="small"
                  value={inputCity}
                  onChange={(e) => setInputCity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Buscar ciudad..."
                  className="bg-white rounded w-full"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                >
                  Buscar
                </Button>
              </div>

              {suggestions.length > 0 && (
                <Paper className="absolute top-full mt-1 w-full max-w-md z-50">
                  {suggestions.map((city, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => handleCitySelect(city.name)} // Llamamos a handleCitySelect al seleccionar
                    >
                      {city.name}, {city.country}{" "}
                      {city.state && `(${city.state})`}
                    </MenuItem>
                  ))}
                </Paper>
              )}
            </div>
          )}
      </header>
    </>
  );
};

export default Header;
