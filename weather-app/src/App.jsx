// App.jsx
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [place, setPlace] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchWeather = async () => {
    setWeather(null);
    setError('');

    if (!place.trim()) {
      setError('Please enter a place name.');
      return;
    }

    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(place)}&limit=1&appid=${apiKey}`
      );
      const geoData = await geoRes.json();

      if (!geoData.length) throw new Error('Location not found');

      const { lat, lon, name, country } = geoData[0];

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await weatherRes.json();

      setWeather({
        name,
        country,
        icon: data.weather[0].icon,
        description: data.weather[0].description,
        temp: data.main.temp,
        humidity: data.main.humidity,
        lat: data.coord.lat,
        lon: data.coord.lon,
      });
    } catch (err) {
      setError('❌ Could not fetch weather for that place.');
    }
  };

  return (
    <div className="app">
      <div className="weather-container">
        <h2>🌍 Smart Weather App</h2>
        <input
          type="text"
          placeholder="Enter place name (city, town, village)..."
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />
        <button onClick={fetchWeather}>Get Weather</button>
        {error && <div className="error">{error}</div>}

        {weather && (
          <div className="weather-info fade">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="Weather Icon"
            />
            <h3>📍 {weather.name}, {weather.country}</h3>
            <p>🌡️ Temperature: {weather.temp}°C</p>
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>☁️ {weather.description}</p>
            <p>🧭 Coordinates: ({weather.lat.toFixed(2)}, {weather.lon.toFixed(2)})</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
