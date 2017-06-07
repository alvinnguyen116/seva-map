var map;      //global variables 
var markers;
var bounds;
var prevWindow = false; //prevent multiple infoWindows 
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var menteeClusterer;
var partnerClusterer;
document.addEventListener('DOMContentLoaded', function () { //foundation: https://www.sitepoint.com/google-maps-javascript-api-the-right-way/ 
  if (document.querySelectorAll('#map').length > 0)
  {
    if (document.querySelector('html').lang)
      lang = document.querySelector('html').lang;
    else
      lang = 'en';

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&key=AIzaSyCGxVwcnSIOQRIALbeJ2eds6ka9PtdBoHg&language=' + lang;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }

});
function initMap()
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  }); 
  map.setOptions({ minZoom: 2, maxZoom: 10 });
  fetch('SEVA_Locations.json') //http://mygeoposition.com/ 
  .then(function(response){return response.json()})
  .then(plotMarkers);
  google.maps.event.addListener(map, "click", function() { //closes infoWindows automatically 
    if (prevWindow) {
      prevWindow.close();
      prevWindow = false;
    }
    map.setOptions({ scrollwheel: true }); //re-enables scrolling 
  });
}
var icons = {
      sevaOffice: {
        name: "Seva Office",
        icon: 'images/seva_office.png' //http://www.flaticon.com
      },
      sevaPartner: {
        name: "Seva Partner",
        icon: 'images/seva_partner.png'
      },
      sevaMentee: {
        name: "Seva Mentee",
        icon: 'images/seva_mentee.png'
      }
  };
function plotMarkers(m)
{
  markers = []; // clustering 
  bounds = new google.maps.LatLngBounds();
  menteeCluster = new MarkerClusterer(map, [], {
    maxZoom: 10,
    gridSize: 40, //the proximity required to cluster 
    styles: [{
     anchor:[26.5, 22], //[y,x][26,18.5]
     textColor: "white",
     textSize: 15,
     height: 52,
     width: 52,
     url: "images/cluster_mentee.png"
    }] 
  });
  partnerClusterer = new MarkerClusterer(map, [], {
    maxZoom: 10,
    gridSize: 40,
    styles: [{
     anchor:[28,22], //[y,x] where top right is [0,0]
     textColor: "white",
     textSize: 15,
     height: 52, 
     width: 52,
     url: "images/cluster_partner.png"
    }] 
  });
  m.forEach(function (marker) {
    var position = new google.maps.LatLng(marker.lat, marker.lng);
    var newMarker = new google.maps.Marker({
        position: position,
        icon: icons[marker.type].icon,
        animation: google.maps.Animation.DROP,
        map: map
      });
    var contentString = infoWindowContent(marker.name, marker.description, marker.image);
    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
  google.maps.event.addListener(infoWindow, 'domready', function() { 
    var iwOuter = $('.gm-style-iw'); //removing InfoWindow margins 
    var iwBackground = iwOuter.prev();
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    iwOuter.parent().parent().css({left: '115px'}); //repositioning infowindow 
    iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 100px !important;'});
    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 100px !important;'});
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow' : '0px 1px 6px #801a50', 'z-index' : '1'});
    var iwCloseBtn = iwOuter.next(); //info window exit button 
    // iwCloseBtn.css({'display': 'none'});
    iwCloseBtn.css({
      opacity: '1', // by default the close button has an opacity of 0.7
      border: '8px solid #801a50', // increasing button border and new color
      'border-radius': '14px' // circular effect
    });
  });
  google.maps.event.addListener(infoWindow,'closeclick',function(){
      map.setOptions({ scrollwheel: true }); //re-enables scrolling 
  });
    newMarker.addListener('click', function() {
      if (prevWindow) {
        prevWindow.close();
      }
      prevWindow = infoWindow;
      infoWindow.open(map, newMarker);
      if (isInfoWindowOpen(infoWindow)) {
        map.setOptions({ scrollwheel: false }); //enables text scrolling 
      } 
    });
    markers.push(newMarker); 
    if (marker.type == "sevaMentee") {
      menteeCluster.addMarker(newMarker);
    } else if (marker.type == "sevaPartner") {
      partnerClusterer.addMarker(newMarker);
    }
    bounds.extend(position);
  });
  map.fitBounds(bounds);
  var legend = document.getElementById('legend'); //legend 
  for (var key in icons) {
    var type = icons[key];
    var name = type.name;
    var icon = type.icon;
    var div = document.createElement('div');
    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);
  }
 map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
}

function infoWindowContent(name, content, image) {
  if (image == "") {
    return "<div id='iw_container'> <div id='iw_title'>" + name + "</div><div id='iw_content'>" + content + "</div><div class='iw-bottom-gradient'></div></div>"; //styling purposes 
  } else {
    return "<div id='iw_container'> <div id='iw_image' style='width:350px; height: 200px; background-image: url(" + image + "); background-size: cover; background-repeat: no-repeat; background-position: 50% 50%;'></div>"
    + "<div id='iw_title'>" + name + "</div><div id='iw_content'>" + content + "</div><div class='iw-bottom-gradient'></div></div>";
  } 
}

function isInfoWindowOpen(infoWindow) {
    var map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
}