(function(){
    
    //URL to fetch
    const DATA_URL = "https://opensky-network.org/api/states/all";

    //create map in leaflet and tie it to the div called 'theMap'
    var map = L.map('theMap').setView([56.13, -106.34], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    L.marker([44.8752, -63.5052]).addTo(map)
        .bindPopup('This map shows every airplane whose origin country is Canada, on real time, and this point here is Halifax Stanfield International Airport!')
        .openPopup();

    //Creating an airplane icon
    var airplane = L.icon({
        iconUrl: 'plane4-45.png',
        iconSize:     [45, 45], // size of the icon
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    //Creating layer
    let myLayer = L.geoJSON(null,{
        pointToLayer: function(feature,latlng){
            //ploting airplan and given it some rotation
          var marker = L.marker(latlng,{icon: airplane, rotationAngle: feature.properties.trueTrack});
          //popup for every plane
          marker.bindPopup(
              'icao24: '
              + feature.properties.id
              + '<br/>' 
              + 'velocity (m/s): '
              + feature.properties.velocity 
              + '<br/>' 
              + 'origin_country: '
              + feature.properties.originCountry
              + '<br/>' 
              + 'on_ground: '
              + feature.properties.onGround
              );
          return marker;
        }
      }).addTo(map)

    //Fetching Data  
    let gatherRealTimeInfo = () => {
        // geoJson
        let geoJsonObject = {
            "type": "FeatureCollection",
            "features": []
        } 
        //Flag for fetching data from API
        let isDataRetrieved = false
        //Fetching
        fetch(DATA_URL)
            .then(function(response){
                //Source: https://www.amitmerchant.com/check-if-api-failing-fetch-javascript/
               if(response.ok) {
                isDataRetrieved=true
               }
               console.log(response)
                return response.json();
            })
            .then(function(json){
                json.states
                //Filter Canada airplanes
                    .filter(element=>{ return element[2]==='Canada'})
                //Creating geoJson
                    .map(element => {
                        geoJsonObject.features.push( 
                                {
                                "type": "Feature",
                                "properties": {
                                    "id": element[0],
                                    "callsign": element[1],
                                    "originCountry": element[2],
                                    "timePosition": element[3],
                                    "lastContact": element[4],
                                    "baroAltitude": element[7],
                                    "onGround": element[8],
                                    "velocity": element[9],
                                    "trueTrack": element[10],
                                    "verticalRate": element[11],
                                    "sensors": element[12]  ,
                                    "geoAltitude": element[13],
                                    "squawk": element[14],
                                    "spi": element[15],
                                    "positionSource": element[16]
                                },
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [element[5], element[6]] //latitude, longitude
                                    }
                                })
                    })
        //Consoling the object (just testing)
        console.log(geoJsonObject)
        //Clearing layer
        myLayer.clearLayers()
        //Adding data
        myLayer.addData(geoJsonObject)
        
        //Assuring re-fetching after receiving of data. Retrieving data every 10s
        if(isDataRetrieved) {
            setTimeout(gatherRealTimeInfo, 10000)
        }
    })}
    //Running the first time
        gatherRealTimeInfo();
})()