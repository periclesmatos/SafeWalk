import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { LocationData } from '../types';
import { logService } from '../services/logService';

/**
 * Configurações de GPS
 */
const GPS_CONFIG = {
  accuracy: Location.Accuracy.High,
  timeInterval: 5000, // 5 segundos
  distanceInterval: 10, // 10 metros
  fallbackLocation: {
    latitude: -3.90023451,
    longitude: -38.52243012,
  },
};

interface UseLocationResult {
  location: LocationData | null;
  isConnected: boolean;
  error: string | null;
  isLoading: boolean;
}

/**
 * Hook especializado para geolocalização GPS
 * Responsabilidade única: obter localização em tempo real
 */
export const useLocation = (): UseLocationResult => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logService.debug('useLocation', 'Hook inicializado');

    const initializeLocation = async () => {
      try {
        // Solicita permissão
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          const errorMsg = 'Permissão de localização negada';
          logService.warn('useLocation', errorMsg);
          setError(errorMsg);
          setIsConnected(false);
          setLocation(GPS_CONFIG.fallbackLocation);
          setIsLoading(false);
          return;
        }

        // Obtém localização inicial
        logService.debug('useLocation', 'Obtendo localização inicial...');
        const initialLocation = await Location.getCurrentPositionAsync({});

        const coords = {
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        };

        setLocation(coords);
        setIsConnected(true);
        setError(null);
        logService.info('useLocation', 'Localização inicial obtida', coords);

        // Watch para atualizações em tempo real
        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: GPS_CONFIG.accuracy,
            timeInterval: GPS_CONFIG.timeInterval,
            distanceInterval: GPS_CONFIG.distanceInterval,
          },
          (newLocation) => {
            const newCoords = {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            };
            setLocation(newCoords);
            setIsConnected(true);
          },
        );

        setIsLoading(false);

        return () => {
          locationSubscription.remove();
          logService.debug('useLocation', 'Hook desmontado');
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao acessar localização';
        logService.error('useLocation', errorMsg, err as Error);
        setError(errorMsg);
        setIsConnected(false);
        setLocation(GPS_CONFIG.fallbackLocation);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, []);

  return {
    location,
    isConnected,
    error,
    isLoading,
  };
};
