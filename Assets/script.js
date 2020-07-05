var long, lati;
var newLocation,
  cityName,
  cityTemp,
  cityHumid,
  cityWind,
  cityUV,
  weatherData,
  locationsArray,
  locName;

function storeData() {
  localStorage.setItem("longitude", long);
  localStorage.setItem("latitude", lati);
}

if (
  localStorage.getItem("latitude") === "undefined" ||
  localStorage.getItem("latitude") === null
) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    function showPosition(position) {
      lati = position.coords.latitude;
      long = position.coords.longitude;
      getWeather();
      locationsArray = JSON.parse(localStorage.getItem("storeData"));
      if (
        locationsArray !== "undefined" &&
        locationsArray !== null &&
        locationsArray !== ""
      ) {
        fillLi();
      }
    }
  }
} else {
  lati = localStorage.getItem("latitude");
  long = localStorage.getItem("longitude");
  getWeather();
  locationsArray = JSON.parse(localStorage.getItem("storeData"));
  fillLi();
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
    $("#fiveDaySpace").empty();
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

function fillLi() {
  $("#locationList").empty();
  locationsArray = JSON.parse(localStorage.getItem("storeData"));
  for (let i = 0; i < locationsArray.length; i++) {
    var newLocationLI = $("<li>");
    var locationButton = $("<button>");
    locationButton.text(locationsArray[i].name);
    locationButton.addClass("btn btn-primary locBtn");
    locationButton.attr("id", i);
    newLocationLI.append(locationButton);
    $("#locationList").append(newLocationLI);
  }
}

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
      locationsArray = JSON.parse(localStorage.getItem("storeData"));
      if (locationsArray === null) {
        locationsArray = [];
      }
      locationsArray.unshift({
        name: response.name,
        latitude: response.coord.lat,
        longitude: response.coord.lon,
      });
      var data1 = locationsArray.filter((thing, index) => {
        return (
          index ===
          locationsArray.findIndex((obj) => {
            return JSON.stringify(obj) === JSON.stringify(thing);
          })
        );
      });
      locationsArray = data1;
      var storeToLocal = JSON.stringify(locationsArray);
      localStorage.setItem("storeData", storeToLocal);
      locName = response.name;
      fillLi();
    });
  }
});
$("#locationList").on("click", ".locBtn", function () {
  locationsArray = JSON.parse(localStorage.getItem("storeData"));
  var currentLoc = this.id,
    currentName = locationsArray[currentLoc].name,
    currentLat = locationsArray[currentLoc].latitude,
    currentLong = locationsArray[currentLoc].longitude;
  lati = currentLat;
  long = currentLong;
  getWeather();
  storeData();

  locationsArray.splice(currentLoc, 1);
  locationsArray.unshift({
    name: currentName,
    latitude: currentLat,
    longitude: currentLong,
  });
  var storeToLocal = JSON.stringify(locationsArray);
  localStorage.setItem("storeData", storeToLocal);
  fillLi();
});
