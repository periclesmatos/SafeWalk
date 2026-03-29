import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MapPin, AlertCircle } from 'lucide-react-native';
import { useAlert } from '../context/AlertContext';
import { useSensorsAndLocation } from '../hooks/useSensorsAndLocation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  content: {
    padding: 24,
    gap: 16,
  },
  mapPlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0284c7',
    borderStyle: 'dashed',
  },
  mapIcon: {
    marginBottom: 12,
  },
  mapText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284c7',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#0284c7',
    opacity: 0.7,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
  cardSubtext: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  historySection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#16a34a',
  },
  historyTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 4,
  },
  historyCoords: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  statusSent: {
    backgroundColor: '#16a34a',
  },
  statusPending: {
    backgroundColor: '#eab308',
  },
  statusFailed: {
    backgroundColor: '#dc2626',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyIcon: {
    marginBottom: 12,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export const MapScreen: React.FC = () => {
  const { alertHistory, lastAlertCoords } = useAlert();
  const { location } = useSensorsAndLocation();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  // Calcula distância entre dois pontos em km (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  // Formata data e hora
  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Formata coordenadas
  const formatCoords = (lat: number, lon: number) => {
    return `${Math.abs(lat).toFixed(5)}°${lat > 0 ? 'N' : 'S'} / ${Math.abs(lon).toFixed(5)}°${lon > 0 ? 'E' : 'W'}`;
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return styles.statusSent;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
      default:
        return styles.statusSent;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviado';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visualização de Mapa</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Mapa Placeholder */}
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapIcon}>
              <MapPin width={48} height={48} color="#0284c7" />
            </View>
            <Text style={styles.mapText}>Google Maps em Desenvolvimento</Text>
            <Text style={styles.mapSubtext}>Integração com API de Mapas em breve</Text>
          </View>

          {/* Localização Atual */}
          {location && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Localização Atual</Text>
              <Text style={styles.cardValue}>{formatCoords(location.latitude, location.longitude)}</Text>
              <Text style={styles.cardSubtext}>Precisão: ~{Math.round(location.accuracy || 0)}m</Text>
            </View>
          )}

          {/* Último Alerta */}
          {lastAlertCoords && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Último Alerta</Text>
              <Text style={styles.cardValue}>{formatCoords(lastAlertCoords.lat, lastAlertCoords.lng)}</Text>
              {location && (
                <Text style={styles.cardSubtext}>
                  Distância: ~{calculateDistance(location.latitude, location.longitude, lastAlertCoords.lat, lastAlertCoords.lng)} km
                </Text>
              )}
            </View>
          )}

          {/* Histórico de Alertas */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Histórico de Alertas ({alertHistory.length})</Text>

            {alertHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <AlertCircle width={40} height={40} color="#94a3b8" />
                </View>
                <Text style={styles.emptyText}>Nenhum alerta registrado</Text>
              </View>
            ) : (
              alertHistory.map((alert, index) => (
                <Pressable key={alert.id} onPress={() => setSelectedAlert(alert.id)}>
                  <View style={[styles.historyCard, selectedAlert === alert.id ? { backgroundColor: '#f0f9ff' } : {}]}>
                    <Text style={styles.historyTime}>{formatDateTime(alert.timestamp)}</Text>
                    <Text style={styles.historyCoords}>{formatCoords(alert.latitude, alert.longitude)}</Text>
                    <View style={[styles.statusBadge, getStatusColor(alert.status)]}>
                      <Text style={styles.statusBadgeText}>{getStatusText(alert.status)}</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>

          {/* Instruções Futuras */}
          <View style={{ marginTop: 24, marginBottom: 32 }}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Em Desenvolvimento</Text>
              <Text style={styles.cardValue} numberOfLines={3}>
                Mapa interativo com marcadores
              </Text>
              <Text style={styles.cardSubtext}>
                Será possível visualizar alertas no mapa, traçar rotas até os pontos de alerta, e anotar localizações personalizadas.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
