"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import useCitySuggestions from "../../queries/geocoding";
import Link from "next/link";

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
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const suggestions = useCitySuggestions(inputCity);

  const handleSearch = () => {
    if (selectedCity.trim()) {
      onSearch(selectedCity);
      setInputCity("");
      setSelectedCity("");
    }
  };

  const handleCitySelect = (city: string) => {
    setInputCity(city);
    setSelectedCity(city);
    onSearch(city);
    setIsSearchVisible(false);
    setInputCity("");
  };

  const toggleSearchField = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <>
      <header className="w-full fixed bg-gray-800 text-white p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={reloadPage}
          >
            <WbSunnyIcon fontSize="large" className="text-yellow-500" />
            <h1 onClick={reloadPage}>Weather</h1>{" "}
          </Link>
          <div>
            {location && (
              <div className="text-xs md:text-sm text-gray-300 flex gap-2 justify-center items-center">
                <p>📍 {location.city}</p>
                <p>📮 {location.postalCode}</p>
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <SearchIcon
            fontSize="large"
            className="text-white cursor-pointer"
            onClick={toggleSearchField}
          />
        </div>
      </header>

      {isSearchVisible && (
        <div className="w-full mt-4 pt-20 flex flex-col items-center">
          <div className="flex gap-2 w-full max-w-md px-6">
            <TextField
              variant="outlined"
              size="small"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Buscar ciudad..."
              className="bg-white rounded w-full"
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Buscar
            </Button>
          </div>

          {suggestions.length > 0 && (
            <Paper className="mt-1 w-full max-w-md z-50">
              {suggestions.map((city, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleCitySelect(city.name)}
                >
                  {city.name}, {city.country} {city.state && `(${city.state})`}
                </MenuItem>
              ))}
            </Paper>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
