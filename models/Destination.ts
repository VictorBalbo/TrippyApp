import type { Activity, Housing, Place } from '.'

export interface Destination {
  id: string
  placeId: string
  place: Place
  housing?: Housing
  activities?: Activity[]
  startDate: Date
  endDate: Date
  notes?: string
}
