import type { Destination, Transportation } from '.'

export interface Trip {
  id: string
  name: string
  startDate: Date
  endDate: Date
  destinations: Destination[]
  transportations: Transportation[]
}
