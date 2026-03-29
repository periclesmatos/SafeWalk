import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { User, Phone, Mail, AlertCircle, CheckCircle } from 'lucide-react-native';
import { useAlert } from '../context/AlertContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1e293b',
    letterSpacing: 0.3,
  },
  cardHeader: {
    backgroundColor: '#f0f9ff',
    color: '#1e293b',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
  },
  cardLabel: {
    fontSize: 9,
    color: '#0c4a6e',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  cardPhone: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0c4a6e',
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 0,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 44,
    fontSize: 14,
    color: '#1e293b',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
  },
  button: {
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  successBox: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export const SettingsScreen: React.FC = () => {
  const { contact, setContact } = useAlert();
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [email, setEmail] = useState(contact.email || '');
  const [emergencyContactName, setEmergencyContactName] = useState(contact.emergencyContactName || '');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSaveContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Erro', 'Por favor, preencha nome e telefone');
      return;
    }

    setContact({ name, phone, email, emergencyContactName });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configurações</Text>

        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>Contato Atual</Text>
          <Text style={styles.cardName}>{contact.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Phone width={14} height={14} color="rgb(203, 213, 225)" strokeWidth={2} />
            <Text style={styles.cardPhone}>{contact.phone}</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do Contato</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <User width={18} height={18} color="rgb(148, 163, 184)" strokeWidth={2} />
            </View>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ex: Maria (Mãe)"
              style={styles.input}
              placeholderTextColor="rgb(148, 163, 184)"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Telefone (WhatsApp)</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Phone width={18} height={18} color="rgb(148, 163, 184)" strokeWidth={2} />
            </View>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+55 85 9..."
              style={styles.input}
              placeholderTextColor="rgb(148, 163, 184)"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email (Opcional)</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Mail width={18} height={18} color="rgb(148, 163, 184)" strokeWidth={2} />
            </View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              style={styles.input}
              placeholderTextColor="rgb(148, 163, 184)"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome da Pessoa de Emergência</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <AlertCircle width={18} height={18} color="rgb(148, 163, 184)" strokeWidth={2} />
            </View>
            <TextInput
              value={emergencyContactName}
              onChangeText={setEmergencyContactName}
              placeholder="Ex: Maria SA"
              style={styles.input}
              placeholderTextColor="rgb(148, 163, 184)"
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSaveContact} style={styles.button}>
          <Text style={styles.buttonText}>Salvar Contato</Text>
        </TouchableOpacity>

        {showSuccessMessage && (
          <View style={styles.successBox}>
            <CheckCircle width={20} height={20} color="white" strokeWidth={2} />
            <Text style={styles.successText}>Salvo com sucesso!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
