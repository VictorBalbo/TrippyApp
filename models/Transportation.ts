import type { Coordinates, Place, Price } from '.'

export interface Transportation {
  id: string
  originId: string
  originTerminalId: string
  originTerminal: Place
  destinationId: string
  destinationTerminalId: string
  destinationTerminal: Place
  path: Coordinates[]
  type: TransportTypes
  startDate?: Date
  endDate?: Date
  price: Price
  company?: string
  number?: string
  reservation?: string
  seat?: string
}
export enum TransportTypes {
  Bus = 'Bus',
  Car = 'Car',
  Plane = 'Plane',
  Ship = 'Ship',
  Train = 'Train',
}
