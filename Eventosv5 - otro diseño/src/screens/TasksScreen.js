
import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  Modal, 
  TextInput,
  FlatList,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Users,
  Info,
  X,
  Calendar,
  Flag,
  User,
  Filter,
  CheckSquare,
  MessageSquare,
  Send,
  MoreHorizontal,
  Search,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  Heart,
  UserCheck,
  Settings,
  Ban
} from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { TaskService, CURRENT_USER_ID, MOCK_USERS } from '../services/mockApi';
import EventDateTimePicker from '../components/EventDateTimePicker';
import { Linking } from 'react-native';

// Constants for Roles
const ROLES = {
  ADMIN: { id: 'ADMIN', label: 'Admin', color: '#6200EE', canEdit: true, canManage: true },
  COLLABORATOR: { id: 'COLLABORATOR', label: 'Colaborador', color: '#03DAC6', canEdit: true, canManage: false },
  VIEWER: { id: 'VIEWER', label: 'Visualizador', color: '#95A5A6', canEdit: false, canManage: false }
};

// Task Statuses
const STATUS = {
  NOT_STARTED: 'NotStarted',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed'
};

const PRIORITIES = {
  HIGH: { label: 'Alta', color: COLORS.error, icon: Flag },
  MEDIUM: { label: 'Media', color: COLORS.warning, icon: Flag },
  LOW: { label: 'Baja', color: COLORS.success, icon: Flag },
};

const DATE_FILTERS = {
  TODAY: 'Hoy',
  TOMORROW: 'Mañana',
  WEEK: 'Esta Semana',
};

export default function TasksScreen({ navigation, route }) {
  const { event } = route.params;
  
  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lists, setLists] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(ROLES.VIEWER.id);
  const [expandedListId, setExpandedListId] = useState(null);

  // Modal State - List
  const [listModalVisible, setListModalVisible] = useState(false);
  const [editingList, setEditingList] = useState(null); // null = create, object = edit
  const [listName, setListName] = useState('');
  const [selectedViewers, setSelectedViewers] = useState([]);

  // Modal State - Task
  const [taskInputVisible, setTaskInputVisible] = useState(false);
  const [activeListIdForTask, setActiveListIdForTask] = useState(null);
  const [taskText, setTaskText] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  
  // New Task Fields
  const [taskAssignedTo, setTaskAssignedTo] = useState(null);
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskDueDate, setTaskDueDate] = useState(null);
  const [taskHasTime, setTaskHasTime] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Filters
  const [filterAssignee, setFilterAssignee] = useState(null); // null | 'ME'
  const [filterPriority, setFilterPriority] = useState(null); // null | 'HIGH' | 'MEDIUM' | 'LOW'
  const [filterDate, setFilterDate] = useState(null); // null | 'TODAY' | 'TOMORROW' | 'WEEK'
  const [showFilters, setShowFilters] = useState(false);

  // Task Detail Modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Info Modal
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoList, setInfoList] = useState(null);

  // Participants Modal State
  const [participantsModalVisible, setParticipantsModalVisible] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL'); // ALL, ADMIN, COLLABORATOR, VIEWER
  const [sortBy, setSortBy] = useState('ROLE'); // ROLE, NAME
  const [selectedParticipant, setSelectedParticipant] = useState(null); // For User Detail Modal

  // Initial Data Load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Parallel data fetching
      const [fetchedUsers, fetchedLists, fetchedPermissions] = await Promise.all([
        TaskService.getUsersByIds(), // Get all potential participants
        TaskService.getToDoListsByEventId(event.id),
        TaskService.getPermissionsByEventAndTool(event.id, 'ToDo')
      ]);

      setUsers(fetchedUsers);
      setLists(fetchedLists);
      setCurrentUserRole(fetchedPermissions.role);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos.');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  // --- Permission Logic ---
  const canCreateList = () => currentUserRole === ROLES.ADMIN.id;
  const canEditList = (list) => currentUserRole === ROLES.ADMIN.id;
  const canDeleteList = (list) => currentUserRole === ROLES.ADMIN.id;
  
  const canViewList = (list) => {
    if (currentUserRole === ROLES.ADMIN.id) return true;
    return list.viewersId && list.viewersId.includes(CURRENT_USER_ID);
  };

  const canCreateTask = (list) => {
    if (currentUserRole === ROLES.ADMIN.id) return true;
    if (currentUserRole === ROLES.COLLABORATOR.id && canViewList(list)) return true;
    return false;
  };

  const canEditDeleteTask = (task) => {
    if (currentUserRole === ROLES.ADMIN.id) return true;
    if (currentUserRole === ROLES.COLLABORATOR.id && task.createdBy === CURRENT_USER_ID) return true;
    return false;
  };

  // --- Participants Logic ---
  const filteredParticipants = useMemo(() => {
    let result = users.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterRole !== 'ALL') {
      result = result.filter(p => (p.role || 'VIEWER') === filterRole);
    }

    // Sorting Logic
    const rolePriority = { ADMIN: 0, COLLABORATOR: 1, VIEWER: 2 };

    result.sort((a, b) => {
      if (sortBy === 'ROLE') {
        const roleA = rolePriority[a.role || 'VIEWER'];
        const roleB = rolePriority[b.role || 'VIEWER'];
        if (roleA !== roleB) return roleA - roleB;
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [users, searchQuery, filterRole, sortBy]);

  const handleAddExternalPerson = () => {
    if (!newPersonName.trim()) return;
    const newPerson = {
      id: Date.now().toString(),
      name: newPersonName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newPersonName)}&background=random`,
      isExternal: true,
      role: 'VIEWER', // Default role
    };
    setUsers([...users, newPerson]);
    setNewPersonName('');
  };

  const canManageParticipants = () => {
    // Only Admin can manage participants
    return currentUserRole === ROLES.ADMIN.id;
  };

  const updateRole = (userId, newRole) => {
    setUsers(users.map(p => 
      p.id === userId ? { ...p, role: newRole } : p
    ));
    // Update selected participant if it's the one being edited
    if (selectedParticipant && selectedParticipant.id === userId) {
      setSelectedParticipant({ ...selectedParticipant, role: newRole });
    }
  };

  const handleWhatsAppContact = (phoneNumber) => {
    if (!phoneNumber) return;
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

  // --- List Management ---

  const openCreateListModal = () => {
    setEditingList(null);
    setListName('');
    setSelectedViewers([CURRENT_USER_ID]); 
    setListModalVisible(true);
  };

  const openEditListModal = (list) => {
    setEditingList(list);
    setListName(list.name);
    setSelectedViewers(list.viewersId || []);
    setListModalVisible(true);
  };

  const handleSaveList = async () => {
    if (!listName.trim()) {
      Alert.alert('Error', 'El nombre de la lista es obligatorio');
      return;
    }

    try {
      if (editingList) {
        await TaskService.updateToDoList({
          id: editingList.id,
          name: listName,
          lastEditedBy: CURRENT_USER_ID,
          viewersId: selectedViewers
          // Details Modal Styles
  
});
      } else {
        await TaskService.createToDoList({
          eventId: event.id,
          name: listName,
          createdBy: CURRENT_USER_ID,
          viewersId: selectedViewers
        });
      }
      setListModalVisible(false);
      handleRefresh();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la lista');
    }
  };

  const handleDeleteList = (list) => {
    Alert.alert(
      'Eliminar Lista',
      `¿Estás seguro de eliminar la lista "${list.name}" y todas sus tareas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await TaskService.deleteToDoList(list.id);
              handleRefresh();
            } catch (e) {
              Alert.alert('Error', 'No se pudo eliminar la lista');
            }
          }
        }
      ]
    );
  };

  // --- Task Management ---

  const openCreateTask = (listId) => {
    setActiveListIdForTask(listId);
    setEditingTask(null);
    setTaskText('');
    setTaskAssignedTo(null);
    setTaskPriority('MEDIUM');
    setTaskDueDate(null);
    setTaskHasTime(false);
    setTaskInputVisible(true);
  };

  const openEditTask = (task) => {
    setActiveListIdForTask(task.listId);
    setEditingTask(task);
    setTaskText(task.text);
    setTaskAssignedTo(task.assignedTo);
    setTaskPriority(task.priority || 'MEDIUM');
    setTaskDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setTaskHasTime(!!task.hasTime);
    setTaskInputVisible(true);
  };

  const handleSaveTask = async () => {
    if (!taskText.trim()) return;

    try {
      const taskData = {
        text: taskText,
        assignedTo: taskAssignedTo,
        priority: taskPriority,
        dueDate: taskDueDate ? taskDueDate.toISOString() : null,
        hasTime: taskHasTime,
      };

      let savedTask;
      if (editingTask) {
        savedTask = await TaskService.updateToDoItem({
          id: editingTask.id,
          ...taskData
        });
      } else {
        savedTask = await TaskService.createToDoItem({
          listId: activeListIdForTask,
          createdBy: CURRENT_USER_ID,
          ...taskData
        });
      }

      // Update selectedTask if it's the one we just edited
      if (selectedTask && savedTask && selectedTask.id === savedTask.id) {
         setSelectedTask(savedTask);
      }

      setTaskInputVisible(false);
      handleRefresh();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la tarea');
    }
  };

  const handleDeleteTask = (task) => {
    if (!canEditDeleteTask(task)) return;
    
    Alert.alert(
      'Eliminar Tarea',
      '¿Eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            await TaskService.deleteToDoItem(task.id);
            handleRefresh();
          }
        }
      ]
    );
  };

  const toggleTaskStatus = async (task) => {
    if (currentUserRole === ROLES.VIEWER) return;

    let newStatus = STATUS.NOT_STARTED;
    if (task.status === STATUS.NOT_STARTED) newStatus = STATUS.IN_PROGRESS;
    else if (task.status === STATUS.IN_PROGRESS) newStatus = STATUS.COMPLETED;
    else if (task.status === STATUS.COMPLETED) newStatus = STATUS.NOT_STARTED;

    try {
      const updatedLists = lists.map(l => {
        if (l.id === task.listId) {
          return {
            ...l,
            items: l.items.map(t => t.id === task.id ? { ...t, status: newStatus } : t)
          };
        }
        return l;
      });
      setLists(updatedLists);
      
      // Update selected task if open
      if (selectedTask && selectedTask.id === task.id) {
        setSelectedTask({ ...selectedTask, status: newStatus });
      }

      await TaskService.setToDoItemStatus(task.id, newStatus);
    } catch (error) {
      handleRefresh(); 
    }
  };

  // --- Subtasks & Comments Handlers ---

  const handleAddSubtask = async () => {
    if (!newSubtaskText.trim() || !selectedTask) return;
    
    const newSubtask = {
      id: `sub-${Date.now()}`,
      text: newSubtaskText,
      completed: false
    };

    const updatedSubtasks = [...(selectedTask.subtasks || []), newSubtask];
    const updatedTask = { ...selectedTask, subtasks: updatedSubtasks };

    updateTaskLocalAndRemote(updatedTask);
    setNewSubtaskText('');
  };

  const handleToggleSubtask = async (subtaskId) => {
    if (!selectedTask) return;

    const updatedSubtasks = selectedTask.subtasks.map(s => 
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    const updatedTask = { ...selectedTask, subtasks: updatedSubtasks };
    
    updateTaskLocalAndRemote(updatedTask);
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (!selectedTask) return;

    const updatedSubtasks = selectedTask.subtasks.filter(s => s.id !== subtaskId);
    const updatedTask = { ...selectedTask, subtasks: updatedSubtasks };
    
    updateTaskLocalAndRemote(updatedTask);
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim() || !selectedTask) return;

    const newComment = {
      id: `com-${Date.now()}`,
      text: newCommentText,
      userId: CURRENT_USER_ID,
      createdAt: new Date().toISOString()
    };

    const updatedComments = [...(selectedTask.comments || []), newComment];
    const updatedTask = { ...selectedTask, comments: updatedComments };

    updateTaskLocalAndRemote(updatedTask);
    setNewCommentText('');
  };

  const updateTaskLocalAndRemote = async (updatedTask) => {
    // Optimistic Update
    setSelectedTask(updatedTask);
    
    const updatedLists = lists.map(l => {
      if (l.id === updatedTask.listId) {
        return {
          ...l,
          items: l.items.map(t => t.id === updatedTask.id ? updatedTask : t)
        };
      }
      return l;
    });
    setLists(updatedLists);

    try {
      await TaskService.updateToDoItem(updatedTask);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
      handleRefresh();
    }
  };

  // --- UI Components ---

  const getStatusIcon = (status) => {
    switch (status) {
      case STATUS.COMPLETED: return <CheckCircle2 size={22} color={COLORS.success} />;
      case STATUS.IN_PROGRESS: return <Clock size={22} color={COLORS.warning} />;
      default: return <Circle size={22} color={COLORS.textSecondary} />;
    }
  };

  const getUserName = (id) => users.find(user => user.id === id)?.name || 'Desconocido';
  const getUserAvatar = (id) => users.find(user => user.id === id)?.avatar || null;

  const renderPriorityBadge = (priority) => {
    const p = PRIORITIES[priority] || PRIORITIES.MEDIUM;
    return (
      <View style={[styles.priorityBadge, { backgroundColor: p.color + '20' }]}>
        <Flag size={10} color={p.color} style={{ marginRight: 2 }} />
        <Text style={[styles.priorityText, { color: p.color }]}>{p.label}</Text>
      </View>
    );
  };

  const renderFilters = () => {
    if (!showFilters) return null;
    return (
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SIZES.padding }}>
          {/* Priority Filters */}
          <TouchableOpacity 
            style={[styles.filterChip, filterAssignee === 'ME' && styles.filterChipSelected]}
            onPress={() => setFilterAssignee(filterAssignee === 'ME' ? null : 'ME')}
          >
            <Text style={[styles.filterText, filterAssignee === 'ME' && styles.filterTextSelected]}>Mis Tareas</Text>
          </TouchableOpacity>
          
          {Object.keys(PRIORITIES).map(key => (
            <TouchableOpacity 
              key={key}
              style={[styles.filterChip, filterPriority === key && styles.filterChipSelected]}
              onPress={() => setFilterPriority(filterPriority === key ? null : key)}
            >
              <Text style={[styles.filterText, filterPriority === key && styles.filterTextSelected]}>
                {PRIORITIES[key].label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Date Filters (Below Priorities) */}
        <View style={{ marginTop: 10 }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: SIZES.l || 16 }}
          >
            {Object.keys(DATE_FILTERS).map(key => (
            <TouchableOpacity 
              key={key}
              style={[styles.filterChip, filterDate === key && styles.filterChipSelected]}
              onPress={() => setFilterDate(filterDate === key ? null : key)}
            >
              <Text style={[styles.filterText, filterDate === key && styles.filterTextSelected]}>
                {DATE_FILTERS[key]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      </View>
    );
  };

  const isTaskOverdue = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const renderList = ({ item: list }) => {
    if (!canViewList(list)) return null;

    let filteredItems = list.items;
    
    // Apply Filters
    if (filterAssignee === 'ME') {
      filteredItems = filteredItems.filter(t => t.assignedTo === CURRENT_USER_ID);
    }
    if (filterPriority) {
      filteredItems = filteredItems.filter(t => t.priority === filterPriority);
    }
    if (filterDate) {
       const today = new Date();
       today.setHours(0,0,0,0);
       
       filteredItems = filteredItems.filter(t => {
         if (!t.dueDate) return false;
         const d = new Date(t.dueDate);
         d.setHours(0,0,0,0);
         
         if (filterDate === 'TODAY') return d.getTime() === today.getTime();
         if (filterDate === 'TOMORROW') {
           const tmrw = new Date(today);
           tmrw.setDate(tmrw.getDate() + 1);
           return d.getTime() === tmrw.getTime();
         }
         if (filterDate === 'WEEK') {
           const startOfWeek = new Date(today);
           const day = startOfWeek.getDay(); // 0 (Sun) - 6 (Sat)
           const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
           startOfWeek.setDate(diff);
           
           const endOfWeek = new Date(startOfWeek);
           endOfWeek.setDate(startOfWeek.getDate() + 6);
           
           return d >= startOfWeek && d <= endOfWeek;
         }
         return true;
       });
    }

    // If filters are active and no items match, maybe show list but empty? 
    // Or hide list if empty? Let's keep list visible if it matches filters or just show empty state inside.

    const completedCount = list.items.filter(t => t.status === STATUS.COMPLETED).length;
    const totalCount = list.items.length;
    const isExpanded = expandedListId === list.id;

    return (
      <View style={styles.listContainer}>
        {/* List Header */}
        <TouchableOpacity 
          style={styles.listHeader} 
          onPress={() => setExpandedListId(isExpanded ? null : list.id)}
        >
          <View style={styles.listHeaderLeft}>
            <Text style={styles.listTitle}>{list.name}</Text>
            <Text style={styles.listProgress}>{completedCount}/{totalCount}</Text>
          </View>
          <View style={styles.listHeaderRight}>
            <TouchableOpacity onPress={() => { setInfoList(list); setInfoModalVisible(true); }} style={styles.iconButton}>
              <Info size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
            {canEditList(list) && (
              <>
                <TouchableOpacity onPress={() => openEditListModal(list)} style={styles.iconButton}>
                  <Edit2 size={18} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteList(list)} style={styles.iconButton}>
                  <Trash2 size={18} color={COLORS.error} />
                </TouchableOpacity>
              </>
            )}
            {isExpanded ? <ChevronUp size={20} color={COLORS.textSecondary} /> : <ChevronDown size={20} color={COLORS.textSecondary} />}
          </View>
        </TouchableOpacity>

        {/* List Body (Tasks) */}
        {isExpanded && (
          <View style={styles.listBody}>
            {filteredItems.length === 0 && (filterAssignee || filterPriority) ? (
              <Text style={styles.emptyFilteredText}>No hay tareas con estos filtros.</Text>
            ) : (
              filteredItems.map(task => {
                const isOverdue = task.status !== STATUS.COMPLETED && isTaskOverdue(task.dueDate);
                return (
                  <View key={task.id} style={styles.taskItem}>
                    <TouchableOpacity onPress={() => toggleTaskStatus(task)} style={styles.statusButton}>
                      {getStatusIcon(task.status)}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.taskContent} 
                      onPress={() => {
                        setSelectedTask(task);
                        setDetailModalVisible(true);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.taskTopRow}>
                        <Text style={[
                          styles.taskText, 
                          task.status === STATUS.COMPLETED && styles.taskTextCompleted
                        ]}>
                          {task.text}
                        </Text>
                        {task.priority && renderPriorityBadge(task.priority)}
                      </View>
                      
                      <View style={styles.taskMeta}>
                        {/* Assigned User */}
                        {task.assignedTo && (
                          <View style={styles.metaItem}>
                            <Image source={{ uri: getUserAvatar(task.assignedTo) }} style={styles.tinyAvatar} />
                          </View>
                        )}
                        
                        {/* Due Date */}
                        {task.dueDate && (
                          <View style={styles.metaItem}>
                            <Calendar size={12} color={isOverdue ? COLORS.error : COLORS.textSecondary} style={{ marginRight: 4 }} />
                            <Text style={[
                              styles.taskDate,
                              isOverdue && { color: COLORS.error, fontWeight: 'bold' }
                            ]}>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </Text>
                          </View>
                        )}

                        {/* Subtasks Count */}
                        {(task.subtasks?.length > 0 || task.comments?.length > 0) && (
                          <View style={styles.metaItem}>
                            {task.subtasks?.length > 0 && (
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                                <CheckSquare size={12} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                                <Text style={styles.taskDate}>
                                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                </Text>
                              </View>
                            )}
                            {task.comments?.length > 0 && (
                               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                 <MessageSquare size={12} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                                 <Text style={styles.taskDate}>{task.comments.length}</Text>
                               </View>
                            )}
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>

                    {canEditDeleteTask(task) && (
                      <TouchableOpacity onPress={() => handleDeleteTask(task)} style={styles.deleteTaskButton}>
                        <Trash2 size={16} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            )}

            {canCreateTask(list) && (
              <TouchableOpacity style={styles.addTaskButton} onPress={() => openCreateTask(list.id)}>
                <Plus size={18} color={COLORS.primary} />
                <Text style={styles.addTaskText}>Agregar tarea</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderViewerSelector = () => (
    <View style={styles.viewerSelector}>
      <Text style={styles.label}>Visible para:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {users.map(u => {
          const isSelected = selectedViewers.includes(u.id);
          return (
            <TouchableOpacity 
              key={u.id} 
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => {
                if (isSelected) {
                   setSelectedViewers(prev => prev.filter(id => id !== u.id));
                } else {
                   setSelectedViewers(prev => [...prev, u.id]);
                }
              }}
            >
              <Image source={{ uri: u.avatar }} style={styles.chipAvatar} />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{u.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // New Renderers for Task Modal
  const renderAssigneeSelector = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Asignar a:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity 
          style={[styles.chip, !taskAssignedTo && styles.chipSelected]}
          onPress={() => setTaskAssignedTo(null)}
        >
          <Users size={16} color={!taskAssignedTo ? COLORS.primary : COLORS.textSecondary} style={{ marginRight: 6 }} />
          <Text style={[styles.chipText, !taskAssignedTo && styles.chipTextSelected]}>Nadie</Text>
        </TouchableOpacity>
        {users.map(u => {
          const isSelected = taskAssignedTo === u.id;
          return (
            <TouchableOpacity 
              key={u.id} 
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => setTaskAssignedTo(u.id)}
            >
              <Image source={{ uri: u.avatar }} style={styles.chipAvatar} />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{u.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderPrioritySelector = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Prioridad:</Text>
      <View style={{ flexDirection: 'row' }}>
        {Object.keys(PRIORITIES).map(key => {
          const p = PRIORITIES[key];
          const isSelected = taskPriority === key;
          return (
            <TouchableOpacity 
              key={key} 
              style={[
                styles.chip, 
                isSelected && { backgroundColor: p.color + '20', borderColor: p.color }
              ]}
              onPress={() => setTaskPriority(key)}
            >
              <Flag size={14} color={p.color} style={{ marginRight: 6 }} />
              <Text style={[styles.chipText, isSelected && { color: p.color, fontWeight: '700' }]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderDateSelector = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Fecha de vencimiento:</Text>
      <TouchableOpacity 
        style={styles.dateButton} 
        onPress={() => setDatePickerVisible(true)}
      >
        <Calendar size={18} color={COLORS.text} style={{ marginRight: 8 }} />
        <Text style={styles.dateButtonText}>
          {taskDueDate 
            ? (taskHasTime 
                ? taskDueDate.toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                : taskDueDate.toLocaleDateString())
            : 'Sin fecha'}
        </Text>
        {taskDueDate && (
          <TouchableOpacity 
            onPress={() => {
              setTaskDueDate(null);
              setTaskHasTime(false);
            }} 
            style={{ marginLeft: 'auto', padding: 4 }}
          >
            <X size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderParticipantItem = ({ item }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => setSelectedParticipant(item)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>
            {item.email || (item.isExternal ? 'Usuario Externo' : 'Sin email')}
        </Text>
      </View>
      <View style={[styles.roleBadge, { backgroundColor: (ROLES[item.role || 'VIEWER']?.color || ROLES.VIEWER.color) + '20' }]}>
        <Text style={[styles.roleText, { color: ROLES[item.role || 'VIEWER']?.color || ROLES.VIEWER.color }]}>
          {ROLES[item.role || 'VIEWER']?.label || 'Visualizador'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Listas de Tareas</Text>
        <View style={{ flexDirection: 'row' }}>
          {canManageParticipants() && (
            <TouchableOpacity onPress={() => setParticipantsModalVisible(true)} style={{ marginRight: 15 }}>
              <Users size={24} color={COLORS.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={{ marginRight: 15 }}>
            <Filter size={24} color={showFilters ? COLORS.primary : COLORS.text} />
          </TouchableOpacity>
          {canCreateList() && (
            <TouchableOpacity onPress={openCreateListModal}>
              <Plus size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {renderFilters()}

      {/* Content */}
      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay listas de tareas aún.</Text>
            {canCreateList() && (
              <TouchableOpacity style={styles.emptyButton} onPress={openCreateListModal}>
                <Text style={styles.emptyButtonText}>Crear primera lista</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Modal: Create/Edit List */}
      <Modal visible={listModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingList ? 'Editar Lista' : 'Nueva Lista'}</Text>
              <TouchableOpacity onPress={() => setListModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.label}>Nombre de la lista</Text>
              <TextInput 
                style={styles.input}
                value={listName}
                onChangeText={setListName}
                placeholder="Ej. Logística"
                autoFocus
              />
              {renderViewerSelector()}
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveList}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Add/Edit Task */}
      <Modal visible={taskInputVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentLarge}>
             <View style={styles.modalHeader}>
                <Text style={styles.modalTitleSmall}>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</Text>
                <TouchableOpacity onPress={() => setTaskInputVisible(false)}>
                  <X size={24} color={COLORS.text} />
                </TouchableOpacity>
             </View>
             
             <Text style={styles.label}>Descripción</Text>
             <TextInput 
                style={styles.input}
                value={taskText}
                onChangeText={setTaskText}
                placeholder="Descripción de la tarea..."
                autoFocus={!editingTask} // Only autofocus on new task
              />
              
              {renderAssigneeSelector()}
              {renderPrioritySelector()}
              {renderDateSelector()}

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
                <Text style={styles.saveButtonText}>Guardar Tarea</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal: List Info */}
      <Modal visible={infoModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentSmall}>
             <View style={styles.modalHeader}>
                <Text style={styles.modalTitleSmall}>Detalles de la Lista</Text>
                <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                  <X size={20} color={COLORS.text} />
                </TouchableOpacity>
             </View>
             {infoList && (
               <View style={styles.infoContainer}>
                 <Text style={styles.infoLabel}>Creada por:</Text>
                 <View style={styles.userRow}>
                    <Image source={{ uri: getUserAvatar(infoList.createdBy) }} style={styles.smallAvatar} />
                    <Text style={styles.infoText}>{getUserName(infoList.createdBy)}</Text>
                 </View>
                 
                 <Text style={styles.infoLabel}>Fecha de creación:</Text>
                 <Text style={styles.infoText}>{new Date(infoList.createdAt).toLocaleString()}</Text>

                 <Text style={styles.infoLabel}>Visible para:</Text>
                 <View style={styles.viewersList}>
                    {infoList.viewersId?.map(id => (
                      <Image key={id} source={{ uri: getUserAvatar(id) }} style={[styles.smallAvatar, { marginRight: -8 }]} />
                    ))}
                 </View>
               </View>
             )}
          </View>
        </View>
      </Modal>

      {/* Modal: Task Details (Subtasks & Comments) */}
      <Modal visible={detailModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.detailModalContainer}>
          {selectedTask && (
            <View style={{ flex: 1 }}>
              {/* Header */}
              <View style={styles.detailHeader}>
                <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={styles.closeButton}>
                  <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                   {canEditDeleteTask(selectedTask) && (
                     <TouchableOpacity 
                        style={styles.headerAction} 
                        onPress={() => {
                          // Keep detail modal open
                          openEditTask(selectedTask);
                        }}
                      >
                       <Edit2 size={20} color={COLORS.primary} />
                     </TouchableOpacity>
                   )}
                </View>
              </View>

              <ScrollView style={styles.detailContent}>
                {/* Title & Status */}
                <View style={styles.detailTitleSection}>
                  <TouchableOpacity onPress={() => toggleTaskStatus(selectedTask)} style={{ marginRight: 12 }}>
                    {selectedTask.status === STATUS.COMPLETED ? (
                      <CheckCircle2 size={28} color={COLORS.success} />
                    ) : selectedTask.status === STATUS.IN_PROGRESS ? (
                      <Clock size={28} color={COLORS.warning} />
                    ) : (
                      <Circle size={28} color={COLORS.textSecondary} />
                    )}
                  </TouchableOpacity>
                  <Text style={[
                    styles.detailTitle, 
                    selectedTask.status === STATUS.COMPLETED && styles.taskTextCompleted
                  ]}>
                    {selectedTask.text}
                  </Text>
                </View>

                {/* Properties List (Redesigned) */}
                <View style={styles.propertiesList}>
                   {/* Assignee */}
                   <View style={styles.propertyRow}>
                     <View style={styles.propertyLabelContainer}>
                        <User size={20} color={COLORS.textSecondary} />
                        <Text style={styles.propertyLabel}>Asignado a</Text>
                     </View>
                     <View style={styles.propertyValue}>
                        {selectedTask.assignedTo ? (
                          <View style={styles.userChip}>
                            <Image source={{ uri: getUserAvatar(selectedTask.assignedTo) }} style={styles.tinyAvatar} />
                            <Text style={styles.userChipText} numberOfLines={1}>{getUserName(selectedTask.assignedTo)}</Text>
                          </View>
                        ) : (
                          <Text style={styles.propertyValueText}>Sin asignar</Text>
                        )}
                     </View>
                   </View>

                   {/* Due Date */}
                   <View style={styles.propertyRow}>
                     <View style={styles.propertyLabelContainer}>
                        <Calendar size={20} color={COLORS.textSecondary} />
                        <Text style={styles.propertyLabel}>Fecha límite</Text>
                     </View>
                     <View style={styles.propertyValue}>
                        {selectedTask.dueDate ? (
                          <Text style={[
                            styles.propertyValueText,
                            isTaskOverdue(selectedTask.dueDate) && selectedTask.status !== STATUS.COMPLETED && { color: COLORS.error, fontWeight: 'bold' }
                          ]}>
                            {new Date(selectedTask.dueDate).toLocaleDateString()}
                            {selectedTask.hasTime && ` · ${new Date(selectedTask.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                          </Text>
                        ) : (
                          <Text style={styles.propertyValueText}>No establecida</Text>
                        )}
                     </View>
                   </View>

                   {/* Priority */}
                   <View style={styles.propertyRow}>
                     <View style={styles.propertyLabelContainer}>
                        <Flag size={20} color={COLORS.textSecondary} />
                        <Text style={styles.propertyLabel}>Prioridad</Text>
                     </View>
                     <View style={styles.propertyValue}>
                        {renderPriorityBadge(selectedTask.priority)}
                     </View>
                   </View>
                </View>

                {/* Subtasks Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Subtareas</Text>
                  {selectedTask.subtasks?.map(sub => (
                    <View key={sub.id} style={styles.subtaskItem}>
                       <TouchableOpacity onPress={() => handleToggleSubtask(sub.id)}>
                         {sub.completed ? (
                           <CheckSquare size={20} color={COLORS.primary} />
                         ) : (
                           <CheckSquare size={20} color={COLORS.textSecondary} />
                         )}
                       </TouchableOpacity>
                       <Text style={[styles.subtaskText, sub.completed && styles.subtaskTextCompleted]}>
                         {sub.text}
                       </Text>
                       <TouchableOpacity onPress={() => handleDeleteSubtask(sub.id)}>
                         <X size={16} color={COLORS.textSecondary} />
                       </TouchableOpacity>
                    </View>
                  ))}
                  
                  {/* Add Subtask Input */}
                  <View style={styles.addSubtaskContainer}>
                    <TextInput
                      style={styles.subtaskInput}
                      placeholder="Nueva subtarea..."
                      value={newSubtaskText}
                      onChangeText={setNewSubtaskText}
                      onSubmitEditing={handleAddSubtask}
                    />
                    <TouchableOpacity onPress={handleAddSubtask} disabled={!newSubtaskText.trim()}>
                       <Plus size={24} color={newSubtaskText.trim() ? COLORS.primary : COLORS.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Comments Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Comentarios</Text>
                  {selectedTask.comments?.map(com => (
                    <View key={com.id} style={styles.commentItem}>
                      <Image source={{ uri: getUserAvatar(com.userId) }} style={styles.commentAvatar} />
                      <View style={styles.commentContent}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentUser}>{getUserName(com.userId)}</Text>
                          <Text style={styles.commentTime}>{new Date(com.createdAt).toLocaleString()}</Text>
                        </View>
                        <Text style={styles.commentText}>{com.text}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Add Comment Input (Fixed at bottom) */}
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Escribe un comentario..."
                  value={newCommentText}
                  onChangeText={setNewCommentText}
                />
                <TouchableOpacity onPress={handleAddComment} disabled={!newCommentText.trim()} style={styles.sendButton}>
                   <Send size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Date Picker Modal */}
      <EventDateTimePicker 
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        startDate={taskDueDate}
        onStartDateChange={(date) => {
          setTaskDueDate(date);
          setDatePickerVisible(false);
        }}
        modalOnly={true}
        includeTime={taskHasTime}
        onIncludeTimeChange={setTaskHasTime}
      />

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
                  <Text style={[styles.filterText, filterRole === 'ALL' && styles.activeFilterChipText]}>Todos</Text>
                </TouchableOpacity>
                {Object.keys(ROLES).map(roleKey => (
                  <TouchableOpacity 
                    key={roleKey}
                    style={[styles.filterChip, filterRole === roleKey && styles.activeFilterChip]}
                    onPress={() => setFilterRole(roleKey)}
                  >
                    <Text style={[styles.filterText, filterRole === roleKey && styles.activeFilterChipText]}>
                      {ROLES[roleKey].label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                 <TouchableOpacity 
                   onPress={() => setSortBy(prev => prev === 'ROLE' ? 'NAME' : 'ROLE')}
                   style={{ flexDirection: 'row', alignItems: 'center' }}
                 >
                   <Filter size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                   <Text style={{ ...FONTS.caption, color: COLORS.textSecondary }}>
                     Ordenado por: {sortBy === 'ROLE' ? 'Rol' : 'Nombre'}
                   </Text>
                 </TouchableOpacity>
              </View>
            </View>

            {/* Add External Person (Only Admin/Collaborator) */}
            {/* {canManageParticipants() && (
              <View style={{ flexDirection: 'row', marginBottom: SIZES.m }}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  placeholder="Nombre nueva persona..."
                  value={newPersonName}
                  onChangeText={setNewPersonName}
                />
                <TouchableOpacity 
                  style={{ 
                    backgroundColor: newPersonName.trim() ? COLORS.primary : COLORS.disabled,
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    paddingHorizontal: 16,
                    borderRadius: SIZES.radius
                  }}
                  onPress={handleAddExternalPerson}
                  disabled={!newPersonName.trim()}
                >
                  <UserPlus size={20} color="white" />
                </TouchableOpacity>
              </View>
            )} */}

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
                    <View style={[styles.roleBadge, { backgroundColor: ROLES[selectedParticipant.role || 'VIEWER'].color + '20', marginTop: 8 }]}>
                      <Text style={[styles.roleText, { color: ROLES[selectedParticipant.role || 'VIEWER'].color }]}>
                        {ROLES[selectedParticipant.role || 'VIEWER'].label}
                      </Text>
                    </View>
                    {selectedParticipant.isExternal && (
                      <Text style={{ ...FONTS.caption, color: COLORS.textSecondary, marginTop: 4 }}>Participante Externo</Text>
                    )}
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
                      <Text style={styles.socialButtonText}>Amigo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialButton, { borderColor: COLORS.error }]}>
                      <Ban size={20} color={COLORS.error} />
                      <Text style={[styles.socialButtonText, { color: COLORS.error }]}>Bloquear</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Admin Actions */}
                  {canManageParticipants() && (
                    <View style={{ marginBottom: SIZES.l }}>
                       <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.error + '10', width: '100%', justifyContent: 'center' }]}>
                         <UserMinus size={20} color={COLORS.error} />
                         <Text style={[styles.actionButtonText, { color: COLORS.error }]}>Seguir/Dejar de seguir</Text>
                       </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.divider} />
                  
                  {/* Stats */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.l, padding: SIZES.m, backgroundColor: COLORS.surface, borderRadius: SIZES.radius }}>
                     <View style={{ alignItems: 'center', flex: 1 }}>
                       <Text style={{ ...FONTS.h3, color: COLORS.primary }}>{selectedParticipant.tasksAssigned || 0}</Text>
                       <Text style={{ ...FONTS.caption, color: COLORS.textSecondary }}>Tareas</Text>
                     </View>
                     <View style={{ width: 1, backgroundColor: COLORS.border }} />
                     <View style={{ alignItems: 'center', flex: 1 }}>
                       <Text style={{ ...FONTS.h3, color: COLORS.success }}>{selectedParticipant.tasksCompleted || 0}</Text>
                       <Text style={{ ...FONTS.caption, color: COLORS.textSecondary }}>Completadas</Text>
                     </View>
                  </View>

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
                              {roleKey === 'ADMIN' && 'Control total de tareas.'}
                              {roleKey === 'COLLABORATOR' && 'Puede crear y editar.'}
                              {roleKey === 'VIEWER' && 'Solo lectura.'}
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

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.l,
    paddingVertical: SIZES.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SIZES.s,
    marginLeft: -SIZES.s,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  content: {
    padding: SIZES.m,
    paddingBottom: 100,
  },
  filtersContainer: {
    paddingVertical: 10,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  filterTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyFilteredText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  listContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.m,
    ...SHADOWS.small,
    overflow: 'hidden',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.m,
    backgroundColor: COLORS.surface,
  },
  listHeaderLeft: {
    flex: 1,
  },
  listHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 2,
  },
  listProgress: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  listBody: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SIZES.s,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '40', 
  },
  statusButton: {
    padding: 4,
    marginRight: 8,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  taskText: {
    ...FONTS.body,
    color: COLORS.text,
    fontSize: 14,
    marginRight: 8,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  tinyAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  taskDate: {
    ...FONTS.caption,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  deleteTaskButton: {
    padding: 8,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.m,
    justifyContent: 'center',
    marginTop: 4,
  },
  addTaskText: {
    ...FONTS.body,
    color: COLORS.primary,
    marginLeft: 8,
    fontWeight: '600',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    ...FONTS.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  
  // Modals
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
    minHeight: '50%',
  },
  modalContentLarge: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.l,
    borderTopRightRadius: SIZES.l,
    padding: SIZES.l,
    maxHeight: '90%',
  },
  modalContentSmall: {
    backgroundColor: COLORS.background,
    margin: SIZES.l,
    borderRadius: SIZES.radius,
    padding: SIZES.l,
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
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
  modalTitleSmall: {
    ...FONTS.h4,
    color: COLORS.text,
    textAlign: 'center',
  },
  modalBody: {
    flex: 1,
  },
  label: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...FONTS.body,
  },
  fieldContainer: {
    marginBottom: 8,
  },
  viewerSelector: {
    marginVertical: SIZES.m,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  chipSelected: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  chipAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  chipText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: SIZES.l,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '700',
    ...FONTS.body,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateButtonText: {
    ...FONTS.body,
    color: COLORS.text,
  },
  
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.m,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.l,
    paddingVertical: SIZES.m,
    borderRadius: SIZES.radius,
  },
  emptyButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  infoContainer: {
    padding: SIZES.s,
  },
  infoLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.m,
  },
  infoText: {
    ...FONTS.body,
    color: COLORS.text,
    marginTop: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  viewersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  detailModalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: 8,
  },
  headerAction: {
    padding: 8,
    marginLeft: 8,
  },
  detailContent: {
    flex: 1,
  },
  detailTitleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SIZES.l,
    paddingBottom: SIZES.m,
  },
  detailTitle: {
    ...FONTS.h2,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  detailPropertiesGrid: {
    paddingHorizontal: SIZES.l,
    paddingBottom: SIZES.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '40',
  },
  propertiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyCard: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  propertyLabelSmall: {
    ...FONTS.caption,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  propertyValue: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  propertyValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionContainer: {
    padding: SIZES.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '40',
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 12,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtaskText: {
    ...FONTS.body,
    flex: 1,
    marginLeft: 12,
    color: COLORS.text,
  },
  subtaskTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  addSubtaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  subtaskInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 0,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUser: {
    ...FONTS.body,
    fontWeight: '700',
    fontSize: 12,
    color: COLORS.text,
  },
  commentTime: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  commentText: {
    ...FONTS.body,
    color: COLORS.text,
    fontSize: 13,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  commentInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Detail Redesign Styles
  propertiesList: {
    paddingHorizontal: SIZES.l,
    paddingBottom: SIZES.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '40',
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  propertyLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  propertyLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
  propertyValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  propertyValueText: {
    ...FONTS.body,
    color: COLORS.text,
    textAlign: 'right',
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userChipText: {
    ...FONTS.body,
    color: COLORS.text,
    marginLeft: 8,
    maxWidth: 150,
  },

  // Participant Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
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
    color: COLORS.text,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  activeFilterChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // User List Item Styles (Standardized)
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.s,
    ...SHADOWS.card,
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.m,
    backgroundColor: COLORS.gray,
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
  // User Details Modal
  centeredModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SIZES.l,
  },
  centeredModalContent: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.m,
    maxHeight: '80%',
    ...SHADOWS.medium,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.m,
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
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.m,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.s,
  },
  selectedRoleOption: {
    backgroundColor: COLORS.surface,
  },
  roleOptionTitle: {
    ...FONTS.body,
    fontWeight: 'bold',
    marginBottom: 2,
    color: COLORS.text,
  },
  roleOptionDescription: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Social Actions Styles
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    paddingVertical: 12,
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
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.m,
  },

});
