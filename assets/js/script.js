//variables to store the current location's latitude and longitude read from geolocation API
var latitude;           
var longitude;
var apikey = "&appid=c63725fc3433c437d23d3a51038313a5"

//Variable storing openweather API url
var queryUrl = "https://api.openweathermap.org/data/2.5/weather?";
var queryUrlUVIndex = "https://api.openweathermap.org/data/2.5/uvi?";

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
            fillCurrentWeatherDetails(response);
        });
        //Getting ultraviolet Index at current location by calling openweather API
        $.ajax({
            url: queryUrlUVIndex + "lat=" + latitude + "&lon=" + longitude + apikey,
            method: "GET"
        }).then(function(response) {
            fillUVIValue(response);
        });
    }
}

$("#search").on("click", function(event) {
    event.preventDefault();
    //Variables storing the latitude and longitude of the searched city
    var searchLatitude;
    var searchLongitude;
    //calling openweather API to get the current weather by providing the city name entered in the search field
    $.ajax({
        url: queryUrl + "q=" + $("#cityName").val() + apikey,
        method: "GET"
    }).then(function(response) {
        fillCurrentWeatherDetails(response);
        searchLatitude = response.coord.lat;
        searchLongitude = response.coord.lon;
        
        //Getting ultraviolet Index at current location by calling openweather API
        $.ajax({
            url: queryUrlUVIndex + "lat=" + searchLatitude + "&lon=" + searchLongitude + apikey,
            method: "GET"
        }).then(function(response) {
            fillUVIValue(response);
        });
    });
    
})

function fillCurrentWeatherDetails(response) {
    var currentTime = moment().format('l');
    //Variable storing the weather icon link
    var iconurl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    $("#currentWeather").attr("style", "display: block;");
    console.log(response);
    var nameTag = $("#name");
    var dateTag = $("#date");
    var iconTag = $("#weatherIcon");
    var descTag = $("#desc");
    var tempTag = $("#temperature");
    var humidTag = $("#humidity");
    var windTag = $("#wSpeed");
    nameTag.text(response.name);
    nameTag.attr("style", "font-size: 22px; font-weight: bold;");
    dateTag.text("(" + currentTime + ")");
    dateTag.attr("style", "font-size: 22px; font-weight: bold;");
    iconTag.attr("src", iconurl);
    iconTag.attr("height", "60px");
    iconTag.attr("style", "padding-bottom: 5px;");
    descTag.text(response.weather[0].main);
    descTag.attr("style", "font-size: 22px;");
    //converting temperature from Kelvin to Celcius
    var tempC = parseInt(response.main.temp) - 273.15 ;
    tempC = tempC.toFixed(2);
    tempTag.text(tempC + " \u2103");
    humidTag.text(response.main.humidity + " %");
    //Converting speed from meter per second to miles per hour
    var speedMPH = (parseInt(response.wind.speed) * 2.23694);      
    windTag.text(speedMPH.toFixed(2) + " MPH");
}

function fillUVIValue(response) {
    var uvTag = $("#uvIndex");
    uvTag.text(response.value);
    uvTag.attr("style", "color: white; background-color: #ff1a1a; padding: 2px 5px; border-radius: 5px;")
}