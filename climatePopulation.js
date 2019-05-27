mapboxgl.accessToken = 'pk.eyJ1IjoiZGFodWdldCIsImEiOiJjam02cmJhOWMwMzExM3BudHJnMGs1YjZpIn0.hLEElhVcuvUz9J4iCw29VQ';

// map object created from Mapbox Studio style
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dahuget/cjo6fkjot1fq82rmir9hqx9x3',
  center: [0.000000, -0.000000],
  zoom: 1.4
});

// callback function executed when map is finished loading (required)
map.on('load', function() {
  
  // country styling based on population in millions (values from Mapbox Studio style)
  var layers = ['0-5', '5-10', '10-25', '25-50', '50-75', '75-100', '100-200', '200-1,000', '1,000+'];
  var colors = ['#9E95EF', '#8084E9', '#717CE6', '#6274E4', '#536CE1', '#4463DE', '#355BDC', '#2653D9', '#0843D4'];

  // add country population legend 
  for (i = 0; i < layers.length; i++) {
      var layer = layers[i];
      var color = colors[i];
      var item = document.createElement('div');
      var key = document.createElement('span');
      key.className = 'legend-key';
      key.style.backgroundColor = color;

      var value = document.createElement('span');
      value.innerHTML = layer;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
  }

  // year ranges for each climate layer (match layer name)
  var years = ['1901-1925', '1926-1950', '1951-1975', '1976-2000', '2001-2025', '2026-2050', '2051-2075', '2076-2100'];

  // hide all year layers except for the first
  for (var i = 1; i < years.length; i++) {
    map.setLayoutProperty(years[i], 'visibility', 'none');
  }

  // slider for showing different climate year layers
  document.getElementById('slider').addEventListener('input', function(e) {
    
    var index = parseInt(e.target.value);

    // update the map
    var selectedLayer = years[index];
    e.preventDefault();
    e.stopPropagation();

    var visibility = map.getLayoutProperty(selectedLayer, 'visibility');
    
    if (visibility === 'visible') {
        map.setLayoutProperty(selectedLayer, 'visibility', 'none');
    } else {
        map.setLayoutProperty(selectedLayer, 'visibility', 'visible');
    }

    // update text in the UI
    document.getElementById('active-year').innerText = years[index];
  });

  // radio buttons to switch between map layers (climate/population)
  document.getElementById('filters').addEventListener('change', function(e) {
    
    var infoBox = document.getElementById('info');
    var selectedMap = e.target.value;

    if (selectedMap === 'climate-map') {
      document.getElementById('classification').hidden = false;
      sliderbar.hidden = false;
      map.setLayoutProperty(years[0], 'visibility', 'visible');
      
      for (var i = 1; i < years.length; i++) {
        map.setLayoutProperty(years[i], 'visibility', 'none');
      }
      legend.hidden = true;
      infoBox.hidden = true;
    } else {
      document.getElementById('classification').hidden = true;
      sliderbar.hidden = true;
      
      for (var i = 0; i < years.length; i++) {
        map.setLayoutProperty(years[i], 'visibility', 'none');
      }
      legend.hidden = false;
      infoBox.hidden = false;
    }
  });

  // add the global population info window with hover capability
  map.on('mousemove', function(e) {
    
    var countries = map.queryRenderedFeatures(e.point, {
        layers: ['countries']
    });
    
    // update text in UI
    if (countries.length > 0) { 
      var population = (countries[0].properties.POP_EST/1000000).toFixed(3);
        document.getElementById('pd').innerHTML = '<h3><strong>' + countries[0].properties.NAME_LONG + '</strong></h3><p><strong><em>' + population + '</strong> million people</em></p>';
    } else {
        document.getElementById('pd').innerHTML = '<p><i>(hover over a country)</i></p>';
    }
  });
});
