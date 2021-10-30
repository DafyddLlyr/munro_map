
import { Feature, Map, View } from 'ol';
import Overlay from 'ol/Overlay';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import axios from 'axios';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';
import RenderFeature from 'ol/render/Feature';


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

const popup = new Overlay({
  element: document.getElementById('popup') || undefined
});

map.on("click", (e) => {
  map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
    setupPopup(e.coordinate, feature);
    map.addOverlay(popup);
  })
});

const setupPopup = (coord: Coordinate, feature: RenderFeature | Feature<Geometry>) => {
  popup.setPosition(coord);
  document.getElementById('popup-content');
  const props = feature.getProperties()
  const munroDetails = `
    <div>
      <h2>${props.name}</h2>
      <p><b>Height:</b> <span>${props.height}m</span></p>
      <p><b>Region:</b> <span>${props.region}</span></p>
      <p><b>Lat Long:</b> <span>[${props.latlng_lat}, ${props.latlng_lng}]</span></p>
      <p><b>Grid Ref:</b> <span>${props.gridref_letters} ${props.gridref_eastings} ${props.gridref_northings}</span></p>
      <p><b>Meaning:</b> <span>${props.meaning}m</span></p>
    </div>
`
popup.getElement()!.innerHTML = munroDetails;
}

const munros = []

const buildMunroFeature = (munro) => (
  new Feature({
    geometry: new Point(fromLonLat([munro.latlng_lng, munro.latlng_lat])),
    ...munro
  })
)



axios.get("https://munroapi.herokuapp.com/munros")
  .then(
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