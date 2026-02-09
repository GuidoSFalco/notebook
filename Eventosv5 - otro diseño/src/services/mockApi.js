
// Simulated Backend Service
// This service mimics the API endpoints required for the Tasks functionality.

// Mock Users (Participants)
export const MOCK_USERS = [
  { id: '1', name: 'Usuario Actual', avatar: 'https://i.pravatar.cc/150?u=1', role: 'ADMIN' }, // Creator/Admin
  { id: '2', name: 'Ana', avatar: 'https://i.pravatar.cc/150?u=2', role: 'COLLABORATOR' },
  { id: '3', name: 'Carlos', avatar: 'https://i.pravatar.cc/150?u=3', role: 'COLLABORATOR' },
  { id: '4', name: 'Sofia', avatar: 'https://i.pravatar.cc/150?u=4', role: 'VIEWER' },
];

// Current User ID (Simulated Session)
export const CURRENT_USER_ID = '1'; 

// Mock Database
let lists = [
  {
    id: 'list-1',
    eventId: '1',
    name: 'Logística General',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    lastEditedBy: '1',
    viewersId: ['1', '2', '3'], // User 4 (Viewer) might not see this if restricted
  },
  {
    id: 'list-2',
    eventId: '1',
    name: 'Catering',
    createdBy: '2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lastEditedBy: '2',
    viewersId: ['1', '2'], // Restricted visibility
  }
];

let tasks = [
  {
    id: 'task-1',
    listId: 'list-1',
    text: 'Contratar seguridad',
    status: 'Completed', // NotStarted, InProgress, Completed
    createdBy: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    listId: 'list-1',
    text: 'Validar permisos municipales',
    status: 'InProgress',
    createdBy: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    listId: 'list-2',
    text: 'Definir menú vegetariano',
    status: 'NotStarted',
    createdBy: '2',
    createdAt: new Date().toISOString(),
  }
];

// API Service
export const TaskService = {
  // 1. Get Event Details
  getEventBySlug: async (slug) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mocking event return based on slug/id
        resolve({ id: '1', title: 'Neon Summer Festival', slug });
      }, 500);
    });
  },

  // 2. Get Users
  getUsersByIds: async (ids) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!ids) resolve(MOCK_USERS);
        else resolve(MOCK_USERS.filter(u => ids.includes(u.id)));
      }, 300);
    });
  },

  // 3. Get Lists
  getToDoListsByEventId: async (eventId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const eventLists = lists.filter(l => l.eventId === eventId);
        // Attach tasks to lists for easier frontend handling, or handle separately.
        // The prompt implies "Carga de Listas" and "Carga de Tareas" might be separate or nested.
        // Let's return lists with their tasks embedded for simplicity in this mock
        const result = eventLists.map(l => ({
          ...l,
          items: tasks.filter(t => t.listId === l.id)
        }));
        resolve(result);
      }, 600);
    });
  },

  // 4. Get Permissions/Role
  getPermissionsByEventAndTool: async (eventId, tool) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return the role of the CURRENT_USER_ID for this event
        const user = MOCK_USERS.find(u => u.id === CURRENT_USER_ID);
        resolve({ role: user ? user.role : 'VIEWER' });
      }, 300);
    });
  },

  // 5. Create List
  createToDoList: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newList = {
          id: `list-${Date.now()}`,
          createdAt: new Date().toISOString(),
          lastEditedBy: data.createdBy,
          items: [],
          ...data,
        };
        lists.push(newList);
        resolve(newList);
      }, 400);
    });
  },

  // 6. Update List
  updateToDoList: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = lists.findIndex(l => l.id === data.id);
        if (index !== -1) {
          lists[index] = { ...lists[index], ...data };
          resolve(lists[index]);
        } else {
          resolve(null);
        }
      }, 400);
    });
  },

  // 7. Delete List
  deleteToDoList: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        lists = lists.filter(l => l.id !== id);
        tasks = tasks.filter(t => t.listId !== id);
        resolve(true);
      }, 400);
    });
  },

  // 8. Create Task
  createToDoItem: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask = {
          id: `task-${Date.now()}`,
          status: 'NotStarted',
          createdAt: new Date().toISOString(),
          ...data,
        };
        tasks.push(newTask);
        resolve(newTask);
      }, 300);
    });
  },

  // 9. Update Task Text
  updateToDoItem: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = tasks.findIndex(t => t.id === data.id);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...data };
          resolve(tasks[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // 10. Set Task Status
  setToDoItemStatus: async (id, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          tasks[index].status = status;
          resolve(tasks[index]);
        } else {
          resolve(null);
        }
      }, 200);
    });
  },

  // 11. Delete Task
  deleteToDoItem: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        resolve(true);
      }, 300);
    });
  }
};
