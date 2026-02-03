import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, ScrollView, Alert, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { G, Circle } from 'react-native-svg';
import { ArrowLeft, Plus, DollarSign, Users, Folder, Trash2, Edit2, Check, X, Search, Filter, PieChart, ChevronRight, UserPlus, UserMinus, Briefcase, TrendingUp, Settings, Mail, Phone, Heart, UserCheck } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

// Mock Data
const MOCK_PARTICIPANTS = [
  { id: '1', name: 'Yo', avatar: 'https://i.pravatar.cc/150?u=1', isExternal: false, role: 'ADMIN', email: 'yo@email.com', phone: '+54 9 11 1234 5678' },
  { id: '2', name: 'Ana', avatar: 'https://i.pravatar.cc/150?u=2', isExternal: false, role: 'AUDITOR', email: 'ana@email.com', phone: '+54 9 11 8765 4321' },
  { id: '3', name: 'Carlos', avatar: 'https://i.pravatar.cc/150?u=3', isExternal: false, role: 'MANAGER', email: 'carlos@email.com', phone: '+54 9 11 2233 4455' },
  { id: '4', name: 'Sofia', avatar: 'https://i.pravatar.cc/150?u=4', isExternal: false, role: 'USER', email: 'sofia@email.com', phone: '+54 9 11 5566 7788' },
];

const ROLES = {
  ADMIN: { label: 'Admin', color: '#6200EE', canEdit: true, canManage: true },
  MANAGER: { label: 'Gestor', color: '#03DAC6', canEdit: true, canManage: false },
  AUDITOR: { label: 'Auditor', color: '#FF9800', canEdit: false, canManage: false },
  USER: { label: 'Usuario', color: '#95A5A6', canEdit: false, canManage: false },
};

const CATEGORIES = [
  { id: 'food', name: 'Comida', icon: '🍔', color: '#FF6B6B' },
  { id: 'transport', name: 'Transporte', icon: '🚗', color: '#4ECDC4' },
  { id: 'accommodation', name: 'Alojamiento', icon: '🏠', color: '#FFE66D' },
  { id: 'entertainment', name: 'Entretenimiento', icon: '🎉', color: '#1A535C' },
  { id: 'other', name: 'Otros', icon: '📝', color: '#95A5A6' },
];

const CURRENT_USER_ID = '1'; // Mock current user

export default function ExpensesScreen({ navigation, route }) {
  const { event } = route.params;
  const [mode, setMode] = useState('SHARED'); // 'SHARED' (Juntada) | 'CORPORATE' (Empresa)
  const [activeTab, setActiveTab] = useState('expenses'); // expenses, groups, balances/reports
  const [selectedGroup, setSelectedGroup] = useState(null); // For Group Detail View
  const [selectedBalanceUser, setSelectedBalanceUser] = useState(null); // For Balance Detail View

  // State
  const [expenses, setExpenses] = useState([
    { id: '1', title: 'Cena bienvenida', amount: 120.50, category: 'food', payerId: '1', creatorId: '1', involvedIds: ['1', '2', '3', '4'], date: new Date().toISOString(), groupId: null, unregisteredParticipants: 0 },
    { id: '2', title: 'Taxi al hotel', amount: 15.00, category: 'transport', payerId: '2', creatorId: '2', involvedIds: ['2', '3'], date: new Date().toISOString(), groupId: null, unregisteredParticipants: 0 },
    { id: '3', title: 'Compra Supermercado', amount: 85.00, category: 'food', payerId: '3', creatorId: '3', involvedIds: ['1', '2', '3', '4'], date: new Date().toISOString(), groupId: null, unregisteredParticipants: 0 },
    { id: '4', title: 'Entradas Museo', amount: 40.00, category: 'entertainment', payerId: '4', creatorId: '4', involvedIds: ['1', '2', '3', '4'], date: new Date().toISOString(), groupId: null, unregisteredParticipants: 0 },
    { id: '5', title: 'Bebidas Noche', amount: 30.00, category: 'food', payerId: '1', creatorId: '1', involvedIds: ['2', '4'], date: new Date().toISOString(), groupId: null, unregisteredParticipants: 0 },
    { id: '6', title: 'Gasolina', amount: 45.00, category: 'transport', payerId: '2', creatorId: '2', involvedIds: ['1', '2', '3', '4'], date: new Date().toISOString(), groupId: null, unregisteredParticipants: 0 },
  ]);
  const [groups, setGroups] = useState([
    { id: 'g1', name: 'Logística', description: 'Gastos de transporte y movimiento' },
  ]);
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'other',
    payerId: CURRENT_USER_ID,
    involvedIds: MOCK_PARTICIPANTS.map(p => p.id),
    groupId: null,
    totalParticipantsInput: MOCK_PARTICIPANTS.length.toString(),
  });

  // Group Modal State
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [groupFormData, setGroupFormData] = useState({ name: '', description: '' });

  // Participants Modal State
  const [participantsModalVisible, setParticipantsModalVisible] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL'); // ALL, ADMIN, MANAGER, AUDITOR, USER
  const [sortBy, setSortBy] = useState('ROLE'); // ROLE, NAME
  const [selectedParticipant, setSelectedParticipant] = useState(null); // For User Detail Modal

  // Derived State
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);

  const categoryStats = useMemo(() => {
    const stats = {};
    expenses.forEach(exp => {
      if (!stats[exp.category]) {
        stats[exp.category] = { amount: 0, count: 0, id: exp.category };
      }
      stats[exp.category].amount += exp.amount;
      stats[exp.category].count += 1;
    });
    
    return Object.values(stats)
      .map(stat => ({
        ...stat,
        name: CATEGORIES.find(c => c.id === stat.id)?.name || 'Otros',
        color: CATEGORIES.find(c => c.id === stat.id)?.color || '#95A5A6',
        percentage: totalExpenses > 0 ? (stat.amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpenses]);

  const balances = useMemo(() => {
    const balances = {};
    participants.forEach(p => {
      balances[p.id] = { 
        id: p.id, 
        name: p.name, 
        paid: 0, 
        share: 0, 
        avatar: p.avatar,
        owedToUser: 0, // Amount they owe to Current User
        owedByUser: 0  // Amount Current User owes to them
      };
    });

    expenses.forEach(exp => {
      // Add to payer
      if (balances[exp.payerId]) {
        balances[exp.payerId].paid += exp.amount;
      }
      
      // Add to involved (split equally)
      const totalParticipants = exp.involvedIds.length + (exp.unregisteredParticipants || 0);
      const splitAmount = exp.amount / totalParticipants;
      
      exp.involvedIds.forEach(id => {
        if (balances[id]) {
          balances[id].share += splitAmount;
        }
      });

      // Calculate Bilateral Debts with Current User
      // Case 1: Current User Paid
      if (exp.payerId === CURRENT_USER_ID) {
        exp.involvedIds.forEach(id => {
          if (id !== CURRENT_USER_ID && balances[id]) {
            balances[id].owedToUser += splitAmount;
          }
        });
      }
      // Case 2: Someone else paid, and Current User participated
      else if (exp.involvedIds.includes(CURRENT_USER_ID)) {
        if (balances[exp.payerId]) {
          balances[exp.payerId].owedByUser += splitAmount;
        }
      }
    });

    return Object.values(balances).map(b => ({
      ...b,
      balance: b.paid - b.share
    })).sort((a, b) => b.balance - a.balance);
  }, [expenses, participants]);

  const filteredParticipants = useMemo(() => {
    let result = participants.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterRole !== 'ALL') {
      result = result.filter(p => (p.role || 'USER') === filterRole);
    }

    // Sorting Logic
    const rolePriority = { ADMIN: 0, MANAGER: 1, AUDITOR: 2, USER: 3 };

    result.sort((a, b) => {
      if (sortBy === 'ROLE') {
        const roleA = rolePriority[a.role || 'USER'];
        const roleB = rolePriority[b.role || 'USER'];
        if (roleA !== roleB) return roleA - roleB;
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [participants, searchQuery, filterRole, sortBy]);

  // Actions
  const handleSaveExpense = () => {
    if (!formData.title || !formData.amount) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    const totalInput = parseInt(formData.totalParticipantsInput) || 0;
    const unregistered = Math.max(0, totalInput - formData.involvedIds.length);

    const newExpense = {
      id: editingExpense ? editingExpense.id : Date.now().toString(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      payerId: formData.payerId,
      creatorId: editingExpense ? editingExpense.creatorId : CURRENT_USER_ID,
      involvedIds: formData.involvedIds,
      groupId: formData.groupId,
      unregisteredParticipants: unregistered,
      date: new Date().toISOString(),
    };

    if (editingExpense) {
      setExpenses(expenses.map(e => e.id === editingExpense.id ? newExpense : e));
    } else {
      setExpenses([...expenses, newExpense]);
    }

    setModalVisible(false);
    resetForm();
  };

  const toggleMode = () => {
    const newMode = mode === 'SHARED' ? 'CORPORATE' : 'SHARED';
    setMode(newMode);
    setActiveTab(newMode === 'SHARED' ? 'expenses' : 'groups'); // Set default tab based on mode
  };

  const handleDeleteExpense = (id) => {
    Alert.alert(
      'Eliminar Gasto',
      '¿Estás seguro de eliminar este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => setExpenses(expenses.filter(e => e.id !== id)) }
      ]
    );
  };

  const handleSaveGroup = () => {
    if (!groupFormData.name) return;
    const newGroup = {
      id: Date.now().toString(),
      name: groupFormData.name,
      description: groupFormData.description,
    };
    setGroups([...groups, newGroup]);
    setGroupModalVisible(false);
    setGroupFormData({ name: '', description: '' });
  };

  const handleAddExternalPerson = () => {
    if (!newPersonName.trim()) return;
    const newPerson = {
      id: Date.now().toString(),
      name: newPersonName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newPersonName)}&background=random`,
      isExternal: true,
      role: 'USER', // Default role
    };
    setParticipants([...participants, newPerson]);
    setNewPersonName('');
  };

  const getUserRole = (userId) => {
    const participant = participants.find(p => p.id === userId);
    return participant ? participant.role : 'USER';
  };

  const canEdit = (expense) => {
    const role = getUserRole(CURRENT_USER_ID);
    if (role === 'AUDITOR') return false;
    if (role === 'ADMIN' || role === 'MANAGER') return true;
    return expense.creatorId === CURRENT_USER_ID;
  };

  const canAddExpense = () => {
    const role = getUserRole(CURRENT_USER_ID);
    return role !== 'AUDITOR';
  };

  const canManageParticipants = () => {
    const role = getUserRole(CURRENT_USER_ID);
    return ROLES[role]?.canManage || false;
  };

  const handleChangeRole = (userId) => {
    // Only ADMIN can change roles
    if (!canManageParticipants()) {
      Alert.alert('Permiso denegado', 'Solo los administradores pueden cambiar roles.');
      return;
    }

    const participant = participants.find(p => p.id === userId);
    const currentRole = participant.role || 'USER';

    Alert.alert(
      'Asignar Rol',
      `Selecciona el rol para ${participant.name}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Admin (Acceso Total)', 
          onPress: () => updateRole(userId, 'ADMIN'),
          style: currentRole === 'ADMIN' ? 'default' : 'default'
        },
        { 
          text: 'Gestor (Editar Gastos)', 
          onPress: () => updateRole(userId, 'MANAGER') 
        },
        { 
          text: 'Auditor (Solo Lectura)', 
          onPress: () => updateRole(userId, 'AUDITOR') 
        },
        { 
          text: 'Usuario (Sin Privilegios)', 
          onPress: () => updateRole(userId, 'USER'),
          style: 'destructive'
        },
      ]
    );
  };

  const updateRole = (userId, newRole) => {
    setParticipants(participants.map(p => 
      p.id === userId ? { ...p, role: newRole } : p
    ));
    // Update selected participant if it's the one being edited
    if (selectedParticipant && selectedParticipant.id === userId) {
      setSelectedParticipant({ ...selectedParticipant, role: newRole });
    }
  };

  const handleWhatsAppContact = (phoneNumber) => {
    if (!phoneNumber) return;
    // Limpiar el número para que solo queden dígitos y el signo +
    const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${formattedPhone}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp no está instalado o no se puede abrir el enlace');
        }
      })
      .catch(err => Alert.alert('Error', 'No se pudo abrir WhatsApp'));
  };

  const resetForm = () => {
    setEditingExpense(null);
    setFormData({
      title: '',
      amount: '',
      category: 'other',
      payerId: CURRENT_USER_ID,
      involvedIds: participants.map(p => p.id), // Default to all
      groupId: null,
      totalParticipantsInput: participants.length.toString(),
    });
  };

  const openEditModal = (expense) => {
    if (!canEdit(expense)) {
      Alert.alert('Permiso denegado', 'No tienes permisos para editar este gasto.');
      return;
    }
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      payerId: expense.payerId,
      involvedIds: expense.involvedIds,
      groupId: expense.groupId,
      totalParticipantsInput: (expense.involvedIds.length + (expense.unregisteredParticipants || 0)).toString(),
    });
    setModalVisible(true);
  };

  const handleRemoveParticipant = (expense, participantId) => {
    Alert.alert(
      'Eliminar Participante',
      `¿Quieres quitar a ${participants.find(p => p.id === participantId)?.name} de este gasto?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            const updatedExpenses = expenses.map(e => {
              if (e.id === expense.id) {
                return {
                  ...e,
                  involvedIds: e.involvedIds.filter(id => id !== participantId)
                };
              }
              return e;
            });
            setExpenses(updatedExpenses);
          }
        }
      ]
    );
  };

  const toggleParticipation = (expense) => {
    const isInvolved = expense.involvedIds.includes(CURRENT_USER_ID);
    
    // If trying to leave, show confirmation
    if (isInvolved) {
      Alert.alert(
        'Salir del Gasto',
        '¿Estás seguro de que quieres quitarte de este gasto?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Salir', 
            style: 'destructive', 
            onPress: () => updateParticipation(expense, false) 
          }
        ]
      );
    } else {
      // Joining is immediate
      updateParticipation(expense, true);
    }
  };

  const updateParticipation = (expense, join) => {
    const updatedExpenses = expenses.map(e => {
      if (e.id === expense.id) {
        let newInvolvedIds = e.involvedIds;
        let newUnregistered = e.unregisteredParticipants || 0;

        if (join) {
          if (!newInvolvedIds.includes(CURRENT_USER_ID)) {
            newInvolvedIds = [...newInvolvedIds, CURRENT_USER_ID];
            // If there are unregistered participants, we assume the user is one of them
            if (newUnregistered > 0) {
              newUnregistered -= 1;
            }
          }
        } else {
          if (newInvolvedIds.includes(CURRENT_USER_ID)) {
            newInvolvedIds = newInvolvedIds.filter(id => id !== CURRENT_USER_ID);
            // If leaving, the user becomes an unregistered participant to keep total constant
            newUnregistered += 1;
          }
        }

        return { ...e, involvedIds: newInvolvedIds, unregisteredParticipants: newUnregistered };
      }
      return e;
    });
    setExpenses(updatedExpenses);
  };

  // Render Items
  const renderExpenseItem = ({ item }) => {
    const category = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[4];
    const payer = participants.find(p => p.id === item.payerId);
    
    // Logic for "Actividad" (All expenses) tab
    const isActivityTab = activeTab === 'all_expenses';
    const isUserInvolved = item.involvedIds.includes(CURRENT_USER_ID);

    // Color logic
    let cardBackgroundColor = COLORS.surface;
    let cardElevation = styles.expenseCard.elevation || 2; // Default elevation from style
    let cardShadowOpacity = 0.1; // Default shadow opacity

    if (item.payerId === CURRENT_USER_ID) {
      cardBackgroundColor = COLORS.success + '15';
      cardElevation = 0;
      cardShadowOpacity = 0;
    } else if (isUserInvolved) {
      cardBackgroundColor = COLORS.error + '10';
      cardElevation = 0;
      cardShadowOpacity = 0;
    }

    return (
      <TouchableOpacity 
        style={[
          styles.expenseCard, 
          { 
            flexDirection: 'column', 
            alignItems: 'stretch', 
            padding: 0, 
            backgroundColor: cardBackgroundColor,
            elevation: cardElevation,
            shadowOpacity: cardShadowOpacity,
            shadowColor: cardElevation === 0 ? 'transparent' : '#000'
          }
        ]} 
        onPress={() => openEditModal(item)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.m }}>
          <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
            <Text style={{ fontSize: 20 }}>{category.icon}</Text>
          </View>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseTitle}>{item.title}</Text>
            {mode === 'SHARED' ? (
              <View style={{ flexDirection: 'column', marginTop: 4 }}>
                {isActivityTab && payer?.avatar && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Image 
                      source={{ uri: payer.avatar }} 
                      style={{ width: 16, height: 16, borderRadius: 8, marginRight: 6 }} 
                    />
                     <Text style={[styles.expenseSubtitle, { fontSize: 12 }]}>
                      {payer?.name}
                    </Text>
                  </View>
                )}
                {!isActivityTab && (
                   <Text style={[styles.expenseSubtitle, { color: COLORS.textSecondary }]}>
                    Pagado por <Text style={{ fontWeight: 'bold', color: COLORS.text }}>{payer?.name}</Text>
                  </Text>
                )}
              </View>
            ) : (
              <Text style={styles.expenseSubtitle}>
                {category.name} • {new Date(item.date).toLocaleDateString()}
              </Text>
            )}
          </View>
          <View style={styles.expenseAmount}>
            <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
          </View>
        </View>

        {isActivityTab && mode === 'SHARED' && (
           <View style={{ 
            borderTopWidth: 1, 
            borderTopColor: COLORS.border, 
            padding: SIZES.m,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isUserInvolved ? COLORS.primary + '10' : 'transparent'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Users size={16} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
              <Text style={{ ...FONTS.caption, color: COLORS.textSecondary }}>
                {item.involvedIds.length + (item.unregisteredParticipants || 0)} personas incluidas
              </Text>
            </View>
            {item.payerId !== CURRENT_USER_ID && canAddExpense() && (
              <TouchableOpacity 
                style={{
                  backgroundColor: isUserInvolved ? COLORS.error + '20' : COLORS.primary + '20',
                  padding: 8,
                  borderRadius: 20,
                }}
                onPress={() => toggleParticipation(item)}
              >
                {isUserInvolved ? (
                  <UserMinus size={20} color={COLORS.error} />
                ) : (
                  <UserPlus size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {!isActivityTab && mode === 'SHARED' && (
          <View style={{ 
            borderTopWidth: 1, 
            borderTopColor: COLORS.border, 
            padding: SIZES.s,
            paddingHorizontal: SIZES.m,
            backgroundColor: 'rgba(0,0,0,0.02)',
            borderBottomLeftRadius: SIZES.radius,
            borderBottomRightRadius: SIZES.radius,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Users size={14} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.expenseSubtitle, { color: COLORS.textSecondary, fontSize: 12 }]}>
                Dividido entre {item.involvedIds.length + (item.unregisteredParticipants || 0)} personas
              </Text>
            </View>
             {/* Optional: Show avatars of involved people if needed, or keep it simple as requested */}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderGroupItem = ({ item }) => {
    const groupExpenses = expenses.filter(e => e.groupId === item.id);
    const groupTotal = groupExpenses.reduce((sum, e) => sum + e.amount, 0);

    return (
      <TouchableOpacity 
        style={styles.groupCard} 
        onPress={() => setSelectedGroup(item)}
      >
        <View style={styles.groupHeader}>
          <View style={styles.groupIcon}>
            <Folder size={24} color={COLORS.primary} />
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupTitle}>{item.name}</Text>
            <Text style={styles.groupSubtitle}>{item.description}</Text>
          </View>
          <Text style={styles.groupAmount}>${groupTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.groupStats}>
          <Text style={styles.groupCount}>{groupExpenses.length} gastos</Text>
          <ChevronRight size={20} color={COLORS.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderBalanceItem = ({ item }) => {
    const isPositive = item.balance >= 0;
    return (
      <TouchableOpacity 
        style={styles.balanceCard}
        onPress={() => setSelectedBalanceUser(item)}
      >
        <View style={styles.balanceUser}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={styles.balanceName}>{item.name}</Text>
          {item.isExternal && <View style={styles.externalBadge}><Text style={styles.externalBadgeText}>Externo</Text></View>}
        </View>
        <View style={styles.balanceDetails}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Te debe</Text>
              <Text style={styles.balanceValue}>${(item.owedToUser || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Le debes</Text>
              <Text style={styles.balanceValue}>${(item.owedByUser || 0).toFixed(2)}</Text>
            </View>
            <View style={[styles.balanceTotal, isPositive ? styles.balancePositive : styles.balanceNegative]}>
            <Text style={styles.balanceTotalText}>
              {isPositive ? 'Recibe' : 'Debe'} ${Math.abs(item.balance).toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderParticipantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.participantRow}
      onPress={() => setSelectedParticipant(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={[styles.participantInfo, { flex: 1 }]}>
        <Text style={styles.participantNameRow}>{item.name}</Text>
        <Text style={styles.participantSubtitle}>
          {item.isExternal ? 'Externo • ' : ''}{ROLES[item.role || 'USER'].label}
        </Text>
      </View>
      <View 
        style={[styles.roleBadge, { backgroundColor: ROLES[item.role || 'USER'].color + '20' }]}
      >
        <Text style={[styles.roleText, { color: ROLES[item.role || 'USER'].color }]}>
          {ROLES[item.role || 'USER'].label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderReportItem = ({ item }) => (
    <View style={styles.reportItem}>
      <View style={styles.reportHeader}>
        <View style={[styles.reportIcon, { backgroundColor: item.color + '20' }]}>
          <Text>{CATEGORIES.find(c => c.id === item.id)?.icon}</Text>
        </View>
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{item.name}</Text>
          <Text style={styles.reportSubtitle}>{item.count} gastos</Text>
        </View>
        <Text style={styles.reportAmount}>${item.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
      </View>
    </View>
  );

  // Main Render
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Gastos</Text>
          <Text style={styles.headerSubtitle}>{mode === 'SHARED' ? 'Modo Amigos' : 'Modo Corporativo'}</Text>
          <Text style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: 2 }}>
            {mode === 'SHARED' 
              ? 'Dividir gastos y saldar deudas' 
              : 'Control total y reporte de gastos'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleMode} style={styles.iconButton}>
            {mode === 'SHARED' ? (
              <Users size={24} color={COLORS.primary} />
            ) : (
              <Briefcase size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setParticipantsModalVisible(true)} style={styles.iconButton}>
            <UserPlus size={24} color={COLORS.text} />
          </TouchableOpacity>
          {canAddExpense() && mode !== 'CORPORATE' && (
            <TouchableOpacity onPress={() => { resetForm(); setModalVisible(true); }} style={styles.addButton}>
              <Plus size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Total Gastado</Text>
          <Text style={styles.summaryAmount}>${totalExpenses.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryIcon}>
          <DollarSign size={24} color="white" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {mode === 'SHARED' && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'expenses' && styles.activeTab]} 
            onPress={() => setActiveTab('expenses')}
          >
            <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>Gastos</Text>
          </TouchableOpacity>
        )}

        {mode === 'SHARED' && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all_expenses' && styles.activeTab]} 
            onPress={() => setActiveTab('all_expenses')}
          >
            <Text style={[styles.tabText, activeTab === 'all_expenses' && styles.activeTabText]}>Global</Text>
          </TouchableOpacity>
        )}
        
        {mode === 'CORPORATE' && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'groups' && styles.activeTab]} 
            onPress={() => setActiveTab('groups')}
          >
            <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>Grupos</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.tab, activeTab === (mode === 'SHARED' ? 'balances' : 'reports') && styles.activeTab]} 
          onPress={() => setActiveTab(mode === 'SHARED' ? 'balances' : 'reports')}
        >
          <Text style={[styles.tabText, activeTab === (mode === 'SHARED' ? 'balances' : 'reports') && styles.activeTabText]}>
            {mode === 'SHARED' ? 'Balances' : 'Reportes'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'expenses' && (
          <FlatList
            data={mode === 'SHARED' 
              ? expenses.filter(e => e.payerId === CURRENT_USER_ID) 
              : expenses
            }
            renderItem={renderExpenseItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No hay gastos registrados</Text>
              </View>
            }
          />
        )}

        {activeTab === 'all_expenses' && (
          <FlatList
            data={expenses}
            renderItem={renderExpenseItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No hay gastos globales registrados</Text>
              </View>
            }
          />
        )}
        
        {activeTab === 'groups' && (
          <View style={{ flex: 1 }}>
            {selectedGroup ? (
              <View style={{ flex: 1 }}>
                 <View style={styles.groupDetailHeader}>
                    <TouchableOpacity onPress={() => setSelectedGroup(null)} style={styles.backButton}>
                       <ArrowLeft size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <View>
                      <Text style={styles.headerTitle}>{selectedGroup.name}</Text>
                      <Text style={styles.headerSubtitle}>{selectedGroup.description}</Text>
                    </View>
                 </View>
                 {canAddExpense() && (
                   <TouchableOpacity 
                      style={styles.createGroupButton} 
                      onPress={() => {
                         resetForm();
                         setFormData(prev => ({ ...prev, groupId: selectedGroup.id }));
                         setModalVisible(true);
                      }}
                   >
                      <Plus size={20} color={COLORS.primary} />
                      <Text style={styles.createGroupText}>Agregar Gasto al Grupo</Text>
                   </TouchableOpacity>
                 )}
                 <FlatList
                    data={expenses.filter(e => e.groupId === selectedGroup.id)}
                    renderItem={renderExpenseItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={
                       <View style={styles.emptyState}>
                          <Text style={styles.emptyText}>No hay gastos en este grupo</Text>
                       </View>
                    }
                 />
              </View>
            ) : (
              <>
                {canAddExpense() && (
                  <TouchableOpacity style={styles.createGroupButton} onPress={() => setGroupModalVisible(true)}>
                    <Plus size={20} color={COLORS.primary} />
                    <Text style={styles.createGroupText}>Crear Nuevo Grupo</Text>
                  </TouchableOpacity>
                )}
                <FlatList
                  data={groups}
                  renderItem={renderGroupItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={{ paddingBottom: 100 }}
                  ListEmptyComponent={
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyText}>No hay grupos creados</Text>
                    </View>
                  }
                />
              </>
            )}
          </View>
        )}
        
        {activeTab === 'balances' && mode === 'SHARED' && (
          <FlatList
            data={balances}
            renderItem={renderBalanceItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        {activeTab === 'reports' && mode === 'CORPORATE' && (
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
             <View style={styles.chartContainer}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Svg height="260" width="260" viewBox="0 0 260 260">
                    <G rotation="-90" origin="130, 130">
                      <Circle
                        cx="130"
                        cy="130"
                        r="100"
                        stroke={COLORS.border || '#F0F0F0'}
                        strokeWidth="25"
                        fill="transparent"
                      />
                      {categoryStats.length === 0 ? null : (
                        categoryStats.map((stat, index) => {
                           const radius = 100;
                           const circumference = 2 * Math.PI * radius;
                           const gapPixel = 4;
                           const gapLength = categoryStats.length > 1 ? gapPixel : 0;
                           const strokeLength = (stat.percentage / 100) * circumference;
                           const drawLength = Math.max(0, strokeLength - gapLength);
                           const previousPercentage = categoryStats.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
                           const offset = -previousPercentage * circumference / 100;
                           
                           return (
                             <Circle
                               key={stat.id}
                               cx="130"
                               cy="130"
                               r={radius}
                               stroke={stat.color}
                               strokeWidth="25"
                               fill="transparent"
                               strokeDasharray={`${drawLength} ${circumference}`}
                               strokeDashoffset={offset}
                               strokeLinecap="butt"
                             />
                           );
                        })
                      )}
                    </G>
                  </Svg>
                  <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>${totalExpenses.toFixed(2)}</Text>
                  </View>
                </View>
             </View>
             <Text style={styles.sectionTitle}>Desglose por Categoría</Text>
             {categoryStats.map((item, index) => (
               <View key={index}>
                 {renderReportItem({ item })}
               </View>
             ))}
          </ScrollView>
        )}
      </View>

      {/* Add/Edit Expense Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formScroll}>
              <Text style={styles.label}>Concepto</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                placeholder="Ej. Cena, Taxi..."
              />

              <Text style={styles.label}>Monto</Text>
              <TextInput
                style={styles.input}
                value={formData.amount}
                onChangeText={(text) => setFormData({...formData, amount: text})}
                placeholder="0.00"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      formData.category === cat.id && { backgroundColor: cat.color, borderColor: cat.color }
                    ]}
                    onPress={() => setFormData({...formData, category: cat.id})}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      formData.category === cat.id && { color: 'white' }
                    ]}>{cat.icon} {cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {mode === 'CORPORATE' && (
                <>
                  <Text style={styles.label}>Grupo (Opcional)</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
                    <TouchableOpacity
                        style={[
                          styles.categoryChip,
                          formData.groupId === null && { backgroundColor: COLORS.textSecondary, borderColor: COLORS.textSecondary }
                        ]}
                        onPress={() => setFormData({...formData, groupId: null})}
                      >
                        <Text style={[
                          styles.categoryChipText,
                          formData.groupId === null && { color: 'white' }
                        ]}>Ninguno</Text>
                      </TouchableOpacity>
                    {groups.map(group => (
                      <TouchableOpacity
                        key={group.id}
                        style={[
                          styles.categoryChip,
                          formData.groupId === group.id && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                        ]}
                        onPress={() => setFormData({...formData, groupId: group.id})}
                      >
                        <Text style={[
                          styles.categoryChipText,
                          formData.groupId === group.id && { color: 'white' }
                        ]}>{group.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </>
              )}

              {mode === 'SHARED' && (
                <>
                  <Text style={styles.label}>Personas Incluidas ({formData.involvedIds.length})</Text>
                  <Text style={{...FONTS.caption, color: COLORS.textSecondary, marginBottom: SIZES.s}}>
                    Indica quiénes participan en el gasto (incluyéndote si corresponde).
                  </Text>
                  <TouchableOpacity onPress={() => {
                      const allIds = participants.map(p => p.id);
                      const currentTotal = parseInt(formData.totalParticipantsInput) || 0;
                      const newTotal = Math.max(currentTotal, allIds.length);
                      setFormData({...formData, involvedIds: allIds, totalParticipantsInput: newTotal.toString()});
                  }} style={{marginBottom: 8}}>
                     <Text style={{...FONTS.caption, color: COLORS.primary}}>Seleccionar todos</Text>
                  </TouchableOpacity>
                  <View style={styles.involvedList}>
                    {participants.map(p => {
                      const isSelected = formData.involvedIds.includes(p.id);
                      return (
                        <TouchableOpacity
                          key={p.id}
                          style={[
                            styles.involvedChip,
                            isSelected && styles.selectedInvolved
                          ]}
                          onPress={() => {
                            const newInvolved = isSelected
                              ? formData.involvedIds.filter(id => id !== p.id)
                              : [...formData.involvedIds, p.id];
                            
                            const currentTotal = parseInt(formData.totalParticipantsInput) || 0;
                            let newTotal = currentTotal;
                            if (newInvolved.length > currentTotal) {
                                newTotal = newInvolved.length;
                            }
                            
                            setFormData({...formData, involvedIds: newInvolved, totalParticipantsInput: newTotal.toString()});
                          }}
                        >
                          <View style={styles.involvedCheck}>
                            {isSelected && <Check size={12} color="white" />}
                          </View>
                          <Text style={[
                            styles.involvedName,
                            isSelected && styles.selectedInvolvedText
                          ]}>{p.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={styles.label}>Total Personas Incluidas</Text>
                  <Text style={{...FONTS.caption, color: COLORS.textSecondary, marginBottom: SIZES.s}}>
                    Total de participantes (registrados + externos).
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={formData.totalParticipantsInput}
                    onChangeText={(text) => setFormData({...formData, totalParticipantsInput: text.replace(/[^0-9]/g, '')})}
                    onEndEditing={() => {
                        const val = parseInt(formData.totalParticipantsInput) || 0;
                        if (val < formData.involvedIds.length) {
                             setFormData(prev => ({...prev, totalParticipantsInput: prev.involvedIds.length.toString()}));
                        }
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </>
              )}

              {editingExpense && (
                (mode === 'SHARED' && activeTab === 'expenses') || 
                (mode === 'CORPORATE' && activeTab === 'groups' && selectedGroup)
              ) && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => {
                    setModalVisible(false);
                    handleDeleteExpense(editingExpense.id);
                  }}>
                  <Trash2 size={20} color={COLORS.error} />
                  <Text style={styles.deleteButtonText}>Eliminar Gasto</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Group Modal */}
      <Modal
        visible={groupModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Crear Grupo</Text>
              <TouchableOpacity onPress={() => setGroupModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.label}>Nombre del Grupo</Text>
              <TextInput
                style={styles.input}
                value={groupFormData.name}
                onChangeText={(text) => setGroupFormData({...groupFormData, name: text})}
                placeholder="Ej. Transporte, Bebidas..."
              />
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={styles.input}
                value={groupFormData.description}
                onChangeText={(text) => setGroupFormData({...groupFormData, description: text})}
                placeholder="Descripción opcional"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveGroup}>
                <Text style={styles.saveButtonText}>Crear Grupo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Participants Modal */}
      <Modal
        visible={participantsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setParticipantsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Participantes</Text>
              <TouchableOpacity onPress={() => setParticipantsModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar colaboradores..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Filters & Sort */}
            <View style={{ marginBottom: SIZES.m }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                <TouchableOpacity 
                  style={[styles.filterChip, filterRole === 'ALL' && styles.activeFilterChip]} 
                  onPress={() => setFilterRole('ALL')}
                >
                  <Text style={[styles.filterChipText, filterRole === 'ALL' && styles.activeFilterChipText]}>Todos</Text>
                </TouchableOpacity>
                {Object.keys(ROLES).map(roleKey => (
                  <TouchableOpacity 
                    key={roleKey}
                    style={[styles.filterChip, filterRole === roleKey && styles.activeFilterChip]} 
                    onPress={() => setFilterRole(roleKey)}
                  >
                    <Text style={[styles.filterChipText, filterRole === roleKey && styles.activeFilterChipText]}>
                      {ROLES[roleKey].label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity 
                style={styles.sortButton} 
                onPress={() => setSortBy(sortBy === 'ROLE' ? 'NAME' : 'ROLE')}
              >
                <Filter size={16} color={COLORS.textSecondary} />
                <Text style={styles.sortButtonText}>
                  Ordenado por: {sortBy === 'ROLE' ? 'Rol (Jerarquía)' : 'Nombre (A-Z)'}
                </Text>
              </TouchableOpacity>
            </View>

            {canAddExpense() && (
              <View style={styles.addPersonContainer}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: SIZES.s }]}
                  placeholder="Nombre persona externa"
                  value={newPersonName}
                  onChangeText={setNewPersonName}
                />
                <TouchableOpacity style={styles.addPersonButton} onPress={handleAddExternalPerson}>
                  <UserPlus size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              data={filteredParticipants}
              renderItem={renderParticipantItem}
              keyExtractor={item => item.id}
              style={{ maxHeight: 400 }}
            />
          </View>
        </View>
      </Modal>

      {/* User Details Modal */}
      <Modal
        visible={!!selectedParticipant}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedParticipant(null)}
      >
        <View style={styles.centeredModalContainer}>
          <View style={styles.centeredModalContent}>
            {selectedParticipant && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Perfil</Text>
                  <TouchableOpacity onPress={() => setSelectedParticipant(null)}>
                    <X size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                  {/* Profile Header */}
                  <View style={{ alignItems: 'center', marginBottom: SIZES.m }}>
                    <Image source={{ uri: selectedParticipant.avatar }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: SIZES.s }} />
                    <Text style={{ ...FONTS.h2, color: COLORS.text, textAlign: 'center' }}>{selectedParticipant.name}</Text>
                    <View style={[styles.roleBadge, { marginTop: 8, backgroundColor: ROLES[selectedParticipant.role || 'USER'].color + '20' }]}>
                      <Text style={[styles.roleText, { color: ROLES[selectedParticipant.role || 'USER'].color }]}>
                        {ROLES[selectedParticipant.role || 'USER'].label}
                      </Text>
                    </View>
                  </View>

                  {/* Contact Info */}
                  <View style={{ marginBottom: SIZES.l }}>
                    <View style={styles.contactRow}>
                      <Mail size={18} color={COLORS.textSecondary} style={{ marginRight: 12 }} />
                      <Text style={styles.contactText}>{selectedParticipant.email || 'No disponible'}</Text>
                    </View>
                    <View style={styles.contactRow}>
              <Phone size={18} color={COLORS.textSecondary} style={{ marginRight: 12 }} />
              {selectedParticipant.phone ? (
                <TouchableOpacity onPress={() => handleWhatsAppContact(selectedParticipant.phone)}>
                  <Text style={[styles.contactText, { color: COLORS.primary, fontWeight: '600' }]}>
                    {selectedParticipant.phone}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.contactText}>No disponible</Text>
              )}
            </View>
                  </View>

                  {/* Social Actions */}
                  <View style={styles.socialActionsContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                      <UserPlus size={20} color={COLORS.primary} />
                      <Text style={styles.socialButtonText}>Agregar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialButton, styles.socialButtonFilled]}>
                      <Heart size={20} color="white" />
                      <Text style={[styles.socialButtonText, { color: 'white' }]}>Seguir</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.divider} />

                  {/* Role Management (Admin Only) */}
                  {canManageParticipants() && (
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sectionTitle}>Gestionar Rol</Text>
                      {Object.keys(ROLES).map(roleKey => (
                        <TouchableOpacity
                          key={roleKey}
                          style={[
                            styles.roleOption,
                            selectedParticipant.role === roleKey && styles.selectedRoleOption,
                            { borderColor: selectedParticipant.role === roleKey ? ROLES[roleKey].color : COLORS.border }
                          ]}
                          onPress={() => updateRole(selectedParticipant.id, roleKey)}
                        >
                           <View style={{ flex: 1 }}>
                              <Text style={[
                                styles.roleOptionTitle,
                                selectedParticipant.role === roleKey && { color: ROLES[roleKey].color }
                              ]}>{ROLES[roleKey].label}</Text>
                              <Text style={styles.roleOptionDescription}>
                                 {roleKey === 'ADMIN' && 'Control total del evento.'}
                                 {roleKey === 'MANAGER' && 'Puede editar gastos.'}
                                 {roleKey === 'AUDITOR' && 'Solo lectura.'}
                                 {roleKey === 'USER' && 'Acceso básico.'}
                              </Text>
                           </View>
                           <View style={[
                             styles.radioButton,
                             selectedParticipant.role === roleKey && { borderColor: ROLES[roleKey].color }
                           ]}>
                              {selectedParticipant.role === roleKey && <View style={[styles.radioButtonSelected, { backgroundColor: ROLES[roleKey].color }]} />}
                           </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Balance Detail Modal */}
      <Modal
        visible={!!selectedBalanceUser}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedBalanceUser(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle: {selectedBalanceUser?.name}</Text>
              <TouchableOpacity onPress={() => setSelectedBalanceUser(null)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Gastos Asociados</Text>
            <FlatList
              data={expenses.filter(e => {
                if (!selectedBalanceUser) return false;
                return e.payerId === selectedBalanceUser.id || e.involvedIds.includes(selectedBalanceUser.id);
              })}
              renderItem={renderExpenseItem}
              keyExtractor={item => item.id}
              style={{ maxHeight: '80%' }}
              ListEmptyComponent={<Text style={styles.emptyText}>No hay gastos asociados.</Text>}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.l,
    paddingVertical: SIZES.m,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  headerSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: SIZES.s,
  },
  iconButton: {
    padding: SIZES.s,
    marginRight: SIZES.s,
  },
  addButton: {
    padding: SIZES.s,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  summaryCard: {
    margin: SIZES.l,
    padding: SIZES.l,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.cardRadius,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  summaryLabel: {
    ...FONTS.caption,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  summaryAmount: {
    ...FONTS.h2,
    color: 'white',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.l,
    marginBottom: SIZES.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    marginRight: SIZES.l,
    paddingBottom: SIZES.s,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: 'Poppins_700Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.l,
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    marginInline: SIZES.xs,
    marginBottom: SIZES.m,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  expenseSubtitle: {
    ...FONTS.caption,
    marginTop: 2,
  },
  expenseAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    ...FONTS.h3,
    color: COLORS.text,
    fontSize: 18,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SIZES.m,
  },
  emptyState: {
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  
  // Group Styles
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.m,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.m,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  createGroupText: {
    ...FONTS.body,
    color: COLORS.primary,
    marginLeft: SIZES.s,
  },
  groupCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    marginInline: SIZES.xs,
    marginBottom: SIZES.m,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.s,
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  groupInfo: {
    flex: 1,
  },
  groupTitle: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  groupSubtitle: {
    ...FONTS.caption,
  },
  groupAmount: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  groupStats: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupCount: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  // Balance Styles
  balanceCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    marginInline: SIZES.xs,
    marginBottom: SIZES.m,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  balanceUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SIZES.s,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.s,
  },
  balanceName: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  balanceDetails: {
    gap: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  balanceValue: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.text,
  },
  balanceTotal: {
    marginTop: SIZES.s,
    padding: SIZES.s,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  balancePositive: {
    backgroundColor: COLORS.success + '20',
  },
  balanceNegative: {
    backgroundColor: COLORS.error + '20',
  },
  balanceTotalText: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  externalBadge: {
    backgroundColor: COLORS.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  externalBadgeText: {
    ...FONTS.caption,
    color: 'white',
    fontSize: 10,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.cardRadius,
    borderTopRightRadius: SIZES.cardRadius,
    padding: SIZES.l,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.l,
  },
  // Centered Modal Styles
  centeredModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredModalContent: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.cardRadius,
    padding: SIZES.l,
    width: '85%',
    maxHeight: '80%',
    maxWidth: 400,
    ...SHADOWS.medium,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    ...FONTS.body,
    color: COLORS.text,
  },
  socialActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.l,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginHorizontal: 6,
  },
  socialButtonFilled: {
    backgroundColor: COLORS.primary,
  },
  socialButtonText: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.m,
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  formScroll: {
    maxHeight: '80%',
  },
  label: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: SIZES.s,
    marginTop: SIZES.m,
  },
  input: {
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    ...FONTS.body,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoriesList: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SIZES.s,
    backgroundColor: COLORS.surface,
  },
  categoryChipText: {
    ...FONTS.caption,
    color: COLORS.text,
  },
  participantsList: {
    flexDirection: 'row',
  },
  participantChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.s,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SIZES.s,
    backgroundColor: COLORS.surface,
  },
  selectedParticipant: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  selectedParticipantText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  participantName: {
    ...FONTS.caption,
    color: COLORS.text,
  },
  involvedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  involvedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.s,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SIZES.s,
    marginBottom: SIZES.s,
    backgroundColor: COLORS.surface,
  },
  selectedInvolved: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  involvedCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedInvolvedText: {
    color: 'white',
  },
  involvedName: {
    ...FONTS.caption,
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: SIZES.xl,
  },
  saveButtonText: {
    ...FONTS.h3,
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.m,
    marginTop: SIZES.m,
  },
  deleteButtonText: {
    color: COLORS.error,
    marginLeft: 8,
    ...FONTS.body,
  },
  
  // Participant Modal Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.m,
    marginBottom: SIZES.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SIZES.s,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SIZES.m,
    ...FONTS.body,
  },
  addPersonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.l,
  },
  addPersonButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.m,
    backgroundColor: COLORS.surface,
    marginBottom: SIZES.s,
    marginInline: SIZES.xs,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  participantInfo: {
    marginLeft: SIZES.m,
  },
  participantNameRow: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  participantSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    ...FONTS.caption,
    fontWeight: 'bold',
  },
  // Report Styles
  chartContainer: {
    alignItems: 'center',
    marginVertical: SIZES.l,
  },
  totalCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    ...SHADOWS.medium,
  },
  totalLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  totalValue: {
    ...FONTS.h2,
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.m,
  },
  reportItem: {
    marginBottom: SIZES.m,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.s,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  reportSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  reportAmount: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Filter & Sort Styles
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    ...FONTS.caption,
    color: COLORS.text,
  },
  activeFilterChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sortButtonText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },

  // Role Option Styles
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.m,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.s,
    backgroundColor: COLORS.surface,
  },
  selectedRoleOption: {
    backgroundColor: COLORS.surface,
  },
  roleOptionTitle: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  roleOptionDescription: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.m,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
