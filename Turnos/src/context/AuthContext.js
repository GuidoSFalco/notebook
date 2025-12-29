import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('client'); // 'client' | 'professional'
  const [professionalStatus, setProfessionalStatus] = useState('none'); // 'none' | 'pending' | 'approved' | 'rejected'

  const login = async (email, password) => {
    // Mock login
    // In a real app, this would make an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          setUser({ email, name: 'Usuario Demo', id: '1' });
          // Reset role and status on login for demo purposes, or fetch from backend
          setRole('client');
          // For demo, let's assume this user is not yet a professional unless specific email is used
          if (email.includes('pro')) {
             setProfessionalStatus('approved');
          } else {
             setProfessionalStatus('none');
          }
          resolve();
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  };

  const register = async (email, password) => {
    // Mock register
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          setUser({ email, name: 'Nuevo Usuario', id: Date.now().toString() });
          setRole('client');
          setProfessionalStatus('none');
          resolve();
        } else {
          reject(new Error('Datos inválidos'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setRole('client');
  };

  const switchRole = () => {
    if (role === 'client') {
      if (professionalStatus === 'approved') {
        setRole('professional');
      } else {
        // Should handle validation flow trigger elsewhere or return status
        return false;
      }
    } else {
      setRole('client');
    }
    return true;
  };

  const requestProfessionalValidation = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setProfessionalStatus('pending');
        // Auto approve for demo after a short delay or immediately in this flow?
        // Let's keep it pending to show UI state, or approve immediately for testing.
        // For the sake of the "immediate switch" requirement after approval:
        // We'll simulate an admin approval process. For now, let's just say it goes to pending.
        // BUT, to demonstrate the switch, I'll make a function to force approve.
        resolve();
      }, 1500);
    });
  };

  // Helper for demo to approve validation
  const mockApproveValidation = () => {
    setProfessionalStatus('approved');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        professionalStatus,
        login,
        register,
        logout,
        switchRole,
        requestProfessionalValidation,
        mockApproveValidation,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
