import api from './api';

const AppointmentService = {
  create: async (appointmentData) => {
    // appointmentData: { professionalId, date, serviceType, notes }
    const response = await api.post('/api/Appointments', appointmentData);
    return response.data;
  },

  getMyAppointments: async () => {
    const response = await api.get('/api/Appointments/my-appointments');
    return response.data;
  },

  getByProfessional: async (professionalId) => {
    const response = await api.get(`/api/Appointments/professional/${professionalId}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    // status: int (0=Confirmed, 4=Cancelled, etc.)
    const response = await api.put(`/api/Appointments/${id}/status`, { status });
    return response.data;
  }
};

export default AppointmentService;
