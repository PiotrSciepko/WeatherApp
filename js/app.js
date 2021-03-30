const showWeatherBox = (box, location) => {
    document.querySelector("body").classList.add("loading");
    return fetch(`http://api.weatherapi.com/v1/forecast.json?key=f8e7ba3672fd4af1b7d125524212803&q=${location}&days=3`)
        .then(el => el.json())
        .then(data => {
            if (!data.error) {
                const city = box.querySelector(".city__name");
                const temp = box.querySelector(".temperature__value");
                const pressure = box.querySelector(".pressure__value");
                const humidity = box.querySelector(".humidity__value");
                const wind = box.querySelector(".wind-speed__value");
                const weatherIcon = box.querySelector(".weather__icon img");
                const ulWeatherForecast = box.querySelector(".weather__forecast");
                const weekDay = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
                city.innerHTML = data.location.name;
                temp.innerHTML = data.current.temp_c;
                pressure.innerHTML = data.current.pressure_mb + " hPa";
                humidity.innerHTML = data.current.humidity + "%";
                wind.innerHTML = data.current.wind_kph + " km/h";
                weatherIcon.src = data.current.condition.icon;
                ulWeatherForecast.innerHTML = data.forecast.forecastday.map(e =>
                    `<li><span class="day">${weekDay[new Date(e.date).getDay()]}</span><img src="${e.hour[18].condition.icon}"/>`
                    + `<span class="temperature"><span class="temperature__value">${e.hour[18].temp_c}</span>&deg;C</span></li>`)
                    .join("");
            }
        })
        .then(() => document.querySelector("body").classList.remove("loading"))
}

const findCity = document.querySelector(".find-city");
findCity.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = findCity.search.value;
    const box = document.querySelector(".module__weather");
    let newBox = box.cloneNode(true);
    newBox.hidden = true;
    newBox.querySelector(".btn--close").style.display = "inherit";
    newBox.querySelector(".btn--close").addEventListener("click", () => newBox.remove());

    showWeatherBox(newBox, city)
        .then(() => {
            const cities = [...document.querySelectorAll(".city__name")].map(el => el.innerHTML);
            box.before(newBox);
            newBox = document.querySelector(".module__weather");
            if (!cities.includes(newBox.querySelector(".city__name").innerHTML)) {
                newBox.hidden = false;
                document.querySelector(".module__form").hidden = true;
                findCity.search.value = "";
                findCity.search.placeholder = "np. Krasnystaw";
            } else {
                newBox.remove();
            }
        })
})

document.querySelector("#add-city")
    .addEventListener("click", el => document.querySelector(".module__form").hidden = false);

document.querySelector(".module__form .btn--close")
    .addEventListener("click", el => document.querySelector(".module__form").hidden = true);

const initialBox = document.querySelector(".module__weather");
initialBox.hidden = true;
initialBox.querySelector(".btn--close").style.display = "none";

showWeatherBox(initialBox, "Warszawa").then(() => initialBox.hidden = false);


