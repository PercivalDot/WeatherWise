document.addEventListener('DOMContentLoaded', function() {
    const locationInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherInfo = document.getElementById('weather-info');

    searchBtn.addEventListener('click', searchWeather);
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });

    function searchWeather() {
        const location = locationInput.value.trim();
        if (!location) {
            alert('Please enter a location');
            return;
        }

        // TODO: Implement actual weather API call
        // For now, show placeholder data
        displayWeather({
            location: location,
            temperature: Math.floor(Math.random() * 30) + 5,
            condition: 'Partly Cloudy'
        });
    }

    function displayWeather(data) {
        const temperatureEl = document.querySelector('.temperature');
        const conditionEl = document.querySelector('.condition');

        temperatureEl.textContent = `${data.temperature}°C`;
        conditionEl.textContent = data.condition;
    }
});