var apiKey = "appId=bc9f6ddfab3a7a8e6e4b64e7c936aeb9";
var searchEl = document.getElementById("citySearch");
var historyEl = document.getElementById("history"); 

var savedCities = ["altamonte springs", "orlando", "new york"];

// load history from local storage if available
var loadHistory = function() {
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


var citySearchSubmit = function(event) {
    // prevent page from reloading
    event.preventDefault();

    // get searched city
    var cityName = searchEl.value;

    // fetch api
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&"+apiKey)
        .then(function(response) {
            // if request successful
            if(response.ok) {
                // city was accepted so save to local storage
                //localStorage.setItem("city")
                console.log(cityName);
            } else {
                alert("something went wrong");
            }

        });

}


loadHistory();
// On submit call function to search for city
document.addEventListener("submit", citySearchSubmit);
