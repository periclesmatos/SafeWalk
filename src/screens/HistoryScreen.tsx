import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-react-native';
import { useAlert } from '../context/AlertContext';
import { formatDateTime, getStatusColor } from '../utils/formatters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  iconBox: {
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 12,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  coordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  coordText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
    flex: 1,
  },
});

export const HistoryScreen: React.FC = () => {
  const { alertHistory } = useAlert();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Clock width={24} height={24} color="#0284c7" strokeWidth={2} />
          </View>
          <Text style={styles.headerText}>HISTÓRICO</Text>
        </View>

        {alertHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Clock width={48} height={48} color="#cbd5e1" strokeWidth={1.5} />
            <Text style={styles.emptyText}>Nenhum alerta registrado</Text>
          </View>
        ) : (
          <>
            {alertHistory.map((alert) => (
              <View key={alert.id} style={[styles.alertCard, { borderLeftColor: getStatusColor(alert.status) }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.timeText}>{formatDateTime(alert.timestamp)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(alert.status) }]}>
                    {alert.status === 'sent' ? (
                      <CheckCircle width={14} height={14} color="white" strokeWidth={2} />
                    ) : (
                      <XCircle width={14} height={14} color="white" strokeWidth={2} />
                    )}
                    <Text style={styles.statusText}>{alert.status === 'sent' ? 'Enviado' : 'Falhou'}</Text>
                  </View>
                </View>

                <View style={styles.coordContainer}>
                  <MapPin width={14} height={14} color="#64748b" strokeWidth={2} />
                  <Text style={styles.coordText}>
                    {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};
