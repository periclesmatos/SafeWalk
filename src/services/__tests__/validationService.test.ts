import { validateContact, validateLocation, validateAlertHistory, normalizePhone, formatPhone } from '../validationService';

describe('validationService', () => {
  describe('validateContact', () => {
    it('deve validar contato com dados válidos', () => {
      const contact = {
        name: 'João Silva',
        phone: '+55 85 99999-0000',
        email: 'joao@example.com',
      };

      const result = validateContact(contact);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve rejeitar contato sem nome', () => {
      const contact = {
        name: '',
        phone: '+55 85 99999-0000',
      };

      const result = validateContact(contact);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Nome é obrigatório');
    });

    it('deve rejeitar contato sem telefone', () => {
      const contact = {
        name: 'João Silva',
        phone: '',
      };

      const result = validateContact(contact);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Telefone é obrigatório');
    });

    it('deve rejeitar telefone com menos de 10 dígitos', () => {
      const contact = {
        name: 'João Silva',
        phone: '1234567', // apenas 7 dígitos
      };

      const result = validateContact(contact);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Telefone inválido (use formato: +55 85 99999-0000)');
    });

    it('deve aceitar telefone com formato válido', () => {
      const validFormats = ['+55 85 99999-0000', '+5585999990000', '(85) 99999-0000', '85 99999-0000'];

      validFormats.forEach((phone) => {
        const contact = {
          name: 'Test User',
          phone,
        };

        const result = validateContact(contact);
        expect(result.valid).toBe(true);
      });
    });

    it('deve rejeitar email inválido', () => {
      const contact = {
        name: 'João Silva',
        phone: '+55 85 99999-0000',
        email: 'email-invalido',
      };

      const result = validateContact(contact);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Email inválido');
    });

    it('deve aceitar email válido', () => {
      const contact = {
        name: 'João Silva',
        phone: '+55 85 99999-0000',
        email: 'joao@example.com',
      };

      const result = validateContact(contact);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateLocation', () => {
    it('deve validar latitude e longitude corretas', () => {
      expect(validateLocation(-3.731862, -38.527669)).toBe(true); // Fortaleza
      expect(validateLocation(0, 0)).toBe(true); // Equador
      expect(validateLocation(90, 180)).toBe(true); // Max valores
      expect(validateLocation(-90, -180)).toBe(true); // Min valores
    });

    it('deve rejeitar latitude inválida', () => {
      expect(validateLocation(91, 0)).toBe(false); // > 90
      expect(validateLocation(-91, 0)).toBe(false); // < -90
      expect(validateLocation(100, 50)).toBe(false);
    });

    it('deve rejeitar longitude inválida', () => {
      expect(validateLocation(0, 181)).toBe(false); // > 180
      expect(validateLocation(0, -181)).toBe(false); // < -180
      expect(validateLocation(45, 200)).toBe(false);
    });

    it('deve rejeitar ambas coordenadas inválidas', () => {
      expect(validateLocation(95, 185)).toBe(false);
      expect(validateLocation(-95, -185)).toBe(false);
    });
  });

  describe('validateAlertHistory', () => {
    it('deve validar histório de alerta com dados válidos', () => {
      const alert = {
        id: 'alert_123456',
        timestamp: Date.now(),
        latitude: -3.731862,
        longitude: -38.527669,
        status: 'sent' as const,
      };

      const result = validateAlertHistory(alert);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve rejeitar alerta sem ID', () => {
      const alert = {
        id: '',
        timestamp: Date.now(),
        latitude: -3.731862,
        longitude: -38.527669,
        status: 'sent' as const,
      };

      const result = validateAlertHistory(alert);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('ID obrigatório');
    });

    it('deve rejeitar timestamp inválido', () => {
      const alert = {
        id: 'alert_123',
        timestamp: 0,
        latitude: -3.731862,
        longitude: -38.527669,
        status: 'sent' as const,
      };

      const result = validateAlertHistory(alert);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Timestamp inválido');
    });

    it('deve rejeitar status inválido', () => {
      const alert = {
        id: 'alert_123',
        timestamp: Date.now(),
        latitude: -3.731862,
        longitude: -38.527669,
        status: 'unknown' as any,
      };

      const result = validateAlertHistory(alert);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Status inválido');
    });

    it('deve aceitar status válidos', () => {
      const statuses = ['sent', 'pending', 'failed'];

      statuses.forEach((status) => {
        const alert = {
          id: 'alert_123',
          timestamp: Date.now(),
          latitude: -3.731862,
          longitude: -38.527669,
          status: status as any,
        };

        const result = validateAlertHistory(alert);
        expect(result.valid).toBe(true);
      });
    });

    it('deve rejeitar coordenadas inválidas no histórico', () => {
      const alert = {
        id: 'alert_123',
        timestamp: Date.now(),
        latitude: 95, // Inválido
        longitude: 200, // Inválido
        status: 'sent' as const,
      };

      const result = validateAlertHistory(alert);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Coordenadas inválidas');
    });
  });

  describe('normalizePhone', () => {
    it('deve remover caracteres especiais do telefone', () => {
      expect(normalizePhone('+55 85 99999-0000')).toBe('5585999990000');
      expect(normalizePhone('(85) 99999-0000')).toBe('85999990000');
      expect(normalizePhone('+55-85-99999-0000')).toBe('5585999990000');
    });

    it('deve retornar apenas dígitos', () => {
      expect(normalizePhone('85 99999-0000')).toBe('85999990000');
      expect(normalizePhone('(85)99999-0000')).toBe('85999990000');
    });
  });

  describe('formatPhone', () => {
    it('deve formatar telefone para máscara visual', () => {
      const formatted = formatPhone('5585999990000');
      expect(formatted).toBe('+55 85 99999-0000');
      expect(formatted).toContain('85'); // Área de Fortaleza
    });
  });
});
