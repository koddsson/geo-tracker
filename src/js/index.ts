import Map from 'https://cdn.skypack.dev/ol/Map.js'
import View from 'https://cdn.skypack.dev/ol/View.js'
import Feature from 'https://cdn.skypack.dev/ol/Feature.js'
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js'
import XYZ from 'https://cdn.skypack.dev/ol/source/XYZ.js'
import Point from 'https://cdn.skypack.dev/ol/geom/Point.js'
import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector.js'
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js'
import {fromLonLat, transform} from 'https://cdn.skypack.dev/ol/proj.js'

const center = [4.35247, 50.84673]
const zoom = 18

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      }),
    }),
  ],
  view: new View({
    center,
    zoom,
  }),
})

map.getView().setCenter(transform(center, 'EPSG:4326', 'EPSG:3857'))
map.getView().setZoom(zoom)

const features = [
  new Feature({
    geometry: new Point(fromLonLat(center)),
  }),
]

const source = new VectorSource({
  features,
})

const layer = new VectorLayer({
  source,
})
map.addLayer(layer)

interface Position {
  coords: {longitude: number; latitude: number}
}

function addMarker(coords: {longitude: number; latitude: number}) {
  source.addFeature(new Feature({geometry: new Point(fromLonLat([coords.longitude, coords.latitude]))}))
  map.getView().setCenter(transform([coords.longitude, coords.latitude], 'EPSG:4326', 'EPSG:3857'))
}

function success(pos: Position) {
  console.log(pos)
  const {longitude, latitude} = pos.coords
  addMarker({longitude, latitude})
}

function error(err: GeolocationPositionError) {
  console.error(`ERROR(${err.code}): ${err.message}`)
}

navigator.geolocation.watchPosition(success, error, {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
})
