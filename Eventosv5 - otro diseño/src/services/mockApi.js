
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
  },
];

export const MOCK_CATERING_ITEMS = [
  // --- Entradas ---
  {
    id: 'cat-1',
    name: 'Mini Hamburguesas Gourmet',
    description: 'Carne de res seleccionada, queso cheddar, cebolla caramelizada.',
    ingredients: ['Carne de Res', 'Queso Cheddar', 'Cebolla Caramelizada', 'Pan Brioche', 'Salsa de la Casa'],
    price: 4500,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
  },
  {
    id: 'cat-e1',
    name: 'Bruschettas Caprese',
    description: 'Tostadas crujientes con tomates frescos, albahaca y mozzarella di bufala.',
    ingredients: ['Pan Baguette', 'Tomate', 'Albahaca', 'Mozzarella', 'Aceite de Oliva'],
    price: 3200,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1572695157363-bc31c5dd3312',
  },
  {
    id: 'cat-e2',
    name: 'Empanadas de Carne Cortada a Cuchillo',
    description: 'Clásicas empanadas argentinas, jugosas y con masa casera.',
    ingredients: ['Carne Vacuna', 'Cebolla', 'Huevo', 'Aceitunas', 'Especias'],
    price: 2800,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f',
  },
  {
    id: 'cat-e3',
    name: 'Tabla de Quesos y Fiambres',
    description: 'Selección premium de quesos artesanales y fiambres curados.',
    ingredients: ['Queso Brie', 'Jamón Serrano', 'Salamín', 'Aceitunas', 'Pan de Campo'],
    price: 8500,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1631379578550-7038263db699',
  },
  {
    id: 'cat-e4',
    name: 'Langostinos Apanados',
    description: 'Langostinos crujientes servidos con salsa tártara.',
    ingredients: ['Langostinos', 'Panko', 'Huevo', 'Limón', 'Salsa Tártara'],
    price: 6500,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8',
  },

  // --- Platos Principales ---
  {
    id: 'cat-2',
    name: 'Salmón a la Parrilla',
    description: 'Salmón fresco con espárragos y salsa de limón.',
    ingredients: ['Salmón Fresco', 'Espárragos', 'Limón', 'Aceite de Oliva', 'Pimienta Negra'],
    price: 12000,
    category: 'Platos Principales',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d',
  },
  {
    id: 'cat-p1',
    name: 'Ojo de Bife con Papas Rústicas',
    description: 'Corte premium a la parrilla acompañado de papas doradas al romero.',
    ingredients: ['Ojo de Bife', 'Papas', 'Romero', 'Sal Marina', 'Chimichurri'],
    price: 14500,
    category: 'Platos Principales',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e',
  },
  {
    id: 'cat-p2',
    name: 'Risotto de Hongos',
    description: 'Arroz cremoso con variedad de hongos silvestres y parmesano.',
    ingredients: ['Arroz Carnaroli', 'Hongos de Pino', 'Champignones', 'Queso Parmesano', 'Vino Blanco'],
    price: 9800,
    category: 'Platos Principales',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
  },
  {
    id: 'cat-p3',
    name: 'Ravioles de Cordero',
    description: 'Pasta rellena de cordero braseado con salsa de reducción de Malbec.',
    ingredients: ['Cordero', 'Harina', 'Huevo', 'Vino Malbec', 'Tomillo'],
    price: 11200,
    category: 'Platos Principales',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
  },
  {
    id: 'cat-p4',
    name: 'Pollo al Curry con Arroz Basmati',
    description: 'Pechuga de pollo en salsa cremosa de curry suave.',
    ingredients: ['Pollo', 'Leche de Coco', 'Curry', 'Arroz Basmati', 'Cilantro'],
    price: 8900,
    category: 'Platos Principales',
    image: 'https://images.unsplash.com/photo-1631292726023-80fdb7b5337e',
  },

  // --- Postres ---
  {
    id: 'cat-3',
    name: 'Tiramisú Clásico',
    description: 'Postre italiano con café, mascarpone y cacao.',
    ingredients: ['Queso Mascarpone', 'Café Expreso', 'Bizcochos de Soletilla', 'Cacao en Polvo', 'Huevos'],
    price: 3500,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
  },
  {
    id: 'cat-po1',
    name: 'Volcán de Chocolate',
    description: 'Bizcocho tibio con centro líquido de chocolate, servido con helado.',
    ingredients: ['Chocolate Semiamargo', 'Manteca', 'Azúcar', 'Huevos', 'Helado de Vainilla'],
    price: 4200,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51',
  },
  {
    id: 'cat-po2',
    name: 'Cheesecake de Frutos Rojos',
    description: 'Suave crema de queso sobre base crocante, cubierta con salsa de frutos rojos.',
    ingredients: ['Queso Crema', 'Galletitas', 'Frutos Rojos', 'Azúcar', 'Limón'],
    price: 3800,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad',
  },
  {
    id: 'cat-po3',
    name: 'Flan Casero con Dulce de Leche',
    description: 'El clásico postre argentino, suave y acaramelado.',
    ingredients: ['Leche', 'Huevos', 'Azúcar', 'Vainilla', 'Dulce de Leche'],
    price: 2900,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1551024601-564d6d67e211',
  },

  // --- Bebidas ---
  {
    id: 'cat-4',
    name: 'Limonada de Menta y Jengibre',
    description: 'Refrescante limonada natural.',
    ingredients: ['Limones Frescos', 'Hojas de Menta', 'Jengibre', 'Azúcar', 'Hielo'],
    price: 1500,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
  },
  {
    id: 'cat-b1',
    name: 'Agua Mineral',
    description: 'Botella de agua mineral pura de manantial, con o sin gas.',
    ingredients: ['Agua Mineral'],
    price: 1200,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1560697529-772f4d6d4536',
  },
  {
    id: 'cat-b2',
    name: 'Jugo de Naranja Exprimido',
    description: 'Jugo 100% natural de naranjas seleccionadas.',
    ingredients: ['Naranjas'],
    price: 1800,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423',
  },
  {
    id: 'cat-b3',
    name: 'Gaseosa Línea Coca-Cola',
    description: 'Variedad de gaseosas línea Coca-Cola (Regular, Zero, Sprite, Fanta).',
    ingredients: ['Agua Carbonatada', 'Jarabe', 'Cafeína'],
    price: 1400,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
  },

  // --- Cafetería ---
  {
    id: 'cat-c1',
    name: 'Café Espresso',
    description: 'Intenso y aromático, la base de todo buen café.',
    ingredients: ['Granos de Café Molidos', 'Agua Caliente'],
    price: 1100,
    category: 'Cafetería',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a',
  },
  {
    id: 'cat-c2',
    name: 'Cappuccino Italiano',
    description: 'Espresso con leche vaporizada y espuma de leche.',
    ingredients: ['Espresso', 'Leche', 'Cacao en Polvo'],
    price: 1600,
    category: 'Cafetería',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
  },
  {
    id: 'cat-c3',
    name: 'Té en Hebras Premium',
    description: 'Selección de tés en hebras (Negro, Verde, Rojo, Earl Grey).',
    ingredients: ['Té en Hebras', 'Agua Caliente'],
    price: 1300,
    category: 'Cafetería',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12',
  },
  {
    id: 'cat-c4',
    name: 'Café Latte',
    description: 'Café suave con mucha leche caliente y poca espuma.',
    ingredients: ['Espresso', 'Leche Caliente'],
    price: 1500,
    category: 'Cafetería',
    image: 'https://images.unsplash.com/photo-1570968992193-d6ea06651afb',
  },

  // --- Vinos ---
  {
    id: 'cat-v1',
    name: 'Malbec Reserva',
    description: 'Vino tinto con cuerpo, notas de ciruela y frutos rojos.',
    ingredients: ['Uva Malbec'],
    price: 6500,
    category: 'Vinos',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809',
  },
  {
    id: 'cat-v2',
    name: 'Cabernet Sauvignon',
    description: 'Tinto estructurado con taninos firmes y notas especiadas.',
    ingredients: ['Uva Cabernet Sauvignon'],
    price: 6200,
    category: 'Vinos',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d',
  },
  {
    id: 'cat-v3',
    name: 'Chardonnay Roble',
    description: 'Blanco untuoso con notas de vainilla y frutas tropicales.',
    ingredients: ['Uva Chardonnay'],
    price: 5800,
    category: 'Vinos',
    image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d',
  },
  {
    id: 'cat-v4',
    name: 'Espumante Extra Brut',
    description: 'Burbujas finas, fresco y elegante para brindar.',
    ingredients: ['Uva Pinot Noir', 'Uva Chardonnay'],
    price: 7500,
    category: 'Vinos',
    image: 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c3',
  },

  // --- Cervezas ---
  {
    id: 'cat-ce1',
    name: 'Cerveza Artesanal IPA',
    description: 'Cerveza lupulada, amarga y aromática con notas cítricas.',
    ingredients: ['Malta', 'Lúpulo', 'Levadura', 'Agua'],
    price: 2200,
    category: 'Cervezas',
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d',
  },
  {
    id: 'cat-ce2',
    name: 'Cerveza Rubia Premium',
    description: 'Lager refrescante y ligera, ideal para acompañar comidas.',
    ingredients: ['Malta', 'Lúpulo', 'Levadura', 'Agua'],
    price: 1900,
    category: 'Cervezas',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9',
  },
  {
    id: 'cat-ce3',
    name: 'Cerveza Roja (Amber Ale)',
    description: 'Equilibrio entre malta caramelo y amargor moderado.',
    ingredients: ['Malta Caramelo', 'Lúpulo', 'Levadura'],
    price: 2100,
    category: 'Cervezas',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee8872a3',
  },
  {
    id: 'cat-ce4',
    name: 'Cerveza Negra Stout',
    description: 'Oscura, con cuerpo y notas a café y chocolate.',
    ingredients: ['Malta Tostada', 'Lúpulo', 'Levadura'],
    price: 2300,
    category: 'Cervezas',
    image: 'https://images.unsplash.com/photo-1625126596323-9366539b972f',
  },

  // --- Tragos ---
  {
    id: 'cat-t1',
    name: 'Fernet con Coca',
    description: 'El clásico argentino. Fernet Branca con Coca-Cola y hielo.',
    ingredients: ['Fernet Branca', 'Coca-Cola', 'Hielo'],
    price: 2500,
    category: 'Tragos',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
  },
  {
    id: 'cat-t2',
    name: 'Gin Tonic con Pepino',
    description: 'Gin premium, agua tónica, rodajas de pepino y pimienta.',
    ingredients: ['Gin', 'Agua Tónica', 'Pepino', 'Pimienta Rosa'],
    price: 2800,
    category: 'Tragos',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
  },
  {
    id: 'cat-t3',
    name: 'Mojito Cubano',
    description: 'Ron blanco, menta fresca, lima, azúcar y soda.',
    ingredients: ['Ron Blanco', 'Menta', 'Lima', 'Azúcar', 'Soda'],
    price: 2600,
    category: 'Tragos',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32d',
  },
  {
    id: 'cat-t4',
    name: 'Negroni',
    description: 'Cóctel aperitivo con Gin, Campari y Vermouth Rosso.',
    ingredients: ['Gin', 'Campari', 'Vermouth Rosso', 'Naranja'],
    price: 2900,
    category: 'Tragos',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
  },

  // --- Sandwiches ---
  {
    id: 'cat-s1',
    name: 'Sandwich de Bondiola Braseada',
    description: 'Bondiola desmenuzada en cocción lenta con barbacoa en pan ciabatta.',
    ingredients: ['Bondiola', 'Salsa Barbacoa', 'Pan Ciabatta', 'Cebolla Morada'],
    price: 3800,
    category: 'Sandwiches',
    image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432',
  },
  {
    id: 'cat-s2',
    name: 'Ciabatta de Pollo y Palta',
    description: 'Pechuga de pollo grillada, palta fresca, tomate y mayonesa.',
    ingredients: ['Pollo', 'Palta', 'Tomate', 'Mayonesa', 'Pan Ciabatta'],
    price: 3500,
    category: 'Sandwiches',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
  },
  {
    id: 'cat-s3',
    name: 'Tostado de Jamón y Queso',
    description: 'Clásico tostado en pan de miga o pebete, gratinado.',
    ingredients: ['Jamón Cocido', 'Queso Tybo', 'Pan de Miga', 'Manteca'],
    price: 2200,
    category: 'Sandwiches',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
  },

  // --- Tortas ---
  {
    id: 'cat-to1',
    name: 'Chocotorta',
    description: 'La torta argentina por excelencia. Galletitas de chocolate y dulce de leche.',
    ingredients: ['Galletitas de Chocolate', 'Dulce de Leche', 'Queso Crema', 'Café'],
    price: 2500,
    category: 'Tortas',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e',
  },
  {
    id: 'cat-to2',
    name: 'Lemon Pie',
    description: 'Base de masa sablée, crema de limón y merengue italiano.',
    ingredients: ['Limón', 'Huevos', 'Azúcar', 'Harina', 'Manteca'],
    price: 2400,
    category: 'Tortas',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729',
  },
  {
    id: 'cat-to3',
    name: 'Torta Oreo',
    description: 'Cheesecake frío con base y trozos de galletitas Oreo.',
    ingredients: ['Galletitas Oreo', 'Queso Crema', 'Crema de Leche', 'Azúcar'],
    price: 2600,
    category: 'Tortas',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad',
  },
  {
    id: 'cat-to4',
    name: 'Carrot Cake',
    description: 'Torta húmeda de zanahoria y nueces con frosting de queso crema.',
    ingredients: ['Zanahorias', 'Nueces', 'Canela', 'Queso Crema', 'Harina'],
    price: 2700,
    category: 'Tortas',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729',
  },
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

  // 4. Gallery Service
  getAlbumsByEventId: async (eventId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'all', name: 'Todas las fotos', type: 'system', count: 12 },
          { id: 'album-1', name: 'Preparativos', type: 'user', count: 5 },
          { id: 'album-2', name: 'Fiesta', type: 'user', count: 7 },
        ]);
      }, 400);
    });
  },

  getMediaByAlbumId: async (albumId, eventId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allMedia = [
          { id: 'm1', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', type: 'image', albumId: 'album-1', uploadedBy: '1', createdAt: new Date().toISOString(), visibility: 'public' },
          { id: 'm2', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622', type: 'image', albumId: 'album-1', uploadedBy: '2', createdAt: new Date().toISOString(), visibility: 'private' },
          { id: 'm3', url: 'https://images.unsplash.com/photo-1519671482502-9759101d4561', type: 'image', albumId: 'album-2', uploadedBy: '1', createdAt: new Date().toISOString(), visibility: 'public' },
          { id: 'm4', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4', type: 'image', albumId: 'album-2', uploadedBy: '3', createdAt: new Date().toISOString(), visibility: 'private' },
          { id: 'm5', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745', type: 'image', albumId: 'album-2', uploadedBy: '2', createdAt: new Date().toISOString(), visibility: 'public' },
        ];
        
        if (albumId === 'all') {
          resolve(allMedia);
        } else {
          resolve(allMedia.filter(m => m.albumId === albumId));
        }
      }, 500);
    });
  },

  uploadMedia: async (mediaItem) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mediaItem, id: `new-${Date.now()}`, createdAt: new Date().toISOString() });
      }, 1000);
    });
  },

  deleteMedia: async (mediaIds) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, deletedIds: mediaIds });
      }, 800);
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

export const CateringService = {
  getItemsByEventId: async (eventId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, filter by eventId
        resolve(MOCK_CATERING_ITEMS);
      }, 500);
    });
  },

  getCateringItems: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CATERING_ITEMS);
      }, 500);
    });
  },

  createCateringItem: async (item) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem = {
          ...item,
          id: `cat-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        MOCK_CATERING_ITEMS.push(newItem);
        resolve(newItem);
      }, 500);
    });
  },

  updateCateringItem: async (item) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_CATERING_ITEMS.findIndex(i => i.id === item.id);
        if (index !== -1) {
          MOCK_CATERING_ITEMS[index] = { ...MOCK_CATERING_ITEMS[index], ...item };
          resolve(MOCK_CATERING_ITEMS[index]);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  deleteCateringItem: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_CATERING_ITEMS.findIndex(i => i.id === id);
        if (index !== -1) {
          MOCK_CATERING_ITEMS.splice(index, 1);
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      }, 500);
    });
  },
};
