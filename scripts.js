const API_KEY = `afcf0addca5b492aae625f7636daafa1`;

const WEATHER_ICONS = {
  sunny: "./img/sunny.svg",
  clouds: "./img/cloudly.svg",
  rain: "./img/rain.svg",
  storm: "./img/storm.svg",
  clear: "./img/clear.svg",
  snow: "./img/strong-snow.svg",
  windy: "./img/windy.svg",
};

city.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    const inputCity = event.target.value.trim();
    try {
      weatherBlock.innerHTML = "";
      daysContainer.innerHTML = "";
      loading.classList.add("display-block");
      await new Promise((complete) => setTimeout(complete, 1000));

      const weatherData = await getWeather(inputCity);
      displayWeather(weatherData);
      displayForecast(weatherData);

      loading.classList.remove("display-block");
    } catch (error) {
      console.error("Error in getWeather:", error.message);
      loadingBlock.style.display = "none";
    }
  }
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=uk&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error("City in input not found");
  }
  return data;
}

function displayWeather(data) {
  const city = data.city.name;
  const country = data.city.country;
  const currentWeather = data.list[0];
  const temperature = Math.round(currentWeather.main.temp);
  const feelsLike = Math.round(currentWeather.main.feels_like);
  const weatherType = currentWeather.weather[0].main.toLowerCase();
  const icon = WEATHER_ICONS[weatherType] || "./img/sunny.svg";

  weatherBlock.innerHTML = `
  <p class="pointed-city">Selected: ${city}, ${country}</p>
        <div class="current-day">
          <div>
            <p class="current-temperature">${temperature}°C</p>
            <div class="additional-info">
              <p class="feel-tem">Feels like</p>
              <p class="max-temp">${feelsLike}°C</p>
            </div>
          </div>
          <div class="location-info">
            <p class="current-type-weather">${weatherType}</p>
            <p class="current-city">${city}, ${country}</p>
          </div>
          <div>
            <img src="${icon}" alt="${weatherType}" />
          </div>
        </div>
    
  `;
}

function displayForecast(data) {
  daysContainer.innerHTML = "";

  const dailyData = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });

    if (!dailyData[day]) {
      const weatherType = item.weather[0].main.toLowerCase();
      const icon = WEATHER_ICONS[weatherType] || "./img/sunny.svg";
      const dayTemp = `${Math.round(item.main.temp_max)} °C`;
      const nightTemp = `${Math.round(item.main.temp_min)} °C`;

      dailyData[day] = {
        day,
        weatherType,
        dayTemp,
        nightTemp,
        icon,
      };
    }
  });

  Object.values(dailyData).forEach((data) => {
    const card = createWeatherCard(data);
    daysContainer.appendChild(card);
  });
}

function createWeatherCard(data) {
  const card = document.createElement("div");
  card.classList.add("day-card");
  card.innerHTML = `<p class="day">${data.day}</p>
          <img src="${data.icon}" alt="${data.weatherType}" />
          <p class="card-weather-type">${data.weatherType}</p>
          <div class="max-min-block">
            <p class="size-of-day-night">Day</p>
            <p class="weight-of-temp">${data.dayTemp}</p>
            <p class="weight-of-temp">${data.nightTemp}</p>
            <p class="size-of-day-night">Night</p>
          </div>`;
  return card;
}

function clearInput() {
  city.value = "";
  weatherBlock.innerHTML = "";
  daysContainer.innerHTML = "";
}
