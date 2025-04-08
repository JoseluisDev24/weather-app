import axios from "axios";

const geoClient = axios.create({
  baseURL: "https://api.openweathermap.org/geo/1.0/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default geoClient;
