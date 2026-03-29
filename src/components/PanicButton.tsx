import React from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { Send } from 'lucide-react-native';

interface PanicButtonProps {
  onPress: () => void;
  loading?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  button: {
    width: 200,
    height: 200,
    backgroundColor: '#0284c7',
    borderRadius: 100,
    borderWidth: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    elevation: 4,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export const PanicButton: React.FC<PanicButtonProps> = ({ onPress, loading = false }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [loading, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.7} style={styles.button}>
          <Send width={36} height={36} color="white" strokeWidth={2} />
          <Text style={styles.text}>Enviar Alerta Manual</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
