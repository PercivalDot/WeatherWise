document.addEventListener('DOMContentLoaded', function() {
    const locationInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-btn');
    const locationBtn = document.getElementById('location-btn');
    const weatherInfo = document.getElementById('weather-info');

    searchBtn.addEventListener('click', searchWeather);
    locationBtn.addEventListener('click', getCurrentLocationWeather);
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

        // Generate and show recommendations
        generateRecommendations(data);
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

    async function getCurrentLocationWeather() {
        if (!navigator.geolocation) {
            showError('Geolocation is not supported by this browser.');
            return;
        }

        try {
            showLoading();
            const position = await getCurrentPosition();
            const weatherData = await getWeatherData(position.coords.latitude, position.coords.longitude);

            // Update location input with city name
            locationInput.value = `Current Location (${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)})`;

            displayWeather(weatherData);
        } catch (error) {
            console.error('Error getting current location:', error);
            showError('Unable to get your location. Please enter manually.');
        }
    }

    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            });
        });
    }

    function generateRecommendations(weatherData) {
        const recommendations = getWeatherRecommendations(weatherData);
        const recSection = document.getElementById('recommendations');
        const recCards = document.getElementById('rec-cards');

        recCards.innerHTML = '';

        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = `rec-card ${rec.type}`;
            card.innerHTML = `
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            `;
            recCards.appendChild(card);
        });

        recSection.style.display = 'block';
    }

    function getWeatherRecommendations(data) {
        const recommendations = [];
        const temp = data.temperature;
        const condition = data.condition.toLowerCase();

        // Clothing recommendations
        if (temp < 5) {
            recommendations.push({
                type: 'clothing',
                title: '🧥 Warm Clothing',
                description: 'It\'s quite cold! Wear a heavy coat, scarf, and gloves. Layer up to stay warm.'
            });
        } else if (temp < 15) {
            recommendations.push({
                type: 'clothing',
                title: '🧢 Light Jacket',
                description: 'Cool weather ahead. A light jacket or sweater would be perfect.'
            });
        } else if (temp > 25) {
            recommendations.push({
                type: 'clothing',
                title: '👕 Light Clothing',
                description: 'Hot weather! Wear light, breathable clothing and don\'t forget sunscreen.'
            });
        }

        // Activity recommendations
        if (condition.includes('rain') || condition.includes('storm')) {
            recommendations.push({
                type: 'activity',
                title: '🏠 Indoor Activities',
                description: 'Rainy weather is perfect for indoor activities. Try a museum visit or cozy up with a book.'
            });
        } else if (condition.includes('sunny') && temp > 15 && temp < 30) {
            recommendations.push({
                type: 'activity',
                title: '🚴 Outdoor Fun',
                description: 'Perfect weather for outdoor activities! Great time for cycling, hiking, or a picnic.'
            });
        } else if (condition.includes('snow')) {
            recommendations.push({
                type: 'activity',
                title: '⛄ Winter Sports',
                description: 'Snowy conditions! Perfect for skiing, snowboarding, or building snowmen.'
            });
        }

        // Health recommendations
        if (data.humidity > 70) {
            recommendations.push({
                type: 'health',
                title: '💧 Stay Hydrated',
                description: 'High humidity levels. Drink plenty of water and take breaks in air-conditioned spaces.'
            });
        } else if (data.humidity < 30) {
            recommendations.push({
                type: 'health',
                title: '🧴 Moisturize',
                description: 'Low humidity can dry out your skin. Use moisturizer and drink extra water.'
            });
        }

        if (temp > 30) {
            recommendations.push({
                type: 'health',
                title: '🌡️ Heat Safety',
                description: 'Very hot weather! Avoid prolonged sun exposure and stay in shaded or cool areas.'
            });
        }

        return recommendations;
    }

    function showError(message) {
        const conditionEl = document.querySelector('.condition');
        conditionEl.textContent = message;
        conditionEl.style.color = '#e74c3c';
    }
});