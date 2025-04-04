import { Place } from '@/models';

export const getMapsDirectionLink = (
  origin: Place,
  destination: Place,
  travelmode: 'transit' | 'walking' = 'transit'
) =>
  `https://www.google.com/maps/dir/?api=1&origin_place_id=${origin.id}&origin=${origin.name}&destination=${destination.name}&destination_place_id=${destination.id}&travelmode=${travelmode}`;
