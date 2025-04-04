import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Ícono del sol
import SearchIcon from "@mui/icons-material/Search"; // Ícono de búsqueda

interface HeaderProps {
  location: {
    city: string;
    address: string;
    postalCode: string;
  } | null;
  onSearch: (city: string) => void;
}

const Header: React.FC<HeaderProps> = ({ location, onSearch }) => {
  const [inputCity, setInputCity] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Estado para mostrar el campo de búsqueda

  const handleSearch = () => {
    if (inputCity.trim()) {
      onSearch(inputCity);
      setInputCity(""); // Limpiar el input después de buscar
    }
  };

  const toggleSearchField = () => {
    setIsSearchVisible(!isSearchVisible); // Alternar la visibilidad del campo de búsqueda
  };

  return (
    <>
      <header className="w-full bg-gray-800 text-white p-4 flex items-center justify-center gap-4">
        <div className="flex flex-col w-full items-center">
          <div className="flex items-center gap-6 w-full justify-between px-4">
            <div className="flex items-center justify-center gap-2">
              <WbSunnyIcon fontSize="large" className="text-yellow-500" />
              <h1>WA</h1>
            </div>
            <div>
              {location && (
                <div className="text-sm text-gray-300 flex gap-2">
                  <p>📍 {location.city}</p>
                  <p>📮 {location.postalCode}</p>
                </div>
              )}
            </div>

            {!isSearchVisible && (
              <SearchIcon
                fontSize="large"
                className="text-white"
                onClick={toggleSearchField}
              />
            )}
          </div>

          {isSearchVisible && (
            <div className="w-full flex justify-center mt-2">
              <TextField
                variant="outlined"
                size="small"
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Buscar ciudad..."
                className="bg-white rounded w-full max-w-md"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
              >
                Buscar
              </Button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
