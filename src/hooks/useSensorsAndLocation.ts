import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface SensorData {
  x: number;
  y: number;
  z: number;
}

export const useSensorsAndLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [acceleration, setAcceleration] = useState<SensorData>({ x: 0, y: 0, z: 0 });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isFallDetected, setIsFallDetected] = useState(false);

  // GPS Initialization
  useEffect(() => {
    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permissão de localização negada');
          return;
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        });

        // Watch location updates
        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (newLocation) => {
            setLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            });
          },
        );

        return () => locationSubscription.remove();
      } catch {
        setLocationError('Erro ao acessar localização');
        // Fallback para localização simulada (Fortaleza, CE)
        setLocation({
          latitude: -3.90023451,
          longitude: -38.52243012,
        });
      }
    };

    startLocationTracking();
  }, []);

  // Accelerometer Setup
  useEffect(() => {
    Accelerometer.setUpdateInterval(50); // 20 leituras por segundo

    let accelHistory: number[] = [];

    const subscription = Accelerometer.addListener((data) => {
      setAcceleration(data);

      // Magnitude da aceleração em m/s²
      const magnitude = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);

      // Atualiza histórico
      accelHistory = [...accelHistory, magnitude].slice(-15); // Últimos 750ms (~15 leituras)

      // Detecta pico de aceleração (> 5 m/s²) - indica impacto
      const highAccelCount = accelHistory.filter((m) => m > 5.5).length;

      // Se teve 2 ou mais picos = queda real
      if (highAccelCount >= 2 && !isFallDetected) {
        setIsFallDetected(true);
        // Reset apenas após 3 segundos (tempo suficiente para modal abrir e countdown)
        setTimeout(() => setIsFallDetected(false), 3000);
      }
    });

    return () => subscription.remove();
  }, [isFallDetected]);

  return {
    location,
    acceleration,
    locationError,
    isFallDetected,
  };
};
