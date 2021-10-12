import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { Map, View } from 'ol';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});
