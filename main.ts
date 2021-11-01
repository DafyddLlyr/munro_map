
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
import { Fill, RegularShape, Stroke, Style } from 'ol/style';

const container = document.getElementById('popup') as HTMLElement;
const content = document.getElementById('popup-content') as HTMLElement;
const closer = document.getElementById('popup-closer') as HTMLElement;
const infoModal = document.getElementById('info-modal') as HTMLElement;
const infoButton = document.getElementById('info') as HTMLElement;

const munros: Feature<Point>[] = []

const bgLayer = new TileLayer({
  source: new XYZ({
    url: "https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=IGPIexDjG8gGAkN35tKd3VoLnFKykGsG",
    crossOrigin: '*'
  }),
})

infoButton.onclick = (e) => infoModal.classList.toggle('info-visible');
infoModal.onclick = (e) => infoModal.classList.toggle('info-visible');

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

map.on("click", (e) => {
  map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
    setupPopup(e.coordinate, feature);
    map.addOverlay(popup);
  })
});

const popup = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

closer.onclick = () => {
  popup.setPosition(undefined);
  closer!.blur();
  return false;
};

const setupPopup = (coord: Coordinate, feature: RenderFeature | Feature<Geometry>) => {
  popup.setPosition(coord);
  const props = feature.getProperties()
  const munroDetails = `
    <div class="munro-details">
      <h2 class="munro-name">${props.name}</h2>
      <hr />
      <p><b>Height:</b> <span>${props.height}m</span></p>
      <p><b>Region:</b> <span>${props.region}</span></p>
      <p><b>Lat Long:</b> <span>${props.latlng_lat}, ${props.latlng_lng}</span></p>
      <p><b>Grid Ref:</b> <span>${props.gridref_letters} ${props.gridref_eastings} ${props.gridref_northings}</span></p>
      <p><b>Meaning:</b> <span>${props.meaning}</span></p>
    </div>
    `
  content!.innerHTML = munroDetails;
}

const buildMunroFeature = (munro: { [key: string]: any }) => (
  new Feature({
    geometry: new Point(fromLonLat([munro.latlng_lng, munro.latlng_lat])),
    ...munro
  })
)

const munroStyle = new Style({
  image: new RegularShape({
    fill: new Fill({
      color: '#8bc34a'
    }),
    stroke: new Stroke({
      color: 'black'
    }),
    points: 3,
    radius: 10,
  }),
})

axios.get("https://munroapi.herokuapp.com/munros").then(
  response => {
    response.data.forEach((munro: { [key: string]: any }) => {
      const munroFeature = buildMunroFeature(munro)
      munros.push(munroFeature)
    })

    const munroLayer = new VectorLayer({
      source: new VectorSource({
        features: munros,
      }),
      style: munroStyle,
    })

    map.addLayer(munroLayer)
  }
);