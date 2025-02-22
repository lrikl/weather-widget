'use strict';

const apiKey = "fb739f60510f087a4d8a414456cb1ea7";

const citiesSelect = document.getElementById("cities");
let currentCity = getCityFromStorage();
citiesSelect.value = currentCity;

const weatherWidget = document.getElementById("weatherWidget");
const currentTime = document.querySelector(".current-time");
const currentDay = document.querySelector(".current-day");
const weatherIcon = document.getElementById("weather-icon");
const temperatureElement = document.getElementById("weather-temperature");
const temperatureFeels = document.getElementById("feels-temperature");
const descriptionElement = document.getElementById("weather-description");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const pressureElement = document.getElementById("pressure");

const updateButton = document.getElementById("updateButton");
const lastUpdate = document.getElementById("last-update");
lastUpdate.style.display = "none";
let errorElement = null;

function toggleLoading(isLoading) {
  const loader = document.querySelector(".main-weather");

  if (isLoading) {
    loader.classList.add("loader");
  } else {
    loader.classList.remove("loader");
  }
}

async function updateWeather() {
  try {
    toggleLoading(true);

    if (errorElement) {
      errorElement.remove();
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}&units=metric&lang=ua`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`);
    }

    const data = await response.json();

    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather-img">`;
    
    temperatureElement.textContent = `${parseInt(data.main.temp)} °C`;
    temperatureFeels.textContent = `відчувається: ${parseInt(data.main.feels_like)} °C`;
    descriptionElement.textContent = `${data.weather[0].description}`;

    humidityElement.innerHTML = `
      <div class="weather-type">Вологість:</div>
      <div class="weather-data">${data.main.humidity} %</div>
    `;
    windElement.innerHTML = `
      <div class="weather-type">Вітер:</div>
      <div class="weather-data">${data.wind.speed} м/с</div>
    `;
    pressureElement.innerHTML = `
      <div class="weather-type">Тиск:</div>
      <div class="weather-data">${data.main.pressure} гПа</div>
    `;

    toggleLoading(false);
    
  } catch(error) {
        errorElement = document.createElement("div");
        errorElement.classList.add("error");
        errorElement.textContent = "Помилка при оновленні даних!";
        weatherWidget.appendChild(errorElement);
        document.querySelectorAll("[data-update]").forEach(el => el.textContent = "");
        console.error(error);
  }
}

updateWeather();

citiesSelect.addEventListener("change", () => {
  currentCity = citiesSelect.value;
  saveCityInStorage(currentCity);
  updateWeather();
});

function getCurrentTime() {
  const now = new Date();
  const [hours, minute, sec] = now.toLocaleTimeString('uk-UA', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(':');
  return { hours, minute, sec };
}

function updateCurrentTime() {
  const { hours, minute, sec } = getCurrentTime();
  currentTime.textContent = `${hours}:${minute}:${sec}`;
}

updateCurrentTime();
setInterval(updateCurrentTime, 1000); 

updateButton.addEventListener("click", () => {
  updateWeather();
  const { hours, minute } = getCurrentTime();
  lastUpdate.style.display = "";
  lastUpdate.textContent = `останнє оновлення: ${hours}:${minute}`;

  setTimeout(() => {
    lastUpdate.style.display = "none";
  }, 2000);
});

function getCurrentDay() {
  const now = new Date();
  const options = {
    weekday: 'short',
    month: 'long',
    day: 'numeric'
  };
  const formattedDate = now.toLocaleDateString('uk-UA', options);
  return formattedDate;
}

currentDay.textContent = getCurrentDay();

function getCityFromStorage() {
  return JSON.parse(localStorage.getItem('myCityWeather')) || "Odesa";
}

function saveCityInStorage(city) {
  localStorage.setItem('myCityWeather', JSON.stringify(city));
}
