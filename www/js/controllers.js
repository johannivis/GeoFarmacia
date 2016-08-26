angular.module('app.controllers', [])

.controller('mapaCtrl', function($scope,Markers,$compile,$ionicLoading) {

  var infowindow=0;
     $scope.showPopup = function(){

    console.log("JOHA");
    alert("JOHA");

  }
function initialize() {



        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

         $scope.map = map;





    navigator.geolocation.getCurrentPosition(function(pos) {

         var myLatLng=new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

       // $scope.ubicacion=pos.coords.latitude +" "+pos.coords.longitude;
        console.log(pos.coords.latitude +" "+ pos.coords.longitude)


           var marker = new google.maps.Marker({
          position: myLatLng,
          title: 'Usuario',
          map: map
        });

        var infoWindowContent = "<h4>mi ubucacion</h4>";

        addInfoWindow(marker, infoWindowContent);


// se añade el marker al mapa q ya esta en el scope
//marker.setMap( $scope.map);
          $scope.map.setCenter(myLatLng);
       loadMarkers(pos.coords.latitude,pos.coords.longitude);

        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      }

      google.maps.event.addDomListener(window, 'load', initialize);




// marcadores

  function loadMarkers(lat,lon){

      //Get all of the markers from our Markers factory
      Markers.getMarkers(lat,lon).then(function(markers){

        var records = markers.FARMACIA;
        console.log(records);

              var limites = new google.maps.LatLngBounds();

        for (var i = 0; i < records.length; i++) {
          var record = records[i];
          console.log(record.NOMBRE);
          var markerPos = new google.maps.LatLng({lat:parseFloat(record.LATITUD),lng:parseFloat(record.LONGITUD)});

          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: $scope.map,
             animation: google.maps.Animation.DROP,
              position: markerPos
          });

          limites.extend(marker.position);

           $scope.map.fitBounds(limites);

        var infoWindowContent =  record.NOMBRE+ "<br>"+record.DIRECCION+ "<br>"+record.TELEFONO;
        console.log(record.DIRECCION);


        addInfoWindow(marker, infoWindowContent);

//setTimeout(function () { infowindow.close(); }, 5000);
        }

      });


  }

  function addInfoWindow(marker, message) {

      var infoWindow = new google.maps.InfoWindow({
          content: message
      });

      google.maps.event.addListener(marker, 'click', function () {

          infoWindow.open($scope.map, marker);

      });

  }

})



.factory('Markers', function($http) {

  var markers = [];

  return {
    getMarkers: function(lat,lon){
     //  return $http.get("http://181.198.51.178:8083/php/get_all_farmacia.php?latitud="+lat+"&longitud="+lon).then(function(response){
      return $http.get("/api/forecast?latitud="+lat+"&longitud="+lon).then(function(response){
          markers = response.data;
             return markers;
      });

    }
  }
})
