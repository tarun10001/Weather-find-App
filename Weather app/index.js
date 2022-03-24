let locationP = document.getElementById('demo');
let locationB = document.getElementById('locationB');

async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        locationP.innerHTML = "This location is not supported";
    }

    function showPosition(position) {
        console.log(position);
        localStorage.setItem("loclatitude", position.coords.latitude);
        localStorage.setItem("loclongitude", position.coords.longitude);
    }

    try {

        let latitude = localStorage.getItem("loclatitude");
        console.log('latitude', latitude)
        let longitude = localStorage.getItem("loclongitude");
        console.log('longitude', longitude)


        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a77df68bcd9e098229cb3c8e6441dfbc`);

        let data_location = await response.json();

        console.log('data_location', data_location.name);
        let city = data_location.name;

        let respon = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a77df68bcd9e098229cb3c8e6441dfbc`);

        let data = await respon.json();
        console.log('data', data);
        appendData(data);

        let iframe = document.getElementById('gmap_canvas');

        iframe.src = `https://maps.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

        let res_forecast = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&appid=a77df68bcd9e098229cb3c8e6441dfbc`);
        let data_forecast = await res_forecast.json();
        console.log('data_forecast', data_forecast);
        appendForecast(data_forecast);
    } catch (error) {
        console.log('error', error)
    }
}




async function showData() {

    console.log(location);

    try {
        let city = document.getElementById('searchInp').value;

        // key -> a77df68bcd9e098229cb3c8e6441dfbc

        //https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=a77df68bcd9e098229cb3c8e6441dfbc

        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a77df68bcd9e098229cb3c8e6441dfbc`);

        let data = await res.json();
        console.log('data', data);
        appendData(data);


        let res_forecast = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&appid=a77df68bcd9e098229cb3c8e6441dfbc`);
        let data_forecast = await res_forecast.json();
        console.log('data_forecast', data_forecast);
        appendForecast(data_forecast);


        let iframe = document.getElementById('gmap_canvas');

        iframe.src = `https://maps.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    } catch (error) {
        console.log('error', error)
    }
}


function appendData(elem) {

    let mainDiv = document.getElementById('curWeather');
    mainDiv.innerHTML = null;

    let name = document.createElement('p');
    name.style.fontSize = "25px";
    name.style.color = "crimson";
    name.innerText = elem.name;

    elem.weather.forEach(function(elem) {
        let sky = elem.main;
        console.log(sky);

        let img = document.createElement('img');
        img.style.height = "40px";

        if (sky == "Clouds") {
            img.src = "icons/clear-sky.png";
        } else if (sky == "Clear") {
            img.src = "icons/sunny.png";
        } else if (sky == "Haze") {
            img.src = "icons/haze.png";
        } else {
            img.src = "icons/rain.png";
        }
        mainDiv.append(img);
})

    let feelsLike = document.createElement('p');
    feelsLike.setAttribute("id", "temp_p");

    feelsLike.innerText = `Real Feel : ${Math.round(elem.main.feels_like - 273.15)}°C`;

    let temp = document.createElement('p');
    temp.setAttribute("id", "temp_p");

    temp.innerText = `Temperature : ${Math.round(elem.main.temp - 273.15)}°C`;

    let tempMax = document.createElement('p');
    tempMax.setAttribute("id", "temp_p");

    tempMax.innerText = `Maximum Temperature : ${Math.round(elem.main.temp_max - 273.15)}°C`;

    let tempMin = document.createElement('p');
    tempMin.setAttribute("id", "temp_p");

    tempMin.innerText = `Minimum Temperature : ${Math.round(elem.main.temp_min - 273.15)}°C`;

    let humidity = document.createElement('p');
    humidity.setAttribute("id", "temp_p");

    humidity.innerText = `Humidity : ${elem.main.humidity}%`;

    mainDiv.append(name, feelsLike, temp, tempMax, tempMin, humidity);
}

function appendForecast(elem) {

    let mainDiv_forecast = document.getElementById('forecast');
    mainDiv_forecast.innerHTML = null;
    let i = 0;

    elem.daily.forEach(function(element) {
        console.log('element', element);

        let main_div = document.createElement('div');
        main_div.setAttribute("id", "main_div");

        let day = document.createElement('p');
        day.setAttribute("id", 'day');

        if (i == 0) {
            day.innerText = "Today";
        } else if (i == 1) {
            day.innerText = "Tomorrow";
        } else {
            day.innerText = `Day ${i + 1}`;
        }

        i++;

        main_div.append(day);

        element.weather.forEach(function(elem) {
            let sky = elem.main;
            console.log(sky);

            let img = document.createElement('img');
            img.style.height = "40px";

            if (sky == "Clouds") {
                img.src = "icons/clear-sky.png";
            } else if (sky == "Clear") {
                img.src = "icons/sunny.png";
            } else if (sky == "Haze") {
                img.src = "icons/haze.png";
            } else {
                img.src = "icons/rain.png";
            }
            main_div.append(img);

        })



        let tempMax = document.createElement('p');
        tempMax.setAttribute("id", "details");
        tempMax.innerText = `Maximum Temp: ${Math.round(element.temp.max - 273.15)}°C`;

        let tempMin = document.createElement('p');
        tempMin.setAttribute("id", "details");
        tempMin.innerText = `Minimum Temp: ${Math.round(element.temp.min - 273.15)}°C`;

        let humidity = document.createElement('p');
        humidity.setAttribute("id", "details");
        humidity.innerText = `Humidity: ${element.humidity}%`;

        let wind = document.createElement('p');
        wind.setAttribute("id", "details");
        wind.innerText = `Wind Speed: ${element.wind_speed}km/h`;

        main_div.append(tempMax, tempMin, humidity, wind);

        mainDiv_forecast.append(main_div);
    });
}