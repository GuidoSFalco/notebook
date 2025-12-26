export const cities = [
  { id: '1', name: 'Córdoba Capital' },
  { id: '2', name: 'Villa Carlos Paz' },
  { id: '3', name: 'Alta Gracia' },
  { id: '4', name: 'Río Cuarto' },
  { id: '5', name: 'Villa María' },
];

export const trips = [
  {
    id: '101',
    origin: 'Córdoba Capital',
    destination: 'Villa Carlos Paz',
    departureTime: '08:00',
    arrivalTime: '08:45',
    duration: '45 min',
    price: 3500,
    seatsAvailable: 12,
    type: 'Directo',
    company: 'InterBus'
  },
  {
    id: '102',
    origin: 'Córdoba Capital',
    destination: 'Villa Carlos Paz',
    departureTime: '09:30',
    arrivalTime: '10:20',
    duration: '50 min',
    price: 3200,
    seatsAvailable: 24,
    type: 'Semirápido',
    company: 'SierrasTour'
  },
  {
    id: '103',
    origin: 'Córdoba Capital',
    destination: 'Alta Gracia',
    departureTime: '10:00',
    arrivalTime: '11:00',
    duration: '1 h',
    price: 4000,
    seatsAvailable: 5,
    type: 'Directo',
    company: 'InterBus'
  },
  {
    id: '104',
    origin: 'Río Cuarto',
    destination: 'Córdoba Capital',
    departureTime: '07:00',
    arrivalTime: '10:00',
    duration: '3 h',
    price: 12500,
    seatsAvailable: 2,
    type: 'Ejecutivo',
    company: 'SurLink'
  }
];

export const myTickets = [
  {
    id: 'T-88291',
    tripId: '101',
    origin: 'Córdoba Capital',
    destination: 'Villa Carlos Paz',
    date: '24 Dic, 2025',
    time: '08:00',
    seat: '4A',
    passenger: 'Guido User',
    status: 'active', // active, used, expired
    qrCode: 'mock-qr-data-123'
  }
];
