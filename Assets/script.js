var long, lati;
var newLocation,
  cityName,
  cityTemp,
  cityHumid,
  cityWind,
  cityUV,
  weatherData,
  weatherArray;

function storeData() {
  // if (weatherArray != null) {
  //   weatherArray.pop();
  // }
  // weatherArray.push({
  //   latitude: lati,
  //   longitude: long,
  // });
  // var storeToLocal = JSON.stringify(weatherArray);
  // localStorage.setItem("storeData", storeToLocal);
  localStorage.setItem("longitude", long);
  localStorage.setItem("latitude", lati);
}

if (
  localStorage.getItem("latitude") == "undefined" &&
  localStorage.getItem("latitude") == null
) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    function showPosition(position) {
      lati = position.coords.latitude;
      long = position.coords.longitude;
      getWeather();
    }
  }
} else {
  // weatherArray = JSON.parse(localStorage.getItem("storeData"));
  // lati = weatherArray[0].latitude;
  // long = weatherArray[0].longitude;
  lati = localStorage.getItem("latitude");
  long = localStorage.getItem("longitude");
  getWeather();
}
function getWeather() {
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lati +
      "&lon=" +
      long +
      "&appid=366cc20005f64d752fb214b02121c288&units=imperial&exclude=hourly",
    method: "GET",
  }).then(function (response) {
    $("#currentTemp").empty();
    $("#currentTemp").text("Temperature: " + response.current.temp + " °F");
    $("#currentHumidity").empty();
    $("#currentHumidity").text("Humidity: " + response.current.humidity);
    $("#windSpeed").empty();
    $("#windSpeed").text("Wind Speed: " + response.current.wind_speed);
    $("#uv").empty();
    $("#uv").text("UV Index: " + response.current.uvi);
    console.log(response);
    for (let i = 1; i < 6; i++) {
      var fiveDay = $("<div>");
      fiveDay.attr("class", "card card-body bg-primary float-left");
      var fiveDayTemp = $("<p>");
      var fiveDayHum = $("<p>");
      var fiveDayDate = $("<p>");
      var fiveDayPic = $("<img>");
      fiveDayDate.text(moment().add(i, "days").format("ddd MMMM Do, YYYY"));
      fiveDayPic.attr(
        "src",
        "http://openweathermap.org/img/wn/" +
          response.daily[i].weather[0].icon +
          ".png"
      );
      fiveDayTemp.text(
        "Temp: " + JSON.stringify(response.daily[i].temp.day) + " °F"
      );
      fiveDayHum.text(
        "Humidity: " + JSON.stringify(response.daily[i].humidity)
      );
      fiveDay.append(fiveDayDate);
      fiveDay.append(fiveDayPic);
      fiveDay.append(fiveDayTemp);
      fiveDay.append(fiveDayHum);
      $("#fiveDaySpace").append(fiveDay);
    }
  });
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lati +
      "&lon=" +
      long +
      "&appid=366cc20005f64d752fb214b02121c288",
    method: "GET",
  }).then(function (response) {
    $("#cityName").empty();
    $("#cityName").text(
      response.name + " (" + moment().format("ddd MMMM Do, YYYY") + ")"
    );
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
      $("#fiveDaySpace").empty();
      getWeather();
      storeData();
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
