
		var geoJson;
		var basketGroup = L.featureGroup();
		basketGroup.addTo(map);
		var basketId= 0;
		
		function clearDisplayedMaps() {
			if(map.hasLayer(geoJson)) {
				map.removeLayer(geoJson);
				geoJson.eachLayer(function (layer) {
					map.removeLayer(layer.tileLayer);
				});
			}
			if(map.hasLayer(test)) {
				test.eachLayer(function (layer) {
					map.removeLayer(layer.tileLayer);
				});
				map.removeLayer(test);
			}

		}
		function addAreaGeoJsonData(area) {	
			clearDisplayedMaps();
			geoJson =  L.geoJson(area, {
				style: areaStyle
			});
			
			geoJson.eachLayer(function (layer) {
				layer.name = layer.feature.properties.name;
				layer.predefined = true;
				layer.tileLayer = L.TileLayer.boundaryCanvas(osmUrl, {
	    			boundary: layer.getLatLngs(), 
	    			attribution: osmAttribution,
	    			minZoom: 8
				});
				
				if(!map.hasLayer(layer.tileLayer)) {
					layer.tileLayer.addTo(map);
				}
				
			});

			geoJson.addTo(map);
			map.fitBounds(geoJson.getBounds());
			map.zoomIn();
		}
		var test =  L.geoJson();
		function addAreaGeoJsonOrder(area) {	
			
			
			map.removeLayer(test);
			test =  L.geoJson(area, {
				style: myStyle
			});
			
			test.eachLayer(function (layer) {
				layer.name = layer.feature.properties.name;
				layer.predefined = true;
				osmUrl = 'tiles/'+layer.feature.properties.area+'/{z}_{x}_{y}.png';
				
				
				
			});
			listMapsShown();
			test.addTo(map);
			test.bringToFront();
			map.fitBounds(test.getBounds());
			
		}
		var tilesLoaded = [];
		
		var tempJson = L.geoJson();
		function addOkartTiles(areaid) {
			
			var tileUrl = 'tiles/'+areaid+'/{z}_{x}_{y}.png';
			$.get('php/sql2geojson.php?id='+areaid, function (data) {
			     tempJson = L.geoJson(geoarea);
			  }, "script");
			tempJson.addTo(map);
			tempJson.eachLayer(function (layer) {
				alert(layer.getLatLngs());
			});
			tempJson.getBounds();
			
		}
		
		function closeOrderInfoAndMap() {
			$("#mapRow").removeClass("row-fluid");
			$("#orderInfoRow").removeClass("row-fluid");
			$("#mapRow").addClass("hidden");
			$("#orderInfoRow").addClass("hidden");
		}
		function openOrderInfoAndMap() {
			$("#mapRow").addClass("row-fluid");
			$("#mapRow").addClass("mapRow");
			$("#mapRow").removeClass("hidden");
			$("#orderInfoRow").addClass("row-fluid");
			$("#orderInfoRow").removeClass("hidden");
			map.invalidateSize();
			

		}
		currentSelectedLayer = null;
		function listMapsShown() {
			var head = document.createElement("h4");
			head.innerHTML = "Kart:"
			var mapLists = $("#maps");
			mapLists.html(' ');
			mapLists.append(head);
			test.eachLayer(function (layer) {
				var par = document.createElement("p");
				var link = document.createElement("a");
				link.href = "javascript:void()";
				link.innerHTML = layer.name;

				link.onclick = function () { 
					if(currentSelectedLayer != null) {
						currentSelectedLayer.setStyle(myStyle);
					}
					currentSelectedLayer = layer;
					map.fitBounds(layer.getBounds()); 
					layer.setStyle(hiStyle); 
				};
				par.appendChild(link);
				mapLists.append(par);


			});

		}
		function archive(id, bool) {
			if(bool) {
				var url = 'php/archive.php?id='+id;
			} else {
				
				var url = 'php/archive.php?restore=1&id='+id;
			
			}
			$.get(url);
			$("#orderRow"+id).remove();
			closeOrderInfoAndMap();
		}
		
		function addTiles(areaid) {
			var tileUrl = 'tiles/'+areaid+'/{z}_{x}_{y}.png';
			
			$.get('php/sql2geojson.php?id='+areaid, function (data) {
			     var geoJsons = L.geoJson(geoarea);
			     geoJsons.eachLayer(function (layer) {
					    L.TileLayer.boundaryCanvas(tileUrl, {
		    			boundary: layer.getLatLngs(), 
		    			attribution: osmAttribution
						}).addTo(map);
			     });
			  }, "script");
			
			
			
			
		}
		
		function displayAllTiles() {
			
			$.getJSON('php/areas.php', function (data) {
				for (var i = 0; i < data.areas.length; i++) {
					data.areas[i];
					addTiles(data.areas[i]);
	
				};

			});
		}
		displayAllTiles();
		function displayOrderData(orderid) {
			var info = orderInfo[orderid];
			if(document.location.search.indexOf("archive=1")>-1) {
				var bool = false;
			}
			else {
				var bool = true;
			}
			$("#finishButton").click(function () {
				archive(orderid, bool);
			});
			$("#name").html(info[2]);
			$("#adress").html(info[3]);
			$("#post").html(info[4]+" "+info[5]);
			$("#email").html(info[6]);
			$("#tel").html(info[7]);
			$("#club").html(info[8]);
			$("#rundate").html(info[9]);

		}
		function addToBasket(layer) {
			drawnItems.removeLayer(layer);
			basketGroup.addLayer(layer);
			map.addLayer(layer.tileLayer);
			layer.closePopup();
			layer.basketId=basketId++;
			var lastItem= $("#basketControls");
			var newLink = document.createElement("a");
			newLink.href = "javascript:void()";
			newLink.onclick = function() {
				showLayer(layer);
			};
			newLink.id =  "basketLayerLink-"+layer.basketId;
			newLink.innerHTML = layer.name;
			var deleteLink = document.createElement("a");
			deleteLink.href = "javascript:void()";
			deleteLink.onclick = function() {
				removeLayer(layer);
			};
			deleteLink.id =  "basketDeleteLayerLink-"+layer.basketId;
			deleteLink.innerHTML = "x";
			lastItem.prepend(newLink);
			$("#mapList").after(createMapDivs(layer));
			var popupContent = "<h4 class=\"mapTitle\">"+
						layer.name + "</h4><a href=\"javascript:void()\" onclick=\"removeFromBasket(currentSelectedLayer)\">Fjern fra kurv</a>";
			layer.bindPopup(popupContent);

		}
		function showLayer(layer) {
			if(!map.hasLayer(layer)) {
				layer.addTo(map);
				if(!map.hasLayer(layer.tileLayer)) {
					layer.tileLayer.addTo(map);
				}
			}

			
			map.fitBounds(layer.getBounds());
		}
		function createMapDivs(layer) {
			/*
		<div class="row-fluid">
            <div class="span11">
              <p><a href="">Egendefinert 1</a></p>
            </div>
            <div class="span1">
              <p><a href="">Slett</a></p>
            </div>
        </div>
			*/
			var row = document.createElement("div");
			row.id = "orderMapRow-"+layer.basketId;
			row.className = "row-fluid";
			var col1 = document.createElement("div");
			col1.className = "span11";
			var col2 = document.createElement("div");
			col2.className = "span1";
			var mapLink = document.createElement("a");
			mapLink.innerHTML = layer.name;
			mapLink.href = "javascript:void()";
			mapLink.onclick = function () {
				showLayer(layer);
			};
			var deleteLink = document.createElement("a");
			deleteLink.innerHTML = "Slett";
			deleteLink.href = "javascript:void()";
			deleteLink.onclick = function () {
				removeFromBasket(layer);
			};
			var theForm = document.forms['submitOrder'];
			var nameInput = document.createElement("input");
			nameInput.name = "mapNames[]";
			nameInput.value = layer.name;
			nameInput.type = "hidden";
			theForm.appendChild(nameInput);
			var areaInput = document.createElement("input");
			areaInput.name = "mapAreas[]";
			areaInput.value = layer.areaId;
			areaInput.type = "hidden";
			theForm.appendChild(areaInput);
			var polygonInput = document.createElement("input");
			polygonInput.name = "mapPolygons[]";
			polygonInput.value = latLngsToMysqlString(layer.getLatLngs());
			polygonInput.type = "hidden";
			theForm.appendChild(polygonInput);

			var par1 = document.createElement("p");
			par1.appendChild(mapLink);
			var par2 = document.createElement("p");
			par2.appendChild(deleteLink);
			col1.appendChild(par1);
			col2.appendChild(par2);
			row.appendChild(col1);
			row.appendChild(col2);
			return row;


		}
		function removeFromBasket(layer) {
			$("#basketLayerLink-"+layer.basketId).remove();
			$("#orderMapRow-"+layer.basketId).remove();
			basketGroup.removeLayer(layer);
			map.removeLayer(layer.tileLayer)
			layer.closePopup();
			map.removeLayer(layer);
		}
		var areaId;
		function retriveGeoJsonArea(id) {
			osmUrl = 'tiles/'+id+'/{z}_{x}_{y}.png';
			$.get('php/sql2geojson.php?id='+id, function (data) {
			     addAreaGeoJsonData(geoarea);
			  }, "script");
			
		}
		function retriveGeoJsonOrders(id) {
			openOrderInfoAndMap();
			displayOrderData(id);
			$.get('php/order2geojson.php?type=order&id='+id, function (data) {
			     addAreaGeoJsonOrder(geoarea);
			  }, "script");
			
		}
		var orderInfo = [];
		map.on('draw:created', function (e) {
			var type = e.layerType,
				layer = e.layer;
			layer.setStyle(myStyle);
			layer.areaId = areaId;
			drawnItems.addLayer(layer);
			layer.predefined = false;
			layer.tileLayer = L.TileLayer.boundaryCanvas(osmUrl, {
    			boundary: layer.getLatLngs(), 
    			attribution: osmAttribution
			});
			layer.on("mouseover", function (e) {
					layer.setStyle(hiStyle);

				});
			layer.on("mouseout", function (e) {
					layer.setStyle(myStyle);

				});
			layer.on("click", function (e) {
					drawnItemToGeoJsonFeature(layer);
					currentSelectedLayer = layer;
			});
			drawnItemsCounter++;
			layer.name = "Egendefinert "+drawnItemsCounter;
			var popupContent = "<h4 class=\"mapTitle\">"+
						layer.name + "</h4><a href=\"javascript:void()\" onclick=\"deleteDrawnLayer(currentSelectedLayer)\">Slett</a> - <a href=\"javascript:void()\" onclick=\"addToBasket(currentSelectedLayer)\">Legg i kurv</a>";

			
			layer.bindPopup(popupContent);
		});
		function deleteDrawnLayer(layer) {
			map.removeLayer(layer.tileLayer);
			drawnItems.removeLayer(layer);
		}
		function showOrders() {
			basketGroup.addTo(map);
			basketGroup.eachLayer(function (layer) {
				if(!map.hasLayer(layer.tileLayer)) {
					layer.tileLayer.addTo(map);
				}
				layer.tileLayer.redraw();
				var popupContent = "<h4 class=\"mapTitle\">"+
						layer.name + "</h4><a href=\"javascript:void()\" onclick=\"removeFromBasket(currentSelectedLayer)\">Remove from basket</a>";
				
				layer.bindPopup(popupContent);

			});
			map.fitBounds(basketGroup.getBounds());


		}

		function emptyBasket() {
			basketGroup.eachLayer(function (layer) {
				map.removeLayer(layer.tileLayer);
				removeFromBasket(layer);
			});
			basketGroup.clearLayers();


		}
		function showOrderForm() {
			var mapContainer = $("#mapContainer");
			var orderForm = $("#orderFormContainer");
			var menus = $("#menus");
			menus.removeClass("span2");
			menus.addClass("hidden");
			mapContainer.removeClass("span10");
			mapContainer.addClass("span6");
			orderForm.removeClass("hidden");
			orderForm.addClass("span6");
			map.invalidateSize();
			showOrders();


		}
		function closeOrderForm() {
			var mapContainer = $("#mapContainer");
			var orderForm = $("#orderFormContainer");
			var menus = $("#menus");
			menus.addClass("span2");
			menus.removeClass("hidden");
			mapContainer.addClass("span10");
			mapContainer.removeClass("span6");
			orderForm.addClass("hidden");
			orderForm.removeClass("span6");
			map.invalidateSize();
			
		}
	
