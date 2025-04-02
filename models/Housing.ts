import type { Place, Price } from '.'

export interface Housing {
  id: string
  placeId: string
  place: Place
  image?: string
  name: string
  checkin?: Date
  checkout?: Date
  website?: string
  notes?: string
  price: Price
}
