import type { Coordinates } from './Coordinates'

export interface DistanceBetweenPlaces {
  fromPlaceId: string
  toPlaceId: string
  driving: Distance
  transit: Distance
  walking: Distance
}

interface Distance {
  distance: number
  duration: number
  polyline: string
  decodedPolyline: Coordinates[]
}
