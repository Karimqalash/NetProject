     var map;
     let data;
     

     function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 9,
          center: {lat: -43 ,lng: 172}
        });

          fetch('data/map.geojson').then(response => {
            return response.json();
          }).then(data => {
               loadGeoJson(map,data);
          }).catch(err => {
               alert(err)
          });

     }

     function loadGeoJson(map,data) {
          var geojson;
          geojson=data
          
          map.data.addGeoJson(geojson);

          fetch('data/tracking_concept.cfm').then(response => {
               return response.json();
          }).then(data => {
               trackingApi(map,geojson,data.position,data.speed)
          }).catch(err => {
               alert(err)
          });   

          setInterval(function(){
               fetch('data/tracking_concept.cfm').then(response => {
                    return response.json();
               }).then(data => {
                    trackingApi(map,geojson,data.position,data.speed)
               }).catch(err => {
                    alert(err)
               });   
          }, 10000);//change time for intervals between checking the tracking api

     }


     function trackingApi(map,data,p,s){

          let i = Math.floor(data.features[0].geometry.coordinates.length*(p/100))


          let v = 60000/((data.features[0].geometry.coordinates.length)*s)

          let pos={
               lat: data.features[0].geometry.coordinates[i][1], 
               lng: data.features[0].geometry.coordinates[i][0]}

          var marker = new google.maps.Marker({
               map: map,
               position: pos
          });
          
          

          setUp(i,v)

          function setUp(i,v){
               if (i < data.features[0].geometry.coordinates.length){
                    let pos={
                         lat: data.features[0].geometry.coordinates[i][1], 
                         lng: data.features[0].geometry.coordinates[i][0]}
                    marker.setPosition(pos)
                    move(i,v);
               }
          }

          function move(i,v){
               setTimeout(function(){
                   i++;
                   setUp(i,v);
               }, v);
          }

          setTimeout(function(){
               marker.setMap(null)
          },10000)//change time for intervals between checking the tracking api
     }

     