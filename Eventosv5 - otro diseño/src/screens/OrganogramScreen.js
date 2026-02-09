import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal, Alert, ScrollView, Share, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, UserPlus, MoreVertical, Trash2, Shield, User, Check, X, Share2, Copy, Link as LinkIcon, QrCode, Heart, Ban, UserMinus } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const ROLES = {
  CREATOR: { label: 'Creador', color: '#FFD700' },
  ADMIN: { label: 'Admin', color: '#FF5252' },
  PARTICIPANT: { label: 'Participante', color: '#4CAF50' },
};

export default function OrganogramScreen({ navigation, route }) {
  const { event } = route.params;

  // Mock Data
  const [users, setUsers] = useState([
    { id: '1', name: 'Ana Silva', role: 'CREATOR', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', email: 'ana.silva@email.com' },
    { id: '2', name: 'Carlos Ruiz', role: 'ADMIN', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', email: 'carlos.ruiz@email.com' },
    { id: '3', name: 'Lucía Méndez', role: 'PARTICIPANT', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', email: 'lucia.mendez@email.com' },
    { id: '4', name: 'Miguel Ángel', role: 'PARTICIPANT', avatar: 'https://randomuser.me/api/portraits/men/85.jpg', email: 'miguel.angel@email.com' },
    { id: '5', name: 'Sofía Torres', role: 'PARTICIPANT', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', email: 'sofia.torres@email.com' },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareMode, setShareMode] = useState('EVENT'); // 'EVENT' | 'INVITE'

  const handleUserPress = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleUpdateRole = (newRole) => {
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleRemoveUser = () => {
    Alert.alert(
      'Eliminar Usuario',
      `¿Estás seguro de eliminar a ${selectedUser.name} del evento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setIsModalVisible(false);
            setSelectedUser(null);
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      const message = shareMode === 'EVENT'
        ? `¡Únete a mi evento "${event.title}" en EventosApp! 📅\nhttps://eventosapp.com/e/${event.id}`
        : `Te invito a colaborar en el evento "${event.title}" como participante.\nAccede aquí: https://eventosapp.com/invite/${event.id}?token=abc1234`;
      
      await Share.share({
        message,
        title: shareMode === 'EVENT' ? event.title : 'Invitación al Evento'
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCopy = async () => {
    const link = shareMode === 'EVENT' 
      ? `https://eventosapp.com/e/${event.id}` 
      : `https://eventosapp.com/invite/${event.id}?token=abc1234`;
    
    await Clipboard.setStringAsync(link);
    Alert.alert('Enlace copiado', 'El enlace ha sido copiado al portapapeles.');
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => handleUserPress(item)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={[styles.roleBadge, { backgroundColor: ROLES[item.role].color + '20' }]}>
        <Text style={[styles.roleText, { color: ROLES[item.role].color }]}>
          {ROLES[item.role].label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Gestión de Usuarios</Text>
          <Text style={styles.subtitle}>{users.length} Miembros</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsShareModalVisible(true)}
        >
          <UserPlus size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* User Management Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalUserHeader}>
                    <Image source={{ uri: selectedUser.avatar }} style={styles.modalAvatar} />
                    <View>
                      <Text style={styles.modalUserName}>{selectedUser.name}</Text>
                      <Text style={styles.modalUserEmail}>{selectedUser.email}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <X size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Social Actions */}
                <View style={styles.socialActionsContainer}>
                  <TouchableOpacity style={[styles.socialButton, styles.socialButtonFilled]}>
                    <Heart size={20} color="white" />
                    <Text style={[styles.socialButtonText, { color: 'white' }]}>Seguir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <UserPlus size={20} color={COLORS.primary} />
                    <Text style={styles.socialButtonText}>Amigo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.socialButton, { borderColor: COLORS.error }]}>
                    <Ban size={20} color={COLORS.error} />
                    <Text style={[styles.socialButtonText, { color: COLORS.error }]}>Bloquear</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Asignar Rol</Text>
                <View style={styles.rolesContainer}>
                  {Object.keys(ROLES).map((roleKey) => (
                    <TouchableOpacity
                      key={roleKey}
                      style={[
                        styles.roleOption,
                        selectedUser.role === roleKey && styles.selectedRoleOption,
                        { borderColor: selectedUser.role === roleKey ? ROLES[roleKey].color : COLORS.border }
                      ]}
                      onPress={() => handleUpdateRole(roleKey)}
                    >
                      <View style={[styles.roleIcon, { backgroundColor: ROLES[roleKey].color + '20' }]}>
                        <Shield size={20} color={ROLES[roleKey].color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.roleOptionLabel}>{ROLES[roleKey].label}</Text>
                      </View>
                      {selectedUser.role === roleKey && (
                        <Check size={20} color={ROLES[roleKey].color} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.removeButton} onPress={handleRemoveUser}>
                  <Trash2 size={20} color={COLORS.error} />
                  <Text style={styles.removeButtonText}>Eliminar del Evento</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={isShareModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsShareModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsShareModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalContent, { minHeight: '60%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Compartir</Text>
                <TouchableOpacity onPress={() => setIsShareModalVisible(false)}>
                  <X size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Share Type Tabs */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity 
                  style={[styles.tab, shareMode === 'EVENT' && styles.activeTab]}
                  onPress={() => setShareMode('EVENT')}
                >
                  <Text style={[styles.tabText, shareMode === 'EVENT' && styles.activeTabText]}>Evento Público</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tab, shareMode === 'INVITE' && styles.activeTab]}
                  onPress={() => setShareMode('INVITE')}
                >
                  <Text style={[styles.tabText, shareMode === 'INVITE' && styles.activeTabText]}>Invitación Privada</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.shareContent}>
                <Text style={styles.shareDescription}>
                  {shareMode === 'EVENT' 
                    ? 'Comparte este evento para que otros puedan verlo y asistir.' 
                    : 'Invita a colaboradores para que te ayuden a gestionar el evento.'}
                </Text>

                {/* w Code Placeholder */}
                <TouchableOpacity activeOpacity={1}>
                  <View style={styles.qrContainer}>
                    <Image 
                      source={{ 
                        uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          shareMode === 'EVENT' 
                            ? `https://eventosapp.com/e/${event.id}` 
                            : `https://eventosapp.com/invite/${event.id}?token=abc1234`
                        )}&color=${COLORS.primary.replace('#', '')}` 
                      }} 
                      style={styles.qrImage} 
                    />
                    <View style={styles.qrBadge}>
                       <QrCode size={20} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>

                <Text style={styles.linkText}>
                  {shareMode === 'EVENT' ? `eventosapp.com/e/${event.id}` : `eventosapp.com/invite/${event.id}...`}
                </Text>

                <View style={styles.shareActions}>
                  <TouchableOpacity style={styles.shareActionButton} onPress={handleShare}>
                    <Share2 size={24} color={COLORS.primary} />
                    <Text style={styles.actionText}>Compartir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareActionButton} onPress={handleCopy}>
                    <Copy size={24} color={COLORS.textSecondary} />
                    <Text style={styles.actionText}>Copiar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    padding: SIZES.s,
    marginLeft: -SIZES.s,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    padding: SIZES.s,
    marginRight: -SIZES.s,
  },
  listContent: {
    padding: SIZES.m,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.s,
    ...SHADOWS.card,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.m,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 2,
  },
  userEmail: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    ...FONTS.caption,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SIZES.l,
    minHeight: '40%',
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
  modalUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SIZES.m,
  },
  modalUserName: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  modalUserEmail: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SIZES.m,
  },
  rolesContainer: {
    marginBottom: SIZES.l,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.m,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.s,
  },
  selectedRoleOption: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  roleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  roleOptionLabel: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: '500',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    backgroundColor: '#FFEBEE',
    marginTop: SIZES.s,
  },
  removeButtonText: {
    ...FONTS.body3,
    color: COLORS.error,
    fontWeight: '600',
    marginLeft: SIZES.s,
  },
  socialActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.l,
    marginTop: SIZES.s,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginHorizontal: 4,
  },
  socialButtonFilled: {
    backgroundColor: COLORS.primary,
  },
  socialButtonText: {
    ...FONTS.caption,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 4,
    marginBottom: SIZES.l,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.s,
    alignItems: 'center',
    borderRadius: SIZES.radius - 4,
  },
  activeTab: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.light,
  },
  tabText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.text,
  },
  shareContent: {
    alignItems: 'center',
  },
  shareDescription: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.l,
    paddingHorizontal: SIZES.m,
  },
  qrContainer: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    borderRadius: SIZES.l,
    padding: SIZES.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.l,
    ...SHADOWS.medium,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  qrBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: COLORS.surface,
  },
  linkText: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SIZES.l,
    backgroundColor: COLORS.background,
    padding: SIZES.s,
    paddingHorizontal: SIZES.m,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  shareActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  shareActionButton: {
    alignItems: 'center',
    padding: SIZES.m,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    marginHorizontal: 4,
  },
  actionButtonText: {
    ...FONTS.body,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
