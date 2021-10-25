
import { Feature, Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import axios from 'axios';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';


const bgLayer = new TileLayer({
  source: new XYZ({
    url: "https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=IGPIexDjG8gGAkN35tKd3VoLnFKykGsG",
    crossOrigin: '*'
  }),
})

const map = new Map({
  target: 'map',
  layers: [bgLayer],
  view: new View({
    projection: 'EPSG:3857',
    minZoom: 8,
    maxZoom: 20,
    center: fromLonLat([-5.082808, 56.984374]),
    zoom: 8
  })
});

const munros = []

const buildMunroFeature = (munro) => (
  new Feature({
    geometry: new Point(fromLonLat([munro.latlng_lng, munro.latlng_lat])),
    ...munro
  })
)

axios.get("https://munroapi.herokuapp.com/munros").then(
  response => {
    response.data.forEach(munro => {
      const munroFeature = buildMunroFeature(munro)
      munros.push(munroFeature)
    })

    const munroLayer = new VectorLayer({
      source: new VectorSource({
        features: munros
      })
    })

    map.addLayer(munroLayer)

  });