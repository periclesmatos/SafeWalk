import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logService } from '../services/logService';

interface Contact {
  name: string;
  phone: string;
  email?: string;
  emergencyContactName?: string;
}

interface AlertHistory {
  id: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  status: 'sent' | 'pending' | 'failed';
}

interface AlertContextType {
  contact: Contact;
  setContact: (contact: Contact) => void;
  isAlertActive: boolean;
  setIsAlertActive: (active: boolean) => void;
  lastAlertCoords: { lat: number; lng: number } | null;
  setLastAlertCoords: (coords: { lat: number; lng: number }) => void;
  alertHistory: AlertHistory[];
  addToHistory: (alert: AlertHistory) => void;
  isGpsConnected: boolean;
  setIsGpsConnected: (connected: boolean) => void;
  isLoading: boolean;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONTACT: '@safewalk_contact',
  HISTORY: '@safewalk_history',
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contact, setContactState] = useState<Contact>({
    name: 'Pericles Matos',
    phone: '+55 85 99999-0000',
    email: '',
    emergencyContactName: '',
  });
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [lastAlertCoords, setLastAlertCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [alertHistory, setAlertHistoryState] = useState<AlertHistory[]>([]);
  const [isGpsConnected, setIsGpsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados do AsyncStorage ao inicializar
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const [storedContact, storedHistory] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CONTACT),
          AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
        ]);

        if (storedContact) {
          setContactState(JSON.parse(storedContact));
        }
        if (storedHistory) {
          setAlertHistoryState(JSON.parse(storedHistory));
        }
      } catch (error) {
        logService.error('AlertContext', 'Erro ao carregar dados do AsyncStorage', { error });
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  // Persiste contato quando muda
  const setContact = async (newContact: Contact) => {
    setContactState(newContact);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(newContact));
    } catch (error) {
      logService.error('AlertContext', 'Erro ao salvar contato', { error });
    }
  };

  // Persiste histórico quando muda
  const addToHistory = async (alert: AlertHistory) => {
    const newHistory = [alert, ...alertHistory].slice(0, 50);
    setAlertHistoryState(newHistory);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
    } catch (error) {
      logService.error('AlertContext', 'Erro ao salvar histórico', { error });
    }
  };

  return (
    <AlertContext.Provider
      value={{
        contact,
        setContact,
        isAlertActive,
        setIsAlertActive,
        lastAlertCoords,
        setLastAlertCoords,
        alertHistory,
        addToHistory,
        isGpsConnected,
        setIsGpsConnected,
        isLoading,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert deve ser usado dentro de AlertProvider');
  }
  return context;
};
