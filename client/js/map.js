var googleMap;
var googleMapMarkers = [];
var openInfoWindow;

function initialize() {
	var mapOptions = {
		center: {
			lat: 29.9657894,
			lng: -90.0993333
		},
		zoom: 11,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	};
	googleMap = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);

// string that will show as marker tooltip
function titleForMarker(dataElement) {
	return "Type: "+dataElement.typetext;
}

function imageForMarker(dataElement) {
    if(dataElement.typetext === 'DISCHARGING FIREARMS'){
        return 'https://raw.githubusercontent.com/joelcarranza/summerware-pre-release/master/client/img/weapons%20icon.png';
    } 
    else if(dataElement.typetext === 'COMPLAINT OTHER'){
        return 'https://raw.githubusercontent.com/joelcarranza/summerware-pre-release/master/client/img/disturbing-the-peace%20icon.png';
    }
    else if (dataElement.typetext === 'BURGLAR ALARM'){
        return 'https://raw.githubusercontent.com/joelcarranza/summerware-pre-release/master/client/img/burglary%20icon.png';
    }
    else if (dataElement.typetext === 'DISTURBANCE (OTHER)'){
        return 'https://raw.githubusercontent.com/joelcarranza/summerware-pre-release/master/client/img/disturbing-the-peace%20icon.png';
    }
    else if (dataElement.typetext === 'AUTO ACCIDENT'){
        return 'https://raw.githubusercontent.com/joelcarranza/summerware-pre-release/master/client/img/vehicle-break-in-theft%20icon.png';
    }
    else if (dataElement.typetext === 'TRAFFIC INCIDENT'){
        return 'https://raw.githubusercontent.com/joelcarranza/summerware-pre-release/master/client/img/vehicle-break-in-theft%20icon.png';
    }
    else if (dataElement.typetext === 'FIREWORKS'){
        return 'https://cdn0.iconfinder.com/data/icons/fatcow/32/dynamite.png';
    }
    else if (dataElement.typetext === 'FUGITIVE ATTTACHMENT'){
        return 'https://cdn3.iconfinder.com/data/icons/pidginsmilies/handcuffs.png';
    }
    else if (dataElement.typetext === 'MUNICIPAL ATTTACHMEN'){
        return 'http://cdns2.freepik.com/free-photo/handcuffs-silhouette-detailed-icon-vector_91-8549.jpg';
    }
}
// HTML string that will show on marker click
function contentForMarker(dataElement) {
	return '<div id="content">'+
	'<b>Type of offense: </b>'+
	
	dataElement.typetext+
	"<br>"+
	'<b>Time dispatched:</b> '+
	dataElement.timedispatch+
	"<br>"+
  '<b>Time closed:</b> '+
	dataElement.timeclosed+
	"<br>"+
  '<b>Zip Code:</b> '+
  dataElement.zip+
	   "<br>"+
	   
		'</div>';
}
function showDataOnMap(data) {
	if (!googleMap) {
		window.alert("Google Maps has not loaded yet!");
		return;
	}
	if (!data) {
		window.alert("No data returned");
		return;
	}
	if (data.length === 0) {
		window.alert("No results from query!");
		return;
	}

	// reset map results
	googleMapMarkers.forEach(function(marker) {
		marker.setMap(null);
	});

	// loop over all elements in data and create map marker for each one
	data.forEach(function(info) {
		var latitude = parseFloat(info['latitude']);
		var longitude = parseFloat(info['longitude']);
		if (latitude && longitude) {
			var location = new google.maps.LatLng(latitude, longitude);

			var contentString = contentForMarker(info);

			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			var marker = new google.maps.Marker({
				position: location,
				map: googleMap,
				icon: imageForMarker(info),
				title: titleForMarker(info)
			});
			google.maps.event.addListener(marker, 'click', function() {
				if (openInfoWindow) {
					openInfoWindow.close();
				}
				infowindow.open(googleMap, marker);
				openInfoWindow = infowindow;
			});
			googleMapMarkers.push(marker);
		}
	});
}

var kmlLayer;

/*
 * Display KML file 
 */
function showKMLFile(url) {
	var urlPrefix = 'https://raw.githubusercontent.com/joelcarranza/summerware-pre-release/master/kml/';
	if(!url.startsWith('http')) {
		url = urlPrefix + url;
	}
	if(kmlLayer) {
		kmlLayer.setMap(null);
	}
	kmlLayer = new google.maps.KmlLayer({
		url: url,
		map: googleMap,
		preserveViewport: true
	});
}