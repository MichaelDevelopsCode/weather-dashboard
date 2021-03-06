var apiKey = "appId=bc9f6ddfab3a7a8e6e4b64e7c936aeb9";
var searchEl = document.getElementById("citySearch");
var historyEl = document.getElementById("history"); 
var cityHeadingEl = document.getElementById("city-heading");
var tempEl = document.getElementById("temp");
var humidityEl = document.getElementById("humidity");
var windEl = document.getElementById("wind");
var uvEl = document.getElementById("uv");
var currentCondEl = document.getElementById("current-conditions");
var forecastHeaderEl = document.getElementById("forecast-header");

var savedCities = [];

// load history from local storage
var loadHistory = function() {
    // clear before loading
    historyEl.innerHTML = "";

    // set only if theres something in local storage
    var localStorageCities = localStorage.getItem("city");
    savedCities = localStorageCities ? JSON.parse(localStorageCities) : [];

    // add all cities to list element
    savedCities.forEach(element => {
        // create list elements and add text
        var cityItem = document.createElement("li");
        cityItem.className = "list-group-item";
        cityItem.textContent = element;

        // append to ul element
        historyEl.appendChild(cityItem);
    });
};

// save to local storage and populate list right away
var saveHistory = function(cityName) {
    savedCities.push(cityName);
    localStorage.setItem("city", JSON.stringify(savedCities));
    loadHistory();
}

var citySearch = function(cityName) {
    // fetch api
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&units=imperial" +"&"+apiKey)
        .then(function(response) {
            // if request successful
            if(response.ok) {

                // city was accepted so update array if NOT already in there and save to local storage
                if(!savedCities.includes(cityName)) {
                    saveHistory(cityName);
                }

                response.json().then(function(data) {
                    // grab lon & lat
                    var longitude = data.coord.lon;
                    var latitude = data.coord.lat;

                    // fetch UV data for city based on lon/lat
                    fetchUV(latitude, longitude);

                    // fetch future weather conditions
                    fetchFutureConditions(cityName);

                    // create current weather conditions
                    createCurrentConditions(data);
                });

            } else {
                alert("something went wrong"); // request not sucessful
            }

        });
}

var citySearchSubmit = function(event) {
    // prevent page from reloading
    event.preventDefault();

    // get searched city
    var cityName = searchEl.value;

    // avoid entering empty spaces
    if (cityName.trim()==null || cityName.trim()==""|| cityName===" ") {
        alert("Enter a city");
        return false;
    } else {
        citySearch(cityName);
    }

}

var fetchUV = function(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&"+apiKey)
        .then(function(response) {
            // if request successful
            if(response.ok) {
                response.json().then(function(data) {
                    var uvIndex = data.value; // grab uv index
                    uvEl.innerHTML = "UV Index: &nbsp; <span>" + uvIndex + "</span>"; // update content
                    // if  favorable, moderate, or severe show corresponding color/class
                    if(uvIndex < 3) { // favorable
                        uvEl.firstElementChild.style.backgroundColor = "green";
                    } else if(uvIndex > 3) { // moderate
                        uvEl.firstElementChild.style.backgroundColor = "orange";
                    } else { // severe
                        uvEl.firstElementChild.style.backgroundColor = "red";
                    }
                });
            } else {
                alert("something went wrong"); // not successful request
            }
        });
};

var fetchFutureConditions = function(city) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial"+"&"+apiKey)
        .then(function(response) {
            // if request successful
            if(response.ok) {
                response.json().then(function(data){
                    createFutureConditions(data); // create future weather conditions
                });
            } else {
                alert("something went wrong");
            }

        });
}

var createCurrentConditions = function(data) {
    // grab data and assign
    var cityName = data.name;
    var cityTemp = data.main.temp; // kelvin to fahrenheit
    var cityHumidity = data.main.humidity;
    var windSpeed = data.wind.speed; // convert from meters per sec to mph
    var icon = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
    
    // grab current date
    var seconds = data.dt; // grab date timestamp (it's in secs)
    var time = new Date(seconds * 1000); // convert to miliseconds for new date function
    var date = time.toLocaleDateString("en-US");

    // update content
    cityHeadingEl.innerHTML = cityName + " (" + date + ") &nbsp;" + "<img src='"+icon+"'></img>"; 
    tempEl.textContent = "Temperature: " + cityTemp + " °F";
    humidityEl.textContent = "Humidity: " + cityHumidity + "%";
    windEl.textContent = "Wind Speed: " + windSpeed + " MPH";
    currentCondEl.classList = "card p-4 col-12"; // show card style now that div has content
}

var createFutureConditions = function(data) {
    // populate header
    forecastHeaderEl.innerHTML = "5-Day Forecast:";

    // grab every 8th list item to seperate days (each list item is 3hrs apart)
    var everyNth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
    var days = everyNth(data.list, 8); // store days in var

    // create li elements
    days.forEach(function(element, i) {

        var futureListEl = document.getElementById("future-"+i); // grab corresponding element
        var icon = "https://openweathermap.org/img/wn/" + element.weather[0].icon + ".png"; // grab icon
        
        // grab current date
        var futureSeconds = element.dt_txt; // grab date timestamp (it's in secs)
        var futureTime = new Date(futureSeconds); // convert to miliseconds for new date function
        var futureDate = futureTime.toLocaleDateString("en-US");

        // style weather cards bg
        futureListEl.style.backgroundColor = "cornflowerblue";

        futureListEl.innerHTML =
            "<h5>" + futureDate + "</h5>" +
            "<img src="+icon+" />" +
            "<p>Temp: " + element.main.temp + " °F</p>" +
            "<p>Humidity: " + element.main.humidity + "%</p>";
    });
}

var historyItemClick = function(event) {
    var selectedCity = event.target.textContent;
    searchEl.value = selectedCity;

    citySearch(selectedCity);

}

loadHistory();
// On submit call function to search for city
document.addEventListener("submit", citySearchSubmit);

// on history list item click
historyEl.addEventListener('click', historyItemClick);