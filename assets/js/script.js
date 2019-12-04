//variables to store the current location's latitude and longitude read from geolocation API
var latitude;           
var longitude;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } 
    else 
    {
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    //reading the latitude and longitude values
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
}

