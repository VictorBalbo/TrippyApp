import { Destination, Place } from '@/models';
import { createContext, useState, ReactNode, useContext } from 'react';

interface MapContextType {
  fitDestination: (destination: Destination) => void;
  fitPlace: (place: Place) => void;
  markers: Place[];
}
const MapContext = createContext<MapContextType | undefined>(undefined);

interface PlaceProviderProps {
  children: ReactNode;
}
export const MapProvider = ({ children }: PlaceProviderProps) => {
  const [markers, setMarkers] = useState<Place[]>([]);

  const fitDestination = (destination: Destination) => {
    const markers = [
      ...(destination.activities?.map((a) => a.place) ?? []),
      destination.place,
    ];
    if (destination.housing) {
      markers.push(destination.housing.place);
    }
    setMarkers(markers);
  };

  const fitPlace = (place: Place) => {
    const markers = [place];
    setMarkers(markers);
  };

  return (
    <MapContext.Provider value={{ fitDestination, fitPlace, markers }}>
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
