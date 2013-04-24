function init(){map.addControl(fullScreen);var e="http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}";var t="http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}";var n=L.tileLayer(e,{attribution:"Map data © Kartverket, Wing OK",key:"BC9A493B41014CAABB98F0471D759707"});n.addTo(map);$.getJSON("php/sql2geojson_test.php",function(e){settings=e.settings;areas=e.areas;maps=e.maps;map.setView([parseFloat(settings.centerLat),parseFloat(settings.centerLong)],parseInt(settings.defaultZoom));displayAllTiles();doRest()})}function drawnItemToGeoJsonFeature(e){var t=e.getLatLngs();var n=[];var r=[];for(var i=t.length-1;i>=0;i--){var s=[];s.push(t[i].lng);s.push(t[i].lat);r.push(s)}n.push(r);var o={type:"Feature",geometry:{type:"Polygon",coordinates:n},properties:{name:e.name,description:e.description}};return o}function latLngsToMysqlString(e){var t="POLYGON((";for(i=e.length-1;i>=0;i--){t+=e[i].lat+" "+e[i].lng+", "}t+=e[e.length-1].lat+" "+e[e.length-1].lng;t+="))";return t}function addTiles(){map.zoomOut();geoJsons=L.geoJson(areas,{style:areaStyle});geoJsons.eachLayer(function(e){var t="tiles/"+e.feature.properties.areaid+"/{z}_{x}_{y}.png";L.TileLayer.boundaryCanvas(t,{boundary:e.getLatLngs(),attribution:osmAttribution,minZoom:10}).addTo(map);e.on("click",function(t){retriveGeoJsonArea(parseInt(e.feature.properties.areaid));map.closePopup()})});geoJsons.addTo(map);map.zoomIn()}function displayAllTiles(){addTiles()}function retriveGeoJsonArea(e){var t=L.featureGroup();geoJsons.eachLayer(function(n){if(e==parseInt(n.feature.properties.areaid)){t.addLayer(n)}});map.fitBounds(t.getBounds());map.closePopup()}var map=L.map("map",{maxZoom:17});var myStyle={color:"#0772a1",weight:2,fillOpacity:0,opacity:1};var areaStyle={color:"#0772a1",weight:1,fillOpacity:0,opacity:.8};var hiStyle={color:"#077271",weight:4,fillOpacity:0,opacity:.8};var clickStyle=hiStyle;var showStyle={color:"#8f04a8",weight:3,fillOpacity:0,opacity:.8};var currentSelectedLayer;var drawnItems=new L.FeatureGroup;map.addLayer(drawnItems);var drawControl=new L.Control.Draw({draw:{position:"topleft",circle:false,marker:false,polyline:false,polygon:{allowIntersection:true,shapeOptions:{color:"#BD63d4"}}},edit:{featureGroup:drawnItems}});var fullScreen=new L.Control.FullScreen;var hash=window.location.hash.substring(1);var settings;var areas;var maps;var osmAttribution="";var geoJsons;var drawnItemsCounter=0;init()