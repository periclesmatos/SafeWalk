import { useEffect, useState, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import { SensorData } from '../types';
import { logService } from '../services/logService';

/**
 * Configurações de detecção de queda
 */
const FALL_CONFIG = {
  updateInterval: 50, // 20 leituras por segundo
  historySize: 15, // Últimos 750ms
  highAccelThreshold: 5.5, // m/s²
  requiredPeaks: 2, // Número de picos necessários
  resetTimeout: 3000, // 3 segundos
};

interface FallDetectionResult {
  isFallDetected: boolean;
  acceleration: SensorData;
  magnitude: number;
}

/**
 * Hook especializado para detecção de queda
 * Responsabilidade única: detectar quedas
 */
export const useFallDetection = (): FallDetectionResult => {
  const [isFallDetected, setIsFallDetected] = useState(false);
  const [acceleration, setAcceleration] = useState<SensorData>({ x: 0, y: 0, z: 0 });
  const [magnitude, setMagnitude] = useState(0);
  const accelHistoryRef = useRef<number[]>([]);
  const fallTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    logService.debug('useFallDetection', 'Hook inicializado');

    Accelerometer.setUpdateInterval(FALL_CONFIG.updateInterval);

    const subscription = Accelerometer.addListener((data) => {
      setAcceleration(data);

      // Calcula magnitude da aceleração
      const mag = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
      setMagnitude(mag);

      // Mantém histórico
      accelHistoryRef.current = [...accelHistoryRef.current, mag].slice(-FALL_CONFIG.historySize);

      // Conta picos (aceleração alta)
      const highAccelCount = accelHistoryRef.current.filter((m) => m > FALL_CONFIG.highAccelThreshold).length;

      // Se detecção de queda
      if (highAccelCount >= FALL_CONFIG.requiredPeaks && !isFallDetected) {
        logService.warn('useFallDetection', 'QUEDA DETECTADA!', { magnitude: mag, peakCount: highAccelCount });

        setIsFallDetected(true);

        // Limpa timeout anterior se existir
        if (fallTimeoutRef.current) {
          clearTimeout(fallTimeoutRef.current);
        }

        // Reset automático após timeout
        fallTimeoutRef.current = setTimeout(() => {
          setIsFallDetected(false);
          accelHistoryRef.current = [];
          fallTimeoutRef.current = null;
        }, FALL_CONFIG.resetTimeout);
      }
    });

    return () => {
      subscription.remove();
      if (fallTimeoutRef.current) {
        clearTimeout(fallTimeoutRef.current);
      }
    };
  }, [isFallDetected]);

  return {
    isFallDetected,
    acceleration,
    magnitude,
  };
};
