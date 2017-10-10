L.Control.LayerTreeControl = L.Control.extend({ //Extension de la clase control
	options: { //opciones de clasee
		position: "topleft", //heredada
		expand: false,
		className: "leaflet-layer-tree-control", //nombre de la clase
		layerTree: {},
		openByDefault: false,
		layerBuilders: {}, //Layers
		featureBuilders: { //Funciones de Construccion de las capas
			WFS: {}
		}
	},
	initialize: function (options) { //Constructor de la clase
		L.Util.setOptions(this, options);
		if (options.layerTree == undefined) { //Verifica que existan capas
			throw Error("Layer tree required to display");
		} //Variables de Instancia
		this._layers = new Array(); //Capas cargadas en el sistema y seleccionadas
		this._reloadHandlers = {};
		this._minWidth = undefined;
		this._setMetadata = undefined;
		this._setElementID = undefined;
		this._setElementUrl = undefined;
		this._setElementName = undefined;
		this._infoStatus = false; //Define si esta habilitada la accion sobre el mapa
		this._legendStatus = false; //Define si esta habilitada la accion sobre el mapa
		this._opacityStatus = false; //Define si esta habilitada la accion sobre el mapa
		this._proxy = "../proxy/proxy?url="; //Se define un proxy si existe para consumir datos externos
	}, //METODOS
	onAdd: function (map) { //Metodo utilidado para agregar el DOM del mapa
		this._map = map; //objeto local mapa
		var className = this.options.className; //Genero la variable con la clase
		var container = this._container = L.DomUtil.create('div', className + " leaflet-control"); //Genero el contenedor
		L.DomEvent.disableClickPropagation(container); //deshabilito el evento click
		L.DomEvent.on(container, "wheel", L.DomEvent.stopPropagation);
		container.setAttribute("aria-haspopup", true);

		// Iconify - -iconos
		var layersContainer = L.DomUtil.create('div', className + '-layers-open leaflet-control-layers', container);
		var iconifyToggleControl = L.DomUtil.create("div", className + "-toggle-open leaflet-control-layers", container);
		var icon = L.DomUtil.create("div", className + "-toggle-link", iconifyToggleControl);

		function iconifyLayersContainerToggleButton() {
			iconifyToggleControl.className = className + "-toggle-closed leaflet-control-layers"
		}

		function restoreLayersContainerToggleButton() {
			iconifyToggleControl.className = className + "-toggle-open leaflet-control-layers"
		}

		function isLayersContainerOpen() {
			return layersContainer.classList.contains(className + "-layers-open");
		}

		function closeLayersContainer() {
			layersContainer.className = className + '-layers-closed leaflet-control-layers';
		}

		function openLayersContainer() {
			layersContainer.className = className + '-layers-open leaflet-control-layers';
		}

		function updateLayerContainerMinWidth() {
			if (me._minWidth == undefined) {
				me._minWidth = layersContainer.offsetWidth;
			} else {
				if (me._minWidth < layersContainer.offsetWidth) {
					me._minWidth = layersContainer.offsetWidth;
				}
			}
			layersContainer.style.minWidth = me._minWidth + "px";
		}

		var me = this; //asigno la instancia a una variable me

		// Order
		var orderContainer = L.DomUtil.create('div', className + '-order-closed leaflet-control-layers', container); //Contenedor de orden
		var orderToggleControl = L.DomUtil.create("div", className + "-order-toggle-closed leaflet-control-layers", container); //Control para ocultar el contenedor
		var order = L.DomUtil.create("div", className + "-order-toggle-link", orderToggleControl); //div que contiene los controles
		var icono_order = L.DomUtil.create("i", "fa fa-sort-amount-asc fa-2x", order);
		//tooltip del boton
		order.title = "Ordenar Capas";


		function isOrderContainerOpen() {
			return orderContainer.classList.contains(className + "-order-open");
		}

		function closeOrderContainer() {
			orderContainer.className = className + '-order-closed leaflet-control-layers';
		}

		function openOrderContainer() {
			updateLayerContainerMinWidth();
			orderContainer.style.minWidth = layersContainer.style.minWidth;
			orderContainer.className = className + '-order-open leaflet-control-layers';
		}

		function openOrderToggleControl() {
			orderToggleControl.className = className + "-order-toggle-open leaflet-control-layers";
		}

		function closeOrderToggleControl() {
			orderToggleControl.className = className + "-order-toggle-closed leaflet-control-layers";
		}

		function hideOrderToggleControl() {
			orderToggleControl.className = className + "-order-toggle-hidden leaflet-control-layers";
		}

		var orderManager = {
			orderContainer: orderContainer,
			orderToggleControl: orderToggleControl,
			layersContainer: layersContainer,
			layers: me._layers, //carga el arbol de capas
			toggleOrder: function () {
				if (isOrderContainerOpen()) {
					closeOrderToggleControl();
					closeOrderContainer();
					openLayersContainer();
				} else {
					openOrderToggleControl();
					openOrderContainer();
					closeLayersContainer();
				}
			},
			reorder: function (top, bottom) {
				if (top > bottom) {
					var layers = orderManager.layers;
					var s = layers[top];
					for (var i = top; i > bottom; i--) {
						layers[i] = layers[i - 1];
					}
					layers[bottom] = s;
				} else if (top < bottom) {
					var layers = orderManager.layers;
					var s = layers[top];
					for (var i = top; i < bottom; i++) {
						layers[i] = layers[i + 1];
					}
					layers[bottom] = s;
				}
			},
			fillOrders: function () {
				this.orderContainer.innerHTML = "";
				var layers = this.layers;
				for (var i = layers.length - 1; i > -1; i--) {
					var layerContainer = layers[i];
					if (layerContainer.layer.setZIndex != undefined) {
						layerContainer.layer.setZIndex(i);
					}
					var row = L.DomUtil.create("div", className + "-order-row", this.orderContainer);
					var rowContent = L.DomUtil.create("div", className + "-order-row-content", row);
					var label = L.DomUtil.create("label", "", rowContent);
					label.innerHTML = layerContainer.name;

					if (i > 0) {
						var down = L.DomUtil.create("span", className + "-order-down", rowContent);
						L.DomEvent.on(down, "click", function (event) {
							var elem = event.currentTarget ? event.currentTarget : this;
							var layerId = elem.parentElement.layerId;
							var index = me._getLayerIndex(layerId);
							orderManager.reorder(index - 1, index);
							orderManager.fillOrders();
						});
					}
					if (i < layers.length - 1) {
						var up = L.DomUtil.create("span", className + "-order-up", rowContent);
						L.DomEvent.on(up, "click", function (event) {
							var elem = event.currentTarget ? event.currentTarget : this;
							var layerId = elem.parentElement.layerId;
							var index = me._getLayerIndex(layerId);
							orderManager.reorder(index + 1, index);
							orderManager.fillOrders();
						});
					}

					rowContent.layerId = layerContainer.id;
					rowContent.draggable = true;
					rowContent.droppable = true;
					rowContent.ondragstart = function (event) {
						var elem = event.currentTarget != undefined ? event.currentTarget : this;
						var sourceId = elem.layerId;
						event.dataTransfer.setData("text/plain", sourceId);
					};
					rowContent.ondragover = function (event) {
						var elem = event.currentTarget != undefined ? event.currentTarget : this;
						var sourceId = elem.layerId;
						var targetId = event.dataTransfer.getData("text/plain");
						var sourceIndex = me._getLayerIndex(sourceId);
						//var targetIndex = me._getLayerIndex(targetId);
						if (sourceIndex != undefined /* && targetIndex != undefined && sourceIndex != targetIndex*/ ) {
							event.preventDefault();
						}
					};
					rowContent.ondrop = function (event) {
						event.preventDefault();
						var elem = event.currentTarget != undefined ? event.currentTarget : this;
						var sourceId = elem.layerId;
						var targetId = event.dataTransfer.getData("text/plain");
						var sourceIndex = me._getLayerIndex(sourceId);
						var targetIndex = me._getLayerIndex(targetId);
						if (sourceIndex != undefined && targetIndex != undefined && sourceIndex != targetIndex) {
							orderManager.reorder(targetIndex, sourceIndex);
							orderManager.fillOrders();
						}
					}
				}
			}
		}

		//Funcion que define el comportamiento de ocultamiento de todo el control
		//Tener en cuenta que tiene que agregarse la funcion  de ocultar y mostar
		//si se incorpora un nuevo boton

		function toggleIconify() {
			if (isLayersContainerOpen() || isOrderContainerOpen()) {
				closeLayersContainer();
				closeOrderContainer();
				iconifyLayersContainerToggleButton();
				hideOrderToggleControl();
				// hideMetadataControl();
				hideInfoControl();
				hideTranspControl();
				hideLeyendaControl();
				hideExtendControl();
				hideDataWFSControl();
			} else {
				openLayersContainer();
				closeOrderContainer();
				restoreLayersContainerToggleButton();
				closeOrderToggleControl();
				// showMetadataControl();
				showInfoControl();
				showTranspControl();
				showLeyendaControl();
				showExtendControl();
				showDataWFSControl();
			}
		}

		L.DomEvent.on(icon, "click", function (event) {
			toggleIconify();
		}, this);

		if (!this.options.openByDefault) {
			toggleIconify();
		}

		L.DomEvent.on(order, "click", function (event) {
			orderManager.fillOrders();
			orderManager.toggleOrder();
		});

		/////////////////////////////
		//Comportamiento boton metadata y manejo de la variable

		// var iconifyMetadataControl = L.DomUtil.create("div", className + "-metadata leaflet-control-layers", container);
		// //tooltip del boton
		// iconifyMetadataControl.title = "Metadatos";
		// var metadata = L.DomUtil.create("div", className + "-metadata-link", iconifyMetadataControl);
		// //var icono = L.DomUtil.create("i", "fa fa-bars fa-rotate-90 fa-3x", metadata);


		// //oculta el control
		// function hideMetadataControl() {
		// 	iconifyMetadataControl.className = className + "-metadata-hidden leaflet-control-layers";
		// }

		// //muestra el control
		// function showMetadataControl() {
		// 	iconifyMetadataControl.className = className + "-metadata leaflet-control-layers";
		// }

		// //Setea la hoja seleccionada y las variables de la funcionalidad del arbol
		// function setMetadata(metadataUrl) {
		// 	me._setMetadata = metadataUrl;
		// }

		// //Funcion que limpia el valor de metadatos
		// function clearMetadata() {
		// 	me._setMetadata = undefined;
		// }


		// //Evento cuando clickea en el control
		// L.DomEvent.on(metadata, "click", function (event) {
		// 	if (me._setMetadata != undefined) {
		// 		//console.log("paso");
		// 		//console.log(me._setMetadata);
		// 		$('#metadataIframe').attr('src', me._setMetadata);
		// 		//$("#result-metadata").html(me._proxy+encodeURIComponent(me._setMetadata));
		// 		$("#metadata-modal").modal("show");
		// 	} else {
		// 		alert('Seleccione una capa para visualizar');
		// 	}

		// }, this);


		/////////////////////////////
		//Comportamiento boton INFO y manejo de la variable

		var iconifyInfoControl = L.DomUtil.create("div", className + "-info leaflet-control-layers", container);
		//tooltip del boton
		iconifyInfoControl.title = "Información de la Capa";
		var info = L.DomUtil.create("div", className + "-info-link", iconifyInfoControl);
		var icono_info = L.DomUtil.create("i", "fa fa-info-circle fa-2x", info);


		//oculta el control
		function hideInfoControl() {
			iconifyInfoControl.className = className + "-info-hidden leaflet-control-layers";
		}

		//muestra el control
		function showInfoControl() {
			iconifyInfoControl.className = className + "-info leaflet-control-layers";
		}

		// //Setea la hoja seleccionada y las variables de la funcionalidad del arbol
		// function setInfo(metadataUrl) {
		// 	me._setMetadata = metadataUrl;
		// }

		// //Funcion que limpia el valor de info seleccionado
		// function clearInfo() {
		// 	me._setMetadata = undefined;
		// }

		////////////////////////////////////////////////////////////////////////////////////////////////

		/////Funciones auxiliares


		function showWaiting() {
			// Animacion mientras se espera que carque la info
			if (!me._map)
				return;
			me._map._container.style.cursor = "progress";
		}

		function hideWaiting() {
			// Detiene la animacion del cursor cuando termina de cargar
			if (!me._map)
				return;
			me._map._container.style.cursor = "default";
		}


		function getWmsParams(layer) {
			// Obtengo las opciones del wms
			var bounds = map.getBounds();
			var size = map.getSize();
			var wmsVersion = parseFloat(layer.wmsParams.version);
			var crs = layer.options.crs || map.options.crs;
			var projectionKey = wmsVersion >= 1.3 ? 'crs' : 'srs';
			var nw = crs.project(bounds.getNorthWest());
			var se = crs.project(bounds.getSouthEast());

			// Genero el parametro para WMS
			var params = {
				'width': size.x,
				'height': size.y
			};

			params[projectionKey] = crs.code;
			params.bbox = (
				wmsVersion >= 1.3 && crs === L.CRS.EPSG4326 ? [se.y, nw.x, nw.y, se.x] : [nw.x, se.y, se.x, nw.y]
			).join(',');

			L.extend(layer.wmsParams, params);
		}



		function getFeatureInfoParams(point, layer) {
			//Generacion de parametros para obtener respuesta del GetFeatureInfo del WMS

			var wmsParams;
			getWmsParams(layer);

			wmsParams = layer.wmsParams;
			wmsParams.layers = layer.wmsParams.layers;


			var infoParams = {
				'request': 'GetFeatureInfo',
				'info_format': 'text/html',
				'query_layers': layer.wmsParams.layers,
				'X': Math.round(point.x),
				'Y': Math.round(point.y)
			};

			return L.extend({}, wmsParams, infoParams);
		}


		/////////////////////////////////

		function identify(evt) {
			//Nos permite obtener de toda las capas selecionadas la info del punto
			//Utiliza Jquery

			console.log('se activo');
			//Recorremos el array con las capas seleccionadas que no sean las base
			var baseG = 'background'; //Seteo el grupo de la base
			//Datos del punto
			var puntoobj = evt.containerPoint;
			var puntoll = evt.latlng;
			var layer, url;
			var layers_info = [];


			showWaiting(); //Pone al cursor en espera

			for (var i = 0; i < me._layers.length; i++) {
				var id = me._layers[i].id;
				var grupo = id.substr(8, 10);

				if (grupo != baseG) {
					//Armamos un arreglo con las capas a leer la informacion de los servidores
					//Esta armado de forma individual por servidor por capa
					//Obtener los datos de la capa
					layer = me._layers[i].layer;
					url = getFeatureInfo(puntoobj, layer);

					layers_info.push(url);


				} //Fin si es del grupo

			} //FIn del ciclo

			var layers_array = JSON.stringify(layers_info)

			//Funcion que engloba el ajax en un solo parametro
			//Se considera que existe JQuery

			var service = $.ajax({
				url: layers_info[0],//'/info_point',
				dataType: 'text',
				// data: {
				// 	url_resq: layers_array
				// },
				method: 'POST'
			});

			service.done(function done(result) {
				hideWaiting(); //Corta el cursor de espera

				resultC = result.toString();

				// console.log("resultado",result);
				// console.log("resultc",resultC)

				// Muestra la respuesta del servicio de la capa
				map.openPopup(resultC, puntoll);


			});

			service.fail(function (jqXHR, textStatus) {
				console.log("Mensaje de Error del Servicio: " + textStatus);
			});



		}


		//Metodo para obtener la informacion en un punto de las capas que le pasamos
		function getFeatureInfo(point, layer) {
			// Consulta el WMS GetFeatureInfo y pasa los resultados a una funciona callbabck

			var params = getFeatureInfoParams(point, layer); //obtiene los parametros de la capa que se le pasa
			return layer._url + L.Util.getParamString(params, layer._url); //genera la url con los parametros

		}




		////////////////////////////////////////////////////////////////////////////////////////////
		//Evento cuando clickea el mapa
		L.DomEvent.on(this._map, "click", function (event) {
			if (me._infoStatus != false) {
				identify(event);
			}
		}, this);



		//Evento cuando clickea en el control de Info
		L.DomEvent.on(info, "click", function (event) {
			if (me._layers.length > 1) { //En el caso que tenga capas seleccionadas

				if (me._infoStatus == false) { //Funcionalidad boton clic
					$('.leaflet-layer-tree-control-info-link').css("color", "rgb(51, 122, 183)");
					me._infoStatus = true;
				} else {
					$('.leaflet-layer-tree-control-info-link').css("color", "black");
					me._infoStatus = false;
				}

			} else {
				alert('Seleccione por lo menos una capa para habilitar la funcionalidad');
			}

		}, this);


		/////////////////////////////
		//Comportamiento boton Leyenda y manejo de la variable

		var iconifyLeyendaControl = L.DomUtil.create("div", className + "-leyenda leaflet-control-layers", container);
		//tooltip del boton
		iconifyLeyendaControl.title = "Leyenda de la Capa";
		var leyenda = L.DomUtil.create("div", className + "-leyenda-link", iconifyLeyendaControl);
		var icono_leyenda = L.DomUtil.create("i", "fa fa-list-ul fa-2x", leyenda);


		//oculta el control
		function hideLeyendaControl() {
			iconifyLeyendaControl.className = className + "-leyenda-hidden leaflet-control-layers";
		}

		//muestra el control
		function showLeyendaControl() {
			iconifyLeyendaControl.className = className + "-leyenda leaflet-control-layers";
		}

		// //Setea la hoja seleccionada y las variables de la funcionalidad del arbol
		// function setLeyenda(metadataUrl) {
		// 	me._setMetadata = metadataUrl;
		// }

		// //Funcion que limpia el valor de info seleccionado
		// function clearLeyenda() {
		// 	me._setMetadata = undefined;
		// }



		function showLeyenda(lurl, lname) {
			$('.info-legend')[0].innerHTML = '<h4>Leyenda</h4> <br>' + '<img alt="legend" src="' + lurl + '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + lname + '"/>';

		}


		//Evento cuando clickea en el control
		L.DomEvent.on(leyenda, "click", function (event) {

			if (me._setElementID != undefined) {

				if (me._legendStatus == false) { //Funcionalidad boton clic
					$('.leaflet-layer-tree-control-leyenda-link').css("color", "rgb(51, 122, 183)");
					me._legendStatus = true;


					//Incorporo el control creado
					legend.addTo(map);

					//Actualizando los datos de la capa elejida
					var lurl = me._setElementUrl;
					var lname = me._setElementName;

					// Insertando una leyenda en el mapa
					showLeyenda(lurl, lname);


				} else {
					$('.leaflet-layer-tree-control-leyenda-link').css("color", "black");
					me._legendStatus = false;

					//REmuevo el objeto de la leyenda
					legend.remove(map);
				}


			} else {
				alert('Seleccione una capa para visualizar');
			}

		}, this);



		/////////////////////////////
		//Comportamiento boton Transparencia y manejo de la variable

		var iconifyTranspControl = L.DomUtil.create("div", className + "-transp leaflet-control-layers", container);
		//tooltip del boton
		iconifyTranspControl.title = "Transparencia de la Capa";
		var transp = L.DomUtil.create("div", className + "-transp-link", iconifyTranspControl);
		var icono_transp = L.DomUtil.create("i", "fa fa-adjust fa-2x", transp);



		//oculta el control
		function hideTranspControl() {
			iconifyTranspControl.className = className + "-transp-hidden leaflet-control-layers";
		}

		//muestra el control
		function showTranspControl() {
			iconifyTranspControl.className = className + "-transp leaflet-control-layers";
		}

		// //Setea la hoja seleccionada y las variables de la funcionalidad del arbol
		// function setTransp(metadataUrl) {
		// 	me._setMetadata = metadataUrl;
		// }

		// //Funcion que limpia el valor de info seleccionado
		// function clearTransp() {
		// 	me._setMetadata = undefined;
		// }


		//Evento cuando clickea en el control
		L.DomEvent.on(transp, "click", function (event) {
			if (me._setElementID != undefined) {

				if (me._opacityStatus == false) { //Funcionalidad boton clic
					$('.leaflet-layer-tree-control-transp-link').css("color", "rgb(51, 122, 183)");
					me._opacityStatus = true;

					//Si no Existe la creo
					if (opacitySlider == undefined) {

						opacitySlider = new L.Control.opacitySlider({
							position: 'topleft'
						});
						map.addControl(opacitySlider);


					}

					// Habilito la capa a controlar la transparencia
					opacitySlider.setOpacityLayer(me._layers[me._getLayerIndex(me._setElementID)].layer);


				} else {
					$('.leaflet-layer-tree-control-transp-link').css("color", "black");
					me._opacityStatus = false;

					//REmuevo el objeto de la leyenda
					map.removeControl(opacitySlider);
				}





			} else {
				alert('Seleccione una capa para visualizar');
			}

		}, this);


		/////////////////////////////
		//Comportamiento boton Zoom de extensiones de la capa y manejo de la variable

		var iconifyExtendControl = L.DomUtil.create("div", className + "-extend leaflet-control-layers", container);
		//tooltip del boton
		iconifyExtendControl.title = "Extensión de la Capa";
		var extend = L.DomUtil.create("div", className + "-extend-link", iconifyExtendControl);
		var icono_extend = L.DomUtil.create("i", "fa fa-arrows-alt fa-2x", extend);


		//oculta el control
		function hideExtendControl() {
			iconifyExtendControl.className = className + "-extend-hidden leaflet-control-layers";
		}

		//muestra el control
		function showExtendControl() {
			iconifyExtendControl.className = className + "-extend leaflet-control-layers";
		}

		// //Setea la hoja seleccionada y las variables de la funcionalidad del arbol
		// function setExtend(metadataUrl) {
		// 	me._setMetadata = metadataUrl;
		// }

		// //Funcion que limpia el valor de info seleccionado
		// function clearExtend() {
		// 	me._setMetadata = undefined;
		// }

		//Funcion que vuelve el extend de la capa seleccionada
		function getBounds() {

			//capa seleccionada
			var capa = me._layers[me._getLayerIndex(me._setElementID)].layer;


			var wfsUrl = capa._url + L.Util.getParamString({
				request: "GetCapabilities",
				version: "1.1.1"
			});
			var layerName = capa.options.layers;
			var south, west, north, east;

			//Funcion que engloba el ajax en un solo parametro
			//Se considera que existe JQuery
			debugger;
			var service = $.ajax({
				url: '/extend',
				data: {
					url_resq: wfsUrl,
					capa: layerName
				},
				method: 'POST'
			});

			service.done(function done(data) {

				if (data != '') {
					map.fitBounds(JSON.parse(data));
					console.log(data);
				}

			});

			service.fail(function (jqXHR, textStatus) {
				console.log("Mensaje de Error del Servicio: " + textStatus);
			});

		}


		//Evento cuando clickea en el control
		L.DomEvent.on(extend, "click", function (event) {
			if (me._setElementID != undefined) {

				//map.setZoom(12);
				getBounds();

			} else {
				alert('Seleccione una capa para visualizar');
			}

		}, this);



		/////////////////////////////
		//Comportamiento boton DATA de extensiones de la capa y manejo de la variable

		var iconifyDataWFSControl = L.DomUtil.create("div", className + "-dataWFS leaflet-control-layers", container);
		//tooltip del boton
		iconifyDataWFSControl.title = "Datos de la Capa";
		var dataWFS = L.DomUtil.create("div", className + "-dataWFS-link", iconifyDataWFSControl);
		var icono_dataWFS = L.DomUtil.create("i", "fa fa-database fa-2x", dataWFS);


		//oculta el control
		function hideDataWFSControl() {
			iconifyDataWFSControl.className = className + "-dataWFS-hidden leaflet-control-layers";
		}

		//muestra el control
		function showDataWFSControl() {
			iconifyDataWFSControl.className = className + "-dataWFS leaflet-control-layers";
		}

		// //Setea la hoja seleccionada y las variables de la funcionalidad del arbol
		// function setDataWFS(metadataUrl) {
		// 	me._setMetadata = metadataUrl;
		// }

		// //Funcion que limpia el valor de info seleccionado
		// function clearDataWFS() {
		// 	me._setMetadata = undefined;
		// }
		//Funcion Auxiliar para manejo de WFS


		//Retorna las columnas a traer para el parametro en WFS
		function Columnas(datos) {
			var column = datos.featureTypes[0].properties;
			var campos = "";
			for (var i = 0; i < column.length; i++) {
				if (column[i].localType != "Geometry") {
					if (campos == "") {
						campos = column[i].name;
					} else {
						campos = campos + "," + column[i].name;
					}
				}
			}
			return campos;
		}

		//Retorna las columnas a traer para el parametro en WFS
		function Encabezado(datos) {
			var column = datos.featureTypes[0].properties;
			var campos = [];
			for (var i = 0; i < column.length; i++) {
				if (column[i].localType != "Geometry") {
					campos.push(column[i].name);
				}
			}
			return campos;
		}



		//Retorna un Json a partir del GeoJSON
		function NoGeoJson(gjson) {
			var datos = gjson.features;
			var tabla = [];
			for (var i = 0; i < datos.length; i++) {
				tabla.push(datos[i].properties);
			}
			return tabla;
		}


		//////////////////////////////





		//Genera la consulta de campos de la capa y abre el box
		function searchFields(capa, capatitle) {

			//Obtenermos los datos de las columnas del wfs deseado
			var urlsourcewfs = capa.options.urlWfs;
			var capawfs = capa.options.layers;

			var urlwfs = urlsourcewfs + "?service=WFS&version=1.0.0&request=DescribeFeatureType&typeName=" + capawfs + "&outputFormat=application/json";


			//Funcion que engloba el ajax en un solo parametro
			//Se considera que existe JQuery
			var service = $.ajax({
				url: urlwfs,//'/filter_search',
				// data: {
				// 	url_resq: urlwfs
				// },
				method: 'POST'
			});

			service.done(function done(data) {

				console.log("data filtrooo",data);
				$("#filter-title")[0].innerHTML = "Filtro de Busqueda - " + capatitle;
				$("#filter-mensaje")[0].innerHTML = "";
				$("#filter-content")[0].innerHTML = data.filtro;
				$("#filter-modal").modal("show");


			});

			service.fail(function (jqXHR, textStatus) {
				console.log("Mensaje de Error del Servicio: " + textStatus);
			});

		}



		//Evento cuando clickea en el control
		L.DomEvent.on(dataWFS, "click", function (event) {
			if (me._setElementID != undefined) {

				//Cierro el slide por si existe resultados previos
				$("#navbar-flex").slideUp("slow");
				$("div#panel").slideUp("slow");
				$("#result-content")[0].innerHTML = '';
				//Si existe resultados borrar
				if (resultados != undefined) {
					resultados.remove();
				}


				//Verifico si la capa tiene servidor wfs para buscar

				var capa = me._layers[me._getLayerIndex(me._setElementID)].layer;
				var capatitle = me._layers[me._getLayerIndex(me._setElementID)].name;

				if (capa.options.urlWfs != undefined) {
					//Carga el Box para generar una busqueda
					searchFields(capa, capatitle);

				} else {
					alert('La capa seleccionada no tiene servidor para la Busqueda');
				}


			} else {
				alert('Seleccione una capa para visualizar');
			}

		}, this);





		// Layers
		///////////////////////////

		//Funcion que permite seleccionar una hoja en el arbol
		//Pametros id del check , utl de la metadata
		function setSelect(idCK, metadataUrl, lurl, lname) {
			//Verifico que no exista otro tildado
			if (me._setElementID != idCK && me._setElementID != undefined) {
				//Si existe lo desactivo
				var jqidA = "#" + me._setElementID;
				//Le cambio el sombreado al label
				$(jqidA).next().css('font-weight', 'normal');
				$(jqidA).next().css('backgroung-color', 'white');
			}

			if (me._setElementID == idCK) {
				//DEstilda el actual y no existe uno anterior
				var jqidA = "#" + me._setElementID;
				//Le cambio el sombreado al label
				$(jqidA).next().css('font-weight', 'normal');
				$(jqidA).next().css('backgroung-color', 'white');
				me._setElementID = undefined;
				// clearMetadata();
			} else {
				//Si es uno nuevo
				//Seteo el nuevo id seleccionado
				me._setElementID = idCK;
				me._setElementUrl = lurl;
				me._setElementName = lname;
				var jqid = "#" + idCK;
				$(jqid).next().css('font-weight', 'bolder');
				$(jqid).next().css('backgroung-color', 'ligthcyan');
				// setMetadata(metadataUrl);
				//Si esta activada la leyenda cambia el valor
				if (me._legendStatus == true) {
					//Actualizando los datos de la capa elejida

					showLeyenda(me._setElementUrl, me._setElementName);

				}

				//Si esta activada la opacidad cambia la capa
				if (me._opacityStatus == true) {
					// Habilito la capa a controlar la transparencia
					opacitySlider.setOpacityLayer(me._layers[me._getLayerIndex(me._setElementID)].layer);
				}

				//console.log("La Cargo");
			}

		}



		//Funcion que le da visibilidad a las hojas
		function toggleChildrenVisibility(elem, open) {
			if (
				(elem.childNodes.length >= 2 && (elem.childNodes[0].className == className + "-leaf-header")) &&
				(elem.childNodes.length >= 2 && (elem.childNodes[1].className == className + "-leaf-content"))
			) {
				var header = elem.childNodes[0];
				var content = elem.childNodes[1];
				var switcherRow = header.getElementsByClassName(className + "-leaf-switcher-row");
				if (switcherRow.length == 1) {
					var toggleButtons = switcherRow[0].getElementsByClassName(className + "-leaf-switcher");
					if (toggleButtons.length == 1) {
						var toggleButton = toggleButtons[0];
						if (open === undefined) {
							open = content.style.display == "none";
						}
						if (open) {
							content.style.display = "";
							toggleButton.className = className + "-leaf-switcher " + className + "-leaf-switcher-closed";
						} else {
							updateLayerContainerMinWidth();
							content.style.display = "none";
							toggleButton.className = className + "-leaf-switcher " + className + "-leaf-switcher-open";
						}
					}
				}
			}
		}

		function traverseLeaf(parentLeaf, parentContainer, leaf, parentId, order) { //Funcion recursiva que genera los nodos del arbol
			var leafContainer = L.DomUtil.create("div", className + "-leaf", parentContainer);
			var leafHeader = L.DomUtil.create("div", className + "-leaf-header", leafContainer);
			var leafTitle = L.DomUtil.create("span", className + "-leaf-title", leafHeader);
			if (leaf.childLayers != undefined && leaf.childLayers.length > 0) { //Si tiene hijos
				var leafSwitcherRow = L.DomUtil.create("span", className + "-leaf-switcher-row", leafHeader);
				var leafSwitcher = L.DomUtil.create("span", className + "-leaf-switcher", leafSwitcherRow);
				L.DomEvent.on(leafSwitcher, "click", function (event) {
					var elem = event.srcElement != undefined ? event.srcElement : this;
					toggleChildrenVisibility(elem.parentElement.parentElement.parentElement);
				});
			}
			var layerId = parentId + "_" + leaf.code + "_" + order; //Compone el ID de layer


			//Funcion que se encarga de cambiar el estado del check
			//Parametros: (id del elemento , estado a ser cambiado )
			function toggleLayerMULTIPLE(sourceElementId, checked) {
				if (sourceElementId) { //si existe el id

					// add or remove currently selected layer

					if (checked) {
						me.addLayer(leaf, sourceElementId);

					} else {
						me.removeLayer(sourceElementId);

					}

					orderManager.fillOrders();
				}
			}

			//Funcion que se encarga de cambiar el estado de radio
			function toggleLayerSINGLE(parentElementId, sourceElementId, leafTitle) {
				me.removeLayers(parentLeaf, parentElementId);
				me.addLayer(leaf, sourceElementId);
				orderManager.fillOrders();
			}

			if (leaf.active) { //Si el nodo esta en activo genera el componente
				switch (parentLeaf.selectType) { //Busca el atributo en el padre
					case "NONE": //Se coloca el titulo o sea es Raiz o no es una Hoja
						leafTitle.innerHTML = "<label>" + leaf.name + "</label>"
						break;
					case "SINGLE": // radio-group Lo utilizamos para la Bases
						{
							var parentLeafCode = parentLeaf.code;
							var checkbox = L.DomUtil.create("input", "", leafTitle);
							checkbox.name = parentLeafCode;
							checkbox.id = layerId;
							checkbox.parentId = parentId;
							checkbox.type = "radio";
							var label = L.DomUtil.create("label", "", leafTitle);
							var labelText = L.DomUtil.create("span", "", label);
							labelText.innerHTML = leaf.name;

							//Funcion cuando cambia el check
							L.DomEvent.on(checkbox, "change", function (event) {
								var elem = event.srcElement != undefined ? event.srcElement : this;
								var sourceElementId = elem.id;
								//verifica si existe otro presionado lo destilda
								if (sourceElementId) {
									var parentElementId = elem.parentId;
									var checked = elem.checked;
									if (checked) {
										toggleLayerSINGLE(parentElementId, sourceElementId);
									}
								}
							});

							//Comportamiento cuando hacer click sobre el label
							L.DomEvent.on(label, "click", function (event) {
								var elem = event.srcElement != undefined ? event.srcElement : this;
								var checkbox = elem.parentElement.parentElement.getElementsByTagName("input")[0];
								checkbox.checked = true;
								var parentElementId = checkbox.parentId;
								var sourceElementId = checkbox.id;
								toggleLayerSINGLE(parentElementId, sourceElementId);
							});
							if (leaf.selectedByDefault) {
								checkbox.checked = true;
								toggleLayerSINGLE(parentId, layerId);
							}
						}
						break;
					case "MULTIPLE":
					default: // checkboxes
						{
							var parentLeafCode = parentLeaf.code;
							var checkbox = L.DomUtil.create("input", "", leafTitle);
							checkbox.name = parentLeafCode;
							checkbox.id = layerId;
							checkbox.parentId = parentId;
							checkbox.type = "checkbox";
							var label = L.DomUtil.create("label", "", leafTitle);
							var labelText = L.DomUtil.create("span", "", label);
							labelText.innerHTML = leaf.name;

							//Evento que se activa si cambian el estado del checkbox
							L.DomEvent.on(checkbox, "change", function (event) {
								var elem = event.srcElement != undefined ? event.srcElement : this;
								//Si es estado al que se cambia es false se debe deseleccionar si esta selecciona

								if (elem.checked == false && me._setElementID == elem.id) {
									setSelect(elem.id, undefined);
								} else if (elem.checked != false) {
									setSelect(elem.id, leaf.metadataUrl, leaf.params.url, leaf.params.layers);
								}

								//Aplica el cambio en la visualizacion de la capa
								toggleLayerMULTIPLE(elem.id, elem.checked, leafTitle);

							});

							//Evento que se activa cuando hacen click en el label
							L.DomEvent.on(label, "click", function (event) {
								var elem = event.srcElement != undefined ? event.srcElement : this;
								var checkbox = elem.parentElement.parentElement.getElementsByTagName("input")[0];
								//Comportamiento de acuerdo a si esta tildado
								var checked; //comportamiento a realizar con el check
								var sourceElementId = checkbox.id; //Id de la hoja
								if (checkbox.checked == true) { //si esta tildado, se selecciona la hoja
									//Verifico que no este selecionado
									if (me._setElementID != sourceElementId) {
										setSelect(sourceElementId, leaf.metadataUrl, leaf.params.url, leaf.params.layers);
									} else {
										checkbox.checked = undefined;
										checked = false;
										toggleLayerMULTIPLE(sourceElementId, checked, leafTitle);
										setSelect(sourceElementId, undefined);
									}
								} else { //sino esta tildado, se seleecciona y se tilda
									checkbox.checked = true;
									checked = true;
									toggleLayerMULTIPLE(sourceElementId, checked, leafTitle);
									setSelect(sourceElementId, leaf.metadataUrl, leaf.params.url, leaf.params.layers);
								}

							});


							if (leaf.selectedByDefault) {
								checkbox.checked = true;
								toggleLayerMULTIPLE(layerId, true, leafTitle);
							}
						}
						break;
				}
				if (me.options.featureBuilders.hasOwnProperty(leaf.serviceType)) { //Verifica si el servicio exites en la lista cargada
					var featureBuilders = me.options.featureBuilders[leaf.serviceType];
					for (var i in featureBuilders) {
						var featureBuilder = featureBuilders[i];
						featureBuilder(leafTitle, leaf, me.options, me._map);
					}
				}
				var leafContent = L.DomUtil.create("div", className + "-leaf-content", leafContainer);
				if (leaf.childLayers && leaf.childLayers.length > 0) { //Verifica si existee hijos y llama recursivamente la funcion
					for (var i in leaf.childLayers) {
						var child = leaf.childLayers[i];
						if (child) {
							traverseLeaf(leaf, leafContent, child, layerId, i);
						}
					}
				}

				toggleChildrenVisibility(leafContainer.parentNode.parentNode, parentLeaf.openByDefault);
			}
		}

		var layerTree = this.options.layerTree; //Asigna el arbol a la variable
		//Inicia el arbol llamando a la funcion para generarlo
		if (Object.prototype.toString.call(layerTree) === '[object Array]') {
			for (var i in layerTree) {
				var layerSubTree = layerTree[i];
				traverseLeaf(layerSubTree, layersContainer, layerSubTree, "", 0);
			}
		} else {
			traverseLeaf(layerTree, layersContainer, layerTree, "", 0);
		}

		orderManager.fillOrders();

		return container;
	},
	onRemove: function (map) {

	},
	copyParams: function (layerSettings, exceptions) { //Realiza una copia de los paramentros
		var params = {};
		for (var paramKey in layerSettings.params) {
			if (!exceptions || !exceptions.test(paramKey)) {
				params[paramKey] = layerSettings.params[paramKey];
			}
		}
		return params;
	},
	addLayer: function (layerSettings, layerId) { //Metodo para incorporar una capa al arbol
		var map = this._map;
		var me = this;
		switch (layerSettings.serviceType) { //Si es OSM  toma el parametro url

			case "TILE":
				var layer = L.tileLayer(layerSettings.params.url, {});
				this._addLayer(layer, layerId, layerSettings);
				break;
			case "WMS":
				{
					var params = this.copyParams(layerSettings, /\burl\b/gi);
					var layer = L.tileLayer.wms(layerSettings.params.url, params).addTo(map);
					this._addLayer(layer, layerId, layerSettings);
				}
				break;
			case "WFS":
				{
					debugger
					var layer = new L.GeoJSON().addTo(map);
					var params = this.copyParams(layerSettings, /\b(url|style)\b/gi);

					this._addLayer(layer, layerId, layerSettings);
					var wfsHandler = function () { //genero la funcion para levantar el json del servicio
						var customParams = {
							bbox: map.getBounds().toBBoxString(),
						};
						var params2 = L.Util.extend(params, customParams); //paratros del objecto mas el box
						var wfsUrl = layerSettings.params.url + L.Util.getParamString(params2); //Transformo la url con parametros para enviar por ajax
						$.ajax({
							url: wfsUrl,
							dataType: 'json',
							success: function (data) {
								layer.clearLayers();
								layer.addData(data);
								if (layerSettings.params.style) {
									var style = JSON.parse(layerSettings.params.style);
									layer.eachLayer(function (layer) {
										layer.setStyle(style);
									});
								}
							},
							error: function () {
								console.error(arguments);
							}
						});
					}
					wfsHandler();
					this._reloadHandlers[layerId + "__moveend"] = wfsHandler;
					map.on("moveend", wfsHandler);
				}
				break;
			default: //Sino es ninguno de ellos
				if (this.options.layerBuilders != undefined && this.options.layerBuilders != null && this.options.layerBuilders.hasOwnProperty(layerSettings.serviceType)) {
					var layer = this.options.layerBuilders[layerSettings.serviceType](layerSettings);
					this._addLayer(layer, layerId, layerSettings);
				}
				break;
		}
	},
	_addLayer: function (layer, layerId, layerSettings) { //Metodo privado que agrega la capa a las variables de clase
		if (layer) {
			this._layers.push({
				id: layerId,
				layer: layer,
				name: layerSettings.name
			});
			this._map.addLayer(layer);
		}
	},
	removeLayers: function (layer, parentId) {
		this.removeLayer(layer);
		if (layer.childLayers && layer.childLayers.length > 0) {
			for (var i in layer.childLayers) {
				var child = layer.childLayers[i];
				this.removeLayer(parentId + "_" + child.code + "_" + i);
			}
		}
	},
	_getLayerIndex: function (layerId) {
		for (var i in this._layers) {
			var layerContainer = this._layers[i];
			if (layerContainer.id == layerId) {
				return 1 * i;
			}
		}
		return undefined;
	},
	searchDataWfs: function (campo, valor, condicion) {
		var capa = this._layers[this._getLayerIndex(this._setElementID)].layer;
		var capatitle = this._layers[this._getLayerIndex(this._setElementID)].name;
		//alert('alguien escucha');
		//Obtenermos los datos de las columnas del wfs deseado
		var urlsourcewfs = capa.options.urlWfs;
		var capawfs = capa.options.layers;

		var versionwfs = '1.0.0';
		var requestwfs = 'GetFeature';
		var maximo = '1000';
		var maxcant = "maxFeatures=" + maximo + "&";

		//Se genera la expresion para el filtro de acuerdo a la caracteristica de la misma
		var expresionfiltro = '';

		//Convierte la condicion en texto
		function alphacond(condicion) {

			switch (condicion) {
				case "ilike":
					return "contiene";
				case "not%20ilike":
					return "no contiene";
				case "=":
					return "igual";
				case ">":
					return "mayor";
				case "<":
					return "menor";
				case ">=":
					return "mayor igual";
				case "<=":
					return "menor igual";
				case "<>":
					return "distinto";


			}

		}


		switch (condicion) {
			case 'ilike':
				expresionfiltro = campo + "%20ILIKE%20%27%25" + valor + "%25%27";
				break;
			case 'not%20ilike':
				expresionfiltro = campo + "%20NOT%20ILIKE%20%27%25" + valor + "%25%27";
				break;
			default:
				expresionfiltro = campo + "%20" + condicion + "%20%27" + valor + "%27";

		}


		//var urlDatawfs = urlsourcewfs + "?service=WFS&version=1.0.0&request=GetFeature&typeName="+capawfs+"&"+maxcant+"outputFormat=application/json&format_options=false";

		var urlDatawfs = urlsourcewfs + "?service=WFS&version=" + versionwfs + "&request=" + requestwfs + "&typeName=" + capawfs + "&" + maxcant + "outputFormat=application/json&CQL_FILTER=" + expresionfiltro + "&srsName=EPSG:4326";



		//Funcion que engloba el ajax en un solo parametro
		//Se considera que existe JQuery
		var service = $.ajax({
			url: '/data_search',
			data: {
				url_resq: urlDatawfs
			},
			method: 'POST'
		});

		service.done(function done(data) {

			//Verificamos segun el codigo las acciones

			//1000: la respuesta no es la adecuada
			//1001: la respuesta sobrepasa el maximo del visualizador
			//1002: la respuesta es vacia


			switch (data.code) {

				case 1000:
					var textomen = "<strong>Advertencia!</strong> La respuesta del Servidor No es adecuada";
					var mensaje = "<div class='alert alert-danger alert-dismissible' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> " + textomen + "</div>";
					$("#filter-mensaje")[0].innerHTML = mensaje;

					break;

				case 1001:
					var textomen = "<strong>Información!</strong> El resultado de la busqueda ha devuelto " + data.cantidad + " registros, el mismo no puede ser mostrado porque la visualizacion se encuentra limitada a " + maximo + " registros ";
					var mensaje = "<div class='alert alert-info alert-dismissible' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> " + textomen + "</div>";
					$("#filter-mensaje")[0].innerHTML = mensaje;

					break;

				case 1002:
					var textomen = "<strong>Información!</strong> La busqueda no arroja resultados";
					var mensaje = "<div class='alert alert-info alert-dismissible' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> " + textomen + "</div>";
					$("#filter-mensaje")[0].innerHTML = mensaje;


					break;

				case 200:


					//Si devolvio resultados
					$("#filter-modal").modal("hide");
					console.log(data.datos);
					$("#result-layer")[0].innerHTML = "<a href='#'>" + capatitle + "</a>";
					$("#result-filter")[0].innerHTML = "<a href='#'>&nbsp;Filtro:&nbsp; " + campo + " " + alphacond(condicion) + " " + valor + "&nbsp;</a>";
					$("#result-content")[0].innerHTML = data.datos;

					$("#navbar-flex").slideDown("slow");
					$("div#panel").slideDown("slow");

					geodatos = data.geodatos;

					//Borro por si ya existen resultados
					if (map.hasLayer(resultados)) {
						//Borro las capas de resultados anteriores
						map.removeLayer(resultados);
					}


					//Creo el geojson para incorporar
					resultados = L.geoJson(geodatos);
					map.addLayer(resultados);
					//Aplica Estilos
					resultados.bringToFront();
					resultados.setStyle({
						"color": "#FFFF00",
						"weight": 5,
						"opacity": 1,
						"fill": false
					});
					map.fitBounds(resultados.getBounds());


					break;

				default:
					var textomen = "<strong>Advertencia!</strong> El servidor no responde adecuadamente";
					var mensaje = "<div class='alert alert-danger alert-dismissible' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> " + textomen + "</div>";
					$("#filter-mensaje")[0].innerHTML = mensaje;

			}


		});

		service.fail(function (jqXHR, textStatus) {
			var textomen = "<strong>Error!</strong> La conexión ha fallado";
			var mensaje = "<div class='alert alert-danger alert-dismissible' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> " + textomen + "</div>";
			$("#filter-mensaje")[0].innerHTML = mensaje;

			console.log("Mensaje de Error del Servicio: " + textStatus);
		});





	},
	removeLayer: function (layerId) {
		var map = this._map;
		var layerIndex = this._getLayerIndex(layerId);
		if (layerIndex != undefined) {
			var layerContainer = this._layers[layerIndex];
			var layer = layerContainer.layer;
			map.removeLayer(layerContainer.layer);
			delete layerContainer.layer;
			delete layer;
			delete layerContainer;
			this._layers.splice(layerIndex, 1);
		}
		if (this._reloadHandlers.hasOwnProperty(layerId + "__moveend")) {
			map.off("moveend", this._reloadHandlers[layerId + "__moveend"]);
			delete this._reloadHandlers[layerId + "__moveend"];
		}
	}
});