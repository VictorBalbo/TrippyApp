import { StyleSheet } from 'react-native';

import PlaceDetails from '../views/PlaceDetails';
import MapView from '../views/MapView';

export default function HomeScreen() {
  ///TODO: Remove this
  const place = {
    id: 'ChIJjx37cOxv5kcRPWQuEW5ntdk',
    name: 'Arc de Triomphe',
    description:
      "The Arc de Triomphe is an iconic triumphal arch located in the 8th arrondissement district of Paris. It was constructed between 1806 and 1836 to honor Napoleon's military victories during the first French Empire. The monument stands at 164 feet tall and 148 feet wide, adorned with intricate designs on its four arches.",
    categories: [
      'Monument',
      'Cultural Landmark',
      'Museum',
      'Tourist Attraction',
    ],
    address: 'Pl. Charles de Gaulle, 75008 Paris, France',
    vicinity: 'Pl. Charles de Gaulle, Paris',
    rating: 4.7,
    website: 'https://www.paris-arc-de-triomphe.fr/',
    phoneNumber: '+33 1 55 37 73 77',
    images: [
      'XhFm0syCyHmwN1c2aaXmaHhINIJ9Dm21',
      'QkWQ8K9m8E74ELy0UEMixCOLogagtTUp',
      'TkhIfLE627XKz90H5P5R5xfBYRziCAdo',
      'Q0TtLxXMSgxjOyBbEF3QMr15YE8sYjHR',
      'xMVFl4Sd530JRNBbYgSnkPTVlf5mvrLv',
    ],
    businessStatus: 'OPERATIONAL',
    openingHours: {
      weekday_text: [
        'Monday: 10 AM–10:30 PM',
        'Tuesday: 11 AM–10:30 PM',
        'Wednesday: 10 AM–10:30 PM',
        'Thursday: 10 AM–10:30 PM',
        'Friday: 10 AM–10:30 PM',
        'Saturday: 10 AM–10:30 PM',
        'Sunday: 10 AM–10:30 PM',
      ],
      periods: [
        {
          open: {
            day: 0,
            time: '1000',
          },
          close: {
            day: 0,
            time: '2230',
          },
        },
        {
          open: {
            day: 1,
            time: '1000',
          },
          close: {
            day: 1,
            time: '2230',
          },
        },
        {
          open: {
            day: 2,
            time: '1100',
          },
          close: {
            day: 2,
            time: '2230',
          },
        },
        {
          open: {
            day: 3,
            time: '1000',
          },
          close: {
            day: 3,
            time: '2230',
          },
        },
        {
          open: {
            day: 4,
            time: '1000',
          },
          close: {
            day: 4,
            time: '2230',
          },
        },
        {
          open: {
            day: 5,
            time: '1000',
          },
          close: {
            day: 5,
            time: '2230',
          },
        },
        {
          open: {
            day: 6,
            time: '1000',
          },
          close: {
            day: 6,
            time: '2230',
          },
        },
      ],
    },
    mapsUrl:
      'https://maps.google.com/?ftid=0x47e66fec70fb1d8f:0xd9b5676e112e643d',
    coordinates: {
      lat: 48.8737917,
      lng: 2.2950274999999998,
    },
  };
  // return <PlaceDetails place={place} />;
  return <MapView />;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
