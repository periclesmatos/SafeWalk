import { Contact, AlertHistory } from '../types';

// Validação de Contato
export const validateContact = (contact: Contact): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!contact.name?.trim()) {
    errors.push('Nome é obrigatório');
  }

  if (!contact.phone?.trim()) {
    errors.push('Telefone é obrigatório');
  }

  // Validar telefone formato básico
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  if (contact.phone && !phoneRegex.test(contact.phone)) {
    errors.push('Telefone inválido (use formato: +55 85 99999-0000)');
  }

  // Validar email se fornecido
  if (contact.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      errors.push('Email inválido');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Validação de Localização
export const validateLocation = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// Validação de Histórico
export const validateAlertHistory = (alert: AlertHistory): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!alert.id) errors.push('ID obrigatório');
  if (!alert.timestamp || alert.timestamp <= 0) errors.push('Timestamp inválido');
  if (!validateLocation(alert.latitude, alert.longitude)) errors.push('Coordenadas inválidas');
  if (!['sent', 'pending', 'failed'].includes(alert.status)) errors.push('Status inválido');

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Normalizar Telefone (remover caracteres especiais para envio)
export const normalizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

// Formatar Telefone para Exibição
export const formatPhoneDisplay = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  // Espera formato: 5585999990000 (13 dígitos com +55 removido)
  if (cleaned.length === 13) {
    // +55 85 99999-0000
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  // Se não tiver +55, assume que é só area + numero (10 dígitos)
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

// Alias para manter compatibilidade com testes
export const formatPhone = formatPhoneDisplay;
