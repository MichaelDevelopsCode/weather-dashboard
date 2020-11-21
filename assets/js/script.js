var apiKey = "appId=bc9f6ddfab3a7a8e6e4b64e7c936aeb9";
var searchEl = document.getElementById("citySearch");

var savedCities = [];


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



// On submit call function to search for city
document.addEventListener("submit", citySearchSubmit);
