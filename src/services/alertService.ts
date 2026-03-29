import { AlertHistory, LocationData, Contact } from '../types';
import { logService } from './logService';
import { validateContact, validateLocation } from './validationService';

export interface SendAlertParams {
  contact: Contact;
  location: LocationData;
  timestamp: number;
}

export interface SendAlertResult {
  success: boolean;
  message: string;
  alertId: string;
}

class AlertService {
  private localAlerts: AlertHistory[] = [];

  /**
   * Simula envio de alerta (para teste)
   * No futuro, integrar com WhatsApp/SMS API
   */
  async sendAlert(params: SendAlertParams): Promise<SendAlertResult> {
    const { contact, location, timestamp } = params;

    logService.info('AlertService', 'Iniciando envio de alerta', { contact: contact.name });

    // Validações
    const contactValidation = validateContact(contact);
    if (!contactValidation.valid) {
      const error = contactValidation.errors.join(', ');
      logService.error('AlertService', 'Contato inválido', { error });
      return {
        success: false,
        message: error,
        alertId: '',
      };
    }

    if (!validateLocation(location.latitude, location.longitude)) {
      logService.error('AlertService', 'Localização inválida');
      return {
        success: false,
        message: 'Localização inválida',
        alertId: '',
      };
    }

    const alertId = `alert_${timestamp}`;

    try {
      // TODO: Integrar com API real
      // const response = await sendToWhatsApp(contact.phone, generateAlertMessage(...));

      // Simular envio bem sucedido
      await new Promise((resolve) => setTimeout(resolve, 500));

      logService.info('AlertService', 'Alerta enviado com sucesso', { alertId });

      return {
        success: true,
        message: `Alerta enviado para ${contact.name}`,
        alertId,
      };
    } catch (error) {
      logService.error('AlertService', 'Erro ao enviar alerta', error as Error);
      return {
        success: false,
        message: 'Erro ao enviar alerta. Tente novamente.',
        alertId,
      };
    }
  }

  /**
   * Gera mensagem de alerta formatada
   */
  generateAlertMessage(contact: Contact, location: LocationData, timestamp: number): string {
    const date = new Date(timestamp).toLocaleString('pt-BR');
    return `
🚨 ALERTA DE EMERGÊNCIA

Nome: ${contact.name}
Contato: ${contact.phone}
Data/Hora: ${date}

📍 Localização:
Latitude: ${location.latitude.toFixed(6)}
Longitude: ${location.longitude.toFixed(6)}

Google Maps: https://maps.google.com/?q=${location.latitude},${location.longitude}
    `.trim();
  }

  /**
   * Adiciona alerta ao histórico local
   */
  addToHistory(alert: AlertHistory): void {
    this.localAlerts.push(alert);
    logService.debug('AlertService', 'Alerta adicionado ao histórico', { alertId: alert.id });
  }

  /**
   * Obter histórico de alertas
   */
  getHistory(): AlertHistory[] {
    return [...this.localAlerts];
  }

  /**
   * Limpar histórico
   */
  clearHistory(): void {
    this.localAlerts = [];
    logService.info('AlertService', 'Histórico de alertas limpo');
  }
}

export const alertService = new AlertService();
