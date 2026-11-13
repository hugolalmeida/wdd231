const weatherStatus = document.querySelector("#weather-status");
const forecastStatus = document.querySelector("#forecast-status");
const dayFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: weatherConfig.timeZone, year: "numeric", month: "2-digit", day: "2-digit"
});
const forecastFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: weatherConfig.timeZone, weekday: "short", month: "short", day: "numeric"
});

async function fetchWeather(endpoint) {
    const url = new URL(`https://api.openweathermap.org/data/2.5/${endpoint}`);
    url.search = new URLSearchParams({
        lat: weatherConfig.latitude, lon: weatherConfig.longitude,
        appid: weatherConfig.apiKey, units: "metric", lang: "en"
    });
    const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error("Weather service unavailable");
    return response.json();
}

function renderCurrentWeather(data) {
    const conditions = data.weather?.[0];
    if (!Number.isFinite(data.main?.temp) || !conditions?.description) {
        throw new Error("Current weather is incomplete");
    }
    document.querySelector("#temperature").textContent = `${Math.round(data.main.temp)} °C`;
    document.querySelector("#weather-description").textContent = conditions.description;
    document.querySelector("#humidity").textContent = `${data.main.humidity}% humidity`;
    document.querySelector("#current-weather").hidden = false;
    weatherStatus.textContent = "";
}

function renderForecast(data) {
    // Use the city's calendar dates, not the visitor's time zone or UTC dates.
    const today = dayFormatter.format(new Date());
    const days = new Map();
    for (const item of data.list ?? []) {
        const date = new Date(item.dt * 1000);
        const key = dayFormatter.format(date);
        if (key <= today || !Number.isFinite(item.main?.temp)) continue;
        const hour = Number(new Intl.DateTimeFormat("en-GB", {
            timeZone: weatherConfig.timeZone, hour: "numeric", hourCycle: "h23"
        }).format(date));
        const previous = days.get(key);
        // Choose the available reading closest to local noon for each day.
        if (!previous || Math.abs(hour - 12) < previous.distance) {
            days.set(key, { date, temperature: item.main.temp, distance: Math.abs(hour - 12) });
        }
    }
    const nextDays = [...days.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(0, 3);
    if (nextDays.length < 3) throw new Error("Three-day forecast is incomplete");
    const rows = nextDays.map(([key, day]) => {
        const row = document.createElement("li");
        const date = document.createElement("time");
        date.dateTime = key;
        date.textContent = forecastFormatter.format(day.date);
        const temperature = document.createElement("strong");
        temperature.textContent = `${Math.round(day.temperature)} °C`;
        row.append(date, temperature);
        return row;
    });
    document.querySelector("#forecast").replaceChildren(...rows);
    document.querySelector("#forecast-note").hidden = false;
    forecastStatus.textContent = "";
}

async function loadWeather() {
    if (!weatherConfig.apiKey.trim()) {
        weatherStatus.textContent = "Live weather is not available yet. Please check back soon.";
        forecastStatus.textContent = "The three-day forecast is not available yet.";
        return;
    }
    await Promise.allSettled([
        fetchWeather("weather").then(renderCurrentWeather).catch(() => {
            weatherStatus.textContent = "Current weather could not be loaded. Please try again later.";
        }),
        fetchWeather("forecast").then(renderForecast).catch(() => {
            forecastStatus.textContent = "The forecast could not be loaded. Please try again later.";
        })
    ]);
}

loadWeather();
