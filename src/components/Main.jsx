import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('Jakarta');
  const [searchCity, setSearchCity] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const API_KEY = '90a8232c4a6e13f38a4aa85df26de462';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('City not found');
      }
      
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);
  
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      const forecastData = await forecastResponse.json();
      
      const dailyForecast = forecastData.list.filter((item, index) => 
        index % 8 === 0
      ).slice(0, 5);
      
      setForecast(dailyForecast);
      setCity(cityName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const getImageBackground = () => {
    if (!weather) return 'assets/clear.jpg';
    
    const isNight = currentTime.getHours() >= 18 || currentTime.getHours() <= 6;
    const weatherMain = weather.weather[0].main;
    
    if (isNight) {
      switch (weatherMain) {
        case 'Clear':
          return 'assets/night_clear.jpg';
        case 'Clouds':
          return 'assets/night_clouds.jpg';
        default:
          return 'assets/night_clear.jpg';
      }
    }
    
    switch (weatherMain) {
      case 'Clear':
        return 'assets/clear.jpg';
      case 'Clouds':
        return 'assets/clouds.jpg';
      case 'Rain':
        return 'assets/rain.jpg';
      case 'Thunderstorm':
        return 'assets/thunderstorm.jpg';
      case 'Snow':
        return 'assets/snow.jpg';
      case 'Mist':
      case 'Fog':
        return 'assets/mist.jpg';
      default:
        return 'assets/clear.jpg';
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case 'Clear':
        return 'bx-sun';
      case 'Clouds':
        return 'bx-cloud';
      case 'Rain':
        return 'bx-cloud-rain';
      case 'Thunderstorm':
        return 'bx-cloud-lightning';
      case 'Snow':
        return 'bx-cloud-snow';
      case 'Mist':
      case 'Fog':
        return 'bx-water';
      default:
        return 'bx-sun';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
      setSearchCity('');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="weather-app">
      <div className="overlay"></div>

      <div className="content">
        <div className="container">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="card glass-card" data-aos="fade-down">
                <div className="card-body">
                  <div className="d-flex gap-2">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0">
                        <i className="bx bx-search text-white"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-transparent border-0 text-white"
                        placeholder="Search city..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch(e);
                          }
                        }}
                      />
                    </div>
                    <button onClick={handleSearch} className="btn btn-primary">
                      <i className="bx bx-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="row justify-content-center mb-4">
              <div className="col-lg-8">
                <div className="alert alert-danger glass-card" data-aos="fade-in">
                  <i className="bx bx-error me-2"></i>
                  {error}
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="glass-card p-5" data-aos="fade-in">
                  <div className="spinner-border text-primary mb-3" role="status"></div>
                  <p className="text-white">Loading weather data...</p>
                </div>
              </div>
            </div>
          ) : weather ? (
            <>
              <div className="row justify-content-center mb-4">
                <div className="col-lg-8">
                  <div className="card glass-card main-weather" data-aos="fade-up">
                    <div className="card-body text-center p-5">
                      <div className="mb-3">
                        <h2 className="text-white mb-1">
                          <i className="bx bx-map me-2"></i>
                          {weather.name}, {weather.sys.country}
                        </h2>
                        <p className="text-white-50 mb-0">
                          {currentTime.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-white-50">
                          {currentTime.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <div className="weather-icon mb-3">
                        <i className={`bx ${getWeatherIcon(weather.weather[0].main)} weather-icon-large`}></i>
                      </div>
                      
                      <h1 className="display-1 text-white mb-3 temperature">
                        {Math.round(weather.main.temp)}°
                      </h1>
                      
                      <h4 className="text-white mb-3">
                        {weather.weather[0].description.charAt(0).toUpperCase() + 
                         weather.weather[0].description.slice(1)}
                      </h4>
                      
                      <p className="text-white-50">
                        Feels like {Math.round(weather.main.feels_like)}°
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center mb-4">
                <div className="col-lg-8">
                  <div className="row g-3">
                    <div className="col-6 col-md-3">
                      <div className="card glass-card h-100" data-aos="fade-up" data-aos-delay="100">
                        <div className="card-body text-center">
                          <i className="bx bx-droplet text-primary mb-2 fs-3"></i>
                          <p className="text-white-50 mb-1 small">Humidity</p>
                          <h5 className="text-white mb-0">{weather.main.humidity}%</h5>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-6 col-md-3">
                      <div className="card glass-card h-100" data-aos="fade-up" data-aos-delay="200">
                        <div className="card-body text-center">
                          <i className="bx bx-wind text-primary mb-2 fs-3"></i>
                          <p className="text-white-50 mb-1 small">Wind</p>
                          <h5 className="text-white mb-0">{Math.round(weather.wind.speed)} m/s</h5>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-6 col-md-3">
                      <div className="card glass-card h-100" data-aos="fade-up" data-aos-delay="300">
                        <div className="card-body text-center">
                          <i className="bx bx-tachometer text-primary mb-2 fs-3"></i>
                          <p className="text-white-50 mb-1 small">Pressure</p>
                          <h5 className="text-white mb-0">{weather.main.pressure} hPa</h5>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-6 col-md-3">
                      <div className="card glass-card h-100" data-aos="fade-up" data-aos-delay="400">
                        <div className="card-body text-center">
                          <i className="bx bx-show text-primary mb-2 fs-3"></i>
                          <p className="text-white-50 mb-1 small">Visibility</p>
                          <h5 className="text-white mb-0">{Math.round(weather.visibility / 1000)} km</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {forecast.length > 0 && (
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="card glass-card" data-aos="fade-up" data-aos-delay="500">
                      <div className="card-body">
                        <h5 className="text-white mb-4">
                          <i className="bx bx-calendar me-2"></i>
                          5-Day Forecast
                        </h5>
                        <div className="row g-2">
                          {forecast.map((day, index) => (
                            <div key={index} className="col">
                              <div className="forecast-item text-center p-3">
                                <p className="text-white-50 mb-2 small">
                                  {formatDate(day.dt)}
                                </p>
                                <i className={`bx ${getWeatherIcon(day.weather[0].main)} text-primary mb-2 fs-4`}></i>
                                <div className="mb-2">
                                  <div className="text-white fw-bold">
                                    {Math.round(day.main.temp_max)}°
                                  </div>
                                  <div className="text-white-50 small">
                                    {Math.round(day.main.temp_min)}°
                                  </div>
                                </div>
                                <p className="text-white-50 small mb-0">
                                  {day.weather[0].main}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        .weather-app {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background-image: url('${getImageBackground()}');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          background-repeat: no-repeat;
          transition: background-image 0.5s ease-in-out;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: -1;
        }

        .content {
          position: relative;
          z-index: 1;
          padding: 2rem 0;
          min-height: 100vh;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .main-weather {
          background: rgba(255, 255, 255, 0.15);
        }

        .weather-icon-large {
          font-size: 5rem;
          color: #fff;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        .temperature {
          font-weight: 300;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .form-control {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }

        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .form-control:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
          color: white !important;
        }

        .input-group-text {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        .forecast-item {
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .forecast-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 15px;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .weather-icon-large {
            font-size: 3rem;
          }
          
          .temperature {
            font-size: 4rem;
          }
        }

        .spinner-border {
          width: 3rem;
          height: 3rem;
        }

        .alert {
          border: none;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        [data-aos] {
          animation: fadeInUp 0.8s ease forwards;
        }
      `}</style>

    </div>
  );
};

export default WeatherApp;