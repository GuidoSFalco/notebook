
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, TextInput, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { Settings, LogOut, Ticket, Heart, Calendar, Camera, Edit2, Check, X, Lock, Users, UserPlus, UserMinus, UserX, Search, MessageSquare, Shield, ShieldBan } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { FlatList } from 'react-native';

const MENU_ITEMS = [
  // { icon: Ticket, label: 'Mis Tickets', badge: 2 },
  { icon: Heart, label: 'Eventos Guardados', badge: 5, route: 'SavedEvents' },
  { icon: Calendar, label: 'Mis Eventos', badge: 1, route: 'MyEvents' },
  { icon: Users, label: 'Amigos', route: 'FriendsManager' },
  { icon: Settings, label: 'Configuración', route: 'Settings' },
  { icon: LogOut, label: 'Cerrar Sesión', color: COLORS.error },
];

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState({
    name: 'Guido',
    bio: 'Amante de la música y el arte 🎨🎵',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    password: 'password123'
  });

  // Friends State
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('friends'); // friends, requests, search, blocked
  const [searchQuery, setSearchQuery] = useState('');
  
  const [friends, setFriends] = useState([
    { id: '1', name: 'Ana García', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', online: true },
    { id: '2', name: 'Carlos Ruiz', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', online: false },
    { id: '3', name: 'Sofia Lopez', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', online: true },
  ]);

  const [requests, setRequests] = useState([
    { id: '4', name: 'Pedro Martinez', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', mutual: 3 },
    { id: '5', name: 'Laura Torres', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', mutual: 1 },
  ]);

  const [blocked, setBlocked] = useState([
    { id: '6', name: 'Usuario Molesto', avatar: null },
  ]);

  const [searchResults, setSearchResults] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleNavigation = (item) => {
    if (item.route === 'FriendsManager') {
      setFriendsModalVisible(true);
    } else if (item.route) {
      navigation.navigate(item.route);
    } else {
      Alert.alert("Próximamente", "Esta funcionalidad estará disponible pronto.");
    }
  };

  // Friend Actions
  const handleRemoveFriend = (id) => {
    Alert.alert(
      "Eliminar amigo",
      "¿Estás seguro de que quieres eliminar a este amigo?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => setFriends(prev => prev.filter(f => f.id !== id))
        }
      ]
    );
  };

  const handleBlockUser = (user, fromList = 'friends') => {
    Alert.alert(
      "Bloquear usuario",
      "¿Estás seguro? No podrá ver tu perfil ni contactarte.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Bloquear", 
          style: "destructive",
          onPress: () => {
            if (fromList === 'friends') setFriends(prev => prev.filter(f => f.id !== user.id));
            if (fromList === 'requests') setRequests(prev => prev.filter(r => r.id !== user.id));
            setBlocked(prev => [...prev, user]);
            Alert.alert("Usuario bloqueado");
          }
        }
      ]
    );
  };

  const handleUnblockUser = (id) => {
    setBlocked(prev => prev.filter(b => b.id !== id));
    Alert.alert("Usuario desbloqueado");
  };

  const handleAcceptRequest = (request) => {
    setRequests(prev => prev.filter(r => r.id !== request.id));
    setFriends(prev => [...prev, { ...request, online: false }]);
    Alert.alert("¡Ahora son amigos!");
  };

  const handleRejectRequest = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      // Mock search
      setSearchResults([
        { id: '99', name: `Usuario "${text}"`, avatar: 'https://randomuser.me/api/portraits/men/99.jpg', status: 'none' },
        { id: '100', name: 'Maria Buscada', avatar: 'https://randomuser.me/api/portraits/women/10.jpg', status: 'pending' }
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const handleSendRequest = (id) => {
    Alert.alert("Solicitud enviada", "Se ha enviado una solicitud de amistad.");
    setSearchResults(prev => prev.map(u => u.id === id ? { ...u, status: 'sent' } : u));
  };

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      <Image source={{ uri: item.avatar || 'https://via.placeholder.com/50' }} style={styles.friendAvatar} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStatus}>{item.online ? 'En línea' : 'Desconectado'}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveFriend(item.id)} style={styles.actionButton}>
        <UserMinus size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleBlockUser(item, 'friends')} style={[styles.actionButton, { marginLeft: 8 }]}>
        <ShieldBan size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  const renderRequestItem = ({ item }) => (
    <View style={styles.friendItem}>
      <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStatus}>{item.mutual} amigos en común</Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity onPress={() => handleAcceptRequest(item)} style={styles.acceptButton}>
          <Check size={20} color={COLORS.surface} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRejectRequest(item.id)} style={styles.rejectButton}>
          <X size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBlockedItem = ({ item }) => (
    <View style={styles.friendItem}>
      <View style={[styles.friendAvatar, { backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center' }]}>
        <UserX size={24} color={COLORS.textSecondary} />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStatus}>Bloqueado</Text>
      </View>
      <TouchableOpacity onPress={() => handleUnblockUser(item.id)} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Desbloquear</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSearchItem = ({ item }) => (
    <View style={styles.friendItem}>
      <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
      </View>
      {item.status === 'sent' ? (
        <Text style={styles.sentText}>Enviada</Text>
      ) : item.status === 'pending' ? (
         <Text style={styles.sentText}>Pendiente</Text>
      ) : (
        <TouchableOpacity onPress={() => handleSendRequest(item.id)} style={styles.primaryButton}>
          <UserPlus size={18} color={COLORS.surface} style={{ marginRight: 4 }} />
          <Text style={styles.primaryButtonText}>Agregar</Text>
        </TouchableOpacity>
      )}
    </View>
  );


  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto de perfil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setEditForm({ ...editForm, avatar: result.assets[0].uri });
    }
  };

  const handleSaveProfile = () => {
    if (!editForm.name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }
    
    setUser({ ...editForm });
    setIsEditing(false);
    Alert.alert('Éxito', 'Perfil actualizado correctamente.');
  };

  const handleCancelEdit = () => {
    setEditForm({ ...user });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    if (passwordForm.current !== user.password) {
      Alert.alert('Error', 'La contraseña actual es incorrecta.');
      return;
    }

    if (passwordForm.new.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden.');
      return;
    }

    setUser(prev => ({ ...prev, password: passwordForm.new }));
    setPasswordModalVisible(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
    Alert.alert('Éxito', 'Contraseña actualizada correctamente.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          >
            {isEditing ? (
              <Check size={24} color={COLORS.success} />
            ) : (
              <Edit2 size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>
        
        {isEditing && (
           <TouchableOpacity 
             style={[styles.editButton, { right: 60 }]} 
             onPress={handleCancelEdit}
           >
             <X size={24} color={COLORS.error} />
           </TouchableOpacity>
        )}

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            disabled={!isEditing} 
            onPress={handlePickImage}
          >
            <Image 
              source={{ uri: isEditing ? editForm.avatar : user.avatar }} 
              style={styles.avatar} 
            />
            {isEditing && (
              <View style={styles.editAvatarOverlay}>
                <Camera size={24} color="#fff" />
              </View>
            )}
            {!isEditing && <View style={styles.onlineBadge} />}
          </TouchableOpacity>

          {isEditing ? (
            <View style={styles.editForm}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                placeholder="Nombre"
                placeholderTextColor={COLORS.textSecondary}
              />
              
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.bio}
                onChangeText={(text) => setEditForm({ ...editForm, bio: text })}
                placeholder="Bio"
                placeholderTextColor={COLORS.textSecondary}
                multiline
              />

              <TouchableOpacity 
                style={styles.changePasswordButton}
                onPress={() => setPasswordModalVisible(true)}
              >
                <Lock size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.changePasswordText}>Cambiar Contraseña</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.bio}>{user.bio}</Text>
            </>
          )}

          {/* Stats */}
          {!isEditing && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Eventos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>48</Text>
                <Text style={styles.statLabel}>Seguidores</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>Seguidos</Text>
              </View>
            </View>
          )}
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => handleNavigation(item)}
            >
              <View style={[styles.menuIconBox, item.color && { backgroundColor: 'rgba(227, 52, 47, 0.1)' }]}>
                <item.icon size={24} color={item.color || COLORS.primary} />
              </View>
              <Text style={[styles.menuLabel, item.color && { color: item.color }]}>
                {item.label}
              </Text>
              {item.badge && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Password Change Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Contraseña Actual</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.current}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, current: text })}
                placeholder="Ingresa tu contraseña actual"
                secureTextEntry
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.inputLabel}>Nueva Contraseña</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.new}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, new: text })}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.confirm}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, confirm: text })}
                placeholder="Repite la nueva contraseña"
                secureTextEntry
                placeholderTextColor={COLORS.textSecondary}
              />

              <TouchableOpacity 
                style={styles.savePasswordButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.savePasswordText}>Guardar Contraseña</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Friends Management Modal */}
      <Modal
        visible={friendsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFriendsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%', marginTop: 'auto' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Amigos</Text>
              <TouchableOpacity onPress={() => setFriendsModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'friends' && styles.activeTab]} 
                onPress={() => setActiveTab('friends')}
              >
                <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>Amigos</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'requests' && styles.activeTab]} 
                onPress={() => setActiveTab('requests')}
              >
                <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>Solicitudes</Text>
                {requests.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{requests.length}</Text></View>}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'search' && styles.activeTab]} 
                onPress={() => setActiveTab('search')}
              >
                <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>Buscar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'blocked' && styles.activeTab]} 
                onPress={() => setActiveTab('blocked')}
              >
                <Text style={[styles.tabText, activeTab === 'blocked' && styles.activeTabText]}>Bloqueados</Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar (Only visible in search tab) */}
            {activeTab === 'search' && (
              <View style={styles.searchContainer}>
                <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar usuarios..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
              </View>
            )}

            {/* Content List */}
            <FlatList
              data={
                activeTab === 'friends' ? friends :
                activeTab === 'requests' ? requests :
                activeTab === 'blocked' ? blocked :
                searchResults
              }
              renderItem={
                activeTab === 'friends' ? renderFriendItem :
                activeTab === 'requests' ? renderRequestItem :
                activeTab === 'blocked' ? renderBlockedItem :
                renderSearchItem
              }
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {activeTab === 'friends' ? 'No tienes amigos aún.' :
                     activeTab === 'requests' ? 'No tienes solicitudes pendientes.' :
                     activeTab === 'blocked' ? 'No has bloqueado a nadie.' :
                     searchQuery.length > 0 ? 'No se encontraron usuarios.' : 'Busca nuevos amigos.'}
                  </Text>
                </View>
              }
            />
          </View>
        </SafeAreaView>
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
    padding: SIZES.l,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  editButton: {
    position: 'absolute',
    right: SIZES.l,
    top: SIZES.l,
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.m,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.surface,
  },
  editAvatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.surface,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 4,
  },
  bio: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.l,
    textAlign: 'center',
    paddingHorizontal: SIZES.l,
  },
  editForm: {
    width: '100%',
    paddingHorizontal: SIZES.l,
    alignItems: 'center',
  },
  inputLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.m,
    ...FONTS.body,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SIZES.s,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.m,
    padding: SIZES.s,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: SIZES.radius,
  },
  changePasswordText: {
    ...FONTS.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.l,
    borderTopRightRadius: SIZES.l,
    padding: SIZES.l,
    minHeight: '65%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.l,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  modalBody: {
    flex: 1,
  },
  savePasswordButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: SIZES.l,
  },
  savePasswordText: {
    ...FONTS.h4,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.m,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.cardRadius,
    ...SHADOWS.medium,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
    marginHorizontal: SIZES.l,
  },
  menuContainer: {
    paddingHorizontal: SIZES.l,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.m,
    ...SHADOWS.small,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  menuLabel: {
    flex: 1,
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  menuBadgeText: {
    ...FONTS.caption,
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 12,
  },
  // Friend System Styles
  tabContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.s,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.error,
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.s,
    marginBottom: SIZES.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SIZES.s,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: COLORS.text,
    ...FONTS.body,
  },
  listContent: {
    paddingBottom: SIZES.xl,
    paddingInline: SIZES.xs,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.s,
    ...SHADOWS.small,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.m,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 2,
  },
  friendStatus: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  actionButton: {
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    padding: 8,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  rejectButton: {
    padding: 8,
    backgroundColor: 'rgba(227, 52, 47, 0.1)',
    borderRadius: SIZES.radius,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SIZES.radius,
  },
  primaryButtonText: {
    ...FONTS.caption,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  sentText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
