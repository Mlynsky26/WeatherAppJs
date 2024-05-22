const input = document.querySelector('input')
const button = document.querySelector('button')
const cityName = document.querySelector('.city-name')
const photo = document.querySelector('.photo')
const warning = document.querySelector('.warning')
const resultsWrapper = document.querySelector('.weather-results .content')
const template = document.getElementById('weather-result-template')

const API_LINK = 'https://api.openweathermap.org/data/2.5/forecast';
const API_KEY = 'd2b939bf8a7394a8748c347f423cc76d';

const getWeather = () => {
    const city = input.value
    const URL = getUrl(city ? {q: city} : {})
    warning.textContent = ''
    cityName.textContent = ''
    
    axios.get(URL).then(res => {
        resultsWrapper.innerHTML = ''
        cityName.textContent = res.data.city.name

        const data = res.data.list.filter((el, index) => index % 8 == 0)
        data.forEach((el, index) => {
            insertWeatherResult(el, index == 0)
        })
    }).catch(error => {
        warning.textContent = error.message
        photo.src = './img/unknown.png'
        resultsWrapper.innerHTML = ''
    })
}

function insertWeatherResult(data, first) {
    const result = template.cloneNode(true)
    resultsWrapper.appendChild(result)

    insertTextContent = (selector, value) =>  {
        const el = result.querySelector(selector)
        el.textContent = value
    }

    insertTextContent('.date', data.dt_txt)
    insertTextContent('.weather', data.weather[0].description)
    insertTextContent('.temperature', Math.floor((data.main.temp)) + '°C')
    insertTextContent('.humidity', data.main.humidity + ' %')

    const iconEl = result.querySelector('.icon')
    const icon = getIconUrl(data.weather[0].icon)
    iconEl.src = icon;
    
    if(first) {
        photo.src = icon
    }
}

function getIconUrl(icon) {
    return  `https://openweathermap.org/img/wn/${icon}@2x.png`
}

function getUrl(params = {}) {
    const defaultParams = {
        appid: API_KEY,
        units: 'metric',
        q: "Kraków",
        lang: "pl",
        ...params
    }

    return API_LINK + '?' + (new URLSearchParams(defaultParams)).toString();
}

getWeather()
button.addEventListener('click', getWeather);
