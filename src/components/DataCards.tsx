import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Navigation } from 'lucide-react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: '#f0f9ff',
    padding: 10,
    borderRadius: 12,
  },
  labelText: {
    fontSize: 9,
    color: '#0c4a6e',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  unitText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },
  actionButton: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  actionText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#0c4a6e',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  locationCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  greenIconContainer: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 12,
  },
  locationBody: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  coordLabel: {
    fontSize: 11,
    color: '#0c4a6e',
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  coordValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
});

interface DataCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const DataCard: React.FC<DataCardProps> = ({ icon, label, value, unit, action }) => {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={styles.iconContainer}>{icon}</View>
        <View>
          <Text style={styles.labelText}>{label}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.valueText}>{value}</Text>
            {unit && <Text style={styles.unitText}>{unit}</Text>}
          </View>
        </View>
      </View>
      {action && (
        <TouchableOpacity onPress={action.onPress} style={styles.actionButton}>
          <Text style={styles.actionText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface LocationCardProps {
  latitude: number;
  longitude: number;
}

export const LocationCard: React.FC<LocationCardProps> = ({ latitude, longitude }) => {
  return (
    <View style={styles.locationCard}>
      <View style={styles.locationHeader}>
        <View style={styles.greenIconContainer}>
          <Navigation width={20} height={20} color="rgb(22, 163, 74)" strokeWidth={2} />
        </View>
        <View>
          <Text style={styles.labelText}>Localização GPS</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569' }}>Monitoramento Ativo</Text>
        </View>
      </View>
      <View style={styles.locationBody}>
        <View style={styles.coordRow}>
          <Text style={styles.coordLabel}>LAT:</Text>
          <Text style={styles.coordValue}>{latitude.toFixed(8)}</Text>
        </View>
        <View style={styles.coordRow}>
          <Text style={styles.coordLabel}>LONG:</Text>
          <Text style={styles.coordValue}>{longitude.toFixed(8)}</Text>
        </View>
      </View>
    </View>
  );
};
