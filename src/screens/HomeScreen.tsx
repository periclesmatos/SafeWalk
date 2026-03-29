import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Activity, AlertCircle, Wifi } from 'lucide-react-native';
import { PanicButton, AlertOverlay, DataCard, LocationCard } from '../components';
import { useSensorsAndLocation } from '../hooks/useSensorsAndLocation';
import { useAlert } from '../context/AlertContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    backgroundColor: '#e0f2fe',
    padding: 8,
    borderRadius: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.3,
  },
  gpsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#16a34a',
    borderRadius: 20,
  },
  gpsText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  content: {
    padding: 24,
  },
  cardsContainer: {
    gap: 16,
  },
});

export const HomeScreen: React.FC = () => {
  const { location, acceleration, isFallDetected } = useSensorsAndLocation();
  const { contact, setIsAlertActive, isAlertActive, setLastAlertCoords, addToHistory } = useAlert();
  const [movementValue, setMovementValue] = useState('1.02');

  // Calcula a magnitude da aceleração
  useEffect(() => {
    if (acceleration) {
      const magnitude = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2).toFixed(2);
      setMovementValue(magnitude);
    }
  }, [acceleration]);

  // Detecta queda automaticamente (com delay para evitar triggers duplicados)
  useEffect(() => {
    if (isFallDetected && !isAlertActive) {
      triggerAlert();
    }
  }, [isFallDetected, isAlertActive, triggerAlert]);

  const triggerAlert = useCallback(() => {
    if (location) {
      setLastAlertCoords(location);
    }
    setIsAlertActive(true);
  }, [location, setLastAlertCoords, setIsAlertActive]);

  const cancelAlert = useCallback(() => setIsAlertActive(false), [setIsAlertActive]);

  const handleSendAlert = useCallback(() => {
    // Adiciona ao histórico
    if (location) {
      addToHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        latitude: location.latitude,
        longitude: location.longitude,
        status: 'sent',
      });
    }
    console.log('Alerta enviado para:', contact.phone);
    cancelAlert();
  }, [location, contact.phone, cancelAlert, addToHistory]);

  return (
    <ScrollView style={styles.container} scrollEnabled={true}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <AlertCircle width={20} height={20} color="#0284c7" strokeWidth={2} />
          </View>
          <Text style={styles.headerText}>EMERGÊNCIA</Text>
        </View>
        {location && (
          <View style={styles.gpsIndicator}>
            <Wifi width={12} height={12} color="white" strokeWidth={2.5} />
            <Text style={styles.gpsText}>GPS OK</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <PanicButton onPress={triggerAlert} loading={isAlertActive} />

        <View style={styles.cardsContainer}>
          <DataCard
            icon={<Activity width={20} height={20} color="#2563eb" strokeWidth={2} />}
            label="Movimento"
            value={movementValue}
            unit="m/s²"
          />
          {location && <LocationCard latitude={location.latitude} longitude={location.longitude} />}
        </View>
      </View>

      <AlertOverlay
        visible={isAlertActive}
        contactName={contact.name}
        contactPhone={contact.phone}
        latitude={location?.latitude || 0}
        longitude={location?.longitude || 0}
        onCancel={cancelAlert}
        onSend={handleSendAlert}
      />
    </ScrollView>
  );
};
