import { Destination, Place } from '@/models';
import { createContext, useState, ReactNode, useContext } from 'react';

interface MapContextType {
  fitDestination: (destination?: Destination) => void;
  fitPlace: (place?: Place) => void;
  centeredMarkers: Place[];
  selectedMarker?: Place;
}
const MapContext = createContext<MapContextType | undefined>(undefined);

interface PlaceProviderProps {
  children: ReactNode;
}
export const MapProvider = ({ children }: PlaceProviderProps) => {
  const [centeredMarkers, setCenteredMarkers] = useState<Place[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Place>();

  const fitDestination = (destination?: Destination) => {
    if (!destination) {
      setCenteredMarkers([]);
      setSelectedMarker(undefined);
      return;
    }
    const markers = [
      ...(destination.activities?.map((a) => a.place) ?? []),
      destination.place,
    ];
    if (destination.housing) {
      markers.push(destination.housing.place);
    }
    setCenteredMarkers(markers);
    setSelectedMarker(destination.place);
  };

  const fitPlace = (place?: Place) => {
    if (place) {
      setCenteredMarkers([place]);
      setSelectedMarker(place);
    } else {
      setCenteredMarkers([]);
      setSelectedMarker(undefined);
    }
  };

  return (
    <MapContext.Provider
      value={{ fitDestination, fitPlace, centeredMarkers, selectedMarker }}
    >
      {children}
    </MapContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useMapContext = (): MapContextType => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within an AppProvider');
  }
  return context;
};
