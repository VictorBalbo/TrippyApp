import { Place } from '@/models';
import { MapsService } from '@/services';
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';

interface PlaceContextType {
  setPlaceId: (value: string) => void;
  place?: Place;
  loading: boolean;
}
const PlaceContext = createContext<PlaceContextType | undefined>(undefined);

interface PlaceProviderProps {
  children: ReactNode;
}
export const PlaceProvider = ({ children }: PlaceProviderProps) => {
  const [placeId, setPlaceId] = useState<string>();
  const [place, setplace] = useState<Place>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPlace = async () => {
    if (placeId && place?.id !== placeId && !loading) {
      setLoading(true);
      try {
        const responsePlace = await MapsService.getDetaisForPlaceId(placeId);
        setplace(responsePlace);
      } catch (err) {
        console.log('Error');
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchPlace();
  }, [placeId]);

  return (
    <PlaceContext.Provider value={{ setPlaceId, place, loading }}>
      {children}
    </PlaceContext.Provider>
  );
};

// Custom hook to use the AppContext
export const usePlaceContext = (): PlaceContextType => {
  const context = useContext(PlaceContext);
  if (!context) {
    throw new Error('usePlaceContext must be used within an AppProvider');
  }
  return context;
};
