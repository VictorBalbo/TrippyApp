export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Distance between two coordinates in a globe
 * @param point1
 * @param point2
 * @returns the distance in meters
 */
export const distanceBetweenPoints = (
  point1: Coordinates,
  point2: Coordinates
) => {
  const R = 6371e3; // earth radius
  const p1 = (point1.lat * Math.PI) / 180;
  const p2 = (point2.lat * Math.PI) / 180;
  const deltaP = p2 - p1;
  const deltaLon = point2.lng - point1.lng;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const a =
    Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
    Math.cos(p1) *
      Math.cos(p2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * R;
  return d;
};
