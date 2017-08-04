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
  var expanded = false; //automatically closes
  var expanded_help = false;
  var expanded_filter = false;  
  var icons = {
        sevaOffice: {
          name: "Seva Office",
          icon: 'images/map/seva_office.png' //must change if directory changes 
        },
        sevaPartner: {
          name: "Seva Partner",
          icon: 'images/map/seva_partner.png'
        },
        sevaMentee: {
          name: "Seva Mentee",
          icon: 'images/map/seva_mentee.png'
        }
    };








  /*INITIALIZING MAP*/
  document.addEventListener('DOMContentLoaded', function () { //https://www.sitepoint.com/google-maps-javascript-api-the-right-way/ 
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
    //https://mapstyle.withgoogle.com/ : colors the map 
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
      disableDefaultUI: false,
      mapTypeControlOptions: {mapTypeIds: ['roadmap', 'satellite', 'styled_map']}
    });
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map'); 
    map.setOptions({ minZoom: 0, maxZoom: 10 }); //lower # is how close, higher # is how far 



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
    xmlhttp.open("GET", "data/SEVA_Locations.json", true); //change if directory changes 
    xmlhttp.send();


    google.maps.event.addListener(map, "mousedown", function() { //closes automatically 
      if (prevWindow) {
        iwclose();
      } 
      if (expanded_help) {
        help_close();
      }
    });

    
    menteeClusterer = new MarkerClusterer(map, []);
    partnerClusterer = new MarkerClusterer(map, []);
    window.addEventListener("resize", initLegend, true);

    function initLegend() {
      if (getOrientation() == "Portrait") {
        $("#legendBtn").css("display","none"); 
        $("#toggleSliderBtn").css("display", "block");
        $(".legend .box").css("margin-left" , "1px"); //slides out 
        $("#legend").css('width', '154px'); //undo landscape style 
        if (expanded) {
          $(".legend").css({"max-height": "29px"});
          $("#box").css({
                "height": "0"
              });
          $("#change_arr").css({" -ms-transform ": "rotate(-90deg)", "-webkit-transform" : "rotate(-90deg)", "transform" : "rotate(-90deg)"});
        } else {
          $(".legend").css({"max-height": "109px"});
          $(".legend").css({"height": "109px"});
          $("#box").css({ "height": "80px"});
          $("#change_arr").css({" -ms-transform ": "rotate(90deg)", "-webkit-transform" : "rotate(90deg)", "transform" : "rotate(90deg)"});
        }
      } else {
        $(".legend").css("height", "29px"); //undo portrait css 
        $("#legendBtn").css("display","block");
        $("#toggleSliderBtn").css("display", "none");
        $("#box").css("display" , "block");
        if (expanded) {
              $("#box").css({ "margin-left": "-380px"});
              $(".legend").css({ "width": "auto"});
              document.getElementById("legendBtn").innerHTML = "Legend &#187;";
        } else {
              $(".legend").css({"width": "450px"});
              $("#box").css({ "margin-left": "1px"});
              $("#legendBtn").css({"padding": "3px"});
              document.getElementById("legendBtn").innerHTML = "Legend &#171;";
        }
      }

      if (getOrientation() == "Portrait") { //in case of resizing, legend helpers will also change  
        $("#legend_help").css({"height": "109px", "width": "160px"});
      } else {
        $("#legend_help").css({"height": "70px", "width": "450px"})
      }

    }

    function unHidden() { 
      $("#map_intro").removeClass("hidden");
      $("#legend_help").removeClass("hidden");
      $("#legend").removeClass("hidden");
    }

     var iwResp = document.getElementById('iw_responsive');
     map.controls[google.maps.ControlPosition.TOP_CENTER].push(iwResp); //arbitrary, will move later with !important 
     
     initLegend(); //initialization functions 
     initFilters();
     
     var map_intro = document.getElementById("map_intro"); //filters
     map.controls[google.maps.ControlPosition.TOP_RIGHT].push(map_intro);
     var map_filters = document.getElementById("map_filters");
     map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(map_filters);

     var legend_help = document.getElementById("legend_help"); //legend
     map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend_help);
     var legend = document.getElementById('legend');
     map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

     window.setTimeout(function(){unHidden()}, 1000); //prevents div elements from loading before map 
  }

  /*PLOT AND FILTER MARKERS FROM JSON*/
  function plotMarkers(m)
  {
    markers = []; // array for clustering 
    bounds = new google.maps.LatLngBounds();

    m.forEach(function (marker) {
      var position = new google.maps.LatLng(marker.lat, marker.lng);
      var newMarker = new google.maps.Marker({
          position: position,
          icon: icons[marker.type].icon,
          category: marker.type,
          animation: google.maps.Animation.DROP
        });
      var infoWindow = [];
      infoWindow.category = marker.type;
      infoWindow.name = marker.name;
      infoWindow.content = marker.description;
      infoWindow.image = marker.image;
      newMarker.keyword = marker.keyword; 
      newMarker.addListener('click', function() {
        map.setOptions({'scrollwheel': false }); //enables text scrolling 
        responsiveOpen(infoWindow);
      });
      markers.push(newMarker); 
      bounds.extend(position);
    });
    map.fitBounds(bounds); //recenters the map according to markers 
    showAll();
  }











  /*onclick functions*/
  function boxclick(box,category) {
    if (prevFilter) {
      if (prevFilter != 'all') {
        filter_hide(prevFilter);
      } else {
        $("#allBox").toggleClass("lightgrey");
      }
      prevFilter = false;
    } 
    if (box.checked) {
      show(category);
    } else {
      hide(category);

    }
  }

  function show(category) {
    var list = [];
    for (var i=0; i<markers.length; i++) {
      if (markers[i].category == category) {
        markers[i].setMap(map);

        markers[i].setAnimation(google.maps.Animation.DROP); //adds back the drop animation 
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
      if (markers[i].category === category) {
        markers[i].setMap(null); //loses animation 
      }
    }
    // == clear the checkbox ==
    document.getElementById(category+"Box").checked = false;
    // == close the info window, in case its open on a marker that we just hid
    if (prevWindow) {
      iwclose();
    }
    if (category === "sevaMentee") {
      menteeClusterer.clearMarkers();
    } else if (category === "sevaPartner") {
      partnerClusterer.clearMarkers();
    }
  }

  function responsiveOpen(infoWindow) {
    if (prevWindow && (prevWindow != infoWindow)) {
          iwclose();
          window.setTimeout(function(){responsiveOpenHelper(infoWindow)},500);
    } else if (prevWindow === infoWindow) {
      iwclose();
      map.setOptions({'scrollwheel': true }); //re-enables scrolling 
    }
    else {
      window.setTimeout(function(){responsiveOpenHelper(infoWindow)},500);
    }
  }

  function legend() { //toggles legend horizontally
        $(".legend").css({"height": "29px"}); //undo portrait css 
        $(".legend").css({ "width": ""});
        if (expanded = !expanded) {
              $("#box").animate({ "margin-left": -380},    500);
              document.getElementById("legendBtn").innerHTML = "Legend &#187;";
              help_close();
        } else {
              $("#box").animate({ "margin-left": 1}, 500);
              $("#legendBtn").css({"padding": "3px"});
              document.getElementById("legendBtn").innerHTML = "Legend &#171;";
              window.setTimeout(function(){ $(".legend").css({"width": "450px"}); }, 500);
        }
  }

  function toggleSlider(){ //toggles legend vertically  
    $("#box").css("margin-left" , "1"); //undo landscape css
    if (expanded = !expanded) {
      $(".legend").animate({"max-height": "29px"}, 500);
      $("#box").animate({
            "height": 0
          }, 500);
      $("#change_arr").css({" -ms-transform ": "rotate(-90deg)", "-webkit-transform" : "rotate(-90deg)", "transform" : "rotate(-90deg)"});
      help_close();
    } else {
      $(".legend").animate({"max-height": "109px"}, 400);
      $(".legend").animate({"height": "109px"},500);
      $("#box").animate({
            "height": "80px"
          }, 500);
      $("#change_arr").css({" -ms-transform ": "rotate(90deg)", "-webkit-transform" : "rotate(90deg)", "transform" : "rotate(90deg)"});
    }
  }

  function iwclose() { //closes info Windows 
    prevWindow = false;
    var max = 0;
    if (getOrientation() == "Portrait") {
      max = $(window).height();
    } else {
      max = $(window).width();
    }
    $("#iw_responsive").animate({ "margin-left": -1.5*max }, "slow");
    map.setOptions({'scrollwheel': true}); //re-enables scrolling 
  }

  function display_file(file, name) { //for displaying legend descriptions
    if (!expanded_help) { //not open yet
      help_open();
      readTextFile(file,document.getElementById("legend_help"));
      expanded_help = name;
    } else if (name == expanded_help) { //clicks on the same question mark
      help_close();
    } else {
      readTextFile(file,document.getElementById("legend_help")); //clicks on another question mark
      expanded_help = name;
    }
  }

  function help_open() { //jquery animation for legend helpers
    if (getOrientation() == "Landscape") {
      $("#legend_help").css({"height": "0", "width": "450px"});
      $("#legend_help").animate({
          'height': '70px',
          'opacity': '1'
      }, 400);
    } else {
      $("#legend_help").css({"height": "109px", "width": "0"});
      $("#legend_help").animate({
          'width': '160px',
          'opacity': '1'
      }, 400);
    }
  }

  function help_close() { //jquery animation for legend helpers
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

  function startFilter() { //jquery animation for filters
    $("#map_filters").css("display", "block");
    if (!expanded_filter) {
      expanded_filter = true; 
      $("#map_filters").animate({"opacity": 1}, "slow");
    } else {
      filtersClose();
    }
  }

  function filter(keyword) { //shows only locations with specific 'keyword'
    if (prevFilter) {
      $("#" + prevFilter + 'Box').toggleClass("lightgrey");
    }
    prevFilter = keyword;
    filter_show(keyword);
  }













  /*HELPER FUNCTIONS*/
  function responsiveOpenHelper(infoWindow) {
    prevWindow = infoWindow;
    var iwResp = document.getElementById("iw_responsive");
    iwResp.innerHTML = infoWindowContent(infoWindow.name, infoWindow.content, infoWindow.image);
    $("#iw_responsive").animate({ "margin-left": 1 }, 750);
    $("#iw_close").on("click", function() {
      if (prevWindow) {
        iwclose();
      } 
      map.setOptions({'scrollwheel': true }); //re-enables scrolling 
    });

    //change colors based on category 
    var category = infoWindow.category;
    if (category == "sevaPartner") {
      $("#iw_title").css("background-color","#F0592A");
      $("#iw_close").css("color", "#F0592A");
    } else if (category == "sevaMentee") {
      $("#iw_title").css("background-color", "#5C7949");
      $("#iw_close").css("color", "#5C7949");
    } else {
      $("#iw_title").css("background-color", "#801a50");
      $("#iw_close").css("color", "#801a50");
    }
  }


  function infoWindowContent(name, content, image) {
    if (image == "") {
      return "<div id='iw_container'> <div id='iw_title'><div class='col-xs-2 col-sm-2'><span id='iw_close'>&laquo;</span></div><div class='col-xs-10 col-sm-10'><span id='iw_name'>" + name + "</span></div></div><div id='iw_content'>" + content + "</div><div class='iw-bottom-gradient'></div></div>"; //styling purposes 
    } else {
      return "<div id='iw_container'><div id='iw_image' style='background-image: url(" + image + ");'></div>"
      + "<div id='iw_title'><div class='col-xs-2 col-sm-2'><span id='iw_close'>&laquo;</span></div><div class='col-xs-10 col-sm-10'><span id='iw_name'>" + name + "</span></div></div><div id='iw_content'>" + content + "</div><div class='iw-bottom-gradient'></div></div>";
    } 
  }

  function getOrientation() {
      var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
      return orientation;
  }

  function clusterMentee(list) {
    menteeClusterer = new MarkerClusterer(map, list, {
      maxZoom: 10,
      gridSize: 40, //the proximity required to cluster markers
      styles: [{
       anchor:[0,0],
       textColor: "white",
       textSize: 16,
       height: 39,
       width: 38,
       url: "images/map/cluster_mentee.png",
       otherStyle: 'font-family:Gotham-Bold, Arial; font-weight:bold;' //use this to add custom styles
      }]
    });
  }

  function clusterPartner(list) {
      partnerClusterer = new MarkerClusterer(map, list, {
      maxZoom: 10,
      gridSize: 40,
      styles: [{
       anchor:[0,0],
       textColor: "white",
       textSize: 16, 
       height: 38, 
       width: 38,
       url: "images/map/cluster_partner.png",
       otherStyle: 'font-family:Gotham-Bold, Arial; font-weight:bold;' //use this to add custom styles
      }]
    });
  }

  function readTextFile(file, display) {
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

  function filtersClose() {
      expanded_filter = false; 
      $("#map_filters").animate({'opacity': 0, 'display': 'none'}, "slow");
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
        var id = filter.replace(/\s/g,''); //removes unnecessary whitespaces
          id = id.toLowerCase(); // case-insensitive
        innerHTML += "<li id='" + id +  "Box' onclick= \"filter('" + id + "')\">" + filter + "</li>";
        filters.push(id + "Box");
    });
    innerHTML += "</ul>";
    var ul = document.getElementById("map_filters");
    ul.innerHTML = innerHTML;
  }

  function intoArray(string) { //used in 'contains_key'
    var retArray = [];
    words = string.split(",");
    words.forEach(function(word){
      retArray.push((word.replace(/\s/g,'')).toLowerCase());
    });
    return retArray;
  }

  function filter_show(keyword) {
    hideAll();
    if (keyword === 'all') {
      showAll();
    } else {
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
  }
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

  function contains_key(marker, keyword) { //iterates through each keyword in marker 
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
