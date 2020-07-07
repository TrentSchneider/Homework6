var long, lati;
var newLocation,
  cityName,
  cityTemp,
  cityHumid,
  cityWind,
  cityUV,
  weatherData,
  locationsArray,
  locName,
  sunrise,
  sunset,
  sunriseStamp,
  sunsetStamp,
  offset;

// converts unix sunrise and sunset time to standard format
// converted getSun function from original conversion function found at https://www.w3docs.com/snippets/javascript/how-to-convert-a-unix-timestamp-to-time-in-javascript.html
function getSun() {
  sunriseTimestamp = sunriseStamp;
  sunsetTimestamp = sunsetStamp;

  let riseDate = new Date(sunriseTimestamp * 1000);
  let riseHours = riseDate.getHours();
  let riseMinutes = "0" + riseDate.getMinutes();
  let riseSeconds = "0" + riseDate.getSeconds();
  sunrise = riseHours + riseMinutes.substr(-2) + riseSeconds.substr(-2);

  let setDate = new Date(sunsetTimestamp * 1000);
  let setHours = setDate.getHours();
  let setMinutes = "0" + setDate.getMinutes();
  let setSeconds = "0" + setDate.getSeconds();
  sunset = setHours + setMinutes.substr(-2) + setSeconds.substr(-2);
}

// function for storing the last searched location's coordinates
function storeData() {
  localStorage.setItem("longitude", long);
  localStorage.setItem("latitude", lati);
}

// this is for the default functionality of the page when it is first visited or the page is refreshed
// it will either fill in the current/5 day weather for the user's current location or fill in the weather/5 day for the last location the user searched
// it will also load the list of previously searched locations if locations have been searched
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

// this is the function for the ajax call for current weather/5 day weather and updating the current weather/5 day weather fields
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
    // fills in the information for the current weather
    $("#currentTemp").empty();
    $("#currentTemp").text("Temperature: " + response.current.temp + " °F");
    $("#currentHumidity").empty();
    $("#currentHumidity").text("Humidity: " + response.current.humidity);
    $("#windSpeed").empty();
    $("#windSpeed").text("Wind Speed: " + response.current.wind_speed);
    $("#uv").empty();
    $("#uv").text(response.current.uvi);

    // compares the current time for the searched location to the times for sunrise and sunset and changes page from day to night or night to day
    sunriseStamp = response.current.sunrise;
    sunsetStamp = response.current.sunset;
    offset = response.timezone_offset;
    getSun();
    var currentTime = moment().subtract(offset, "seconds").format("Hmmss");
    if (currentTime > sunrise && currentTime < sunset) {
      $("body").removeClass("bg-dark text-white");
      $("button").removeClass("bg-dark text-white");
      $("#searchHead").removeClass("bg-secondary");
      $("#locCol").removeClass("bg-secondary");
      $("#searchCol").removeClass("noBord");
      $("#fiveDayCard").removeClass("bg-blue");
      $("#fiveDayCard").addClass("bg-primary");
      $("#showCurrent").removeClass("bg-secondary");
      $("#locCol").addClass("bg-light");
      $("body").addClass("bg-white text-dark");
    } else {
      $("body").removeClass("bg-white text-dark");
      $("#locCol").removeClass("bg-light");
      $("#fiveDayCard").removeClass("bg-primary");
      $("#searchHead").addClass("bg-secondary");
      $("#searchCol").addClass("noBord");
      $("#fiveDayCard").addClass("bg-blue");
      $("#showCurrent").addClass("bg-secondary");
      $("button").addClass("bg-dark text-white");
      $("#locCol").addClass("bg-secondary");
      $("body").addClass("bg-dark text-white");
    }

    // updates uv index for current weather with color coding
    if (response.current.uvi < 3) {
      $("#uv").removeClass("bg-warning");
      $("#uv").removeClass("bg-orange");
      $("#uv").removeClass("bg-danger");
      $("#uv").removeClass("bg-purple");
      $("#uv").addClass("bg-success");
    } else if (response.current.uvi > 2.9 && response.current.uvi < 6) {
      $("#uv").removeClass("bg-success");
      $("#uv").removeClass("bg-orange");
      $("#uv").removeClass("bg-danger");
      $("#uv").removeClass("bg-purple");
      $("#uv").addClass("bg-warning");
    } else if (response.current.uvi > 5.9 && response.current.uvi < 8) {
      $("#uv").removeClass("bg-warning");
      $("#uv").removeClass("bg-success");
      $("#uv").removeClass("bg-danger");
      $("#uv").removeClass("bg-purple");
      $("#uv").addClass("bg-orange");
    } else if (response.current.uvi > 7.9 && response.current.uvi < 11) {
      $("#uv").removeClass("bg-warning");
      $("#uv").removeClass("bg-orange");
      $("#uv").removeClass("bg-success");
      $("#uv").removeClass("bg-purple");
      $("#uv").addClass("bg-danger");
    } else {
      $("#uv").removeClass("bg-warning");
      $("#uv").removeClass("bg-orange");
      $("#uv").removeClass("bg-danger");
      $("#uv").removeClass("bg-success");
      $("#uv").addClass("bg-purple");
    }

    // this fills in the 5 day weather for the current location
    $("#fiveDaySpace").empty();
    for (let i = 1; i < 6; i++) {
      var fiveDay = $("<div>");
      fiveDay.attr("id", "fiveDayCard");
      fiveDay.attr("class", "card card-body bg-primary float-left text-white");
      var fiveDayTemp = $("<p>");
      var fiveDayHum = $("<p>");
      var fiveDayDate = $("<p>");
      var fiveDayPic = $("<img>");
      fiveDayDate.text(moment().add(i, "days").format("ddd MMMM Do, YYYY"));
      fiveDayPic.attr(
        "src",
        "https://openweathermap.org/img/wn/" +
          response.daily[i].weather[0].icon +
          "@2x.png"
      );
      fiveDayPic.attr("alt", "5 day weather icon");
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

  // this fills in the current location and pulls the current date
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lati +
      "&lon=" +
      long +
      "&appid=366cc20005f64d752fb214b02121c288",
    method: "GET",
  }).then(function (response) {
    var weatherPic = $("<img>");
    weatherPic.attr(
      "src",
      "https://openweathermap.org/img/wn/" +
        response.weather[0].icon +
        "@2x.png"
    );
    $("#cityName").empty();
    $("#cityName").text(
      response.name + " (" + moment().format("ddd MMMM Do, YYYY") + ")"
    );
    $("#cityName").append(weatherPic);
  });
}

// this fills in the searched locations list
function fillLi() {
  $("#locationList").empty();
  locationsArray = JSON.parse(localStorage.getItem("storeData"));
  for (let i = 0; i < locationsArray.length; i++) {
    var newLocationLI = $("<li>");
    var locationButton = $("<button>");
    locationButton.text(locationsArray[i].name);
    locationButton.addClass("btn btn-primary locBtn w-100");
    locationButton.attr("id", i);
    newLocationLI.append(locationButton);
    $("#locationList").append(newLocationLI);
  }
}

// this is for searching new locations and adding the data to the stored list of locations
$("#newLocationBtn").on("click", function (event) {
  event.preventDefault();
  var newLocation = $("#citySearch").val();
  if ($("#citySearch").val() != "") {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
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
      // code segment from https://www.wikimass.com/json/remove-duplicates
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

// this allows the location list buttons to call the current/5 day weather for the selected location and to move said location to the top of the list
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
