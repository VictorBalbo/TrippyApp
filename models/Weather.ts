export interface Weather {
  sunrise: string
  sunset: string
  avg: AvgWeather
  lastYear: LastYear
}

interface LastYear {
  [key: string]: PeriodWeather
}

interface AvgWeather {
  minTemp: number
  maxTemp: number
  rain: number
  wind: number
}

interface PeriodWeather {
  temp: number
  rain: number
}
