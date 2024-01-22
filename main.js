import axios from "axios";

const time = document.querySelector(".time");
const date = document.querySelector(".date");
const titleName = document.querySelector(".title");

const addLinksButton = document.querySelector("#add-link");
const linkContainer = document.querySelector(".link-container");
const submitLinkButton = document.querySelector("#submit-link-button");
const cancelLinkButton = document.querySelector("#cancel-link-button");

const yourTitle = document.querySelector("#title-link");
const url = document.querySelector("#link-url");
const linkList = document.querySelector(".link-list");

const weatherList = document.querySelector(".weather");
const newsList = document.querySelector(".news-list");
const backgroundButton = document.querySelector("#background-button");
const textInNote = document.querySelector("#note");
const searchImageInput = document.querySelector("#search-image-text");

//Time och Date
let timeHtml = new Date()
  .toLocaleString("sv-SV")
  .slice(0, -3)
  .slice(10)
  .split(" ")
  .join(" ");
time.innerHTML = timeHtml;

const dateToday = new Date().toLocaleDateString("sv-SE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
date.innerHTML = dateToday;

setInterval(() => {
  let timeHtml = new Date()
    .toLocaleString("sv-SV")
    .slice(0, -3)
    .slice(10)
    .split(" ")
    .join(" ");
  time.innerHTML = timeHtml;
}, 1000);

//Title and save updated title
let title = "Dashboard";

const saveNewTitle = () => {
  localStorage.setItem("newTitleName", titleName.innerHTML);
  const newTitleName = localStorage.getItem("newTitleName");
  titleName.innerHTML = newTitleName;
};
titleName.addEventListener("blur", saveNewTitle);

const newTitleName = localStorage.getItem("newTitleName");
titleName.innerHTML = newTitleName;

if (!localStorage.getItem("newTitleName")) {
  titleName.innerHTML = title;
}

//DISPLAY SAVED LINKS
const myLinks = [];

// Remove link
const removeLink = (index) => {
  if (index >= 0 && index < myLinks.length) {
    myLinks.splice(index, 1);

    localStorage.setItem("linkData", JSON.stringify(myLinks));
    displaySavedLinks(myLinks);
  }
};
linkList.addEventListener("click", (event) => {
  if (event.target.id === "remove-link") {
    const index = event.target.getAttribute("data-index");
    removeLink(index);
  }
});

async function displaySavedLinks(myLinks) {
  const linkItemsList = await Promise.all(
    myLinks.map((linkData, index) => {
      return `
              <li class="li">
                <a href="${linkData.url}" class="link-image" title="Länk" target="_blank">
                <img id="favicon" src="${linkData.favicon}" alt="favicon">
                <div id="link-title">${linkData.title}</div></a>
                <button id="remove-link" data-index="${index}" title="Ta bort" <span class="material-symbols-outlined">do_not_disturb_on</span></button>
              </li>`;
    })
  );
  linkList.innerHTML = linkItemsList.join("");
}

//Cancel Link-form
const cancelNewLink = (e) => {
  linkContainer.style.display = "none";

  if (e) {
    yourTitle.value = "";
  }
  if (e) {
    url.value = "";
  }
};
cancelLinkButton.addEventListener("click", cancelNewLink);

//Open Link-form
const openAddLinkContainer = () => {
  linkContainer.style.display = "flex";
};
addLinksButton.addEventListener("click", openAddLinkContainer);

//ADD LINK AND SAVE IN LOCALSTORAGE
const createLinksToList = async (e) => {
  e.preventDefault();

  const urlValue = url.value;
  const faviconURL = `https://www.google.com/s2/favicons?domain=${url.value}&sz=32`;

  const id = myLinks.length;
  const linkData = {
    url: urlValue,
    favicon: faviconURL,
    title: yourTitle.value,
    id: id,
  };
  myLinks.push(linkData);

  localStorage.setItem("linkData", JSON.stringify(myLinks));
  displaySavedLinks(myLinks);

  linkContainer.style.display = "none";
  if (e) {
    yourTitle.value = "";
  }
  if (e) {
    url.value = "";
  }
};
submitLinkButton.addEventListener("click", createLinksToList);

let storedLinkData = localStorage.getItem("linkData");
if (storedLinkData) {
  const linkDataArray = JSON.parse(storedLinkData);
  myLinks.push(...linkDataArray);
  displaySavedLinks(myLinks);
}

//GET WEATHER
const weatherApi =
  "https://api.open-meteo.com/v1/forecast?current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max&timezone=GMT";

async function getWeather(latitude, longitude) {
  try {
    const apiUrl = `${weatherApi}&latitude=${latitude}&longitude=${longitude}`;
    const response = await axios.get(apiUrl);
    const weatherData = response.data;
    displayWeather(weatherData);
  } catch (error) {
    console.error(error);
  }
}

//Display weather
function chooseWeatherDescription(weatherCode) {
  let weatherDescription;
  let weatherIcon;

  for (let i = 0; i <= 99; i++) {
    if (weatherCode == 0) {
      weatherDescription = "Klart";
      weatherIcon = `<span class="material-symbols-outlined">sunny</span>`;
    } else if (weatherCode == 1 || weatherCode == 2 || weatherCode == 3) {
      weatherDescription = "Mestadels klart";
      weatherIcon = `<span class="material-symbols-outlined">partly_cloudy_day</span>`;
    } else if (weatherCode == 45 || weatherCode == 48) {
      weatherDescription = "Dimma";
      weatherIcon = `<span class="material-symbols-outlined">foggy</span>`;
    } else if (weatherCode == 51 || weatherCode == 53 || weatherCode == 55) {
      weatherDescription = "Duggregn";
      weatherIcon = `<span class="material-symbols-outlined">rainy_light</span>`;
    } else if (weatherCode == 56 || weatherCode == 57) {
      weatherDescription = "Lätt snöfall";
      weatherIcon = `<span class="material-symbols-outlined">cloudy_snowing</span>`;
    } else if (weatherCode == 61 || weatherCode == 63 || weatherCode == 65) {
      weatherDescription = "Regn";
      weatherIcon = `<span class="material-symbols-outlined">rainy</span>`;
    } else if (weatherCode == 66 || weatherCode == 67) {
      weatherDescription = "Freezing Rain: Light and heavy intensity";
      weatherIcon = `<span class="material-symbols-outlined">rainy_snow</span>`;
    } else if (
      weatherCode == 71 ||
      weatherCode == 73 ||
      weatherCode == 75 ||
      weatherCode == 77 ||
      weatherCode == 85 ||
      weatherCode == 86
    ) {
      weatherDescription = "Snö";
      weatherIcon = `<span class="material-symbols-outlined">snowing</span>`;
    } else if (weatherCode == 80 || weatherCode == 81 || weatherCode == 82) {
      weatherDescription = "Regnskurar";
      weatherIcon = `<span class="material-symbols-outlined">rainy</span>`;
    } else if (weatherCode == 95 || weatherCode == 96 || weatherCode == 99) {
      weatherDescription = "Åska";
      weatherIcon = `<span class="material-symbols-outlined">thunderstorm</span>`;
    }
    ("Unknown");
  }
  return [weatherDescription, weatherIcon];
}

const checkDay = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  let day;

  switch (dayOfWeek) {
    case 1:
      day = "Onsdag";
      break;
    case 2:
      day = "Torsdag";
      break;
    case 3:
      day = "Fredag";
      break;
    case 4:
      day = "Lördag";
      break;
    case 5:
      day = "Söndag";
      break;
    case 6:
      day = "Måndag";
      break;
    case 7:
      day = "Tisdag";
      break;
  }
  return day;
};

//Display current weather
function displayWeather(weatherData) {
  weatherList.innerHTML = "";
  let currentTemperature = weatherData.current.temperature_2m;
  let weatherCode = weatherData.current.weather_code;
  let a = chooseWeatherDescription(weatherCode);

  const currentWeatherWrapper = document.createElement("li");
  currentWeatherWrapper.classList.add("weather-wrapper");
  weatherList.appendChild(currentWeatherWrapper);

  const currentWeatherDay = document.createElement("div");
  currentWeatherDay.classList.add("weather-day");
  currentWeatherDay.innerHTML = "Idag";
  currentWeatherWrapper.appendChild(currentWeatherDay);

  const addWeather = document.createElement("div");
  addWeather.classList.add("weather-info");
  addWeather.innerHTML = `
        <div>${a[1]}</div>
        <div class="tempeture">${currentTemperature} °C</div>
        <div>${a[0]}</div>`;
  currentWeatherWrapper.appendChild(addWeather);

  //Tomorrow
  let tomorrowTemperature = weatherData.daily.temperature_2m_max[1];
  let tomorrowWeatherDescription = weatherData.daily.weather_code[1];
  let b = chooseWeatherDescription(tomorrowWeatherDescription);

  const tomorrowWeatherWrapper = document.createElement("li");
  tomorrowWeatherWrapper.classList.add("weather-wrapper");
  weatherList.appendChild(tomorrowWeatherWrapper);

  const tomorrowWeatherDay = document.createElement("div");
  tomorrowWeatherDay.classList.add("weather-day");
  tomorrowWeatherWrapper.appendChild(tomorrowWeatherDay);
  tomorrowWeatherDay.innerHTML = "Imorgon";

  const tomorrowWeather = document.createElement("div");
  tomorrowWeather.classList.add("weather-info");
  tomorrowWeather.innerHTML = `
        <div>${b[1]}</div>
        <div class="tempeture">${tomorrowTemperature} °C</div>
        <div>${b[0]}</div>`;
  tomorrowWeatherWrapper.appendChild(tomorrowWeather);

  //Third day
  let thirdDayTemperature = weatherData.daily.temperature_2m_max[2];
  let thirdDayWeatherDescription = weatherData.daily.weather_code[2];
  let c = chooseWeatherDescription(thirdDayWeatherDescription);

  const thirdWeatherWrapper = document.createElement("li");
  thirdWeatherWrapper.classList.add("weather-wrapper");
  weatherList.appendChild(thirdWeatherWrapper);

  let day = checkDay();

  const thirdWeatherDay = document.createElement("div");
  thirdWeatherDay.classList.add("weather-day");
  thirdWeatherWrapper.appendChild(thirdWeatherDay);
  thirdWeatherDay.innerHTML = day;

  const thirdDayWeather = document.createElement("div");
  thirdDayWeather.classList.add("weather-info");
  thirdDayWeather.innerHTML = `
        <div>${c[1]}</div>
        <div class="tempeture">${thirdDayTemperature} °C</div>
        <div>${c[0]}</div>`;
  thirdWeatherWrapper.appendChild(thirdDayWeather);
}

//Get your position
navigator.geolocation.watchPosition(
  (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeather(latitude, longitude);
  },
  (error) => {
    console.error(`Error getting location: ${error.message}`);
  }
);

//Get NEWS
const newsUrl =
  "https://newsapi.org/v2/top-headlines?country=se&apiKey=your_api_key_here";

async function getNews(newsUrl) {
  try {
    const response = await axios.get(newsUrl);
    const newsData = response.data;
    return newsData;
  } catch (error) {
    console.error(error);
  }
}

//Display news
const displayNews = (newsData) => {
  const newsOneLink = newsData.articles[0].url;
  const newsOne = newsData.articles[0].title;

  const newsTwoLink = newsData.articles[1].url;
  const newsTwo = newsData.articles[1].title;

  const newsThreeLink = newsData.articles[2].url;
  const newsThree = newsData.articles[2].title;

  newsList.innerHTML = `
        <a href="${newsOneLink}" class="news" title="Läs mer" target="_blank"><div class="news-content">"${newsOne}"</div></a>
        <a href="${newsTwoLink}" class="news" title="Läs mer" target="_blank"><div class="news-content">"${newsTwo}"</div></a>
        <a href="${newsThreeLink}" class="news" title="Läs mer" target="_blank"><div class="news-content">"${newsThree}"</div></a>`;
};
getNews(newsUrl).then(displayNews);

//SAVE TEXT IN NOTE
let noteText = "";

const updTextContent = () => {
  localStorage.setItem("noteText", textInNote.value);
};
textInNote.addEventListener("input", updTextContent);

const newNoteText = localStorage.getItem("noteText");
textInNote.value = newNoteText;

if (!localStorage.getItem("noteText")) {
  textInNote.value = noteText;
}

//Random background image
const imagesApi =
  "https://api.unsplash.com/photos/random/?client_id=your_api_key_here";

async function getImages(imagesApi) {
  try {
    const response = await axios.get(imagesApi);
    const imageUrl = response.data.urls.regular;
    displayImage(imageUrl);
  } catch (error) {
    console.error(error);
  }
}

function displayImage(imageUrl) {
  document.body.style.backgroundImage = `url(${imageUrl})`;
  localStorage.setItem("background", imageUrl);
}

//Display saved background image from localstorage
const savedBackground = localStorage.getItem("background");
if (savedBackground) {
  document.body.style.backgroundImage = `url(${savedBackground})`;
}

backgroundButton.addEventListener("click", () => {
  getImages(imagesApi);
});

//Search background image
const getSearchedImages = async (searchWord) => {
  const searchImagesApi = `https://api.unsplash.com/search/photos?query=${searchWord}&client_id=your_api_key_here`;
  try {
    const response = await axios.get(searchImagesApi);
    const imageDataUrl = response.data.results;
    displaySearchedImage(imageDataUrl);
  } catch (error) {
    console.error(error);
  }
};

const displaySearchedImage = (imageDataUrl) => {
  let image = imageDataUrl[0].urls.regular;
  localStorage.setItem("background", image);
  const searchedImage = localStorage.getItem("background");
  if (searchedImage) {
    document.body.style.backgroundImage = `url(${image})`;
  }
};

searchImageInput.addEventListener("blur", (e) => {
  let searchWord = searchImageInput.value;
  getSearchedImages(searchWord);

  if (e) {
    searchImageInput.value = "";
  }
});
