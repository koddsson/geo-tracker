import Map from 'https://cdn.skypack.dev/ol/Map.js'
import View from 'https://cdn.skypack.dev/ol/View.js'
import Feature from 'https://cdn.skypack.dev/ol/Feature.js'
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js'
import XYZ from 'https://cdn.skypack.dev/ol/source/XYZ.js'
import Point from 'https://cdn.skypack.dev/ol/geom/Point.js'
import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector.js'
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js'
import {fromLonLat} from 'https://cdn.skypack.dev/ol/proj.js'

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
    center: [4.35247, 50.84673],
    zoom: 2,
  }),
})

const features = [
  new Feature({
    geometry: new Point(fromLonLat([4.35247, 50.84673])),
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
  coords: {longitude: unknown; latitude: unknown}
}

function success(pos: Position) {
  console.log(pos)
  const crd = pos.coords
  source.addFeature(new Feature({geometry: new Point(fromLonLat([crd.longitude, crd.latitude]))}))
}

function error(err: GeolocationPositionError) {
  console.error(`ERROR(${err.code}): ${err.message}`)
}

navigator.geolocation.watchPosition(success, error, {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
})
