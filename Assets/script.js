var long, lati;
var newLocation, cityName, cityTemp, cityHumid, cityWind, cityUV, weatherData;
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
  function showPosition(position) {
    lati = position.coords.latitude;
    long = position.coords.longitude;
    getWeather();
  }
}
function getWeather() {
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lati +
      "&lon=" +
      long +
      "&appid=366cc20005f64d752fb214b02121c288&units=imperial",
    method: "GET",
  }).then(function (response) {
    $("#cityName").empty();
    $("#cityName").text(response.name);
    $("#currentTemp").empty();
    $("#currentTemp").text("Temperature: " + response.main.temp);
    $("#currentHumidity").empty();
    $("#currentHumidity").text("Humidity: " + response.main.humidity);
    $("#windSpeed").empty();
    $("#windSpeed").text("Wind Speed: " + response.wind.speed);
  });
  $.ajax({
    url:
      "http://api.openweathermap.org/data/2.5/uvi?appid=366cc20005f64d752fb214b02121c288&lat=" +
      lati +
      "&lon=" +
      long,
    method: "GET",
  }).then(function (response) {
    $("#uv").empty();
    $("#uv").text("UV Index: " + response.value);
  });
}
function showData() {}
$("#newLocationBtn").on("click", function () {
  var newLocation = $("#citySearch").val();
  if ($("#citySearch").val() != "") {
    $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/weather?q=" +
        newLocation +
        "&appid=366cc20005f64d752fb214b02121c288",
      method: "GET",
    }).then(function (response) {
      lati = response.coord.lat;
      long = response.coord.lon;
      getWeather();
      var newLocation = $("#citySearch").val();
      var newLocationLI = $("<li>");
      var locationButton = $("<button>");
      locationButton.text(response.name);
      locationButton.addClass("btn btn-primary");
      newLocationLI.append(locationButton);
      $("#locationList").append(newLocationLI);
    });
  }
});
