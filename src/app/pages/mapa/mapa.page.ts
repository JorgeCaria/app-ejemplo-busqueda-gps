import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';

declare var google : any;
declare var require: any
const geocoder = new google.maps.Geocoder();
let polygon_asturias = 
         [[42.06560675405716,-7.8662109375,],
         [42.06560675405716,-3.6090087890625004],
        [43.88997537383687,-3.6090087890625004],
        [43.88997537383687,-7.8662109375],
        [42.06560675405716, -7.8662109375]];

        
let polygon_asturias_invertido = 
        [[-7.8662109375,42.06560675405716],
        [-3.6090087890625004,42.06560675405716],
       [-3.6090087890625004,43.88997537383687],
       [-7.8662109375,43.88997537383687],
       [-7.8662109375,42.06560675405716]];

       

let dibujo_Asturias = [
          {lat: 43.67432820783561, lng: -5.844039916992187},
          {lat: 43.59232754538541, lng: -7.00927734375},
          {lat: 43.464880828929545, lng: -7.0697021484375},
          {lat: 43.42898792344155, lng: -7.174072265624999},
          {lat: 43.37710501700073, lng: -7.1575927734375},
          {lat:  43.305193797650546, lng: -7.0916748046875},
          {lat: 43.13306116240612, lng:  -6.954345703125},
          {lat: 42.87596410238256, lng:-6.7510986328125 },
          {lat:  42.956422511073335, lng: -6.43798828125},
          {lat: 43.05684777584547, lng: -6.3555908203125},
          {lat:  43.01669737169671, lng: -6.218261718749999},
          {lat: 43.03677585761058 , lng: -6.08642578125},
          {lat:  43.08894918346591, lng:  -5.9490966796875},
          {lat: 42.96044267380142, lng: -5.8721923828125},
          {lat: 43.02071359427862, lng:-5.718383789062499 },
          {lat:  43.04480541304369, lng:  -5.5535888671875},
          {lat:  43.072900581493215, lng: -5.3448486328125},
          {lat: 43.12504316740127, lng: -5.1690673828125},
          {lat: 43.100982876188546, lng: -5.1031494140625},
          {lat: 43.193162620926074, lng: -5.05645751953125},
          {lat: 43.19516498456403, lng: -4.96856689453125},
          {lat: 43.22319117678928, lng: -4.87518310546875},
          {lat: 43.18515250937298, lng: -4.8065185546875},
          {lat: 43.201171681272456, lng: -4.7296142578125},
          {lat: 43.257205668363206, lng: -4.72412109375},
          {lat: 43.27320591705845, lng: -4.64996337890625},
          {lat: 43.31918320532585, lng: -4.592285156249999},
          {lat: 43.35314407444698, lng: -4.52911376953125},
          {lat:  43.38708594974803, lng: -4.50439453125},
          {lat: 43.41302868475145 , lng:  -4.49615478515625},
          {lat: 43.67432820783561, lng: -5.844039916992187},
        ];

let dibujo_triangulo_oviedo = [
          {lat:  43.40429919674392, lng: -5.854339599609374},
          {lat: 43.333918561984014, lng: -5.875282287597655},
          {lat: 43.36312895068202, lng: -5.778465270996094},
          {lat:  43.40429919674392, lng: -5.854339599609374},
        ];

let poligono_triangulo_oviedo = 
         [
        [43.40429919674392,-5.854339599609374],
        [43.333918561984014,-5.875282287597655],
        [43.36312895068202,-5.778465270996094],
        [43.40429919674392,-5.854339599609374],
        ];

let poligono_oviedo = 
        [
       [43.401056495052906,-5.840435028076172],
       [43.358511149653154,-5.8933067321777335],
       [43.3332942549869,-5.850563049316406],
       [43.378227953964156,-5.790309906005859],
       [43.401056495052906,-5.840435028076172],
       ];



@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})

export class MapaPage{
  [x: string]: any;
  
  @ViewChild('map', {read: ElementRef, static: false})mapRef: ElementRef;
  map: any;
  address:string;
  lat: string;
  long: string;  
  autocomplete: { input: string,};
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  coordenadas: any;
  label_coordenadas:any;
  esta_dentro:any;
  currentMapTrack:any;
  resultados_lat:any;
  resultados_long:any;

  infoWindows:any;
  markers: any = [];


  constructor( 
        
    public zone: NgZone,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: ''};
    this.autocompleteItems = []; 
    
  }

  ionViewDidEnter(){
    this.showMap();
  }

  showMap(){
    const location = new google.maps.LatLng(43.361557, -5.849807);
    const options = {
      center:location,
      zoom:9,
      disableDefaultUI: true
    }

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.drawPath(dibujo_triangulo_oviedo);
  }

  drawPath(path){
    this.currentMapTrack = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor:'#ff00ff',
      strokeOpacity:1.0,
      strokeWeight:3
    });

    this.currentMapTrack.setMap(this.map);
  }


  addaMarkersToMap(markers){
    for(let marker of markers){
      let position = new google.maps.LatLng(marker.latitude, marker.longitude);
      let mapMarker= new google.maps.Marker({
        position:position,
        title:marker.title,
        latitude: marker.latitude,
        longitude: marker.longitude,
      });

      mapMarker.setMap(this.map);

      
      
      //this.addInfoWindowToMarker(mapMarker);
    }
  }

  
  //AUTOCOMPLETE, SIMPLEMENTE ACTUALIZAMOS LA LISTA CON CADA EVENTO DE ION CHANGE EN LA VISTA.
  UpdateSearchResults(){
    
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input, componentRestrictions:{ country: 'es' } },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
  
  //FUNCION QUE LLAMAMOS DESDE EL ITEM DE LA LISTA.
  SelectSearchResult(item) {
    //AQUI PONDREMOS LO QUE QUERAMOS QUE PASE CON EL PLACE ESCOGIDO, GUARDARLO, SUBIRLO A FIRESTORE.
    //HE AÑADIDO UN ALERT PARA VER EL CONTENIDO QUE NOS OFRECE GOOGLE Y GUARDAMOS EL PLACEID PARA UTILIZARLO POSTERIORMENTE SI QUEREMOS.
    
    //alert(JSON.stringify(item))      
    this.placeid = item.place_id

    geocoder.geocode({ address: item.description }, (results, status) => {
      if (status === "OK") {
          // Resultados en consola
          console.log(results);

          this.coordenadas = results[0].geometry.location;
          //alert(this.coordenadas = results[0].geometry.location);
          this.label_coordenadas = 'Coordenadas:'

          
         
         //ESTA FUNCIÓN COMPARA UN PUNTO DE COORDENADAS CON UN ARRAY DE PUNTOS DE COORDENADAS DEVOLVIENDO UN BOOLEANO SI EL PUNTO SE ENCUENTRA DENTRO DEL POLIGONO FORMADO POR EL ARRAY
         let pointInPolygon = require('point-in-polygon');

        

        let resultados_busqueda = JSON.stringify(results[0].geometry.location);

        this.resultados_lat = resultados_busqueda.slice(
          resultados_busqueda.indexOf(':')+1, resultados_busqueda.lastIndexOf(',')
        );
        
        this.resultados_long = resultados_busqueda.slice(
          resultados_busqueda.indexOf('lng')+5, resultados_busqueda.lastIndexOf('}')
        );


        this.esta_dentro = pointInPolygon([this.resultados_lat,this.resultados_long], poligono_triangulo_oviedo);
        
        this.markers= [
          {
            title: "Sitio seleccionado",
            latitude: this.resultados_lat,
            longitude: this.resultados_long
          }
        ];

        this.addaMarkersToMap(this.markers);

      } else {
          alert("Geocode error: " + status);
      }
    });
  
  } 
  
  //LLAMAMOS A ESTA FUNCION PARA LIMPIAR LA LISTA CUANDO PULSAMOS IONCLEAR.
  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }
}
