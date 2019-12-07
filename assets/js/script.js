//variables to store the current location's latitude and longitude read from geolocation API
var latitude;           
var longitude;
var apikey = "&appid=c63725fc3433c437d23d3a51038313a5"

//Variable storing openweather API url
var queryUrl = "https://api.openweathermap.org/data/2.5/weather?";
var queryUrlUVIndex = "https://api.openweathermap.org/data/2.5/uvi?";
var units = "&units=imperial";

function getLocation() {
    //Function to fill the previously searched cities in history tab
    fillSearchHistory();
    //Get the current location coordinates from Geolocation API
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
            url: queryUrl + "lat=" + latitude + "&lon=" + longitude + units + apikey,
            method: "GET"
        }).then(function(response) {
            fillCurrentWeatherDetails(response);
        });

        //Calling Openweather API to display forecast over the next 5 days
        var url = "https://api.openweathermap.org/data/2.5/forecast?";
        $.ajax({
            url: url + "lat=" + latitude + "&lon=" + longitude + units + apikey,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            fillForecastDetails(response);
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
    fetchWeatherAtCity($("#cityName").val());  
});

function fetchWeatherAtCity(cityName) {
    //Variables storing the latitude and longitude of the searched city
    var searchLatitude;
    var searchLongitude;
    //calling openweather API to get the current weather by providing the city name entered in the search field
    $.ajax({
        url: queryUrl + "q=" + cityName + units + apikey,
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
    //Calling Openweather API to display forecast over the next 5 days
    var url = "https://api.openweathermap.org/data/2.5/forecast?";
    $.ajax({
        url: url + "q=" + cityName + units + apikey,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        fillForecastDetails(response);
    });
}
function addCityToSearchHistory() {
    //Reading the list of searched cities from local storage
    var cityList = JSON.parse(localStorage.getItem("cities")); 
    //Saving the searched item in the history div
    var searchedCity = $("#name").text();
    var button = $("<button>");
    button.text(searchedCity);
    button.attr("class", "button");

    if(cityList === null) {
        cityList = [];
        cityList.push(searchedCity);
        $("#cityHistory").append(button);
    }
    else { 
        //Ensuring that city name is not already in cityList
        if(cityList.indexOf(searchedCity) < 0) {  
            //Maintaining only 5 cities in the history. If already 5 cities exist then prepending the new city and removing the oldest city
            if(cityList.length >= 5) {
                cityList.unshift(searchedCity);
                cityList = cityList.slice(0, 5);
            }
            else {
                cityList.push(searchedCity);
            }
            $("#cityHistory").append(button);
        }
    }
    //Writing back the newly added city to local storage
    localStorage.setItem("cities", JSON.stringify(cityList));
    fillSearchHistory();
}
        
function fillCurrentWeatherDetails(response) {
    var currentTime = moment().format('l');
    //Variable storing the weather icon link
    var iconurl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    $("#currentWeather").attr("style", "display: block;");
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
    //converting temperature from Fahrenheit to Celcius
    var tempF = response.main.temp;
    var tempC = (((parseInt(tempF) - 32) * 5)/9).toFixed(2);
    tempTag.text(tempF + "\u2109" + " (" + tempC + " \u2103" + ")");
    humidTag.text(response.main.humidity + "%");
    //Displaying wind in miles per hour   
    windTag.text(response.wind.speed + " MPH");
    //Fill the previously searched history
    addCityToSearchHistory();
}
function fillSearchHistory() {
    //read the list of searched cities from local storage and populate in the search div
    var cityList = JSON.parse(localStorage.getItem("cities"));
    //Remove the previously added cities so as to refresh the search history
    $("#cityHistory").empty();
    if(cityList !== null) {
        // Create and add new buttons for each city read from the search history
        for(var i=0; i<cityList.length; i++) {
            var button = $("<button>");
            button.text(cityList[i]);
            button.attr("class", "button");
            $("#cityHistory").append(button);
        }
    }
}
function fillUVIValue(response) {
    var uvTag = $("#uvIndex");
    uvTag.text(response.value);
    uvTag.attr("style", "color: white; background-color: #ff1a1a; padding: 2px 5px; border-radius: 5px;")
}

$(document).on("click", ".button", function(event) {
    event.preventDefault();
    fetchWeatherAtCity($(this).text());
});

function fillForecastDetails(response) {
    var meanTimeWeatherList = [];
    var today = moment().format("YYYY-MM-DD");
    for(var i=0; i<response.list.length; i++) {
        //dt_txt stores the date and time separated by a space hence splitting them to check the time and collect only the weather forecasts during the mean time of the day between 12:00PM to 3PM
        var arr = response.list[i].dt_txt.split(" ");
        if(arr[1] === "12:00:00") {
            meanTimeWeatherList.push(response.list[i]);
        }
    }
    //If the first instance at 12PM weather is of today then removing it from list since we want to display the future forecast of next 5 days which shouldn't include current day
    if((meanTimeWeatherList[0].dt_txt.split())[0] === today) {
        meanTimeWeatherList.shift();
        //The current day's 12PM instance was returned which means that the 5th day's 12PM forecast doesn't exist. Hence, adding the last noted weather of the 5th day to the list since we have to provide 5th day's forecast
        meanTimeWeatherList.push(response.list[length - 1]);
    }
    var forecastList = document.querySelectorAll(".forecast");
    $("h4").attr("style", "display:block;");
    for(var i=0; i<meanTimeWeatherList.length; i++) {
        for(var j=0; j<forecastList.length; j++) {
            //Fill the forecast details of the next 5 days
            if(parseInt(forecastList[j].getAttribute("data-day")) === i) {
                forecastList[j].setAttribute("style", "display:block;");
                //creating new date, icon, temperature and humidity tags to save the forecast details
                var dateTag = document.createElement('p');
                var iconTag = document.createElement('img');
                var tempTag = document.createElement('p');
                var humidTag = document.createElement('p');
                dateTag.innerHTML = (meanTimeWeatherList[i].dt_txt.split(" "))[0];
                dateTag.setAttribute("style", "font-size: 20px; font-weight: bold;");
                var iconurl = "http://openweathermap.org/img/w/" + meanTimeWeatherList[i].weather[0].icon + ".png";
                iconTag.setAttribute("src", iconurl);
                iconTag.setAttribute("height", "60px");
                iconTag.setAttribute("style", "padding-bottom: 5px;");
                var tempF = meanTimeWeatherList[i].main.temp;
                var tempC = (((parseInt(tempF) - 32) * 5)/9).toFixed(2);
                tempTag.innerHTML = tempF + " \u2109" + " (" + tempC + " \u2103" + ")";
                humidTag.innerHTML = "Humidity: " + meanTimeWeatherList[i].main.humidity + "%";
                //Empty previous forecast contents
                forecastList[j].innerHTML = "";
                forecastList[j].appendChild(dateTag);
                forecastList[j].appendChild(iconTag);
                forecastList[j].appendChild(tempTag);
                forecastList[j].appendChild(humidTag);
            }
        }
    }
}

