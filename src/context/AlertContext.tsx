import React, { createContext, useState, ReactNode } from 'react';

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
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

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

  // Atualiza contato sem persistência
  const setContact = (newContact: Contact) => {
    setContactState(newContact);
  };

  // Adiciona ao histórico sem persistência (máx 50 itens)
  const addToHistory = (alert: AlertHistory) => {
    const newHistory = [alert, ...alertHistory].slice(0, 50);
    setAlertHistoryState(newHistory);
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
