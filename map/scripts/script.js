const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [-74.006, 40.7128], // New York City coordinates
    zoom: 10
});

new maplibregl.Marker()
    .setLngLat([-74.006, 40.7128])
    .addTo(map);