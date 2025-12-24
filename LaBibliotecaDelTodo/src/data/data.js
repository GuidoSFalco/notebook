export const CATEGORIES = [
  {
    id: 'software',
    title: 'Desarrollo de Software',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#f54287',
    keywords: ['programación', 'código', 'software', 'frontend', 'backend', 'dev', 'fullstack'],
    icon: { family: 'Ionicons', name: 'code-slash' },
    subcategories: [
      {
        id: 'software-lenguajes',
        title: 'Lenguajes de Programación',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['python', 'java', 'c++', 'javascript', 'typescript', 'rust', 'go'],
        icon: { family: 'Ionicons', name: 'code' },
        subcategories: [
          {
            id: 'software-lenguajes-python',
            title: 'Python',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['ia', 'datascience', 'backend', 'django', 'flask'],
            icon: { family: 'Ionicons', name: 'logo-python' },
            content: 'Python es un lenguaje interpretado, de alto nivel y propósito general. Destaca por su legibilidad y es el estándar en Ciencia de Datos e Inteligencia Artificial.'
          },
          {
            id: 'software-lenguajes-javascript',
            title: 'JavaScript',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['web', 'frontend', 'backend', 'es6'],
            icon: { family: 'Ionicons', name: 'logo-javascript' },
            content: 'JavaScript es el lenguaje de la web. Permite interactividad en el frontend y lógica de servidor con Node.js. Es débilmente tipado y multiparadigma.'
          },
          {
            id: 'software-lenguajes-typescript',
            title: 'TypeScript',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['tipado', 'microsoft', 'superset'],
            icon: { family: 'Ionicons', name: 'code-working' },
            content: 'TypeScript es un superset de JavaScript desarrollado por Microsoft que añade tipado estático opcional, facilitando el desarrollo de aplicaciones grandes y robustas.'
          },
          {
            id: 'software-lenguajes-java',
            title: 'Java',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['poo', 'empresarial', 'android', 'jvm'],
            icon: { family: 'Ionicons', name: 'cafe' },
            content: 'Java es un lenguaje orientado a objetos, portable (WORA - Write Once, Run Anywhere) gracias a la JVM. Es ampliamente usado en sistemas empresariales y desarrollo Android nativo.'
          },
          {
            id: 'software-lenguajes-cpp',
            title: 'C++',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['rendimiento', 'sistemas', 'videojuegos'],
            icon: { family: 'Ionicons', name: 'hardware-chip' },
            content: 'C++ es un lenguaje de alto rendimiento, extensión de C con orientación a objetos. Es fundamental en desarrollo de sistemas operativos, motores de videojuegos y aplicaciones de tiempo real.'
          }
        ]
      },
      {
        id: 'software-frontend',
        title: 'Frontend',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['ui', 'react', 'css', 'web', 'javascript', 'html', 'angular', 'vue'],
        icon: { family: 'Ionicons', name: 'desktop' },
        subcategories: [
          {
            id: 'software-frontend-html',
            title: 'HTML5',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['semántica', 'estructura', 'web'],
            icon: { family: 'Ionicons', name: 'logo-html5' },
            content: 'HTML5 es la última versión del estándar que define la estructura y el contenido de las páginas web. Introduce etiquetas semánticas como <header>, <article> y <section>.'
          },
          {
            id: 'software-frontend-css',
            title: 'CSS Moderno',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['flexbox', 'grid', 'animations', 'responsive', 'tailwind', 'sass'],
            icon: { family: 'Ionicons', name: 'color-palette' },
            content: 'CSS permite diseñar la presentación. Tecnologías modernas incluyen Flexbox y Grid para layouts, y preprocesadores como SASS o frameworks como Tailwind CSS.'
          },
          {
            id: 'software-frontend-react',
            title: 'React',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['hooks', 'components', 'jsx', 'virtual dom', 'redux', 'nextjs'],
            icon: { family: 'Ionicons', name: 'logo-react' },
            content: 'Biblioteca de JS creada por Facebook. Se basa en componentes, estado y props. Su ecosistema incluye Next.js para SSR y Redux/Zustand para manejo de estado global.'
          },
          {
            id: 'software-frontend-vue',
            title: 'Vue.js',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['progresivo', 'reactividad', 'componentes'],
            icon: { family: 'Ionicons', name: 'logo-vue' },
            content: 'Framework progresivo de JavaScript. Destaca por su curva de aprendizaje suave y su sistema de reactividad eficiente. Usa una sintaxis de plantillas basada en HTML.'
          },
          {
            id: 'software-frontend-angular',
            title: 'Angular',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['google', 'typescript', 'mvc', 'enterprise'],
            icon: { family: 'Ionicons', name: 'logo-angular' },
            content: 'Framework completo desarrollado por Google. Utiliza TypeScript y sigue una arquitectura robusta, ideal para aplicaciones empresariales de gran escala.'
          }
        ]
      },
      {
        id: 'software-backend',
        title: 'Backend',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['api', 'node', 'server', 'db', 'python', 'java', 'rest', 'graphql'],
        icon: { family: 'Ionicons', name: 'server' },
        subcategories: [
          {
            id: 'software-backend-node',
            title: 'Node.js',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['express', 'npm', 'async', 'event loop', 'nest'],
            icon: { family: 'Ionicons', name: 'logo-nodejs' },
            content: 'Entorno de ejecución de JS en el servidor. Permite I/O no bloqueante. Frameworks populares: Express (minimalista) y NestJS (arquitectura escalable con TS).'
          },
          {
            id: 'software-backend-api',
            title: 'APIs (REST & GraphQL)',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['http', 'endpoints', 'json', 'query'],
            icon: { family: 'Ionicons', name: 'globe' },
            content: 'REST usa verbos HTTP (GET, POST) y recursos estándar. GraphQL permite al cliente pedir exactamente los datos que necesita en una sola petición.'
          },
          {
            id: 'software-backend-db',
            title: 'Bases de Datos',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['sql', 'nosql', 'mongo', 'postgres', 'redis'],
            icon: { family: 'Ionicons', name: 'file-tray-full' },
            content: 'Almacenamiento de datos. SQL (PostgreSQL, MySQL) usa tablas y relaciones. NoSQL (MongoDB, Redis) es flexible, ideal para datos no estructurados o caché de alta velocidad.'
          },
          {
            id: 'software-backend-auth',
            title: 'Autenticación',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['jwt', 'oauth', 'seguridad', 'cookies'],
            icon: { family: 'Ionicons', name: 'key' },
            content: 'Mecanismos para verificar identidad. JWT (JSON Web Tokens) es común en APIs stateless. OAuth permite loguearse con Google/Facebook/GitHub.'
          }
        ]
      },
      {
        id: 'software-arquitectura',
        title: 'Arquitectura',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['patrones', 'diseño', 'clean', 'solid'],
        icon: { family: 'Ionicons', name: 'construct' },
        subcategories: [
          {
            id: 'software-arq-patrones',
            title: 'Patrones de Diseño',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['singleton', 'factory', 'observer', 'strategy'],
            icon: { family: 'Ionicons', name: 'shapes' },
            content: 'Soluciones reutilizables a problemas comunes. Ejemplos: Singleton (una instancia), Factory (creación de objetos), Observer (eventos).'
          },
          {
            id: 'software-arq-clean',
            title: 'Clean Architecture',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['capas', 'dependencias', 'testabilidad'],
            icon: { family: 'Ionicons', name: 'layers' },
            content: 'Propuesta por Robert C. Martin. Separa el software en capas (Entidades, Casos de Uso, Controladores) para independizar la lógica de negocio de frameworks y bases de datos.'
          },
          {
            id: 'software-arq-microservicios',
            title: 'Microservicios',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['distribuido', 'escalabilidad', 'contenedores'],
            icon: { family: 'Ionicons', name: 'apps' },
            content: 'Estilo arquitectónico donde una aplicación se estructura como una colección de servicios pequeños, autónomos y desplegables independientemente.'
          }
        ]
      },
      {
        id: 'software-devops',
        title: 'DevOps & Cloud',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['docker', 'ci', 'cd', 'infra', 'cloud', 'aws', 'kubernetes'],
        icon: { family: 'Ionicons', name: 'cloud-circle' },
        subcategories: [
          {
            id: 'software-devops-docker',
            title: 'Docker',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['contenedores', 'imágenes', 'virtualización'],
            icon: { family: 'Ionicons', name: 'cube' },
            content: 'Plataforma de contenerización. Empaqueta código y dependencias para asegurar que la aplicación corra igual en desarrollo y producción.'
          },
          {
            id: 'software-devops-k8s',
            title: 'Kubernetes',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['orquestación', 'clusters', 'pods'],
            icon: { family: 'Ionicons', name: 'boat' },
            content: 'Sistema open-source para la orquestación de contenedores. Automatiza el despliegue, escalado y gestión de aplicaciones contenerizadas.'
          },
          {
            id: 'software-devops-cicd',
            title: 'CI/CD',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['jenkins', 'github actions', 'automatización'],
            icon: { family: 'Ionicons', name: 'infinite' },
            content: 'Integración y Despliegue Continuos. Prácticas para automatizar la integración de código, ejecución de tests y despliegue a producción.'
          }
        ]
      },
      {
        id: 'software-mobile',
        title: 'Desarrollo Móvil',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['android', 'ios', 'react native', 'flutter', 'swift', 'kotlin'],
        icon: { family: 'Ionicons', name: 'phone-portrait' },
        subcategories: [
          {
            id: 'software-mobile-rn',
            title: 'React Native',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['cross-platform', 'javascript', 'meta'],
            icon: { family: 'Ionicons', name: 'logo-react' },
            content: 'Framework de Meta para crear apps nativas usando React. Unifica el desarrollo para iOS y Android compartiendo lógica de negocio.'
          },
          {
            id: 'software-mobile-flutter',
            title: 'Flutter',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['dart', 'google', 'widgets'],
            icon: { family: 'Ionicons', name: 'paper-plane' },
            content: 'UI Toolkit de Google. Usa el lenguaje Dart. Destaca por su rendimiento nativo y su sistema de widgets personalizables.'
          },
          {
            id: 'software-mobile-native',
            title: 'Nativo (Swift/Kotlin)',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['apple', 'google', 'performance'],
            icon: { family: 'Ionicons', name: 'hardware-chip' },
            content: 'Desarrollo específico para cada plataforma. Swift para iOS (Apple) y Kotlin para Android (Google). Ofrecen el máximo rendimiento y acceso a APIs del sistema.'
          }
        ]
      },
      {
        id: 'software-herramientas',
        title: 'Herramientas',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['git', 'ide', 'vscode', 'terminal'],
        icon: { family: 'Ionicons', name: 'hammer' },
        subcategories: [
          {
            id: 'software-tools-git',
            title: 'Git & GitHub',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['version control', 'commit', 'branch', 'merge'],
            icon: { family: 'Ionicons', name: 'git-network' },
            content: 'Sistema de control de versiones distribuido. Permite rastrear cambios en el código, trabajar en ramas y colaborar con otros desarrolladores.'
          },
          {
            id: 'software-tools-vscode',
            title: 'VS Code',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['editor', 'microsoft', 'extensions'],
            icon: { family: 'Ionicons', name: 'code-slash' },
            content: 'Editor de código fuente ligero y potente. Altamente personalizable mediante extensiones, con soporte integrado para Git y depuración.'
          }
        ]
      }
    ],
  },
  {
    id: 'ciencias-naturales',
    title: 'Ciencias Naturales',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#4caf50',
    keywords: ['biología', 'química', 'naturaleza', 'ciencia', 'vida', 'átomos'],
    icon: { family: 'Ionicons', name: 'leaf' },
    subcategories: [
      {
        id: 'ciencias-biologia',
        title: 'Biología',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['células', 'genética', 'ecosistemas', 'anatomía'],
        icon: { family: 'Ionicons', name: 'flower' },
        subcategories: [
          {
            id: 'ciencias-biologia-celula',
            title: 'La Célula',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['núcleo', 'mitocondria', 'adn', 'membrana'],
            icon: { family: 'Ionicons', name: 'ellipse' },
            content: 'La célula es la unidad básica de la vida. Existen procariotas (sin núcleo definido) y eucariotas (con núcleo). Contienen organelos como mitocondrias y ribosomas.'
          },
          {
            id: 'ciencias-biologia-genetica',
            title: 'Genética',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['herencia', 'genes', 'mendel', 'cromosomas'],
            icon: { family: 'Ionicons', name: 'git-branch' },
            content: 'La genética estudia la herencia biológica. El ADN contiene las instrucciones genéticas usadas en el desarrollo y funcionamiento de todos los organismos vivos.'
          }
        ]
      },
      {
        id: 'ciencias-quimica',
        title: 'Química',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['reacciones', 'elementos', 'compuestos', 'laboratorio'],
        icon: { family: 'Ionicons', name: 'flask' },
        subcategories: [
          {
            id: 'ciencias-quimica-tabla',
            title: 'Tabla Periódica',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['elementos', 'grupos', 'periodos', 'metales'],
            icon: { family: 'Ionicons', name: 'grid' },
            content: 'La tabla periódica organiza los elementos químicos según su número atómico, configuración electrónica y propiedades químicas. Dmitri Mendeléyev publicó la primera versión reconocible.'
          },
          {
            id: 'ciencias-quimica-enlaces',
            title: 'Enlaces Químicos',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['covalente', 'iónico', 'metálico', 'moléculas'],
            icon: { family: 'Ionicons', name: 'git-network' },
            content: 'Los átomos se unen mediante enlaces químicos para formar compuestos. Los principales tipos son iónico (transferencia de electrones), covalente (compartición) y metálico.'
          }
        ]
      }
    ]
  },
  {
    id: 'fisica',
    title: 'Física',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#f54242',
    keywords: ['física', 'fisica', 'escuela', 'universidad', 'ciencias exactas', 'ecuaciones', 'movimiento', 'energía'],
    icon: { family: 'Ionicons', name: 'flask' },
    subcategories: [
      {
        id: 'fisica-calculos',
        title: 'Cálculos y Mecánica',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['ecuaciones', 'cinemática', 'dinámica', 'MRU', 'MRUA', 'fuerza', 'newton'],
        icon: { family: 'Ionicons', name: 'calculator' },
        subcategories: [
          {
            id: 'fisica-calculos-cinematica',
            title: 'Cinemática',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['velocidad', 'aceleración', 'tiempo', 'distancia'],
            icon: { family: 'Ionicons', name: 'stopwatch' },
            content: 'Estudia el movimiento sin considerar sus causas. Conceptos clave: Desplazamiento, Velocidad (v=d/t), Aceleración (a=Δv/t). MRU: velocidad constante. MRUA: aceleración constante.'
          },
          {
            id: 'fisica-calculos-dinamica',
            title: 'Dinámica',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['fuerza', 'masa', 'leyes de newton', 'inercia'],
            icon: { family: 'Ionicons', name: 'hammer' },
            content: 'Estudia las causas del movimiento. 2da Ley de Newton: F = m · a. La fuerza es igual a la masa por la aceleración. Peso = m · g.'
          },
        ],
      },
      {
        id: 'fisica-energias',
        title: 'Energías',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['potencial', 'cinética', 'térmica', 'eléctrica', 'energía', 'trabajo'],
        icon: { family: 'Ionicons', name: 'flash' },
        subcategories: [
          {
            id: 'fisica-energias-cinetica',
            title: 'Energía Cinética',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['movimiento', 'masa', 'velocidad', 'energía', 'cinética', 'energía cinética'],
            icon: { family: 'Ionicons', name: 'speedometer' },
            content: 'La energía cinética de un cuerpo en movimiento es Ek = 1/2 · m · v^2, donde m es la masa y v la velocidad. Se mide en Joules (J).'
          },
          {
            id: 'fisica-energias-potencial',
            title: 'Energía Potencial',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['altura', 'gravedad', 'elástica'],
            icon: { family: 'Ionicons', name: 'arrow-up' },
            content: 'Energía almacenada por la posición. Ep gravitatoria = m · g · h. A mayor altura y masa, mayor energía potencial.'
          }
        ]
      },
      {
        id: 'fisica-electromagnetismo',
        title: 'Electromagnetismo',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['campo', 'carga', 'corriente', 'inducción', 'imanes'],
        icon: { family: 'Ionicons', name: 'radio' },
        subcategories: [
          {
            id: 'fisica-electro-circuitos',
            title: 'Circuitos',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['ohm', 'resistencia', 'voltaje', 'corriente'],
            icon: { family: 'Ionicons', name: 'pulse' },
            content: 'Ley de Ohm: V = I · R. Voltaje es igual a Corriente por Resistencia. Circuitos en serie (corriente constante) y paralelo (voltaje constante).'
          }
        ]
      },
      {
        id: 'fisica-astronomia',
        title: 'Astronomía',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['espacio', 'universo', 'estrellas', 'planetas', 'galaxias'],
        icon: { family: 'Ionicons', name: 'planet' },
        subcategories: [
          {
            id: 'fisica-astronomia-sistema',
            title: 'Sistema Solar',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['sol', 'tierra', 'marte', 'júpiter'],
            icon: { family: 'Ionicons', name: 'sunny' },
            content: 'Formado por el Sol y los objetos que orbitan a su alrededor, incluidos 8 planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno.'
          },
          {
            id: 'fisica-astronomia-cosmos',
            title: 'Espacio Profundo',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['galaxias', 'agujeros negros', 'nebulosas', 'big bang'],
            icon: { family: 'Ionicons', name: 'moon' },
            content: 'El universo contiene miles de millones de galaxias. La Vía Láctea es nuestra galaxia. Los agujeros negros son regiones con gravedad tan fuerte que nada escapa de ellos.'
          }
        ]
      }
    ],
  },
  {
    id: 'matematicas',
    title: 'Matemáticas',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#f5a442',
    keywords: ['álgebra', 'cálculo', 'geometría', 'trigonometría', 'números', 'lógica'],
    icon: { family: 'Ionicons', name: 'calculator' },
    subcategories: [
      { 
        id: 'mate-algebra', 
        title: 'Álgebra', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['ecuaciones', 'polinomios', 'variables'], 
        icon: { family: 'Ionicons', name: 'grid' },
        subcategories: [
          {
            id: 'mate-algebra-bhaskara',
            title: 'Teorema de Bhaskara',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['ecuaciones cuadráticas', 'fórmula general', 'raíces'],
            icon: { family: 'Ionicons', name: 'school' },
            content: 'La fórmula de Bhaskara (fórmula general) resuelve ax^2 + bx + c = 0: x = (-b ± √(b^2 - 4ac)) / (2a). El discriminante Δ = b^2 - 4ac determina la cantidad y tipo de raíces.'
          },
          {
            id: 'mate-algebra-lineal',
            title: 'Ecuaciones Lineales',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['rectas', 'pendientes', 'sistemas'],
            icon: { family: 'Ionicons', name: 'trending-up' },
            content: 'Ecuaciones de primer grado (y = mx + b). m es la pendiente, b la ordenada al origen. Sistemas de ecuaciones pueden resolverse por sustitución, igualación o reducción.'
          }
        ]
      },
      { 
        id: 'mate-calculo', 
        title: 'Cálculo', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['derivadas', 'integrales', 'límites', 'funciones'], 
        icon: { family: 'Ionicons', name: 'infinite' },
        subcategories: [
          {
            id: 'mate-calculo-derivadas',
            title: 'Derivadas',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['tasa de cambio', 'pendiente', 'reglas'],
            icon: { family: 'Ionicons', name: 'git-commit' },
            content: 'La derivada mide la tasa de cambio instantánea de una función. Geométricamente, es la pendiente de la recta tangente a la curva en un punto.'
          }
        ]
      },
      { 
        id: 'mate-geometria', 
        title: 'Geometría', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['ángulos', 'áreas', 'volúmenes', 'figuras'], 
        icon: { family: 'Ionicons', name: 'shapes' },
        subcategories: [
          {
            id: 'mate-geometria-pitagoras',
            title: 'Teorema de Pitágoras',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['triángulos', 'hipotenusa', 'catetos'],
            icon: { family: 'Ionicons', name: 'triangle' },
            content: 'En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos: a^2 + b^2 = c^2.'
          }
        ]
      },
    ],
  },
  {
    id: 'geografia',
    title: 'Geografía',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#009688',
    keywords: ['mapas', 'países', 'capitales', 'mundo', 'tierra'],
    icon: { family: 'Ionicons', name: 'globe' },
    subcategories: [
      {
        id: 'geo-continentes',
        title: 'Continentes',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['américa', 'europa', 'asia', 'áfrica', 'oceanía'],
        icon: { family: 'Ionicons', name: 'map' },
        subcategories: [
          {
            id: 'geo-america',
            title: 'América',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['norte', 'sur', 'central', 'andes', 'amazonas'],
            icon: { family: 'Ionicons', name: 'location' },
            content: 'Segundo continente más grande. Se divide en América del Norte, Central y del Sur. Posee la cordillera de los Andes y la selva amazónica.'
          },
          {
            id: 'geo-europa',
            title: 'Europa',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['unión europea', 'alpes', 'mediterráneo'],
            icon: { family: 'Ionicons', name: 'business' },
            content: 'Continente con gran historia cultural. Incluye países como España, Francia, Alemania, Italia. Hogar de la Unión Europea.'
          },
          {
            id: 'geo-asia',
            title: 'Asia',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['china', 'india', 'himalaya'],
            icon: { family: 'Ionicons', name: 'people' },
            content: 'El continente más grande y poblado. Incluye potencias como China, India y Japón, y el monte Everest en el Himalaya.'
          }
        ]
      },
      {
        id: 'geo-fisica',
        title: 'Geografía Física',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['montañas', 'ríos', 'climas', 'volcanes'],
        icon: { family: 'Ionicons', name: 'sunny' },
        subcategories: [
          {
            id: 'geo-fisica-rios',
            title: 'Ríos Principales',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['amazonas', 'nilo', 'mississippi'],
            icon: { family: 'Ionicons', name: 'water' },
            content: 'El Amazonas es el río más caudaloso del mundo. El Nilo es históricamente considerado el más largo. Son vitales para los ecosistemas y civilizaciones.'
          }
        ]
      }
    ]
  },
  {
    id: 'cocina',
    title: 'Recetas de Cocina',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#f5d112',
    keywords: ['cocina', 'recetas', 'ingredientes', 'postres', 'comida', 'chef', 'gastronomía'],
    icon: { family: 'Ionicons', name: 'restaurant' },
    subcategories: [
      { 
        id: 'cocina-postres', 
        title: 'Postres', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['dulce', 'horno', 'chocolate', 'frutas'], 
        icon: { family: 'Ionicons', name: 'ice-cream' },
        subcategories: [
          {
            id: 'cocina-postres-tarta-manzana',
            title: 'Tarta de Manzana',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['masa', 'manzana', 'canela'],
            icon: { family: 'Ionicons', name: 'pie-chart' },
            content: 'Receta: masa quebrada, relleno de manzanas con azúcar y canela, hornear a 180°C por ~45min. Servir tibia con helado.'
          },
          {
            id: 'cocina-postres-brownie',
            title: 'Brownie de Chocolate',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['chocolate', 'nueces', 'horno'],
            icon: { family: 'Ionicons', name: 'cube' },
            content: 'Mezclar chocolate fundido con manteca, huevos y azúcar. Agregar harina y nueces. Hornear 20-25 min para que quede húmedo por dentro.'
          }
        ]
      },
      { 
        id: 'cocina-platos', 
        title: 'Platos Principales', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['carne', 'vegetales', 'pasta', 'pollo'], 
        icon: { family: 'Ionicons', name: 'fast-food' },
        subcategories: [
          {
            id: 'cocina-platos-pasta',
            title: 'Pasta Carbonara',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['italia', 'huevo', 'queso', 'panceta'],
            icon: { family: 'Ionicons', name: 'restaurant' },
            content: 'La auténtica carbonara lleva huevo, queso pecorino, guanciale (o panceta) y pimienta negra. ¡Sin crema!'
          }
        ]
      },
      { 
        id: 'cocina-bebidas', 
        title: 'Bebidas', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['jugos', 'cocteles', 'café', 'té'], 
        icon: { family: 'Ionicons', name: 'beer' },
        subcategories: [
          {
            id: 'cocina-bebidas-cafe',
            title: 'Tipos de Café',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['espresso', 'latte', 'cappuccino'],
            icon: { family: 'Ionicons', name: 'cafe' },
            content: 'Espresso: café concentrado. Latte: espresso con mucha leche vaporizada. Cappuccino: partes iguales de espresso, leche y espuma.'
          }
        ]
      },
    ],
  },
  {
    id: 'animales',
    title: 'Animales',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#8bc34a',
    keywords: ['animal', 'animales', 'herbívoros', 'domésticos', 'fauna', 'salvajes'],
    icon: { family: 'Ionicons', name: 'paw' },
    subcategories: [
      { 
        id: 'animales-reptiles', 
        title: 'Reptiles', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['sangre fría', 'escamas'], 
        icon: { family: 'Ionicons', name: 'logo-python' },
        subcategories: [
          { 
            id: 'animales-serpientes', 
            title: 'Serpientes', 
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['reptiles', 'venenosas', 'pitón'], 
            icon: { family: 'Ionicons', name: 'alert' },
            content: 'Reptiles sin patas, carnívoros. Algunas son venenosas (cobras, víboras) y otras constrictoras (boas, pitones).'
          }
        ]
      },
      { 
        id: 'animales-mamiferos', 
        title: 'Mamíferos', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['leche', 'pelo', 'vivíparos'], 
        icon: { family: 'Ionicons', name: 'paw' },
        subcategories: [
          { id: 'animales-perros', title: 'Perros', keywords: ['caninos', 'domésticos', 'mascotas'], icon: { family: 'Ionicons', name: 'paw' }, content: 'El mejor amigo del hombre. Existen cientos de razas con diferentes características.' },
          { id: 'animales-gatos', title: 'Gatos', keywords: ['felinos', 'domésticos', 'mascotas'], icon: { family: 'Ionicons', name: 'paw' }, content: 'Felinos domésticos conocidos por su agilidad y ronroneo.' },
          { id: 'animales-felinos-salvajes', title: 'Grandes Felinos', keywords: ['león', 'tigre', 'pantera'], icon: { family: 'Ionicons', name: 'skull' }, content: 'Incluye al León (rey de la selva), Tigre (el más grande), y Jaguar.' }
        ] 
      },
      {
        id: 'animales-insectos',
        title: 'Insectos y Arácnidos',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['patas', 'exoesqueleto'],
        icon: { family: 'Ionicons', name: 'bug' },
        subcategories: [
          { id: 'animales-aranas', title: 'Arañas', keywords: ['arácnidos', 'telaraña', 'veneno', '8 patas'], icon: { family: 'Ionicons', name: 'bug' }, content: 'Arácnidos con 8 patas. Producen seda para tejer telarañas.' },
          { id: 'animales-abejas', title: 'Abejas', keywords: ['miel', 'polinización', 'reina'], icon: { family: 'Ionicons', name: 'rose' }, content: 'Insectos vitales para la polinización. Viven en colmenas organizadas con una reina, obreras y zánganos.' }
        ]
      }
    ],
  },
  {
    id: 'historia',
    title: 'Historia',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#9c27b0',
    keywords: ['antigua', 'moderna', 'civilizaciones', 'biografías', 'guerra', 'pasado'],
    icon: { family: 'Ionicons', name: 'book' },
    subcategories: [
      { 
        id: 'historia-antigua', 
        title: 'Edad Antigua', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['egipto', 'roma', 'grecia', 'pirámides'], 
        icon: { family: 'Ionicons', name: 'hourglass' },
        subcategories: [
          {
            id: 'historia-antigua-egipto',
            title: 'Antiguo Egipto',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['faraones', 'nilo', 'jeroglíficos'],
            icon: { family: 'Ionicons', name: 'triangle' },
            content: 'Civilización del noreste de África. Famosa por sus pirámides, faraones y complejos rituales funerarios (momias).'
          },
          {
            id: 'historia-antigua-roma',
            title: 'Imperio Romano',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['césar', 'coliseo', 'legiones'],
            icon: { family: 'Ionicons', name: 'shield' },
            content: 'Roma dominó el Mediterráneo por siglos. Aportaron el derecho, la arquitectura (arcos, acueductos) y el latín.'
          }
        ]
      },
      { 
        id: 'historia-media', 
        title: 'Edad Media', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['castillos', 'caballeros', 'feudalismo'], 
        icon: { family: 'Ionicons', name: 'shield-checkmark' },
        subcategories: [
           {
             id: 'historia-media-feudalismo',
             title: 'Feudalismo',
             titleColor: '#333333',
             tagColor: '#555555',
             keywords: ['rey', 'vasallo', 'tierra'],
             icon: { family: 'Ionicons', name: 'people' },
             content: 'Sistema social y político basado en la tenencia de tierras (feudos) y relaciones de vasallaje entre señores y siervos.'
           }
        ]
      },
      { 
        id: 'historia-moderna', 
        title: 'Edad Moderna y Contemp.', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['guerras mundiales', 'revoluciones', 'industrial'], 
        icon: { family: 'Ionicons', name: 'time' },
        subcategories: [
          {
            id: 'historia-rev-francesa',
            title: 'Revolución Francesa',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['1789', 'libertad', 'igualdad', 'fraternidad'],
            icon: { family: 'Ionicons', name: 'flag' },
            content: 'Conflicto social y político en Francia (1789) que derrocó a la monarquía y estableció principios de libertad e igualdad.'
          }
        ]
      },
      { 
        id: 'historia-argentina', 
        title: 'Historia Argentina', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['independencia', 'próceres', 'san martín'], 
        icon: { family: 'Ionicons', name: 'flag' },
        subcategories: [
          {
             id: 'historia-arg-independencia',
             title: 'Independencia',
             titleColor: '#333333',
             tagColor: '#555555',
             keywords: ['1816', 'tucumán', 'españa'],
             icon: { family: 'Ionicons', name: 'calendar' },
             content: 'Declarada el 9 de julio de 1816 en el Congreso de Tucumán, rompiendo vínculos con la corona española.'
          }
        ]
      },
    ],
  },
  {
    id: 'deportes',
    title: 'Deportes',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#03a9f4',
    keywords: ['ejercicio', 'competencia', 'equipo', 'olimpiadas', 'fitness'],
    icon: { family: 'Ionicons', name: 'football' },
    subcategories: [
      { 
        id: 'deportes-futbol', 
        title: 'Fútbol', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['balón', 'liga', 'gol', 'mundial'], 
        icon: { family: 'Ionicons', name: 'football' },
        subcategories: [
          {
            id: 'deportes-futbol-reglas',
            title: 'Reglas Básicas',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['offside', 'penal', 'arbitro'],
            icon: { family: 'Ionicons', name: 'book' },
            content: 'Se juega 11 vs 11. El objetivo es meter el balón en el arco contrario. No se puede usar las manos (salvo el arquero).'
          }
        ]
      },
      { 
        id: 'deportes-basquet', 
        title: 'Básquet', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['nba', 'aro', 'triple'], 
        icon: { family: 'Ionicons', name: 'basketball' },
        subcategories: [
          {
             id: 'deportes-basquet-posiciones',
             title: 'Posiciones',
             titleColor: '#333333',
             tagColor: '#555555',
             keywords: ['base', 'alero', 'pivot'],
             icon: { family: 'Ionicons', name: 'people' },
             content: 'Base (armador), Escolta, Alero, Ala-pívot y Pívot. Cada uno tiene un rol específico en ataque y defensa.'
          }
        ]
      },
      { id: 'deportes-natacion', title: 'Natación', keywords: ['piscina', 'estilos', 'agua'], icon: { family: 'Ionicons', name: 'water' } },
      { 
        id: 'deportes-tenis', 
        title: 'Tenis', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['raqueta', 'grand slam', 'red'], 
        icon: { family: 'Ionicons', name: 'tennisball' },
        subcategories: [
          {
            id: 'deportes-tenis-puntuacion',
            title: 'Puntuación',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['15', '30', '40', 'deuce'],
            icon: { family: 'Ionicons', name: 'stats-chart' },
            content: 'Puntos: 0, 15, 30, 40, Juego. Si empatan en 40 (Deuce), se necesita ventaja de dos puntos para ganar el game.'
          }
        ]
      },
    ],
  },
  {
    id: 'arte',
    title: 'Arte y Cultura',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#e91e63',
    keywords: ['pintura', 'escultura', 'museo', 'creatividad', 'cultura'],
    icon: { family: 'Ionicons', name: 'color-palette' },
    subcategories: [
      { 
        id: 'arte-pintura', 
        title: 'Pintura', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['óleo', 'acuarela', 'lienzo', 'vangogh'], 
        icon: { family: 'Ionicons', name: 'brush' },
        subcategories: [
          {
            id: 'arte-pintura-tecnicas',
            title: 'Técnicas',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['fresco', 'temple', 'acrílico'],
            icon: { family: 'Ionicons', name: 'color-fill' },
            content: 'Existen muchas técnicas: Óleo (aceite), Acuarela (agua), Acrílico (polímeros), Fresco (muro húmedo).'
          }
        ]
      },
      { 
        id: 'arte-musica', 
        title: 'Música', 
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['instrumentos', 'ritmo', 'melodía', 'notas'], 
        icon: { family: 'Ionicons', name: 'musical-notes' },
        subcategories: [
          {
            id: 'arte-musica-teoria',
            title: 'Teoría Musical',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['pentagrama', 'clave de sol', 'compás'],
            icon: { family: 'Ionicons', name: 'musical-note' },
            content: 'El pentagrama tiene 5 líneas. Las notas son Do, Re, Mi, Fa, Sol, La, Si. El compás define el ritmo.'
          }
        ]
      },
      {
        id: 'arte-cine',
        title: 'Cine',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['películas', 'director', 'guion', 'hollywood'],
        icon: { family: 'Ionicons', name: 'videocam' },
        subcategories: [
          {
            id: 'arte-cine-generos',
            title: 'Géneros',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['drama', 'comedia', 'terror', 'sci-fi'],
            icon: { family: 'Ionicons', name: 'film' },
            content: 'Categorías narrativas: Drama, Comedia, Terror, Ciencia Ficción, Acción, Documental, etc.'
          }
        ]
      }
    ],
  },
  {
    id: 'tecnologia',
    title: 'Tecnología',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#607d8b',
    keywords: ['futuro', 'innovación', 'digital', 'ia', 'robots'],
    icon: { family: 'Ionicons', name: 'hardware-chip' },
    subcategories: [
      {
        id: 'tec-ia',
        title: 'Inteligencia Artificial',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['machine learning', 'redes neuronales', 'chatgpt'],
        icon: { family: 'Ionicons', name: 'logo-android' },
        subcategories: [
           {
             id: 'tec-ia-ml',
             title: 'Machine Learning',
             titleColor: '#333333',
             tagColor: '#555555',
             keywords: ['datos', 'entrenamiento', 'modelos'],
             icon: { family: 'Ionicons', name: 'analytics' },
             content: 'Rama de la IA que permite a las máquinas aprender de datos y mejorar su rendimiento sin ser programadas explícitamente.'
           }
        ]
      },
      {
        id: 'tec-seguridad',
        title: 'Ciberseguridad',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['hacking', 'virus', 'firewall', 'encriptación'],
        icon: { family: 'Ionicons', name: 'lock-closed' },
        subcategories: [
          {
            id: 'tec-seguridad-phishing',
            title: 'Phishing',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['estafa', 'email', 'robo'],
            icon: { family: 'Ionicons', name: 'warning' },
            content: 'Técnica de ingeniería social para engañar a usuarios y robar datos confidenciales (contraseñas, tarjetas) mediante correos falsos.'
          }
        ]
      }
    ]
  },
  {
    id: 'literatura',
    title: 'Literatura',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#795548',
    keywords: ['libros', 'autores', 'poesía', 'novela', 'lectura'],
    icon: { family: 'Ionicons', name: 'library' },
    subcategories: [
      {
        id: 'lit-generos',
        title: 'Géneros Literarios',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['narrativa', 'lírica', 'dramática'],
        icon: { family: 'Ionicons', name: 'bookmarks' },
        subcategories: [
          {
            id: 'lit-generos-novela',
            title: 'Novela',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['ficción', 'personajes', 'trama'],
            icon: { family: 'Ionicons', name: 'book' },
            content: 'Narración extensa en prosa que relata una historia ficticia o real con un desarrollo de personajes y trama más complejo que el cuento.'
          },
          {
            id: 'lit-generos-poesia',
            title: 'Poesía',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['versos', 'rimas', 'estrofas'],
            icon: { family: 'Ionicons', name: 'rose' },
            content: 'Género literario que se caracteriza por la manifestación de la belleza o del sentimiento estético a través de la palabra, en verso o en prosa.'
          }
        ]
      },
      {
        id: 'lit-autores',
        title: 'Grandes Autores',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['cervantes', 'shakespeare', 'borges', 'garcia marquez'],
        icon: { family: 'Ionicons', name: 'person' },
        subcategories: [
          {
            id: 'lit-autores-cervantes',
            title: 'Miguel de Cervantes',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['don quijote', 'españa', 'siglo de oro'],
            icon: { family: 'Ionicons', name: 'create' },
            content: 'Autor de "El ingenioso hidalgo Don Quijote de la Mancha", considerada la primera novela moderna y una de las mejores obras de la literatura universal.'
          },
          {
            id: 'lit-autores-borges',
            title: 'Jorge Luis Borges',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['ficciones', 'aleph', 'argentina', 'laberintos'],
            icon: { family: 'Ionicons', name: 'glasses' },
            content: 'Escritor argentino clave del siglo XX. Conocido por sus cuentos, ensayos y poemas que exploran temas como el infinito, los espejos y los laberintos.'
          }
        ]
      }
    ]
  },
  {
    id: 'salud',
    title: 'Salud y Medicina',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#e53935',
    keywords: ['medicina', 'cuerpo', 'nutrición', 'enfermedades', 'bienestar'],
    icon: { family: 'Ionicons', name: 'medkit' },
    subcategories: [
      {
        id: 'salud-cuerpo',
        title: 'Cuerpo Humano',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['anatomía', 'órganos', 'sistemas'],
        icon: { family: 'Ionicons', name: 'body' },
        subcategories: [
          {
            id: 'salud-cuerpo-corazon',
            title: 'Sistema Circulatorio',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['corazón', 'sangre', 'arterias'],
            icon: { family: 'Ionicons', name: 'heart' },
            content: 'El corazón bombea sangre a través de arterias, venas y capilares, transportando oxígeno y nutrientes a todo el cuerpo.'
          }
        ]
      },
      {
        id: 'salud-nutricion',
        title: 'Nutrición',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['vitaminas', 'proteínas', 'dieta', 'calorías'],
        icon: { family: 'Ionicons', name: 'nutrition' },
        subcategories: [
          {
            id: 'salud-nutricion-macro',
            title: 'Macronutrientes',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['carbohidratos', 'proteínas', 'grasas'],
            icon: { family: 'Ionicons', name: 'restaurant' },
            content: 'Los nutrientes principales que el cuerpo necesita en grandes cantidades: Carbohidratos (energía), Proteínas (construcción) y Grasas (reserva y hormonal).'
          }
        ]
      },
      {
        id: 'salud-primeros-auxilios',
        title: 'Primeros Auxilios',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['rcp', 'heridas', 'emergencia'],
        icon: { family: 'Ionicons', name: 'bandage' },
        subcategories: [
          {
            id: 'salud-auxilios-rcp',
            title: 'RCP',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['reanimación', 'cardíaca', 'compresiones'],
            icon: { family: 'Ionicons', name: 'pulse' },
            content: 'La Reanimación Cardiopulmonar (RCP) combina compresiones torácicas y respiración boca a boca para mantener el flujo sanguíneo y la oxigenación durante un paro cardíaco.'
          }
        ]
      }
    ]
  },
  {
    id: 'economia',
    title: 'Economía y Finanzas',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#2e7d32',
    keywords: ['dinero', 'mercado', 'inversión', 'negocios', 'finanzas'],
    icon: { family: 'Ionicons', name: 'cash' },
    subcategories: [
      {
        id: 'eco-basica',
        title: 'Conceptos Básicos',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['oferta', 'demanda', 'inflación', 'pib'],
        icon: { family: 'Ionicons', name: 'stats-chart' },
        subcategories: [
          {
            id: 'eco-basica-oferta-demanda',
            title: 'Oferta y Demanda',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['precio', 'mercado', 'equilibrio'],
            icon: { family: 'Ionicons', name: 'swap-vertical' },
            content: 'Ley fundamental del mercado: si la demanda supera la oferta, los precios suben; si la oferta supera la demanda, los precios bajan.'
          },
          {
            id: 'eco-basica-inflacion',
            title: 'Inflación',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['precios', 'moneda', 'poder adquisitivo'],
            icon: { family: 'Ionicons', name: 'trending-up' },
            content: 'Aumento generalizado y sostenido de los precios de bienes y servicios. Reduce el poder adquisitivo de la moneda.'
          }
        ]
      },
      {
        id: 'eco-finanzas',
        title: 'Finanzas Personales',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['ahorro', 'inversión', 'presupuesto'],
        icon: { family: 'Ionicons', name: 'wallet' },
        subcategories: [
          {
            id: 'eco-finanzas-interes-compuesto',
            title: 'Interés Compuesto',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['crecimiento', 'tiempo', 'ganancia'],
            icon: { family: 'Ionicons', name: 'snow' }, // Snowball effect
            content: 'Es el interés sobre el interés. Las ganancias se reinvierten para generar más ganancias, creando un crecimiento exponencial a largo plazo.'
          }
        ]
      }
    ]
  },
  {
    id: 'filosofia',
    title: 'Filosofía',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#455a64',
    keywords: ['pensamiento', 'ética', 'lógica', 'razón', 'sabiduría'],
    icon: { family: 'Ionicons', name: 'bulb' },
    subcategories: [
      {
        id: 'filo-ramas',
        title: 'Ramas Principales',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['metafísica', 'epistemología', 'ética'],
        icon: { family: 'Ionicons', name: 'git-network' },
        subcategories: [
          {
            id: 'filo-ramas-etica',
            title: 'Ética',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['moral', 'bien', 'mal', 'conducta'],
            icon: { family: 'Ionicons', name: 'scale' },
            content: 'Estudia el comportamiento humano y las nociones de bien y mal, deber, felicidad y bienestar común.'
          },
          {
            id: 'filo-ramas-logica',
            title: 'Lógica',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['razonamiento', 'argumentos', 'falacias'],
            icon: { family: 'Ionicons', name: 'git-merge' },
            content: 'Estudia los principios de la demostración y la inferencia válida. Analiza la estructura de los argumentos para determinar su corrección.'
          }
        ]
      },
      {
        id: 'filo-historia',
        title: 'Historia',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['sócrates', 'platón', 'aristóteles', 'kant'],
        icon: { family: 'Ionicons', name: 'time' },
        subcategories: [
          {
            id: 'filo-historia-antigua',
            title: 'Filosofía Griega',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['atenas', 'academia', 'liceo'],
            icon: { family: 'Ionicons', name: 'partly-sunny' },
            content: 'Cuna de la filosofía occidental. Sócrates (método socrático), Platón (teoría de las ideas) y Aristóteles (lógica, biología) son sus máximos exponentes.'
          }
        ]
      }
    ]
  },
  {
    id: 'psicologia',
    title: 'Psicología',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#9c27b0', // Reuse purple variant
    keywords: ['mente', 'conducta', 'terapia', 'freud'],
    icon: { family: 'Ionicons', name: 'head' }, // Custom handling for head? or happy-outline
    subcategories: [
      {
        id: 'psico-corrientes',
        title: 'Corrientes',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['psicoanálisis', 'cognitivo', 'humanismo'],
        icon: { family: 'Ionicons', name: 'layers' },
        subcategories: [
          {
            id: 'psico-corrientes-freud',
            title: 'Psicoanálisis',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['inconsciente', 'sueños', 'freud'],
            icon: { family: 'Ionicons', name: 'bed' },
            content: 'Fundado por Sigmund Freud. Enfatiza la influencia del inconsciente, los sueños y la infancia en el comportamiento y la personalidad.'
          },
          {
            id: 'psico-corrientes-tcc',
            title: 'Cognitivo-Conductual',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['pensamientos', 'conducta', 'terapia'],
            icon: { family: 'Ionicons', name: 'settings' },
            content: 'Se centra en identificar y cambiar patrones de pensamiento y comportamiento negativos. Es muy eficaz para tratar ansiedad y depresión.'
          }
        ]
      }
    ]
  },
  {
    id: 'idiomas',
    title: 'Idiomas',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#3f51b5',
    keywords: ['inglés', 'francés', 'aprender', 'gramática', 'vocabulario'],
    icon: { family: 'Ionicons', name: 'language' },
    subcategories: [
      {
        id: 'idiomas-ingles',
        title: 'Inglés',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['verbos', 'tiempos', 'grammar'],
        icon: { family: 'Ionicons', name: 'chatbubbles' },
        subcategories: [
          {
            id: 'idiomas-ingles-tiempos',
            title: 'Tiempos Verbales',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['present simple', 'past continuous', 'future'],
            icon: { family: 'Ionicons', name: 'time' },
            content: 'Present Simple (hábitos), Present Continuous (ahora), Past Simple (acción terminada), Future "Will" vs "Going to".'
          },
          {
            id: 'idiomas-ingles-vocabulario',
            title: 'Vocabulario Viajes',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['airport', 'hotel', 'restaurant'],
            icon: { family: 'Ionicons', name: 'airplane' },
            content: 'Palabras clave: Flight (vuelo), Booking (reserva), Check-in, Luggage (equipaje), Bill (cuenta), Ticket (boleto).'
          }
        ]
      },
      {
        id: 'idiomas-frances',
        title: 'Francés',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['bonjour', 'merci', 'paris'],
        icon: { family: 'Ionicons', name: 'flag' },
        subcategories: [
          {
            id: 'idiomas-frances-basico',
            title: 'Frases Básicas',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['saludos', 'cortesía'],
            icon: { family: 'Ionicons', name: 'chatbox' },
            content: 'Bonjour (Hola/Buenos días), Au revoir (Adiós), Merci (Gracias), S\'il vous plaît (Por favor), Je m\'appelle... (Me llamo...).'
          }
        ]
      }
    ]
  },
  {
    id: 'mitologia',
    title: 'Mitología',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#fbc02d',
    keywords: ['dioses', 'héroes', 'leyendas', 'griega', 'nórdica'],
    icon: { family: 'Ionicons', name: 'thunderstorm' },
    subcategories: [
      {
        id: 'mito-griega',
        title: 'Mitología Griega',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['zeus', 'olimpo', 'hades'],
        icon: { family: 'Ionicons', name: 'partly-sunny' },
        subcategories: [
          {
            id: 'mito-griega-zeus',
            title: 'Zeus',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['rayo', 'rey', 'cronos'],
            icon: { family: 'Ionicons', name: 'flash' },
            content: 'Rey de los dioses y gobernante del monte Olimpo. Dios del cielo y el trueno. Sus símbolos son el rayo, el águila y el roble.'
          },
          {
            id: 'mito-griega-hades',
            title: 'Hades',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['inframundo', 'muerte', 'cerbero'],
            icon: { family: 'Ionicons', name: 'skull' },
            content: 'Dios del inframundo y de los muertos. Hermano de Zeus y Poseidón. Posee un casco que lo hace invisible.'
          }
        ]
      },
      {
        id: 'mito-nordica',
        title: 'Mitología Nórdica',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['thor', 'odin', 'vikingos', 'asgard'],
        icon: { family: 'Ionicons', name: 'hammer' },
        subcategories: [
          {
            id: 'mito-nordica-thor',
            title: 'Thor',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['martillo', 'mjolnir', 'trueno'],
            icon: { family: 'Ionicons', name: 'hammer' },
            content: 'Dios del trueno, la fuerza y la protección de la humanidad. Empuña el martillo Mjölnir.'
          },
          {
            id: 'mito-nordica-odin',
            title: 'Odín',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['padre de todo', 'sabiduría', 'cuervos'],
            icon: { family: 'Ionicons', name: 'eye' },
            content: 'El Padre de Todo. Dios de la sabiduría, la guerra y la muerte. Sacrificó un ojo para obtener conocimiento.'
          }
        ]
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing y Negocios',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#ff9800',
    keywords: ['ventas', 'publicidad', 'empresa', 'startup'],
    icon: { family: 'Ionicons', name: 'trending-up' },
    subcategories: [
      {
        id: 'mkt-digital',
        title: 'Marketing Digital',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['seo', 'redes sociales', 'ads'],
        icon: { family: 'Ionicons', name: 'wifi' },
        subcategories: [
          {
            id: 'mkt-digital-seo',
            title: 'SEO',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['google', 'posicionamiento', 'keywords'],
            icon: { family: 'Ionicons', name: 'search' },
            content: 'Search Engine Optimization. Conjunto de técnicas para mejorar la visibilidad de un sitio web en los resultados orgánicos de los buscadores.'
          }
        ]
      },
      {
        id: 'mkt-emprendimiento',
        title: 'Emprendimiento',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['startup', 'lean', 'modelo de negocio'],
        icon: { family: 'Ionicons', name: 'rocket' },
        subcategories: [
          {
            id: 'mkt-emprendimiento-lean',
            title: 'Lean Startup',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['mvp', 'validación', 'pivotar'],
            icon: { family: 'Ionicons', name: 'bulb' },
            content: 'Metodología para desarrollar negocios y productos. Se basa en el aprendizaje validado, la experimentación rápida y el lanzamiento de Productos Mínimos Viables (MVP).'
          }
        ]
      }
    ]
  },
  {
    id: 'jardineria',
    title: 'Jardinería',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#81c784',
    keywords: ['plantas', 'flores', 'huerto', 'naturaleza'],
    icon: { family: 'Ionicons', name: 'flower' },
    subcategories: [
      {
        id: 'jardin-huerto',
        title: 'Huerto Urbano',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['tomates', 'aromáticas', 'cultivo'],
        icon: { family: 'Ionicons', name: 'leaf' },
        subcategories: [
          {
            id: 'jardin-huerto-aromaticas',
            title: 'Hierbas Aromáticas',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['albahaca', 'menta', 'romero'],
            icon: { family: 'Ionicons', name: 'nutrition' },
            content: 'Fáciles de cultivar en macetas. Necesitan sol directo (al menos 4-6 horas) y buen drenaje. Ideales para cocinar.'
          }
        ]
      },
      {
        id: 'jardin-cuidados',
        title: 'Cuidados Básicos',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['riego', 'luz', 'tierra'],
        icon: { family: 'Ionicons', name: 'water' },
        subcategories: [
          {
            id: 'jardin-cuidados-riego',
            title: 'El Riego',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['agua', 'frecuencia', 'humedad'],
            icon: { family: 'Ionicons', name: 'water' },
            content: 'El exceso de agua es la causa #1 de muerte de plantas. Comprobar la humedad de la tierra antes de regar (dedo o palillo).'
          }
        ]
      }
    ]
  },
  {
    id: 'mecanica',
    title: 'Mecánica Automotriz',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#607d8b',
    keywords: ['autos', 'motor', 'reparación', 'taller'],
    icon: { family: 'Ionicons', name: 'car' },
    subcategories: [
      {
        id: 'mecanica-motor',
        title: 'El Motor',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['combustión', 'cilindros', 'aceite'],
        icon: { family: 'Ionicons', name: 'cog' },
        subcategories: [
          {
            id: 'mecanica-motor-ciclo',
            title: 'Ciclo 4 Tiempos',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['admisión', 'compresión', 'explosión', 'escape'],
            icon: { family: 'Ionicons', name: 'refresh' },
            content: '1. Admisión (entra mezcla). 2. Compresión (pistón sube). 3. Explosión/Expansión (chispa bujía). 4. Escape (salen gases).'
          }
        ]
      },
      {
        id: 'mecanica-mantenimiento',
        title: 'Mantenimiento',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['aceite', 'filtros', 'neumáticos'],
        icon: { family: 'Ionicons', name: 'construct' },
        subcategories: [
          {
            id: 'mecanica-mantenimiento-aceite',
            title: 'Cambio de Aceite',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['lubricación', 'viscosidad', 'filtro'],
            icon: { family: 'Ionicons', name: 'water' },
            content: 'Vital para lubricar el motor. Se debe cambiar según el kilometraje (ej. cada 10.000 km) o tiempo (1 año). Cambiar filtro también.'
          }
        ]
      }
    ]
  },
  {
    id: 'derecho',
    title: 'Derecho y Leyes',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#7986cb',
    keywords: ['ley', 'justicia', 'abogado', 'constitución'],
    icon: { family: 'Ionicons', name: 'briefcase' },
    subcategories: [
      {
        id: 'derecho-ddhh',
        title: 'Derechos Humanos',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['onu', 'libertad', 'igualdad'],
        icon: { family: 'Ionicons', name: 'people' },
        subcategories: [
          {
            id: 'derecho-ddhh-universal',
            title: 'Declaración Universal',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['1948', 'dignidad', 'derechos'],
            icon: { family: 'Ionicons', name: 'globe' },
            content: 'Adoptada por la ONU en 1948. Establece que todos los seres humanos nacen libres e iguales en dignidad y derechos.'
          }
        ]
      }
    ]
  },
  {
    id: 'arquitectura',
    title: 'Arquitectura',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#795548',
    keywords: ['edificios', 'diseño', 'construcción', 'estilos'],
    icon: { family: 'Ionicons', name: 'business' },
    subcategories: [
      {
        id: 'arq-estilos',
        title: 'Estilos Arquitectónicos',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['gótico', 'barroco', 'moderno'],
        icon: { family: 'Ionicons', name: 'easel' },
        subcategories: [
          {
            id: 'arq-estilos-gotico',
            title: 'Gótico',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['catedrales', 'arcos', 'vitrales'],
            icon: { family: 'Ionicons', name: 'triangle' },
            content: 'Estilo medieval (s. XII-XV) caracterizado por arcos apuntados, bóvedas de crucería y grandes vitrales. Ejemplo: Notre Dame.'
          },
          {
            id: 'arq-estilos-moderno',
            title: 'Modernismo',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['gaudí', 'formas orgánicas', 'siglo xx'],
            icon: { family: 'Ionicons', name: 'flower' },
            content: 'Movimiento de finales del s. XIX y principios del XX. Busca romper con la tradición, usando líneas curvas y asimetría. Ejemplo: La Sagrada Familia.'
          }
        ]
      },
      {
        id: 'arq-elementos',
        title: 'Elementos Constructivos',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['columna', 'cúpula', 'arco'],
        icon: { family: 'Ionicons', name: 'construct' },
        subcategories: [
          {
            id: 'arq-elementos-columna',
            title: 'Columnas',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['dórico', 'jónico', 'corintio'],
            icon: { family: 'Ionicons', name: 'pause' }, // Looks like columns
            content: 'Soportes verticales. En la arquitectura clásica griega hay tres órdenes principales: Dórico (simple), Jónico (volutas) y Corintio (hojas de acanto).'
          }
        ]
      }
    ]
  },
  {
    id: 'fotografia',
    title: 'Fotografía',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#607d8b',
    keywords: ['cámara', 'fotos', 'luz', 'arte'],
    icon: { family: 'Ionicons', name: 'camera' },
    subcategories: [
      {
        id: 'foto-tecnica',
        title: 'Técnica Fotográfica',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['iso', 'apertura', 'velocidad'],
        icon: { family: 'Ionicons', name: 'settings' },
        subcategories: [
          {
            id: 'foto-tecnica-triangulo',
            title: 'Triángulo de Exposición',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['luz', 'exposición', 'sensor'],
            icon: { family: 'Ionicons', name: 'triangle' },
            content: 'Equilibrio entre Apertura (diafragma), Velocidad de obturación (tiempo) e ISO (sensibilidad del sensor) para lograr la exposición correcta.'
          },
          {
            id: 'foto-tecnica-apertura',
            title: 'Apertura (f)',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['diafragma', 'profundidad de campo', 'luz'],
            icon: { family: 'Ionicons', name: 'aperture' },
            content: 'Controla la cantidad de luz que entra y la profundidad de campo (fondo borroso). Un número f bajo (f/1.8) es mucha luz y fondo desenfocado.'
          }
        ]
      },
      {
        id: 'foto-composicion',
        title: 'Composición',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['reglas', 'encuadre', 'mirada'],
        icon: { family: 'Ionicons', name: 'image' },
        subcategories: [
          {
            id: 'foto-comp-tercios',
            title: 'Regla de los Tercios',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['cuadrícula', 'intersección', 'interés'],
            icon: { family: 'Ionicons', name: 'grid' },
            content: 'Divide la imagen en 9 partes iguales (2 líneas horizontales y 2 verticales). Coloca los elementos importantes en las intersecciones.'
          }
        ]
      }
    ]
  },
  {
    id: 'videojuegos',
    title: 'Videojuegos',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#9c27b0',
    keywords: ['gaming', 'consolas', 'pc', 'esports'],
    icon: { family: 'Ionicons', name: 'game-controller' },
    subcategories: [
      {
        id: 'games-generos',
        title: 'Géneros',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['rpg', 'fps', 'aventura'],
        icon: { family: 'Ionicons', name: 'list' },
        subcategories: [
          {
            id: 'games-generos-rpg',
            title: 'RPG (Rol)',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['personaje', 'nivel', 'historia'],
            icon: { family: 'Ionicons', name: 'people' },
            content: 'Role-Playing Game. El jugador controla las acciones de un personaje inmerso en un mundo detallado, mejorando sus habilidades (level up).'
          },
          {
            id: 'games-generos-fps',
            title: 'FPS (Shooter)',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['disparos', 'primera persona', 'acción'],
            icon: { family: 'Ionicons', name: 'crosshair' },
            content: 'First-Person Shooter. Juegos de disparos en primera persona, donde ves la acción desde los ojos del protagonista.'
          }
        ]
      },
      {
        id: 'games-historia',
        title: 'Historia Gaming',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['retro', 'arcade', 'nintendo'],
        icon: { family: 'Ionicons', name: 'time' },
        subcategories: [
          {
            id: 'games-historia-arcade',
            title: 'Era Arcade',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['pacman', 'fichas', '80s'],
            icon: { family: 'Ionicons', name: 'logo-game-controller-b' },
            content: 'Años 70 y 80. Máquinas recreativas en salones públicos. Clásicos como Pac-Man, Space Invaders y Donkey Kong definieron la industria.'
          }
        ]
      }
    ]
  },
  {
    id: 'moda',
    title: 'Moda y Estilo',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#e91e63',
    keywords: ['ropa', 'diseño', 'tendencias', 'telas'],
    icon: { family: 'Ionicons', name: 'shirt' },
    subcategories: [
      {
        id: 'moda-historia',
        title: 'Historia de la Moda',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['coco chanel', 'dior', 'siglo xx'],
        icon: { family: 'Ionicons', name: 'time' },
        subcategories: [
          {
            id: 'moda-historia-coco',
            title: 'Coco Chanel',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['elegancia', 'mujer moderna', 'francia'],
            icon: { family: 'Ionicons', name: 'woman' },
            content: 'Revolucionó la moda femenina en el siglo XX, liberando a las mujeres de los corsés y popularizando el uso de pantalones y el "Little Black Dress".'
          }
        ]
      },
      {
        id: 'moda-textiles',
        title: 'Textiles',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['telas', 'algodón', 'seda', 'sintético'],
        icon: { family: 'Ionicons', name: 'cut' },
        subcategories: [
          {
            id: 'moda-textiles-naturales',
            title: 'Fibras Naturales',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['algodón', 'lana', 'seda', 'lino'],
            icon: { family: 'Ionicons', name: 'leaf' },
            content: 'Provienen de plantas o animales. El algodón es suave y transpirable; la lana es cálida; la seda es lujosa y brillante.'
          }
        ]
      }
    ]
  },
  {
    id: 'politica',
    title: 'Política',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#607d8b',
    keywords: ['gobierno', 'democracia', 'leyes', 'sociedad'],
    icon: { family: 'Ionicons', name: 'podium' },
    subcategories: [
      {
        id: 'pol-sistemas',
        title: 'Sistemas Políticos',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['democracia', 'monarquía', 'dictadura'],
        icon: { family: 'Ionicons', name: 'globe' },
        subcategories: [
          {
            id: 'pol-sistemas-democracia',
            title: 'Democracia',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['voto', 'pueblo', 'elecciones'],
            icon: { family: 'Ionicons', name: 'people' },
            content: 'Sistema donde el poder reside en la ciudadanía, que lo ejerce directamente o a través de representantes elegidos.'
          }
        ]
      },
      {
        id: 'pol-ideologias',
        title: 'Ideologías',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['izquierda', 'derecha', 'liberalismo'],
        icon: { family: 'Ionicons', name: 'bulb' },
        subcategories: [
          {
            id: 'pol-ideologias-liberalismo',
            title: 'Liberalismo',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['libertad individual', 'mercado', 'propiedad'],
            icon: { family: 'Ionicons', name: 'open' },
            content: 'Defiende la libertad individual, la igualdad ante la ley y la limitación de los poderes del Estado.'
          }
        ]
      }
    ]
  },
  {
    id: 'ecologia',
    title: 'Ecología y Ambiente',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#4caf50',
    keywords: ['naturaleza', 'reciclaje', 'cambio climático', 'energía'],
    icon: { family: 'Ionicons', name: 'leaf' },
    subcategories: [
      {
        id: 'eco-problemas',
        title: 'Problemas Ambientales',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['calentamiento', 'plástico', 'extinción'],
        icon: { family: 'Ionicons', name: 'warning' },
        subcategories: [
          {
            id: 'eco-problemas-cambio',
            title: 'Cambio Climático',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['efecto invernadero', 'temperatura', 'co2'],
            icon: { family: 'Ionicons', name: 'thermometer' },
            content: 'Aumento de la temperatura global debido a la acumulación de gases de efecto invernadero (como CO2) por actividades humanas.'
          }
        ]
      },
      {
        id: 'eco-soluciones',
        title: 'Soluciones',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['reciclaje', 'renovables', 'sostenibilidad'],
        icon: { family: 'Ionicons', name: 'happy' },
        subcategories: [
          {
            id: 'eco-soluciones-3r',
            title: 'Las 3 R',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['reducir', 'reutilizar', 'reciclar'],
            icon: { family: 'Ionicons', name: 'refresh' },
            content: 'Regla para cuidar el ambiente: Reducir el consumo, Reutilizar lo que se pueda y Reciclar los materiales para nuevos usos.'
          }
        ]
      }
    ]
  },
  {
    id: 'crypto',
    title: 'Criptomonedas',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#ffc107',
    keywords: ['bitcoin', 'blockchain', 'inversión', 'digital'],
    icon: { family: 'Ionicons', name: 'logo-bitcoin' },
    subcategories: [
      {
        id: 'crypto-monedas',
        title: 'Principales Monedas',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['btc', 'eth', 'altcoins'],
        icon: { family: 'Ionicons', name: 'cash' },
        subcategories: [
          {
            id: 'crypto-monedas-bitcoin',
            title: 'Bitcoin (BTC)',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['satoshi', 'oro digital', 'primera'],
            icon: { family: 'Ionicons', name: 'logo-bitcoin' },
            content: 'La primera criptomoneda, creada por Satoshi Nakamoto en 2009. Funciona como dinero digital descentralizado y reserva de valor.'
          },
          {
            id: 'crypto-monedas-ethereum',
            title: 'Ethereum (ETH)',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['contratos inteligentes', 'vitalik', 'apps'],
            icon: { family: 'Ionicons', name: 'code' },
            content: 'Plataforma que permite crear contratos inteligentes y aplicaciones descentralizadas (DApps), más allá de ser solo dinero.'
          }
        ]
      },
      {
        id: 'crypto-tech',
        title: 'Tecnología',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['blockchain', 'minería', 'wallets'],
        icon: { family: 'Ionicons', name: 'hardware-chip' },
        subcategories: [
          {
            id: 'crypto-tech-blockchain',
            title: 'Blockchain',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['cadena de bloques', 'seguridad', 'inmutable'],
            icon: { family: 'Ionicons', name: 'link' },
            content: 'Libro de contabilidad digital, distribuido y seguro. Registra transacciones en bloques enlazados criptográficamente, imposible de modificar.'
          }
        ]
      }
    ]
  },
  {
    id: 'yoga',
    title: 'Yoga y Meditación',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#ab47bc',
    keywords: ['relajación', 'posturas', 'mente', 'paz'],
    icon: { family: 'Ionicons', name: 'body' },
    subcategories: [
      {
        id: 'yoga-estilos',
        title: 'Estilos de Yoga',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['hatha', 'vinyasa', 'kundalini'],
        icon: { family: 'Ionicons', name: 'fitness' },
        subcategories: [
          {
            id: 'yoga-estilos-hatha',
            title: 'Hatha Yoga',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['básico', 'equilibrio', 'respiración'],
            icon: { family: 'Ionicons', name: 'body' },
            content: 'Estilo clásico enfocado en posturas físicas (asanas) y respiración para preparar el cuerpo para la meditación.'
          }
        ]
      },
      {
        id: 'yoga-meditacion',
        title: 'Meditación',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['mindfulness', 'zen', 'calma'],
        icon: { family: 'Ionicons', name: 'sunny' },
        subcategories: [
          {
            id: 'yoga-meditacion-mindfulness',
            title: 'Mindfulness',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['atención plena', 'presente', 'conciencia'],
            icon: { family: 'Ionicons', name: 'eye' },
            content: 'Atención plena. Consiste en prestar atención al momento presente de manera intencional y sin juzgar.'
          }
        ]
      }
    ]
  },
  {
    id: 'bricolaje',
    title: 'Bricolaje (DIY)',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#ff5722',
    keywords: ['reparación', 'hogar', 'herramientas', 'madera'],
    icon: { family: 'Ionicons', name: 'hammer' },
    subcategories: [
      {
        id: 'diy-herramientas',
        title: 'Herramientas Básicas',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['martillo', 'destornillador', 'taladro'],
        icon: { family: 'Ionicons', name: 'construct' },
        subcategories: [
          {
            id: 'diy-herramientas-kit',
            title: 'Kit de Inicio',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['básicos', 'caja', 'arreglos'],
            icon: { family: 'Ionicons', name: 'briefcase' },
            content: 'Imprescindibles: Martillo, destornilladores (plano y estrella), cinta métrica, llave inglesa, alicates y nivel.'
          }
        ]
      },
      {
        id: 'diy-madera',
        title: 'Carpintería',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['lijar', 'barniz', 'muebles'],
        icon: { family: 'Ionicons', name: 'cut' },
        subcategories: [
          {
            id: 'diy-madera-acabados',
            title: 'Acabados',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['lija', 'pintura', 'protección'],
            icon: { family: 'Ionicons', name: 'brush' },
            content: 'Lijar siempre en sentido de la veta. Usar barniz o aceite para proteger la madera de la humedad y realzar su color.'
          }
        ]
      }
    ]
  },
  {
    id: 'turismo',
    title: 'Turismo y Viajes',
    titleColor: '#333333',
    tagColor: '#555555',
    color: '#00bcd4',
    keywords: ['viajar', 'mundo', 'avión', 'culturas'],
    icon: { family: 'Ionicons', name: 'airplane' },
    subcategories: [
      {
        id: 'turismo-tipos',
        title: 'Tipos de Turismo',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['aventura', 'cultural', 'gastronómico'],
        icon: { family: 'Ionicons', name: 'map' },
        subcategories: [
          {
            id: 'turismo-tipos-mochilero',
            title: 'Mochilero',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['low cost', 'hostel', 'aventura'],
            icon: { family: 'Ionicons', name: 'walk' },
            content: 'Viajar de forma económica, generalmente con mochila, alojándose en hostales y priorizando experiencias sobre lujos.'
          },
          {
            id: 'turismo-tipos-sostenible',
            title: 'Ecoturismo',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['naturaleza', 'respeto', 'impacto cero'],
            icon: { family: 'Ionicons', name: 'leaf' },
            content: 'Viajar responsablemente a áreas naturales, conservando el medio ambiente y mejorando el bienestar de la población local.'
          }
        ]
      },
      {
        id: 'turismo-consejos',
        title: 'Tips de Viaje',
        titleColor: '#ffffff',
        tagColor: '#eeeeee',
        keywords: ['maleta', 'documentos', 'seguridad'],
        icon: { family: 'Ionicons', name: 'information-circle' },
        subcategories: [
          {
            id: 'turismo-consejos-pack',
            title: 'Hacer la Maleta',
            titleColor: '#333333',
            tagColor: '#555555',
            keywords: ['ropa', 'espacio', 'enrollar'],
            icon: { family: 'Ionicons', name: 'briefcase' },
            content: 'Enrollar la ropa ahorra espacio y evita arrugas. Llevar siempre un botiquín básico y adaptadores de enchufe universales.'
          }
        ]
      }
    ]
  }
];
