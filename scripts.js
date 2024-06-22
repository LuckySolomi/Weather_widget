const KEY = `afcf0addca5b492aae625f7636daafa1`;

const WEATHER_ICONS = {
  Sunny: "./img/sunny.svg",
  Clouds: "./img/cloudly.svg",
  Rain: "./img/rain.svg",
  Storm: "./img/storm.svg",
  Clear: "./img/clear.svg",
  Snow: "./img/strong-snow.svg",
  Windy: "./img/windy.svg",
};

let loadingBlock = document.querySelector(".loading");

city.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    const inputCity = event.target.value.trim();
    console.log(inputCity);
    try {
      loadingBlock.style.display = "block";

      const weatherData = await getWeather(inputCity);
      displayWeather(weatherData);
      displayForecast(weatherData);

      loadingBlock.style.display = "none";
    } catch (error) {
      console.error("Error in getWeather:", error.message);
      loadingBlock.style.display = "none";
    }
  }
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=uk&appid=${KEY}`;
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
  const weatherType = currentWeather.weather[0].main;
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
  const container = document.querySelector(".days-container");
  container.innerHTML = "";

  const dailyData = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });

    if (!dailyData[day]) {
      const weatherType = item.weather[0].main;
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
    container.appendChild(card);
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
  document.getElementById("city").value = "";
  weatherBlock.innerHTML = "";
  document.querySelector(".days-container").innerHTML = "";
}
