export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (isToday) {
    return time;
  }

  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'sent':
      return '✓ Enviado';
    case 'pending':
      return '⏳ Pendente';
    case 'failed':
      return '✗ Falhou';
    default:
      return status;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'sent':
      return '#16a34a';
    case 'pending':
      return '#f59e0b';
    case 'failed':
      return '#dc2626';
    default:
      return '#64748b';
  }
};
