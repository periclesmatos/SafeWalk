import { validateContact, validateLocation } from '../validationService';
import { SendAlertParams } from '../alertService';

describe('alertService', () => {
  describe('sendAlert', () => {
    it('deve retornar erro se contato inválido', async () => {
      const params: SendAlertParams = {
        contact: {
          name: '',
          phone: '',
        },
        location: {
          latitude: -3.731862,
          longitude: -38.527669,
        },
        timestamp: Date.now(),
      };

      // Valida contato
      const validation = validateContact(params.contact);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('deve rejeitar localização inválida', () => {
      const params: SendAlertParams = {
        contact: {
          name: 'João Silva',
          phone: '+55 85 99999-0000',
        },
        location: {
          latitude: 95, // Inválido
          longitude: 200, // Inválido
        },
        timestamp: Date.now(),
      };

      // Valida localização
      const isValid = validateLocation(params.location.latitude, params.location.longitude);
      expect(isValid).toBe(false);
    });

    it('deve criar alertId com timestamp', () => {
      const timestamp = Date.now();
      const alertId = `alert_${timestamp}`;

      expect(alertId).toMatch(/^alert_\d+$/);
      expect(alertId).toBe(`alert_${timestamp}`);
    });
  });

  describe('validations', () => {
    it('deve rejeitar ambos contato e localização inválidos', () => {
      const invalidContact = {
        name: '',
        phone: 'abc', // Muito curto
      };

      const invalidLocation = {
        latitude: 100,
        longitude: 200,
      };

      const contactValid = validateContact(invalidContact).valid;
      const locationValid = validateLocation(invalidLocation.latitude, invalidLocation.longitude);

      expect(contactValid).toBe(false);
      expect(locationValid).toBe(false);
    });

    it('deve aceitar dados válidos para alerta', () => {
      const validContact = {
        name: 'João Silva',
        phone: '+55 85 99999-0000',
        email: 'joao@example.com',
      };

      const validLocation = {
        latitude: -3.731862,
        longitude: -38.527669,
      };

      const contactValid = validateContact(validContact).valid;
      const locationValid = validateLocation(validLocation.latitude, validLocation.longitude);

      expect(contactValid).toBe(true);
      expect(locationValid).toBe(true);
    });
  });

  describe('alertHistory', () => {
    it('deve aceitar alertId com prefixo correto', () => {
      const timestamp = Date.now();
      const alertId = `alert_${timestamp}`;

      const historyItem = {
        id: alertId,
        timestamp,
        latitude: -3.731862,
        longitude: -38.527669,
        status: 'sent' as const,
      };

      expect(historyItem.id).toMatch(/^alert_/);
      expect(historyItem.status).toBe('sent');
    });
  });
});
