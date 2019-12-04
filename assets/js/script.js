//variables to store the current location's latitude and longitude read from geolocation API
var latitude;           
var longitude;
var apikey = "&appid=c63725fc3433c437d23d3a51038313a5"

//Variable storing openweather API url
var queryUrl = "https://api.openweathermap.org/data/2.5/weather?";

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeatherAtPosition);
    } 
    else 
    {
        alert("Geolocation is not supported by this browser.");
    }
}
function showWeatherAtPosition(position) {
    //reading the latitude and longitude values
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);

    if(latitude !== undefined && longitude !== undefined) {
        //calling openweather API to get the current weather by providing the latitude and longitude coordinates of the user
        $.ajax({
            url: queryUrl + "lat=" + latitude + "&lon=" + longitude + apikey,
            method: "GET"
        }).then(function(response) {
            console.log(response);
        });
    }
}

$("#search").on("click", function(event) {
    event.preventDefault();
    //calling openweather API to get the current weather by providing the city name entered in the search field
    $.ajax({
        url: queryUrl + "q=" + $("#cityName").val() + apikey,
        method: "GET"
    }).then(function(response) {
        console.log(response);
    });
})

