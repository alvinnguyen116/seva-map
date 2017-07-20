/*GLOBAL VARIABLES*/
var map; 
var markers;
var curr_markers = [];
var filters = [];
var bounds;
var prevWindow = false; //prevent multiple infoWindows 
var prevFilter = false; 
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var menteeClusterer;
var partnerClusterer;
var expanded = true;
var expanded_help = false;
var expanded_filter = false;  
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








/*INITIALIZING MAP*/
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
    zoom: 8,
    center:  new google.maps.LatLng(-34.397, 150.644),
    disableDefaultUI: true,
    mapTypeControlOptions: {mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']}
  });
  map.mapTypes.set('styled_map', styledMapType); //https://developers.google.com/maps/documentation/javascript/styling
  map.setMapTypeId('styled_map'); 

  map.setOptions({ minZoom: 1, maxZoom: 10 });


  // fetch('SEVA_Locations.json') //http://mygeoposition.com/ 
  // .then(function(response){return response.json();})
  // .then(plotMarkers);


  var xmlhttp;
  if (window.XMLHttpRequest) {
      // code for modern browsers
      xmlhttp = new XMLHttpRequest();
   } else {
      // code for old IE browsers
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200)
      {
        if (this.responseText)
         {
      var myArr = JSON.parse(this.responseText);
      plotMarkers(myArr);
    }
  }
  };
  xmlhttp.open("GET", "data/SEVA_Locations.json", true);
  xmlhttp.send();


  google.maps.event.addListener(map, "mousedown", function() { //closes infoWindows automatically 
    if (prevWindow) {
      // prevWindow.close();
      iwclose();
    } 
    if (expanded_help) {
      help_close();
    }
    if (expanded_filter) {
      filtersClose();
    }

  });

  
  menteeClusterer = new MarkerClusterer(map, []);
  partnerClusterer = new MarkerClusterer(map, []);
  window.addEventListener("resize", temp, true);
  window.addEventListener("orientationchange", temp);

  function temp() {
    initLegend();
    help_close();
  }

  function initLegend(){
    if (prevWindow) {
      responsiveOpen(prevWindow);
    }
    if (getOrientation() == "Portrait") {
      $("#legendBtn").css("display","none"); 
      $("#toggleSliderBtn").css("display", "block");
      $(".legend .box").css("margin-left" , 1); //slides out 
      $(".legend").css('width','auto'); //undo landscape style 
      if (expanded) {
        // $("#box").slideUp('slow');
        $("#box").animate({
          "height": 0
        }, 500);

        $("#change_arr").css({" -ms-transform ": "rotate(-90deg)", "-webkit-transform" : "rotate(-90deg)", "transform" : "rotate(-90deg)"});
      } else {
        // $("#box").slideDown('slow');

        $("#box").animate({
          "height": "100%"
        }, 500);

        $("#change_arr").css({" -ms-transform ": "rotate(90deg)", "-webkit-transform" : "rotate(90deg)", "transform" : "rotate(90deg)"});
      }
    } else {
      $("#legendBtn").css("display","block");
      $("#toggleSliderBtn").css("display", "none");
      $("#box").css("display" , "block");
      if (expanded) {
            $("#box").animate({ "margin-left": -380},    "slow");
            $(".legend").animate({ "width": "auto"}, "slow");
            $("#change_arrow").css({"right": 7});
            document.getElementById("change_arrow").innerHTML = "&#187;";
      } else {
            $("#box").animate({ "margin-left": 1 }, "slow");
            $(".legend").animate({"width": 440}, "slow");
            $("#change_arrow").css({"right": 9});
            document.getElementById("change_arrow").innerHTML = "&#171;";
      }
    }
  }

   var iwResp = document.getElementById('iw_responsive');
   map.controls[google.maps.ControlPosition.TOP_CENTER].push(iwResp); //arbitrary, will move later with !important 
   initLegend();
   initFilters();
   var map_intro = document.getElementById("map_intro");
   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(map_intro);
   var legend_help = document.getElementById("legend_help");
   map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend_help);
   var map_filters = document.getElementById("map_filters");
   map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(map_filters);
}







/*PLOT AND FILTER MARKERS*/
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
    var infoWindow = [];
    infoWindow.name = marker.name;
    infoWindow.content = marker.description;
    infoWindow.image = marker.image;
    newMarker.keyword = marker.keyword; 
    newMarker.addListener('click', function() {
      responsiveOpen(infoWindow);
      map.setOptions({ scrollwheel: false }); //enables text scrolling 
    });
    markers.push(newMarker); 
    bounds.extend(position);
  });
  map.fitBounds(bounds);

  var legend = document.getElementById('legend'); //legend 
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

  showAll();
}

function infoWindowContent(name, content, image) {
  var width = $(window).width();
  var height = $(window).height();
  if (image == "") {
    if ((width <= 850) && (height <= 850)) {
      return "<div id='iw_container'> <div id='iw_title'><img src='images/left-arrow_phone.png' alt='left-arrow'></img><span>" + name + "</span></div><div id='iw_content'>" + content + "</div><div class='iw-bottom-gradient'></div></div>"; //styling purposes 
    }
    return "<div id='iw_container'> <div id='iw_title'><img src='images/left-arrow.png' alt='left-arrow'></img><span>" + name + "</span></div><div id='iw_content'>" + content + "</div><div class='iw-bottom-gradient'></div></div>"; //styling purposes 
  } else {
    if ((width <= 850) && (height <= 850)) {
      return "<div id='iw_container'> <div id='iw_image' style='background-image: url(" + image + ");'></div>"
    + "<div id='iw_title'><img src='images/left-arrow_phone.png' alt='left-arrow'></img><span>" + name + "</span></div><div id='iw_content'>" + content + "</div><div class='iw-bottom-gradient'></div></div>";
    }
    return "<div id='iw_container'> <div id='iw_image' style='background-image: url(" + image + ");'></div>"
    + "<div id='iw_title'><img src='images/left-arrow.png' alt='left-arrow'></img><span>" + name + "</span></div><div id='iw_content'>" + content + "</div><div class='iw-bottom-gradient'></div></div>";
  } 
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
    iwclose();
  }
  if (category == "sevaMentee") {
    menteeClusterer.clearMarkers();
  } else if (category == "sevaPartner") {
    partnerClusterer.clearMarkers();
  }
}

function boxclick(box,category) {
  if (prevFilter) {
    filter_hide(prevFilter);
  } 
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
     url: "images/cluster_mentee.png",
     ignoreHidden: true
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





/*HELPER FUNCTIONS*/
function responsiveOpen(infoWindow) {
  //responsive design
  if (prevWindow && (prevWindow != infoWindow)) {
        iwclose();
        window.setTimeout(function(){responsiveOpenHelper(infoWindow)},500);
  } else if (prevWindow === infoWindow) {
    iwclose();
  }
  else {
    window.setTimeout(function(){responsiveOpenHelper(infoWindow)},500);
  }
}

function responsiveOpenHelper(infoWindow) {
  prevWindow = infoWindow;
  var iwResp = document.getElementById("iw_responsive");
  iwResp.innerHTML = infoWindowContent(infoWindow.name, infoWindow.content, infoWindow.image);
  var height = parseInt($("#map").css("height"),10)/3;
  $("#iw_content").css("max-height", height);
  $("#iw_responsive").animate({ "margin-left": 1 }, 750);
  $("#iw_title img").on("click", function() {
    if (prevWindow) {
      iwclose();
    } 
    map.setOptions({ scrollwheel: true }); //re-enables scrolling 
  });
}

function legend() { //toggles legend horizontally 
      if (expanded = !expanded) {
            $("#box").animate({ "margin-left": -380 },    "slow");
            $(".legend").css({ "width": "auto"});
            $("#change_arrow").css({"right": 7});
            document.getElementById("change_arrow").innerHTML = "&#187;";
            help_close();
      } else {
            $("#box").animate({ "margin-left": 1 }, "slow");
            $(".legend").animate({ "width": 440}, "slow");
            $("#change_arrow").css({"right": 9});
            document.getElementById("change_arrow").innerHTML = "&#171;";
      }
}


function toggleSlider(){ //toggles legend vertically 
  $("#box").css("margin-left" , "1"); //fix from landscape mode 
  if (expanded = !expanded) {
    // $("#box").slideUp('slow');

    $("#box").animate({
          "height": 0
        }, 500);
        
    $("#change_arr").css({" -ms-transform ": "rotate(-90deg)", "-webkit-transform" : "rotate(-90deg)", "transform" : "rotate(-90deg)"});
    help_close();
  } else {
    // $("#box").slideDown('slow');
    $("#box").animate({
          "height": "80px"
        }, 500);
    $("#change_arr").css({" -ms-transform ": "rotate(90deg)", "-webkit-transform" : "rotate(90deg)", "transform" : "rotate(90deg)"});
  }
}

 function getOrientation(){
    var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
    return orientation;
}

function iwclose(){ //closes info Windows 
  prevWindow = false;
  var max = 0;
  if (getOrientation() == "Portrait") {
    max = $(window).height();
  } else {
    max = $(window).width();
  }
  $("#iw_responsive").animate({ "margin-left": -1.5*max }, "slow");
  map.setOptions({scrollwheel: true}); //re-enalbes scrolling 
}

function readTextFile(file, display)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                display.innerHTML = allText; 
            }
        }
    }
    rawFile.send();
}

function display_file(file, name) {
  if (!expanded_help) {
    help_open();
    readTextFile(file,document.getElementById("legend_help"));
    expanded_help = name;
  } else if (name == expanded_help) {
    help_close();
  } else {
    readTextFile(file,document.getElementById("legend_help"));
    expanded_help = name;
  }
}

function help_open() {
  if (getOrientation() == "Landscape") {
    $("#legend_help").css({"height": "0", "width": "416px"});
    $("#legend_help").animate({
        'height': '70px',
        'opacity': '1'
    }, 400);
  } else {
    $("#legend_help").css({"height": "86px", "width": "0"});
    $("#legend_help").animate({
        'width': '160px',
        'opacity': '1'
    }, 400);
  }
}

function help_close() {
  if (getOrientation() == "Landscape") {
    $("#legend_help").animate({
      'opacity': '0',
      'height': '0'
    }, 500);
  } else {
    $("#legend_help").animate({
      'opacity': '0',
      'width': '0'
    }, 500);
  }
  expanded_help = false;
}

function startFilter() {
  if (!expanded_filter) {
    expanded_filter = true; 
    $("#map_filters").animate({"opacity": 1}, "slow");
  } else {
    filtersClose();
  }
}

function filtersClose() {
    expanded_filter = false; 
    $("#map_filters").animate({'opacity': 0}, "slow");
}


function initFilters() {
 var rawFile = new XMLHttpRequest();
 rawFile.open("GET", "data/map_filters.txt", true);
 rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              var allText = rawFile.responseText;
              initFilterHelper(allText);
          }
      }
  }
  rawFile.send();
}

function initFilterHelper(allText) {
  var list_filter = allText.split(",");
  var innerHTML = "<ul>"; 
  list_filter.forEach(function(filter) {
      var id = filter.replace(/\s/g,'');
        id = id.toLowerCase();
      innerHTML += "<li id='" + id +  "Box' onclick= \"filter('" + id + "')\">" + filter + "</li>";
      filters.push(id + "Box");
  });
  innerHTML += "</ul>";
  var ul = document.getElementById("map_filters");
  ul.innerHTML = innerHTML;
  // var filters = Array.from(ul.children());
  // filters.forEach(function(filter){ 
  //   filter.checked = false;
  // });
}

function filter(keyword) {
  if (prevFilter) {
    $("#" + prevFilter + 'Box').toggleClass("lightgrey");
  }
  prevFilter = keyword;
  filter_show(keyword);
}

function intoArray(string) {
  var retArray = [];
  words = string.split(",");
  words.forEach(function(word){
    retArray.push((word.replace(/\s/g,'')).toLowerCase());
  });
  return retArray;
}

function filter_show(keyword) {
  hideAll();
  var mentee = [];
  var partner = [];
  for (var i=0; i<markers.length; i++) {
    if (contains_key(markers[i], keyword)) {
      markers[i].setMap(map);
      markers[i].setAnimation(google.maps.Animation.DROP); //add back the animation 
      curr_markers.push(markers[i]);
      if (markers[i].category == "sevaPartner") {
        partner.push(markers[i]);
      } else if (markers[i].category == "sevaMentee") {
        mentee.push(markers[i]);
      }
    }
  }
  clusterMentee(mentee);
  clusterPartner(partner);
  $("#" + keyword + 'Box').toggleClass("lightgrey");
}

function filter_hide(keyword) {
  for (var i=0; i < curr_markers.length; i++) {
    curr_markers[i].setMap(null); //loses animation 
  }
  curr_markers = [];
  // == clear the checkbox ==
  $("#" + keyword + 'Box').toggleClass("lightgrey");
  prevFilter = false;
  // == close the info window, in case its open on a marker that we just hid
  if (prevWindow) {
    iwclose();
  }
  menteeClusterer.clearMarkers();
  partnerClusterer.clearMarkers();
}

function contains_key(marker, keyword) {
  var value = false;
  if (marker.keyword) {
    var allText = intoArray(marker.keyword);
    allText.forEach(function(word) {
      
      if (word === keyword) {
          value = true;
      }
    });
  }
  return value;
}

function showAll() {
  show("sevaOffice");
  show("sevaMentee");
  show("sevaPartner");
}

function hideAll() {
  hide("sevaOffice");
  hide("sevaMentee");
  hide("sevaPartner");
}
