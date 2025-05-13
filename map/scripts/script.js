const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/topo-v2-dark/style.json?key=IO8n64EFzCLGpJrn7JW3',
    center: [-118.3426, 34.0], // Los Angeles coordinates
    zoom: 8,
    minZoom: 7
});

function rotateAndZoom() {
    map.easeTo({
        zoom: 9.5,      // Zoom in
        duration: 3000, // Smooth transition over 5 seconds
        pitch: 40
    });
}

map.setMaxBounds([
  [-121.3426, 32.0], // Southwest coordinates [lng, lat]
  [-115.3426, 36.0]  // Northeast coordinates [lng, lat]
]);

map.on('load', function () {
    rotateAndZoom();
    map.addSource('sold-houses', {
    type: 'geojson',
    data: '../data/Los_Angeles_Sold.geojson',
    cluster: true,
    clusterMaxZoom: 10, // Max zoom to cluster points on
    clusterRadius: 40
    });
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'sold-houses',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',  // small clusters
          50, '#f1f075', // medium
          250, '#f28cb1'  // large
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          50, 30,
          250, 40
        ]
      }
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'sold-houses',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Arial Unicode MS Bold'],
        'text-size': 12
      }
    });
    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'sold-houses',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 6,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });
});

map.on('mouseenter', 'clusters', () => {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', () => {
  map.getCanvas().style.cursor = '';
});
map.on('mouseenter', 'unclustered-point', () => {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'unclustered-point', () => {
  map.getCanvas().style.cursor = '';
});
map.on('click', 'clusters', async (e) => {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    const zoom = await map.getSource('sold-houses').getClusterExpansionZoom(clusterId);
    map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom + 1
    });
});
map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const listPrice = e.features[0].properties.list_price;
    console.log(e.features[0].properties)
    new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(
            `List Price: $${listPrice}`
        )
        .addTo(map);
});
function priceSymbology(){
    map.setPaintProperty('points-layer', 'circle-color', [
        'interpolate',
        ['linear'],
        ['get', 'price'],
        0, '#ffffcc',     // new sorted color scheme: light yellow
        500, '#a1dab4',
        1000, '#41b6c4',
        2000, '#2c7fb8',
        5000, '#253494'   // deep blue for highest prices
      ]);
}
//document.getElementById('sortColorsButton').addEventListener('click', () => {
//  priceSymbology
//});
