import api from './api';

const ProfessionalService = {
  getAll: async (params) => {
    // params can include: category, name, lat, lon, radius
    const response = await api.get('/api/Professionals', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/Professionals/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/api/Professionals/categories');
    return response.data;
  }
};

export default ProfessionalService;
