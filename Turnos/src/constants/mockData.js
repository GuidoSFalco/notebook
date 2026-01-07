export const CATEGORIES = [
  { id: '1', name: 'Medicina General', icon: 'stethoscope' },
  { id: '2', name: 'Odontología', icon: 'smile' },
  { id: '3', name: 'Psicología', icon: 'brain' },
  { id: '4', name: 'Nutrición', icon: 'apple' },
  { id: '5', name: 'Kinesiología', icon: 'activity' },
];

export const PROFESSIONALS = [
  {
    id: 'p1',
    name: 'Dr. Alejandro García',
    specialty: 'Cardiólogo',
    category: 'Medicina General',
    rating: 4.9,
    reviews: 124,
    location: 'Centro Médico Belgrano, CABA',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    price: 5000,
    about: 'Especialista en cardiología clínica con más de 15 años de experiencia. Enfoque en prevención y tratamiento de hipertensión.',
    availability: ['2025-12-30', '2025-12-31', '2026-01-02', '2026-01-03', '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08'],
    fullDates: ['2026-01-02', '2026-01-06'],
    phone: '5491112345678',
    coordinate: {
      latitude: -34.5627,
      longitude: -58.4563,
    }
  },
  {
    id: 'p2',
    name: 'Lic. María Fernández',
    specialty: 'Psicóloga Clínica',
    category: 'Psicología',
    rating: 5.0,
    reviews: 89,
    location: 'Consultorio Privado, Palermo',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    price: 4500,
    about: 'Terapia cognitivo-conductual para adultos y adolescentes. Especializada en trastornos de ansiedad y estrés.',
    availability: ['2025-12-26', '2025-12-29'],
    phone: '5491187654321',
    coordinate: {
      latitude: -34.5889,
      longitude: -58.4305,
    }
  },
  {
    id: 'p3',
    name: 'Dra. Sofía Martínez',
    specialty: 'Odontóloga',
    category: 'Odontología',
    rating: 4.8,
    reviews: 210,
    location: 'Dental Health, Recoleta',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    price: 3500,
    about: 'Odontología general y estética. Blanqueamientos, ortodoncia invisible y diseño de sonrisa.',
    availability: ['2026-01-02', '2026-01-04', '2026-01-05', '2026-01-07'],
    phone: '5491111223344',
    coordinate: {
      latitude: -34.5883,
      longitude: -58.3938,
    }
  },
    {
    id: 'p4',
    name: 'Lic. Juan Pablo Silva',
    specialty: 'Nutricionista Deportivo',
    category: 'Nutrición',
    rating: 4.7,
    reviews: 56,
    location: 'Gym Fit, Nuñez',
    image: 'https://randomuser.me/api/portraits/men/85.jpg',
    price: 4000,
    about: 'Planes de alimentación personalizados para deportistas de alto rendimiento y amateurs.',
    availability: ['2025-12-30', '2026-01-02', '2026-01-03', '2026-01-06'],
    fullDates: ['2025-12-30'],
    phone: '5491199887766',
    coordinate: {
      latitude: -34.5457,
      longitude: -58.4636,
    }
  }
];

export const MY_APPOINTMENTS = [
  // HOY (2026-01-06)
  {
    id: 'a1',
    professionalId: 'p1',
    date: '2026-01-06T09:00:00',
    status: 'confirmed',
    service: 'Consulta Cardiológica',
    clientName: 'Juan Pérez',
    clientPhone: '5491133334444'
  },
  {
    id: 'a2',
    professionalId: 'p1',
    date: '2026-01-06T11:30:00',
    status: 'completed',
    service: 'Control Presión Arterial',
    clientName: 'María Gómez',
    clientPhone: '5491155556666'
  },
  {
    id: 'a3',
    professionalId: 'p1',
    date: '2026-01-06T14:00:00',
    status: 'reschedule_requested',
    service: 'Consulta Urgencia',
    clientName: 'Carlos López',
    clientPhone: '5491166667777',
    endTime: '15:00'
  },
  {
    id: 'a4',
    professionalId: 'p1',
    date: '2026-01-06T16:15:00',
    status: 'cancellation_requested',
    service: 'Chequeo General',
    clientName: 'Ana Díaz',
    clientPhone: '5491188889999'
  },
  {
    id: 'a5',
    professionalId: 'p1',
    date: '2026-01-06T18:00:00',
    status: 'confirmed',
    service: 'Entrega de Estudios',
    clientName: 'Pedro Silva',
    clientPhone: '5491122223333'
  },

  // MAÑANA (2026-01-07)
  {
    id: 'a6',
    professionalId: 'p1',
    date: '2026-01-07T10:00:00',
    status: 'confirmed',
    service: 'Ergometría',
    clientName: 'Lucía Fernández',
    clientPhone: '5491144445555'
  },
  {
    id: 'a7',
    professionalId: 'p1',
    date: '2026-01-07T15:00:00',
    status: 'proposal_sent',
    service: 'Consulta General',
    clientName: 'Miguel Torres',
    clientPhone: '5491199990000'
  },

  // AYER (2026-01-05)
  {
    id: 'a8',
    professionalId: 'p1',
    date: '2026-01-05T09:00:00',
    status: 'completed',
    service: 'Consulta Primera Vez',
    clientName: 'Sofía Ramirez',
    clientPhone: '5491177778888'
  },
  {
    id: 'a9',
    professionalId: 'p1',
    date: '2026-01-05T11:00:00',
    status: 'cancelled',
    service: 'Control',
    clientName: 'Diego Ruiz',
    clientPhone: '5491111112222'
  },

  // OTROS PROFESIONALES (Para no romper otras vistas si se usan)
  {
    id: 'a10',
    professionalId: 'p2',
    date: '2026-01-06T16:30:00',
    status: 'confirmed',
    service: 'Sesión de Terapia',
    clientName: 'Guido Cliente',
    clientPhone: '5491155556666'
  },
  {
    id: 'a11',
    professionalId: 'p3',
    date: '2026-01-08T14:00:00',
    status: 'reschedule_requested',
    service: 'Limpieza Dental',
    clientName: 'Ana Perez',
    clientPhone: '5491144443333'
  }
];
