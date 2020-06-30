var long, lat;
var newLocation;
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(showPosition);
//   function showPosition(position) {
//     lat = position.coords.latitude;
//     long = position.coords.longitude;
//     console.log(lat);
//     console.log(long);
//   }
// }
// function getLocalWeather() {
//   $.ajax({
//     url:
//       "https://api.openweathermap.org/data/2.5/weather?lat=" +
//       lat +
//       "&lon=" +
//       long +
//       "&appid=366cc20005f64d752fb214b02121c288",
//     method: "GET",
//   }).then(function (response) {
//     console.log(response);
//   });
// }
// function showData(){
// }
$("#newLocationBtn").on("click", function () {
  var newLocation = $("#citySearch").val;
  var newLocationDiv = $("locationList").append("<div>");
  newLocationDiv.text(newLocation);
});
