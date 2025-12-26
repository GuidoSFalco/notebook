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
    availability: ['2025-12-26', '2025-12-27', '2025-12-28'],
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
    availability: ['2025-12-27', '2025-12-28'],
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
    availability: ['2025-12-26', '2025-12-30'],
    coordinate: {
      latitude: -34.5457,
      longitude: -58.4636,
    }
  }
];

export const MY_APPOINTMENTS = [
  {
    id: 'a1',
    professionalId: 'p1',
    date: '2025-12-28T10:00:00',
    status: 'confirmed', // confirmed, cancelled, completed
    service: 'Consulta General'
  },
  {
    id: 'a2',
    professionalId: 'p2',
    date: '2025-12-15T16:30:00',
    status: 'completed',
    service: 'Sesión de Terapia'
  }
];
