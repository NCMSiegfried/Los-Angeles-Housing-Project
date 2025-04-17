const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/topo-v2-dark/style.json?key=IO8n64EFzCLGpJrn7JW3',
    center: [-118.2426, 34.0549], // Los Angeles coordinates
    zoom: 8,
    minZoom: 7
});

function rotateAndZoom() {
    map.easeTo({
        zoom: 10,      // Zoom in
        duration: 3500, // Smooth transition over 5 seconds
        pitch: 40
    });
}

map.on('load', function () {
    rotateAndZoom();
    fetch('../data/Los_Angeles_Sold.geojson')
    .then(response => response.json())
    .then(data => {
      map.addSource('my-geojson', {
        type: 'geojson',
        data: data
      });

      map.addLayer({
        id: 'geojson-layer',
        type: 'circle',
        source: 'my-geojson',
        paint: {
          'circle-radius': 5,
          'circle-color': '#007cbf'
        }
      });
    });
});


