import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';


declare var google;



var mi_GeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "stroke": "#555555",
        "stroke-width": 2,
        "stroke-opacity": 1,
        "fill": "#555555",
        "fill-opacity": 0.5,
        "name": "aviles_coordenadas"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -5.939140319824219,
              43.59481405781924
            ],
            [
              -5.954246520996094,
              43.58175872138417
            ],
            [
              -5.953044891357422,
              43.54929461786305
            ],
            [
              -5.911502838134766,
              43.52204112424862
            ],
            [
              -5.882320404052734,
              43.54369559037468
            ],
            [
              -5.9154510498046875,
              43.58996526341285
            ],
            [
              -5.917682647705077,
              43.59568431289932
            ],
            [
              -5.939140319824219,
              43.59481405781924
            ]
          ]
        ]
      }
    }
  ]
}

const geocoder = new google.maps.Geocoder();


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {
  [x: string]: any;
  
  @ViewChild('map',  {static: false}) mapElement: ElementRef;
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

  constructor( 
        
    public zone: NgZone,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: ''};
    this.autocompleteItems = []; 
    
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
          this.label_coordenadas = 'Coordenadas:'
          
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
