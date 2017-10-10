
//Armado del Arbol
var padre = {
        "code": null,
        "name": null,
        "active": true,
        "selectedByDefault": false,
        "openByDefault": true,
        "childLayers": [],
        "selectType": null,
        "serviceType": null,
        "params": {}
      };

//Datos de ingreso

//Grupos

var groups = {
   "sis_ref":{
      "title":"Sistemas de referencia",
      "expanded":false
   },
   "unid_ter":{
      "title":"Unidades Territoriales",
      "expanded":false
   },
   "Cartografia":{
      "title":"Cartografia y SIG",
      "expanded":true
   },
//    "infraestructura":{
//       "title":"Infraestructura",
//       "expanded":false
//    },
//    "ambiente":{
//       "title":"Medioambiente y Recursos Naturales",
//       "expanded":false
//    },
//    "educacion":{
//       "title":"Educacion",
//       "expanded":false
//    },
//    "turismo":{
//       "title":"Turismo",
//       "expanded":false
//    },
//    "agro":{
//       "title":"Agricultura y ganaderia",
//       "expanded":false
//    },
//    "varios":{
//       "title":"Varios",
//       "expanded":false
//    },
//    "imagenes_digitales":{
//       "title":"Imágenes Digitales",
//       "expanded":false
//    },
   "background":{
      "title":"Capas Base",
      "exclusive":true
   }
};


var capas = [
   {
      "source":"SVRCATIDE",
      "id":"681",
      "name":"Parcelas_Rur",
      "visibility":false,
      "title":"Parcelas Rurales",
      "group":"Cartografia",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=ce9ea27e-2aa5-4583-ac67-133dfdfd9f0d"
   },
   {
      "source":"SRV_PRUEBA",
      "id":"620",
      "name":"PASIS74_F-RRURALES_VER",
      "visibility":false,
      "title":"Fracciones y Radios Rurales",
      "group":"Cartografia",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=ce9ea27e-2aa5-4583-ac67-133dfdfd9f0d"
   },
   {
      "source":"SRV_PRUEBA",
      "id":"620",
      "name":"fracciones-radios",
      "visibility":false,
      "title":"Fracciones y Radios",
      "group":"Cartografia",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=ce9ea27e-2aa5-4583-ac67-133dfdfd9f0d"
   },
   {
      "source":"MCYT",
      "id":"620",
      "name":"0",
      "visibility":false,
      "title":"Antenas wifi",
      "group":"Cartografia",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=ce9ea27e-2aa5-4583-ac67-133dfdfd9f0d"
   },
   {
      "source":"SRV_PRUEBA",
      "id":"620",
      "name":"Localidades",
      "visibility":false,
      "title":"Localidades",
      "group":"Cartografia",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=ce9ea27e-2aa5-4583-ac67-133dfdfd9f0d"
   },
   {
      "source":"SRV_PRUEBA",
      "id":"620",
      "name":"contexto",
      "visibility":false,
      "title":"Contexto",
      "group":"Cartografia",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=ce9ea27e-2aa5-4583-ac67-133dfdfd9f0d"
   },
   {
      "source":"SRV_PRUEBA",
      "id":"620",
      "name":"74_SAN_LUIS_GK3",
      "visibility":false,
      "title":"San Luis CONAE",
      "group":"Cartografia",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=ce9ea27e-2aa5-4583-ac67-133dfdfd9f0d"
   },
   {
      "source":"SVRCATIDE",
      "id":"682",
      "name":"Manzanas",
      "visibility":false,
      "title":"Manzanas Catastrales",
      "group":"Cartografia",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=ce00dfe3-1ed4-4f68-bcff-1dc2b483de02"
   },
   {
      "source":"SVRCATIDE",
      "id":"683",
      "name":"Parcelas_Urb",
      "visibility":false,
      "title":"Parcelas Urbanas",
      "group":"Cartografia",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=ef18d3e2-9cd7-443f-b2d4-c25745c09cf5"
   },
   {
      "source":"Prueba",
      "id":"863",
      "name":"conus_ir_4km",
      "visibility":false,
      "title":"conus",
      "group":"infraestructura",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=71e168b7-7638-4b37-9744-cef530207aec"
   },
   {
      "source":"MCYT",
      "id":"721",
      "name":"1",
      "visibility":false,
      "title":"NODO ESTRELLA",
      "group":"infraestructura",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=175458fd-e10a-4a30-beda-d4a4460b564a"
   },
   {
      "source":"mapSVROat2",
      "id":"883",
      "name":"fl_belgrano-FINAL.shp",
      "visibility":false,
      "title":"belgrano",
      "group":"ambiente",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=08bbf361-cd37-4e1b-ac04-26a6915c791a"
   },
   {
      "source":"SVRCATIDE",
      "id":"741",
      "name":"cuenca_el_morro",
      "visibility":false,
      "title":"cuenca_el_morro",
      "group":"educacion",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=791fef85-93ab-4181-b137-31d1ea98ecb3"
   },
   {
      "source":"mapSVROat2",
      "id":"903",
      "name":"Pasto del niño",
      "visibility":false,
      "title":"Pasto del niño",
      "group":"varios",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=02a2dcbc-6916-4ce0-9132-46efc44ff7d1"
   },
   {
      "source":"google_satelite",
      "id":"685",
      "name":"SATELLITE",
      "title":"Google Satélite",
      "group":"background"
   },
   {
      "source":"google_hibrido",
      "id":"686",
      "name":"HYBRID",
      "title":"Google hibrido",
      "group":"background"
   },
   {
      "source":"google",
      "id":"687",
      "name":"ROADMAP",
      "title":"Google Callejero",
      "group":"background"
   },
//    {
//       "source":"bing",
//       "id":"701",
//       "name":"Road",
//       "title":"Bing Carreteras",
//       "group":"background"
//    },
//    {
//       "source":"bing_satelite",
//       "id":"702",
//       "name":"Aerial",
//       "title":"Bing Foto Aérea",
//       "group":"background"
//    },
//    {
//       "source":"bing_hibrido",
//       "id":"703",
//       "name":"AerialWithLabels",
//       "title":"Bing Hibrido",
//       "group":"background"
//    },
   {
      "source":"osm",
      "id":"704",
      "name":"mapnik",
      "visibility":false,
      "title":"Open Street Map",
      "group":"background"
   },
   {
      "source":"IGN_ORTOFOTO_SAN_LUIS",
      "id":"689",
      "name":"san_luis",
      "title":"San Luis Ortofoto",
      "group":"imagenes_digitales",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=620850b6-2e5d-4ba8-b350-1e31d35e68fa"
   },
   {
      "source":"IGN_ORTOFOTO_V_MERCEDES",
      "id":"688",
      "name":"villa_mercedes",
      "title":"Villa Mercedes Ortofoto",
      "group":"imagenes_digitales",
      "metadataUrl":"http://testvisualide.dynalias.com/geonetwork/srv/spa/metadata.show?uuid=3e4f45b7-d049-4687-b70e-c0192270f590"
   },
    {
      "source":"SVRCATIDE",
      "id":"958",
      "name":"Provincias",
      "visibility":false,
      "title":"Otras Provincias",
      "group":"varios"

   }
];

var origen = {
	"ARCGIS2": {
		"url": "http://ulpgeoapp2.atlasdesanluis.edu.ar/arcgis/services/IDE/MCYT/MapServer/WMSServer",
		"url_wfs": "http://ulpgeoapp2.atlasdesanluis.edu.ar/arcgis/services/IDE/MCYT/MapServer/WFSServer",
		"server_type": "ARCGISSERVER",
		"title": "AECGIS2",
		"ptype": "WMS"
	},
	"IDE_ULP": {
		"url": "http://64.215.200.9/geoserver/NODO_IDE_01/wms",
		"url_wfs": "http://64.215.200.9/geoserver/NODO_IDE_01/wfs",
		"server_type": "GEOSERVER",
		"authentication_user": "idesl",
		"authentication_pass": "123",
		"title": "IDE_ULP",
		"ptype": "WMS"
	},
	"mapSVROat2": {
		"url": "http://oat.sanluis.gov.ar/cgi-bin/mapserv",
		"url_parameters": "map=/medioambiente/sanluis.map",
		"server_type": "MAPSERVER",
		"title": "mapSVROat2",
		"ptype": "WMS"
	},
	"TestIDE": {
		"url": "testvisualide.dynalias.com/geoserver/prueba_shp/wms",
		"url_wfs": "testvisualide.dynalias.com/geoserver/prueba_shp/wfs",
		"server_type": "GEOSERVER",
		"title": "TestIDE",
		"ptype": "WMS"
	},
	"NODO_IDE_01": {
		"url": "http://64.215.200.9/geoserver/NODO_IDE_01/wms",
		"url_wfs": "http://64.215.200.9/geoserver/NODO_IDE_01/wfs",
		"server_type": "GEOSERVER",
		"authentication_user": "idesl",
		"authentication_pass": "123",
		"title": "NODO IDE 1",
		"ptype": "WMS"
	},
	"ARCGisSVROat": {
		"url": "http://ulpgeoapp2.atlasdesanluis.edu.ar/arcgis/services/IDE/MCYT/MapServer/WMSServer",
		"url_wfs": "http://ulpgeoapp2.atlasdesanluis.edu.ar/arcgis/services/IDE/MCYT/MapServer/WFSServer",
		"server_type": "ARCGISSERVER",
		"title": "ARCGisSVROat",
		"ptype": "WMS"
	},
	"IDE_AUI": {
		"url": "http://64.213.148.86:8080/geoserver/ide/wms",
		"url_wfs": "http://64.213.148.86:8080/geoserver/ide/wfs",
		"server_type": "GEOSERVER",
		"authentication_user": "admin_ide",
		"authentication_pass": "B8Nu7Qd8",
		"title": "IDE_AUI",
		"ptype": "WMS"
	},
	"SVRCATIDE": {
		"url": "http://visualide.sanluis.gov.ar/geoserver/idesl/wms",
		"url_wfs": "http://visualide.sanluis.gov.ar/geoserver/idesl/wfs",
		"server_type": "GEOSERVER",
		"title": "SERVIDOR IDE CATASTRO SAN LUIS (TEST)",
		"ptype": "WMS"
	},
	"SRV_PRUEBA": {
		"url": "http://10.52.76.17:8080/geoserver/carto_estadisticas/wms",
		"url_wfs": "http://10.52.76.17:8080/geoserver/carto_estadisticas/wfs",
		"server_type": "GEOSERVER",
		"title": "SERVIDOR IDE CATASTRO SAN LUIS",
		"ptype": "WMS"
	},
	"MCYT": {
		"url": "http://ulpgeoapp2.atlasdesanluis.edu.ar/arcgis/services/IDE/MCYT/MapServer/WMSServer",
		"url_wfs": "http://ulpgeoapp2.atlasdesanluis.edu.ar/arcgis/services/IDE/MCYT/MapServer/WFSServer",
		"server_type": "ARCGISSERVER",
		"title": "MINISTERIO DE CIENCIA Y TECNOLOGIA",
		"ptype": "WMS"
	},
	"MCYT_IDE": {
		"url": "http://ulpgeoapp2.atlasdesanluis.edu.ar/arcgis/services/IDE/Capas/MapServer/WMSServer",
		"url_wfs": "http://ulpgeoapp2.atlasdesanluis.edu.ar/arcgis/services/IDE/Capas/MapServer/WFSServer",
		"server_type": "ARCGISSERVER",
		"title": "MINISTERIO DE CIENCIA Y TECNOLOGIA - IDE",
		"ptype": "WMS"
	},
	"MMACYP": {
		"url": "http://64.213.148.86:8080/geoserver/minmacyp/wms",
		"url_wfs": "http://64.213.148.86:8080/geoserver/minmacyp/wfs",
		"server_type": "GEOSERVER",
		"authentication_user": "admin_minmacyp",
		"authentication_pass": "n5NQ1dOW",
		"title": "MMACYP",
		"ptype": "WMS"
	},
	"osm": {
		"ptype": "OSM",
		"server_type": "BASES",
		"projection": "EPSG:3857",
		"id": "osm"
	},
	"San_Luis_Agua": {
		"url": "http://10.52.116.33:85/geoserver/wms",
		"url_wfs": "http://10.52.116.33:85/geoserver/wfs",
		"server_type": "GEOSERVER",
		"title": "Agua SL",
		"ptype": "WMS"
	},
	"Prueba": {
		"url": "http://mesonet.agron.iastate.edu/cgi-bin/mapserv/mapserv",
		"url_parameters": "map=/mesonet/www/apps/iemwebsite/data/wms/goes/conus_ir.map",
		"server_type": "MAPSERVER",
		"title": "prueba map",
		"ptype": "WMS"
	},
	"IGN_ORTOFOTO_SAN_LUIS": {
		"url": "https://ide.ign.gob.ar/geoservicios/services/sensores_remotos/san_luis/ImageServer/WMSServer",
		"server_type": "GEOSERVER",
		"title": "IGN_ORTOFOTO_SAN_LUIS",
		"ptype": "WMS"
	},
	"IGN_ORTOFOTO_V_MERCEDES": {
		"url": "https://ide.ign.gob.ar/geoservicios/services/sensores_remotos/villa_mercedes/ImageServer/WMSServer",
		"server_type": "GEOSERVER",
		"title": "IGN_ORTOFOTO_V_MERCEDES",
		"ptype": "WMS"
	},
	// "bing": {
	// 	"title": "Capas Base Bing",
	// 	"ptype": "BING",
	// 	"server_type": "BASES",
	// 	"projection": "EPSG:3857",
	// 	"id": "bing"
	// },
	// "bing_hibrido": {
	// 	"title": "Capas Base Bing",
	// 	"ptype": "BING_HYBRID",
	// 	"server_type": "BASES",
	// 	"projection": "EPSG:3857",
	// 	"id": "bing"
	// },
	// "bing_satelite": {
	// 	"title": "Capas Base Bing",
	// 	"ptype": "BING_SATELITE",
	// 	"server_type": "BASES",
	// 	"projection": "EPSG:3857",
	// 	"id": "bing"
	// },
	"google": {
		"title": "Capas Base Google",
		"ptype": "GOOGLE",
		"server_type": "BASES",
		"projection": "EPSG:3857",
		"id": "google"
	},
	"google_terreno": {
		"title": "Capas Base Google",
		"ptype": "GOOGLE_TERRAIN",
		"server_type": "BASES",
		"projection": "EPSG:3857",
		"id": "google"
	},
	"google_hibrido": {
		"title": "Capas Base Google",
		"ptype": "GOOGLE_HYBRID",
		"server_type": "BASES",
		"projection": "EPSG:3857",
		"id": "google"
	},
	"google_satelite": {
		"title": "Capas Base Google",
		"ptype": "GOOGLE_SATELITE",
		"server_type": "BASES",
		"projection": "EPSG:3857",
		"id": "google"
	}
};


///Genero las categorias del arbol

var treeG2 = [];

//Defino el grupo base del visualizador
var baseG = 'background';

for( ele in groups){
   console.log(groups[ele].title);

   //Verificamos que no sea el grupo de base
   if (ele != baseG){
      treeG2.push({
         "code": ele,
         "name": groups[ele].title,
         "active": true,
         "selectedByDefault": false,
         "openByDefault": groups[ele].expanded,
         "parent": padre,
         "childLayers": [ ],
         "selectType": "MULTIPLE",
         "serviceType": null,
         "params": {}
      });
   }else{
      treeG2.push({
         "code": ele,
         "name": groups[ele].title,
         "active": true,
         "selectedByDefault": false,
         "openByDefault": true,
         "childLayers": [ ],
         "selectType": "SINGLE",
         "serviceType": null,
         "params": {}
      } );


    }


}

///Genero el contenido de cada categoria

//Recorro las capas


var base_default = 'osm'
var base_selected = 'false'

var hijo = {};

for (var i=0;i< capas.length; i++){

   if (capas[i].source == base_default){
      base_selected = true;
   }else{
      base_selected = false;
   }

   hijo = {"code": capas[i].id,
      "name": capas[i].title,
      "active": true,
      "selectedByDefault": base_selected,
      "openByDefault": capas[i].visibility ,
      "metadataUrl": capas[i].metadataUrl,
      "parent": padre,
      "childLayers": [],
      "selectType": "NONE",
      "serviceType": get_type_service(capas[i].source,origen),
      "params":{
         "url": get_source(capas[i].source,origen),
         "urlWfs": get_url_wfs(capas[i].source,origen),
         "serverType": get_type_server(capas[i].source,origen),
         "transparent": "TRUE",
         "layers": capas[i].name,
         "format": 'image/png',
         "version": '1.1.1'
      }

   };

   put_child(capas[i].group,hijo, treeG2);

}

//Agrega hijos al arbol generado

function put_child(code, hijo, arbol){
    for (var i=0;i< arbol.length; i++){
        if (arbol[i].code == code){
            arbol[i].childLayers.push(hijo);
        }
    }
}

//Obtiene la url del source
function get_source(code, source){
   var resultado='';
   //Verificamos si tiene parametros
   if ( source[code].url_parameters != undefined){
       resultado =  source[code].url+'?'+ source[code].url_parameters;
   } else {
      resultado =  source[code].url;
   }


    return resultado;
}

//Obtiene el tipo de servicio para la capa
function get_type_service(code, source){
    return source[code].ptype;
}


//Obtiene la url wfs de la capa
function get_url_wfs(code, source){

   return source[code].url_wfs;
}

//Obtiene el tipo de servidor
function get_type_server(code, source){
    return source[code].server_type;
}


