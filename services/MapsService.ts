import { apiUrl } from '@/constants';
import { DistanceBetweenPlaces, Place } from '@/models';

const BASE_URL = apiUrl;

export class MapsService {
  static getDetaisForPlaceId = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/place/${id}`);
      const data = await response.json();
      return data as Place;
    } catch (e) {
      console.error(e);
    }
  };

  static getDistaceBetweenPlaces = async (
    placeId1: string,
    placeId2: string
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/distance/${placeId1}/${placeId2}`
      );
      const data = await response.json();
      return data as DistanceBetweenPlaces;
    } catch (e) {
      console.error(e);
    }
  };

  static getPhotoForPlace = (keys: string[]) => {
    if (keys.length)
      return `https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/${keys[0]}`;
    else return '';
  };
  static getMediumPhotoForPlace = (keys: string[]) => {
    if (keys.length)
      return `https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageMedium/${keys[0]} 1200w`;
  };
}
