import { apiUrl } from '@/constants'
import type { Trip } from '@/models'

const BASE_URL = apiUrl

export class TripService {
  static getTripDetails = async (tripId: string) => {
    try {
      const tripResponse = await fetch(`${BASE_URL}/trip/${tripId}`)
      const trip = await tripResponse.json()
      return TripService.convertDates(trip) as Trip
    } catch (e) {
      console.error(e)
    }
  }

  static setTripDetails = async (trip: Trip) => {
    try {
      const requestTrip = {
        ...trip,
        destinations: trip.destinations.map(d => ({
          ...d,
          place: undefined,
          housing: { ...d.housing, place: undefined },
          activities: d.activities?.map(a => ({
            ...a,
            place: undefined,
          })),
        })),
        transportations: trip.transportations.map(t => ({
          ...t,
          originTerminal: undefined,
          destinationTerminal: undefined,
        })),
      }
      const tripResponse = await fetch(`${BASE_URL}/trip`, {
        method: 'POST',
        body: JSON.stringify(requestTrip),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!tripResponse.ok) {
        console.error('Failed to save', tripResponse.statusText)
      }
    } catch (e) {
      console.error(e)
    }
  }

  private static isDateString(value: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/
    return dateRegex.test(value)
  }

  private static convertDates(obj: unknown): unknown {
    if (obj === null) {
      return obj
    }

    if (typeof obj === 'string' && TripService.isDateString(obj)) {
      return new Date(obj)
    }

    if (typeof obj !== 'object') {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map(this.convertDates)
    }

    const entries = Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'string' && TripService.isDateString(value)) {
        value = new Date(value)
      } else if (typeof value === 'object') {
        value = TripService.convertDates(value)
      }
      return [key, value]
    })
    return Object.fromEntries(entries)
  }
}
