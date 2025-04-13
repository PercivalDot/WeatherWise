const CONFIG = {
    // Using OpenWeatherMap API
    WEATHER_API_KEY: 'your-api-key-here',
    WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5',
    GEOCODING_API_URL: 'https://api.openweathermap.org/geo/1.0'
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}