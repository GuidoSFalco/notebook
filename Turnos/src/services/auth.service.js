import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthService = {
  login: async (email, password) => {
    const response = await api.post('/api/Auth/login', { email, password });
    const { token, userId, role, professionalStatus, fullName } = response.data;
    
    if (token) {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userId', userId ? userId.toString() : '');
      // We can store other info if needed, but Context will usually hold it in memory
    }
    return response.data;
  },

  register: async (fullName, email, password, isProfessional) => {
    const response = await api.post('/api/Auth/register', {
      fullName,
      email,
      password,
      isProfessional
    });
    return response.data;
  },

  requestProfessional: async (data) => {
    // data: { specialty, price, locationName, categoryId, ... }
    const response = await api.post('/api/Auth/request-professional', data);
    return response.data;
  },

  logout: async () => {
    const keys = ['userToken', 'userId', 'userRole', 'userStatus', 'userFullName'];
    await AsyncStorage.multiRemove(keys);
  }
};

export default AuthService;
