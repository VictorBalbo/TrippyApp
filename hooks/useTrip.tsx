import { tripId } from '@/constants';
import { Activity, Destination, Housing, Transportation, Trip } from '@/models';
import { TripService } from '@/services/TripService';
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useMemo,
  useEffect,
} from 'react';

interface TripContextType {
  trip?: Trip;
  setTrip: (value: Trip) => void;
  activities?: Activity[];
  destinations?: Destination[];
  housings?: Housing[];
  transportations?: Transportation[];
}
const TripContext = createContext<TripContextType | undefined>(undefined);

interface TripProviderProps {
  children: ReactNode;
}
export const TripProvider = ({ children }: TripProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [trip, setTrip] = useState<Trip>();
  const activities = useMemo(() => {
    return trip?.destinations
      .flatMap((d) => d.activities)
      .filter((d) => d !== undefined);
  }, [trip?.destinations]);
  const destinations = useMemo(() => {
    return trip?.destinations.filter((d) => d !== undefined);
  }, [trip?.destinations]);
  const housings = useMemo(() => {
    return trip?.destinations
      .flatMap((d) => d.housing)
      .filter((h) => h !== undefined);
  }, [trip?.destinations]);
  const transportations = trip?.transportations;

  const fetchTrip = async () => {
    if (!trip && !loading) {
      setLoading(true);
      try {
        const responseTrip = await TripService.getTripDetails(tripId);
        setTrip(responseTrip);
      } catch (err) {
        console.log('Error');
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchTrip();
  }, []);

  return (
    <TripContext.Provider
      value={{ trip, setTrip, activities, destinations, housings, transportations }}
    >
      {children}
    </TripContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useTripContext = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within an AppProvider');
  }
  return context;
};
