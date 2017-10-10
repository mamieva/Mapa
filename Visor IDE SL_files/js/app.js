//Variables Globales

var proxy = "http://10.78.30.130/proxy/proxy?url=";
var resultados, geodatos;


//Confeccion de mapa
var map = L.map('map', {
	crs: L.CRS.EPSG3857,
	center: [-33.4, -66.3], //Es un objeto lat lon
	zoom: 8,
	minZoom: 8,
	// maxBounds: [
	//  	[-34.08240, -69.21770],
	//  	[-32.65034, -58.29864]
	// ],
	zoomControl: false
});


//Agregar Controles

//Iniciar la barra de zoom
L.control.navbar().addTo(map);

//Inicia el control de box zoom

L.control.zoomBox({
	modal: true,
	title: "Zoom por area"
}).addTo(map);




//control del zoom
L.control.zoom().addTo(map);


// //Medicion de Areas

// //Configuramos el idioma de la herramienta

// //Customizacion de Lenguaje de los elementos
// L.drawLocal.draw.toolbar.buttons.polygon = 'Medir Area';
// L.drawLocal.draw.handlers.polygon.tooltip.start = 'Clic para dibujar';
// L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Clic para continuar dibujando';
// L.drawLocal.draw.handlers.polygon.tooltip.end = 'Clic en el punto inicial para finalizar Poligono';

// L.drawLocal.draw.handlers.polyline.tooltip.start = 'Clic para dibujar';
// L.drawLocal.draw.handlers.polyline.tooltip.cont = 'Clic para continuar dibujando';
// L.drawLocal.draw.handlers.polyline.tooltip.end = 'Clic para finalizar la Linea';

// L.drawLocal.draw.toolbar.actions.title = 'Cancelar dibujo';
// L.drawLocal.draw.toolbar.actions.text = 'Cancelar';
// L.drawLocal.draw.toolbar.finish.title = 'Finalizar dibujo';
// L.drawLocal.draw.toolbar.finish.text = 'Finalizar';
// L.drawLocal.draw.toolbar.undo.title = 'Borrar el ultimo punto';
// L.drawLocal.draw.toolbar.undo.text = 'Borrar ultimo punto';


// //Carga del control de Edicion

// var drawControl = new L.Control.Draw({
//     position: 'topleft',
//     draw: {
//         polyline: false,
//         polygon: {
//             allowIntersection: false, // Restingue a poligonos simples
//             drawError: {
//                 color: '#e1e100', // Color de la interseccion
//                 message: '<strong>Error<strong> Solo se accectan Poligonos simples!!!' //Mensaje de la interseccion
//             },
//             shapeOptions: {
//                 color: '#bada55'
//             },
//             metric: true,
//             showArea: true
//         },
//         circle: false,
//         marker: false,
//         rectangle: false
//     }
// });

// //Agrego los controles
// map.addControl(drawControl);

//Medicion de Distancia

// L.Control.measureControl().addTo(map);

//GeoBusqueda
/*
new L.Control.GeoSearch({
				provider: new L.GeoSearch.Provider.Google()
		}).addTo(map);*/


//Escala
L.control.scale({
	metric: true,
	imperial: false,
	position: 'bottomright'
}).addTo(map);


//Armado del Arbol


var tree = [{
	"code": "root",
	"name": "Capas",
	"active": true,
	"selectedByDefault": false,
	"openByDefault": true,
	"childLayers": treeG2, //Los componentes del arbol

	"selectType": "NONE",
	"serviceType": null,
	"params": {}
}];



var layerBuilders = {
	// BING: function (layerSettings) {
	// 	return new L.BingLayer(layerSettings.params.url);
	// },
	OSM: function (layerSettings) {
		var osm = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/emerald-v8/tiles/{z}/{x}/{y}?access_token={accessToken}', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'aanthieni',
			accessToken: 'pk.eyJ1IjoiYWFudGhpZW5pIiwiYSI6ImNpcGk4ODI2aTAxZTd0bG5qOTFjMXQxMjUifQ.CXtY1YXxMuOO9G10B_3CaQ'
		});

		return osm;
	},
	GOOGLE: function (layerSettings) {
		return new L.gridLayer.googleMutant({
			type: 'roadmap'
		});
	},
	GOOGLE_TERRAIN: function (layerSettings) {
		return new L.gridLayer.googleMutant({
			type: 'terrain'
		});
	},
	GOOGLE_SATELITE: function (layerSettings) {
		return new L.gridLayer.googleMutant({
			type: 'satellite'
		});
	},
	GOOGLE_HYBRID: function (layerSettings) {
		return new L.gridLayer.googleMutant({
			type: 'hybrid'
		});
	}

};

//Google Mutant valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'

var arbol = new L.Control.LayerTreeControl({
	layerTree: tree,
	openByDefault: true,
	layerBuilders: layerBuilders
});

arbol.addTo(map);


//Objeto de Leyenda

//var legend = undefined;
var legend = L.control({
	position: 'bottomright'
});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info-legend');

	return div;
};



//Inicializo el control de transparencia

var opacitySlider = undefined;



/*
//Funciones de Manejo de WFS DATOS


//Retorna las columnas a traer para el parametro en WFS
function Columnas(datos){
	  var column = datos.featureTypes[0].properties;
		var campos="";
		for ( var i=0;i< column.length;i++){
			if(column[i].localType!="Geometry"){
					if (campos == ""){
							campos = column[i].name;
					}else {
							campos = campos + ","+ column[i].name;
					};
			};
		};
		return campos;
};

//Retorna las columnas a traer para el parametro en WFS
function Encabezado(datos){
	  var column = datos.featureTypes[0].properties;
		var campos=[];
		for ( var i=0;i< column.length;i++){
			if(column[i].localType!="Geometry"){
					campos.push(column[i].name);
			};
		};
		return campos;
};



//Retorna un Json a partir del GeoJSON
function NoGeoJson(gjson){
	var datos = gjson.features;
	var tabla=[];
	for ( var i=0;i< datos.length;i++){
			tabla.push(datos[i].properties);
	};
	return tabla;
};





var campos = "";

var tabla = "";

//Test de carga

//Obtenermos los datos de las columnas del wfs deseado
var urlsourcewfs = "http://visualide.sanluis.gov.ar/geoserver/idesl/ows";
var capawfs = "idesl:Parcelas_Rur";
var urlwfs = urlsourcewfs + "?service=WFS&version=1.0.0&request=DescribeFeatureType&typeName="+capawfs+"&outputFormat=application/json";

//Se codifica para pasar por el proxy
var purlwfs = encodeURIComponent(urlwfs);

$.ajax({
	url: proxy + purlwfs,
	dataType: 'json', async: false
}).done(function (data) {
		campos = data;
		console.log(campos);
});


var camposwfs = Columnas(campos);
var encabezadoswfs = Encabezado(campos);
var maxcant = "maxFeatures=50&";
//var maxcant = "";
var urlDatawfs = urlsourcewfs + "?service=WFS&version=1.0.0&request=GetFeature&propertyname="+camposwfs+"&typeName="+capawfs+"&"+maxcant+"outputFormat=application/json&format_options=false";

for (var i=0;i< encabezadoswfs.length;i++){
		$('#headwfs').append('<th data-field="'+encabezadoswfs[i]+'" data-sortable="true">'+encabezadoswfs[i]+'</th>');
		console.log(encabezadoswfs[i]);
};

		//Se codifica para pasar por el proxy
var purlDatawfs = encodeURIComponent(urlDatawfs);

$.ajax({
			url: proxy+purlDatawfs,
			dataType: 'json' , async: false
}).done(function (data) {
				tabla = data;
				console.log(tabla);
});

var tablawfs = NoGeoJson(tabla);
console.log(tablawfs);

var $tabla = $('#tablewfs');
$tabla.bootstrapTable({data: tablawfs});


*/


///Botones

//Botons de carga de grilla de datos
$("#wfs-btn").click(function () {

	$("#wfs-modal").modal("show");
	return false;
});

//Boton extend del mapa
$("#full-extent-btn").click(function () {
	map.setView([-36, -67], 7);
	return false;
});

//Boton de Ayuda del sistema

$("#ayuda-btn").click(function () {

	$("#ayuda-modal").modal("show");
	return false;
});

//Boton de Acerca de

$("#acerca-btn").click(function () {

	$("#acerca-modal").modal("show");
	return false;
});


//Manejo del Slide/////////

//Abre el slider

$("#open").click(function () {
	$("div#panel").slideDown("slow");

});

//Cierran el slider

$("#close-btn").click(function () {
	$("#navbar-flex").slideUp("slow");
	$("div#panel").slideUp("slow");
	$("#result-content")[0].innerHTML = '';
});


//Clic Sobre registro

$(document).on("click", ".feature-row", function (e) {
	var selectid = $(this).attr("id");
	zoomfeature(selectid);

});


//Funcion para obtener el id leaflet a partir del id de la capa

function getIDlf(grupo, elemento) {
	var arreglo = grupo.getLayers();

	//console.log(arreglo);

	for (var i = 0; i < arreglo.length; i++) {
		if (arreglo[i].feature.properties.id == elemento) {
			var capaid = arreglo[i];
		}
	}

	return capaid._leaflet_id;

}



//Funcion que hace zoom al feature
function zoomfeature(selectid) {
	//obtengo el id interno de la capa
	var idintlf = getIDlf(resultados, selectid);

	var ext = resultados.getLayer(idintlf).getBounds();

	map.fitBounds(ext);



}



//Manejo del siderar

$("#sidebar-toggle-btn").click(function () {
	animateSidebar();
	return false;
});

//Boton de cierre de resultados menor
$("#sidebar-hide-btn").click(function () {
	animateSidebar();
	return false;
});

//Animacion de la barra lateral de resultados
function animateSidebar() {
	$("#sidebar").animate({
		width: "toggle"
	}, 350, function () {
		map.invalidateSize();
	});
}

///Boton Modal Favoritos


//Boton Nuuevo de Favorito
$("#createF-btn").click(function () {
	$("#createF-modal").modal("show");
	return false;
});


//Boton Carga de Favorito
$("#uploadF-btn").click(function () {
	$("#uploadF-modal").modal("show");
	return false;
});


//Boton Borrar de Favorito
$("#deleteF-btn").click(function () {
	$("#deleteF-modal").modal("show");
	return false;
});


//Manejo de las busquedas
$("#search-btn").click(function () {
	//Verifico si el campo valor esta completo

	if ($("#input-valor")[0].value == '') {
		var mensaje = "<div class='alert alert-warning alert-dismissible' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> <strong>Advertencia!</strong> El campo valor no puede ser vacio </div>";
		$("#filter-mensaje")[0].innerHTML = mensaje;
		return false;
	}


	//Genero la busqueda en el wms en el control
	arbol.searchDataWfs($("#columnas-list")[0].value, $("#input-valor")[0].value, $("#condicion-list")[0].value);

	return false;
});


var c = new L.Control.Coordinates(); 

c.addTo(map);

map.on('mousemove', function(e) {
	c.setCoordinates(e);
});


var mapControlsContainer = document.getElementById("map");
var logoContainer = document.getElementById("logoDPEC");
var logoContainer = document.getElementById("logoGobierno");

mapControlsContainer.appendChild(logoContainer);
