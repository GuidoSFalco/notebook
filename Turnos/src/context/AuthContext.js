import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { setOnUnauthorized } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('client'); // 'client' | 'professional'
  const [professionalStatus, setProfessionalStatus] = useState('none'); // 'none' | 'pending' | 'approved' | 'rejected'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const keys = ['userToken', 'userId', 'userRole', 'userStatus', 'userFullName'];
        const result = await AsyncStorage.multiGet(keys);
        const data = Object.fromEntries(result);
        
        const token = data.userToken;
        const userId = data.userId;
        const savedRole = data.userRole;
        const savedStatus = data.userStatus;
        const savedName = data.userFullName;
        
        if (token && userId) {
          setUser({ id: userId, token, fullName: savedName });
          if (savedRole) setRole(savedRole);
          if (savedStatus) setProfessionalStatus(savedStatus);
        }
      } catch (e) {
        console.error('Failed to load auth state', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();

    setOnUnauthorized(() => {
      logout();
    });
  }, []);

  const login = async (email, password) => {
    try {
      const data = await AuthService.login(email, password);
      setUser({ email, id: data.userId, fullName: data.fullName });
      
      // Map backend status if it's not a string (assuming backend might send integers)
      // If backend sends strings matching these, great. If not, we might need mapping.
      // For now, assuming backend sends compatible values or we use what it sends.
      // If we need mapping: 
      // const statusMap = { 0: 'none', 1: 'pending', 2: 'approved', 3: 'rejected' };
      // setProfessionalStatus(statusMap[data.professionalStatus] || data.professionalStatus);
      
      setProfessionalStatus(data.professionalStatus || 'none');
      setRole(data.role || 'client');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (fullName, email, password, isProfessional) => {
    try {
      await AuthService.register(fullName, email, password, isProfessional);
      // Automatically login after register
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      console.error('Logout error', e);
    }
    setUser(null);
    setRole('client');
    setProfessionalStatus('none');
  };

  const switchRole = () => {
    if (role === 'client') {
      if (professionalStatus === 'approved') {
        setRole('professional');
      } else {
        return false;
      }
    } else {
      setRole('client');
    }
    return true;
  };

  const requestProfessionalValidation = async (data) => {
    try {
      await AuthService.requestProfessional(data);
      setProfessionalStatus('pending');
    } catch (error) {
      throw error;
    }
  };

  // Helper for demo/testing to approve validation locally
  const mockApproveValidation = () => {
    setProfessionalStatus('approved');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        professionalStatus,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        requestProfessionalValidation,
        mockApproveValidation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
