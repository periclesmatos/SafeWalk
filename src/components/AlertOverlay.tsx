import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertTriangle, XCircle } from 'lucide-react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0284c7',
  },
  header: {
    backgroundColor: '#0284c7',
    padding: 24,
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 10,
    color: '#0c4a6e',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoName: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: 14,
  },
  infoPhone: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  coordText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#1e293b',
  },
  countdownContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 8,
  },
  countdownText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#0284c7',
  },
  button: {
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

interface AlertOverlayProps {
  visible: boolean;
  contactName: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  onCancel: () => void;
  onSend?: () => void;
  autoSendDelay?: number;
}

export const AlertOverlay: React.FC<AlertOverlayProps> = ({
  visible,
  contactName,
  contactPhone,
  latitude,
  longitude,
  onCancel,
  onSend,
  autoSendDelay = 10,
}) => {
  const [countdown, setCountdown] = useState(autoSendDelay);

  useEffect(() => {
    if (!visible) {
      setCountdown(autoSendDelay);
      return;
    }

    setCountdown(autoSendDelay);
    let count = autoSendDelay;

    // Inicia o countdown imediatamente
    const interval = setInterval(() => {
      count = count - 1;
      setCountdown(count);

      if (count <= 0) {
        clearInterval(interval);
        onSend?.();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [visible, autoSendDelay, onSend]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <AlertTriangle width={32} height={32} color="white" strokeWidth={2.5} />
            <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', color: 'white', marginTop: 12, letterSpacing: 0.3 }}>
              Alerta de Emergência
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Enviando Alerta para:</Text>
              <Text style={styles.infoName}>{contactName}</Text>
              <Text style={styles.infoPhone}>{contactPhone}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Localização no Impacto:</Text>
              <Text style={styles.coordText}>
                Lat: {latitude.toFixed(6)} | Lng: {longitude.toFixed(6)}
              </Text>
            </View>

            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>Enviando automaticamente em:</Text>
              <Text style={styles.countdownNumber}>{countdown}s</Text>
            </View>

            <TouchableOpacity onPress={onCancel} style={styles.button}>
              <XCircle width={20} height={20} color="white" strokeWidth={2} />
              <Text style={styles.buttonText}>CANCELAR ALERTA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
