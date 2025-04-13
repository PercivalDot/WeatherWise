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

    async function searchWeather() {
        const location = locationInput.value.trim();
        if (!location) {
            alert('Please enter a location');
            return;
        }

        try {
            showLoading();
            const coordinates = await getCoordinates(location);
            const weatherData = await getWeatherData(coordinates.lat, coordinates.lon);
            displayWeather(weatherData);
        } catch (error) {
            console.error('Error fetching weather:', error);
            showError('Failed to fetch weather data. Please try again.');
        }
    }

    async function getCoordinates(locationName) {
        // For demo purposes, return mock coordinates
        // In real implementation, would use geocoding API
        return {
            lat: 40.7128,
            lon: -74.0060,
            name: locationName
        };
    }

    async function getWeatherData(lat, lon) {
        // Mock weather data for demo
        // In real implementation, would call OpenWeatherMap API
        const mockWeatherConditions = [
            'Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Thunderstorms', 'Snow'
        ];

        return {
            temperature: Math.floor(Math.random() * 35) + 5,
            condition: mockWeatherConditions[Math.floor(Math.random() * mockWeatherConditions.length)],
            humidity: Math.floor(Math.random() * 50) + 30,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            location: locationInput.value
        };
    }

    function displayWeather(data) {
        const temperatureEl = document.querySelector('.temperature');
        const conditionEl = document.querySelector('.condition');

        temperatureEl.textContent = `${data.temperature}°C`;
        conditionEl.textContent = data.condition;

        // Add more weather details
        addWeatherDetails(data);
    }

    function addWeatherDetails(data) {
        const existingDetails = document.querySelector('.additional-details');
        if (existingDetails) {
            existingDetails.remove();
        }

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'additional-details';
        detailsDiv.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Humidity:</span>
                <span class="detail-value">${data.humidity}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Wind Speed:</span>
                <span class="detail-value">${data.windSpeed} km/h</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${data.location}</span>
            </div>
        `;

        weatherInfo.appendChild(detailsDiv);
    }

    function showLoading() {
        const temperatureEl = document.querySelector('.temperature');
        const conditionEl = document.querySelector('.condition');

        temperatureEl.textContent = '--°C';
        conditionEl.textContent = 'Loading...';
    }

    function showError(message) {
        const conditionEl = document.querySelector('.condition');
        conditionEl.textContent = message;
        conditionEl.style.color = '#e74c3c';
    }
});