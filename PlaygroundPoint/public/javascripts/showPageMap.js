  mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
      center: playground.geometry.coordinates, // starting position [lng, lat]
      zoom: 9 // starting zoom
  });

 new mapboxgl.Marker()
     .setLngLat(playground.geometry.coordinates)
     .setPopup(
       new mapboxgl.Popup({ offset: 25 })
       .setHTML(
         `<h4>${playground.title}</h4><p>${playground.location}</p>`
       )
     )
     .addTo(map)