var apiKey = "appId=bc9f6ddfab3a7a8e6e4b64e7c936aeb9";
var searchEl = document.getElementById("citySearch");
var historyEl = document.getElementById("history"); 
var cityHeadingEl = document.getElementById("city-heading");
var tempEl = document.getElementById("temp");
var humidityEl = document.getElementById("humidity");
var windEl = document.getElementById("wind");
var uvEl = document.getElementById("uv");
var currentCondEl = document.getElementById("current-conditions");

var savedCities = [];

// load history from local storage
var loadHistory = function() {
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
var saveHistory = function() {
    savedCities.push(cityName);
    localStorage.setItem("city", JSON.stringify(savedCities));
    loadHistory();
}


var citySearchSubmit = function(event) {
    // prevent page from reloading
    event.preventDefault();

    // get searched city
    var cityName = searchEl.value;

    // fetch api
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&units=imperial" +"&"+apiKey)
        .then(function(response) {
            // if request successful
            if(response.ok) {

                // city was accepted so update array if NOT already in there and save to local storage
                if(!savedCities.includes(cityName)) {
                    saveHistory();
                }

                response.json().then(function(data) {
                    // grab lon & lat
                    var longitude = data.coord.lon;
                    var latitude = data.coord.lat;

                    // fetch UV data for city based on lon/lat
                    fetchUV(latitude, longitude);

                    // create current weather conditions
                    createCurrentConditions(data);
                });

            } else {
                alert("something went wrong"); // request not sucessful
            }

        });

}

var fetchUV = function(lat, lon) {
    fetch("http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&"+apiKey)
        .then(function(response) {
            // if request successful
            if(response.ok) {
                response.json().then(function(data) {
                    var uvIndex = data.value;
                    uvEl.textContent = "UV Index: " + uvIndex;
                });
            } else {
                alert("something went wrong"); // not successful request
            }
        });
}

var createCurrentConditions = function(data) {
    // grab data and assign
    var cityName = data.name;
    var cityTemp = data.main.temp; // kelvin to fahrenheit
    var cityHumidity = data.main.humidity;
    var windSpeed = data.wind.speed; // convert from meters per sec to mph

    // update content
    cityHeadingEl.textContent = cityName;
    tempEl.textContent = "Temperature: " + cityTemp + "°F";
    humidityEl.textContent = "Humidity: " + cityHumidity + "%";
    windEl.textContent = "Wind Speed: " + windSpeed + " MPH";
    currentCondEl.classList = "card p-4 col-12"; // show card style now that div has content


}


loadHistory();
// On submit call function to search for city
document.addEventListener("submit", citySearchSubmit);
