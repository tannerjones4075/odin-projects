document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submit').addEventListener('click', handleSubmit);
});

// Fetch data from weather API
const WEATHER_API = 'YOUR_API_KEY_HERE';

// Fetch weather data based on zipcode
async function fetchWeatherData(zipcode) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zipcode}/?key=${WEATHER_API}`, { mode: 'cors' });
        
        if (!response.ok) {
            throw new Error(`HTTP response failure ${response.status}`);
        }
        
        return await response.json();
    } catch (err) {
        onError(err);
    }
}

// Fetch location data based on latitude and longitude
async function getLocationData(longitude, latitude) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        
        if (!response.ok) {
            throw new Error(`HTTP response failure ${response.status}`);
        }
        
        const locationData = await response.json();
        // console.log(locationData)
        return {
            postcode: locationData.address.postcode || "Not found",
            county: locationData.address.county || "Not found",
            state: locationData.address.state || "Not found"
        }; // Return structured location data
    } catch (err) {
        onError(err);
    }
}

// Handle errors
function onError(err) {
    console.error(`Error: ${err.message}`);
}

// Select specific fields from the data
function selectFields(data) {
    if (!data) return {};

    const { latitude, longitude } = data;
    const currentConditions = data.currentConditions || {};

    return {
        longitude,
        latitude,
        currentConditions: {
            temp: currentConditions.temp,
            humidity: currentConditions.humidity,
            feelslike: currentConditions.feelslike,
            windspeed: currentConditions.windspeed,
            cloudcover: currentConditions.cloudcover,
            uvindex: currentConditions.uvindex,
            dew: currentConditions.dew,
            conditions: currentConditions.conditions,
        },
    };
}

// Process JSON data and return selected fields
async function ProcessJSONData(zipcode) {
    try {
        const allData = await fetchWeatherData(zipcode);
        if (!allData) {
            alert('Zipcode not processed correctly: No data returned');
            return null;
        }
        return selectFields(allData);
    } catch (err) {
        onError(err);
        return null;
    }
}

// Display weather and location data in the DOM
async function displayData(weatherData, locationData) {
    const locationDiv = document.createElement('div');
    const weatherDiv = document.createElement('div');

    const { county, state, postcode } = locationData; // Destructure postcode here
    const locationInfo = `
        <h2>Location Data</h2>
        <p>County: ${county}</p>
        <p>Postcode: ${postcode}</p>
        <p>State: ${state}</p>
    `;

    locationDiv.innerHTML = locationInfo;
    document.body.appendChild(locationDiv);

    const { currentConditions, longitude, latitude } = weatherData;
    const weatherInfo = `
        <h2>Weather Data</h2>
        <p>Location: Latitude ${latitude}, Longitude ${longitude}</p>
        <p>Temperature: ${currentConditions.temp}°</p>
        <p>Humidity: ${currentConditions.humidity}%</p>
        <p>Feels Like: ${currentConditions.feelslike}°</p>
        <p>Windspeed: ${currentConditions.windspeed} mph</p>
        <p>Cloud Cover: ${currentConditions.cloudcover}%</p>
        <p>UV Index: ${currentConditions.uvindex}</p>
        <p>Dew Point: ${currentConditions.dew}°</p>
        <p>Conditions: ${currentConditions.conditions}</p>
    `;

    weatherDiv.innerHTML = weatherInfo;
    document.body.appendChild(weatherDiv);
}

// Function to clear previous results
function clearPreviousResults() {
    // Remove all divs displaying weather and location data
    const resultDivs = document.querySelectorAll('div');
    resultDivs.forEach(div => div.remove());
}

// Handle form submission
async function handleSubmit() {
    try {
        clearPreviousResults();

        const zipcode = document.getElementById('zipcode').value.trim();

        // Validate the zipcode input
        if (!zipcode) {
            alert('Please enter a zipcode.');
            return;
        }

        const zipcodePattern = /^\d{5}(-\d{4})?$/;
        if (!zipcodePattern.test(zipcode)) {
            alert('Please enter a valid zipcode');
            return;
        }

        // Process the zipcode and retrieve filtered data
        const filteredData = await ProcessJSONData(zipcode);
        if (!filteredData) {
            alert('No data found for the entered zipcode.');
            return;
        }

        // console.log('Filtered weather data:', filteredData);
        
        const { longitude, latitude } = filteredData; // Destructure coordinates
        const locationData = await getLocationData(longitude, latitude);
        // console.log('Location data:', locationData);

        await displayData(filteredData, locationData); // Pass both weather and location data to display
    } catch (err) {
        onError(err);
    }
}
