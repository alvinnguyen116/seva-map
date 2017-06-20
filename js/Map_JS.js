var map;      //global variables 
var markers;
var bounds;
var prevWindow = false; //prevent multiple infoWindows 
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var menteeClusterer;
var partnerClusterer;
var expanded = false;
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
  //https://mapstyle.withgoogle.com/
  var styledMapType = new google.maps.StyledMapType (

    [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
],

{name: 'Silver'}

    );
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8,
    mapTypeControlOptions: {mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']}
  });
  map.mapTypes.set('styled_map', styledMapType); //https://developers.google.com/maps/documentation/javascript/styling
  map.setMapTypeId('styled_map'); 

  map.setOptions({ minZoom: 2, maxZoom: 10 });
  fetch('SEVA_Locations.json') //http://mygeoposition.com/ 
  .then(function(response){return response.json();})
  .then(plotMarkers);
  google.maps.event.addListener(map, "click", function() { //closes infoWindows automatically 
    if (prevWindow) {
      prevWindow.close();
      prevWindow = false;
      iwclose();
    }
    map.setOptions({ scrollwheel: true }); //re-enables scrolling 
  });
  menteeClusterer = new MarkerClusterer(map, []);
  partnerClusterer = new MarkerClusterer(map, []);
  window.addEventListener("resize", function(){
    if (prevWindow) {
      responsiveOpen(prevWindow);
    }
    if (getOrientation() == "Portrait") {
      document.getElementById("legend_landscape").id = "legend_portrait";
      $("#legendBtn").css("display","none");
      $("#toggleSliderBtn").css("display", "block");
      $("#box").css("margin-left" , "0");
      toggleSlider();
    } else {
      document.getElementById("legend_portrait").id = "legend_landscape";
       $("#legendBtn").css("display","block");
      $("#toggleSliderBtn").css("display", "none");
      $("#box").css("display" , "block");
      legend();
    }
  }, true);
   $(window).on("orientationchange", function(){
    if (prevWindow) {
      responsiveOpen(prevWindow);
    }
    if (getOrientation() == "Portrait") {
      document.getElementById("legend_landscape").id = "legend_portrait";
      $("#legendBtn").css("display","none");
      $("#toggleSliderBtn").css("display", "block");
      $("#box").css("margin-left" , "0");
      toggleSlider();
    } else {
      document.getElementById("legend_portrait").id = "legend_landscape";
       $("#legendBtn").css("display","block");
      $("#toggleSliderBtn").css("display", "none");
      $("#box").css("display" , "block");
      legend();
    }
  });
   var iwResp = document.getElementById('iw_responsive');
   map.controls[google.maps.ControlPosition.TOP_CENTER].push(iwResp); // for responsive design 
   if (getOrientation() == "Portrait") {
      document.getElementById("legend_landscape").id = "legend_portrait";
      $("#legendBtn").css("display","none");
      $("#toggleSliderBtn").css("display", "block");
      document.getElementById("legend_arrow").src = "images/sort-down_opt.png";
    } else {
      document.getElementById("legend_portrait").id = "legend_landscape";
      $("#legendBtn").css("display","block");
      $("#toggleSliderBtn").css("display", "none");
      document.getElementById("legend_arrow2").src = "images/left-arrow_opt.png";
    }
}

function plotMarkers(m)
{
  markers = []; // clustering 
  bounds = new google.maps.LatLngBounds();

  m.forEach(function (marker) {
    var position = new google.maps.LatLng(marker.lat, marker.lng);
    var newMarker = new google.maps.Marker({
        position: position,
        icon: icons[marker.type].icon,
        category: [marker.type],
        animation: google.maps.Animation.DROP
      });
    var contentString = infoWindowContent(marker.name, marker.description, marker.image);
    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    infoWindow.name = marker.name;
    infoWindow.content = marker.description;
    infoWindow.image = marker.image;
  google.maps.event.addListener(infoWindow, 'domready', function() { 
    var iwOuter = $('.gm-style-iw'); //removing InfoWindow margins
    
    iwOuter.children().first().css({'overflow': 'hidden'}); 
    var iwBackground = iwOuter.prev();
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    iwOuter.parent().parent().css({left: '115px'}); //repositioning infowindow 
    iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
    // iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow' : '0px 1px 6px #801a50', 'z-index' : '1'});
    var iwCloseBtn = iwOuter.next(); //info window exit button 
    iwCloseBtn.hide();
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
      if (prevWindow && (prevWindow != infoWindow)) {
        prevWindow.close();
        iwclose();
      }
      prevWindow = infoWindow;
      responsiveOpen(infoWindow,newMarker);
      if (isInfoWindowOpen(infoWindow)) {
        map.setOptions({ scrollwheel: false }); //enables text scrolling 
      } 
    });
    markers.push(newMarker); 
    bounds.extend(position);
  });
  map.fitBounds(bounds);

  var legend = document.getElementById('legend_landscape'); //legend 
  if (legend == null) {
    legend = document.getElementById('legend_portrait');
  }
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

  show("sevaOffice");
  show("sevaMentee");
  show("sevaPartner");
}

function infoWindowContent(name, content, image) {
  if (image == "") {
    return "<div id='iw_container'> <div id='iw_title'><img src='images/left-arrow.png' alt='left-arrow'></img>" + name + "</div><div id='iw_content'>" + content + "</div></div>"; //styling purposes 
  } else {
    return "<div id='iw_container'> <div id='iw_image' style='width:350px; height: 200px; background-image: url(" + image + "); background-size: cover; background-repeat: no-repeat; background-position: 50% 50%;'></div>"
    + "<div id='iw_title'><img src='images/left-arrow.png' alt='left-arrow'></img>" + name + "</div><div id='iw_content'>" + content + "</div></div>";
  } 
}

function isInfoWindowOpen(infoWindow) {
    var map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
}

function show(category) {
  var list = [];
  for (var i=0; i<markers.length; i++) {
    if (markers[i].category == category) {
      markers[i].setMap(map);
      markers[i].setAnimation(google.maps.Animation.DROP); //add back the animation 
      list.push(markers[i]);
    }
  }
   document.getElementById(category+"Box").checked = true;
   if (category == "sevaMentee") {
    clusterMentee(list);
  } else if (category == "sevaPartner") {
    clusterPartner(list);
  }
}

function hide(category) {
  for (var i=0; i<markers.length; i++) {
    if (markers[i].category == category) {
      markers[i].setMap(null); //loses animation 
    }
  }
  // == clear the checkbox ==
  document.getElementById(category+"Box").checked = false;
  // == close the info window, in case its open on a marker that we just hid
  if (prevWindow) {
    prevWindow.close();
    prevWindow = false;
    iwclose();
  }
  if (category == "sevaMentee") {
    menteeClusterer.clearMarkers();
  } else if (category == "sevaPartner") {
    partnerClusterer.clearMarkers();
  }
}

function boxclick(box,category) {
  if (box.checked) {
    show(category);
  } else {
    hide(category);
  }
}

function clusterMentee(list) {
  menteeClusterer = new MarkerClusterer(map, list, {
    maxZoom: 10,
    gridSize: 40, //the proximity required to cluster 
    styles: [{
     anchor1:[13,21], //seperate anchors for various digits 
     anchor2: [13,15.5], //[y,x] where top right is [0,0]
     textColor: "white",
     textSize1: 18,
     textSize2: 18,
     height: 52,
     width: 52,
     url: "images/cluster_mentee.png"
    }]
  });
}

function clusterPartner(list) {
    partnerClusterer = new MarkerClusterer(map, list, {
    maxZoom: 10,
    gridSize: 40,
    styles: [{
     anchor1:[13,21],
     anchor2:[13,15.5], //[y,x] where top right is [0,0]
     textColor: "white",
     textSize1: 18, //seperate textSizes for various digits 
     textSize2: 18,
     height: 52, 
     width: 52,
     url: "images/cluster_partner.png"
    }]
  });
}

function responsiveOpen(infoWindow, marker) {
  //responsive design 
  prevWindow = infoWindow;
  prevWindow.close();
  var iwResp = document.getElementById("iw_responsive");
  iwResp.style.display = 'none';
  iwResp.innerHTML="";
  var mode = getOrientation();
  var maxwidth = $(window).width();
  var maxheight = $(window).height();
  if (maxwidth <= 500 && (mode == "Portrait")) { 
     iwResp.innerHTML = infoWindowContent(infoWindow.name, infoWindow.content, infoWindow.image);
     iwResp.style.display = 'block';
     iwResp.className = "portrait_mode";

     $("#iw_responsive").animate({ "margin-left": 0 }, "slow");
  } else if (maxheight <= 400 && (mode == "Landscape")) {
    //change class
    iwResp.innerHTML = infoWindowContent(infoWindow.name, infoWindow.content, infoWindow.image); 
    iwResp.style.display = 'block';
    iwResp.className = "landscape_mode";
      if (document.getElementById("iw_image") == null) {
        $(".landscape_mode #iw_title img").css({'position':'absolute', 'left': '10px'});
      } else {
        $(".landscape_mode #iw_title img").css({'margin-right':'2.5vw'});
      }
    $("#iw_responsive").animate({ "margin-left": 0 }, "slow");
  } else {
    infoWindow.open(map,marker);
  }
  legendClose(); 
  $("#iw_title img").on("click", function() {
        if (prevWindow) {
          prevWindow.close();
          iwclose();
        } 
        prevWindow = false;
  });
}

function legend() { 
      if (expanded = !expanded) {
            $("#legend_landscape .box").animate({ "margin-left": -500 },    "slow");
            document.getElementById("legend_arrow2").src = "images/play-arrow_opt.png";
      } else {
            $("#legend_landscape .box").animate({ "margin-left": 0 }, "slow");
            document.getElementById("legend_arrow2").src = "images/left-arrow_opt.png";
      }
}


function toggleSlider(){
  if (expanded = !expanded) {
            $("#box").slideUp('slow');
            document.getElementById("legend_arrow").src = "images/caret-arrow-up_opt.png";
      } else {
            $("#box").slideDown('slow');
            document.getElementById("legend_arrow").src = "images/sort-down_opt.png";
      }
}

 function getOrientation(){
    var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
    return orientation;
}

function legendClose() {
  if (getOrientation() == "Portrait") {
    $("#box").slideUp('slow');
  } else {
     $("#legend_landscape .box").animate({ "margin-left": -500 },    "slow");
  }
  expanded = true;
}

function iwclose(){
  $("#iw_responsive").animate({ "margin-left": -1000 },    "slow");
  setTimeout(function(){$("#iw_responsive").hide();}, 1000);
}
