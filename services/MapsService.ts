export class MapsService {

  static getPhotoForPlace = (keys: string[]) => {
    if (keys.length)
      return `https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/${keys[0]}`
  }
  static getMediumPhotoForPlace = (keys: string[]) => {
    if (keys.length)
      return `https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageMedium/${keys[0]} 1200w`
  }
}
