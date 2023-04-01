const currentweather = document.querySelector("[data-currentweather]");
const searchweather = document.querySelector("[data-searchweather]");
const locationbtn = document.querySelector("[data-locationbtn]");
const searchbtn = document.querySelector("[data-searchbtn]");
const inputsearch = document.querySelector("[data-inputsearch]");
const city = document.querySelector("[data-city]");
const flag = document.querySelector("[data-flag]");
const weather = document.querySelector("[data-weather]");
const weatherimg = document.querySelector("[data-weatherimg]");
const temperature = document.querySelector("[data-temperature]");
const windspeed = document.querySelector("[data-windspeed]");
const humidity = document.querySelector("[data-humidity]");
const cloud = document.querySelector("[data-cloud]");
const tabs = document.querySelectorAll(".tabs");

const weathercontainer = document.querySelector(".weather-container");
const locationcontainer = document.querySelector(".location-container");
const weatherdata = document.querySelector(".current-weather");
const loadingcontainer = document.querySelector(".loading-container");
const searchcontainer = document.querySelector(".search-container");

const API_KEY = "5245f98ede07658f3ce26b948ce13b88";

let currenttab = currentweather;

currenttab.classList.add("current-tab");

getfromsessionstorage();

function toCelcius(temp) {
  return temp - 273.15;
}

function switchtab(clickedtab) {
  if (clickedtab != currenttab) {
    currenttab.classList.remove("current-tab");
    currenttab = clickedtab;
    currenttab.classList.add("current-tab");

    if (!searchcontainer.classList.contains("active")) {
      weatherdata.classList.remove("active");
      locationcontainer.classList.remove("active");
      searchcontainer.classList.add("active");
    } else {
      searchcontainer.classList.remove("active");
      weatherdata.classList.remove("active");
      getfromsessionstorage();
    }
  }
}
currentweather.addEventListener("click", () => {
  switchtab(currentweather);
});

searchweather.addEventListener("click", () => {
  switchtab(searchweather);
});

//function to check if the coordiantesa are present on session storage

function getfromsessionstorage() {
  const localcoordinates = sessionStorage.getItem("user-coordinates");
  if (!localcoordinates) {
    locationcontainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localcoordinates);
    fetchuserweatherinfo(coordinates);
   
  }
}

async function fetchuserweatherinfo(coordinates) {
  const { lat, lon } = coordinates;
  //first make location caontainer invisible
  locationcontainer.classList.remove("active");
  loadingcontainer.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data = await response.json();
    loadingcontainer.classList.remove("active");
    weatherdata.classList.add("active");

    // console.log(data);

    renderweather(data);
  } catch (err) {
    loadingcontainer.classList.remove("active");
  }
}

function renderweather(data) {
  city.innerText = data?.name;
  flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  weather.innerText = data?.weather?.[0]?.description;
  weatherimg.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${toCelcius(data?.main?.temp).toFixed(2)} °C`;
  windspeed.innerText = `${data?.wind?.speed} m/s`;
  humidity.innerText = `${data?.main?.humidity}%`;
  cloud.innerHTML = `${data?.clouds?.all}%`;
}

function showposition(position) {
  const usercoordinate = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinate));
  fetchuserweatherinfo(usercoordinate);
}

function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showposition);
  } else {
    alert("Browser does not support location");
  }
}

locationbtn.addEventListener("click", getlocation);

searchcontainer.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityname = inputsearch.value;
  if (cityname === "") {
    return;
  } else {
    fetchsearchweatherinfo(cityname);
  }
});

async function fetchsearchweatherinfo(city) {
  loadingcontainer.classList.add("active");
  weatherdata.classList.remove("active");
  locationcontainer.classList.remove("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    const data = await response.json();

    loadingcontainer.classList.remove("active");
    weatherdata.classList.add('active')
    renderweather(data);
  } catch (err) {
    alert("no city found");
  }
}
