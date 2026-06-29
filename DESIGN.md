# SOLEMNE 2

---

# Mockups  
Boceto a mano pantalla de titulo  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Imagenes_conceptos_DESIGN/boceto_titulo.jpeg)  

Boceto a mano gameplay  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Imagenes_conceptos_DESIGN/boceto_gameplay.jpeg)  

Concepto digital pantalla de titulo  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Imagenes_conceptos_DESIGN/concepto_titulo.png)  

Concepto digital gameplay (1)  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Imagenes_conceptos_DESIGN/gameplay(1).png)  

Concepto digital gameplay (2)  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Imagenes_conceptos_DESIGN/gameplay(2).png)  

Concepto digital gameplay (3)  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Imagenes_conceptos_DESIGN/gameplay(3).png)  

---

# Especificaciones de tecnología  
## Framework Base: Vue 3 (Vite)  
Cuenta con una alta eficiencia en el manejo del DOM para la interfaz de usuario (menús, HUD).  
## Motor de juego: Phaser 3  
Cuenta con un alto rendimiento, ideal para este tipo de juego teniendo en cuenta la cantidad de proyectiles. Cuenta con un motor de físicas integrado llamado Arcade, ideal para realizar la idea de un shooter 2D, ya que lo podemos utilizar para gestionar hitboxes con un bajo costo de rendimiento.  
Es un framework "Opensource" y altamente documentado, por lo que a la hora de investigar como realizar cierta función, utilizar alguna heramienta en especifico o como arreglar algun error, es fácil encontrar ayuda en internet.  

---

## Estructura de carpetas

---

Solemne_2/  
├── .github/  
│   └── workflows/                   # Configuración de GitHub Actions (CI/CD)  
├── Imagenes_conceptos_DESIGN/       # Carpeta que contiene mockups y bocetos  
├── frontend/                        # Carpeta principal del juego (visuales y gameplay)  
│   ├── public/                      # Recursos estáticos (imágenes, sonidos) que se sirven directamente  
│   └── src/                         # Código fuente de la aplicación Vue y Phaser  
│       ├── assets/                  # Recursos de Vue procesados por Vite (CSS, etc.)  
│       ├── components/              # Componentes de la interfaz de usuario de Vue (.vue)  
│       ├── game/                    # Lógica principal del juego gestionada por Phaser  
│       │   ├── entities/            # Clases para entidades del juego (Jugador, Bala, etc.)  
│       │   ├── scenes/              # Escenas del juego (Menú, Partida, etc.)  
│       │   └── utils/               # Funciones de utilidad para la lógica del juego  
│       ├── state/                   # Estado global reactivo de la aplicación  
│       └── test/                    # Pruebas unitarias con Vitest  
└── backend/                         # API REST con Node.js, Express y TypeScript  
    └── src/  
        ├── config/                  # Configuración de la aplicación (ej. conexión a DB)  
        ├── controllers/             # Lógica que maneja las peticiones y respuestas HTTP  
        ├── middlewares/             # Funciones que se ejecutan antes de los controladores (auth, errores)  
        ├── models/                  # Esquemas y modelos de la base de datos (Mongoose)  
        ├── routes/                  # Definición de los endpoints de la API  
        ├── schemas/                 # Esquemas de validación de datos (Zod)  
        ├── services/                # Lógica de negocio principal de la aplicación  
        ├── types/                   # Definiciones de tipos e interfaces de TypeScript  
        └── utils/                   # Funciones de utilidad compartidas en el backend  

---

## Dependencias principales  
Las principales dependencias a ser instaladas utilizando pnpm seran: Vue, Phaser, Typescript, Vite, Vitest, Prettier.  

---

# Descripción del juego  
Juego para dos jugadores, competitivo 1 contra 1, ambos son puestos en un escenario, sobre el cual apareceran en lados opuestos sin armas, deben recolectar un arma de las que aparecen sobre el escenario al inicio de la ronda, pudiendo moverse y saltar, con el fin de utilizar una de estas armas para disparar al otro jugador y ganar, el primero en ganar 3 rondas gana la partida.

---

# SOLEMNE 3

El proyecto evoluciona desde un juego local 1v1 desarrollado con Vue, Phaser y Vite hacia una aplicacion web fullstack. La nueva arquitectura incorpora un backend REST con Node.js, Express y TypeScript, una base de datos MongoDB para persistencia de usuarios, configuraciones y partidas, y una integracion con un servicio REST externo.

---

# Arquitectura Fullstack

## Frontend

El frontend se encuentra en la carpeta `frontend/`, con una estructura Vue + Phaser. Vue se encarga de la interfaz, menus, HUD y futuras pantallas de login/perfil. Phaser gestiona la logica visual e interactiva del juego.

## Backend

El backend se encuentra en la carpeta `backend/` y expone una API REST construida con Node.js, Express y TypeScript. Su responsabilidad es gestionar usuarios, autenticacion, configuraciones, historial de partidas y estadisticas.

## Base de Datos

MongoDB se utiliza como base de datos principal. La conexion se realiza desde el backend mediante Mongoose.

---

# Modelo de Datos

## User

Representa una cuenta de jugador registrada.

Campos principales:
- username
- email
- passwordHash
- createdAt
- updatedAt

## PlayerSettings

Representa las preferencias guardadas por usuario.

Campos principales:
- userId
- preferredColor
- selectedSkin
- musicEnabled
- sfxEnabled
- countryCode

## Match

Representa una partida jugada.

Campos principales:
- mode: local | online
- players: [{ userId, slot }]
- winnerUserId
- winnerSlot
- durationSeconds
- p1Color
- p2Color
- playedAt

---

# Endpoints Principales

## Health

GET /api/health  
Verifica que el backend este funcionando.

GET /api/health/db  
Verifica la conexion con MongoDB.

## Autenticacion

POST /api/auth/register  
Registra un nuevo usuario.

POST /api/auth/login  
Permite iniciar sesion.

## Usuarios

GET /api/users/:id  
Obtiene informacion publica de un usuario.

## Configuraciones

GET /api/settings/:userId  
Obtiene las preferencias de un jugador.

PUT /api/settings/:userId  
Actualiza color, skin, sonido u otras preferencias.

## Partidas

POST /api/matches  
Guarda el resultado de una partida.

GET /api/matches  
Lista partidas registradas.

GET /api/matches/user/:userId  
Lista partidas de un usuario.

## Estadisticas

GET /api/stats/:userId  
Obtiene victorias, derrotas, partidas jugadas y win rate.

---

# Servicio REST Externo

(por determinar)

---

## Mejoras y adiciones

- Mejorar consistencia tamaño personajes
- Mejorar animaciones de personaje
- Añadir personajes distintos
- Añadir distintas plataformas
- Añadir mas escenarios con distintas tematicas
- Añadir mas elementos ineteractivos para los escenarios
- Mejorar diseño de plataformas
- Añadir plataformas moviles
- Añadir mecanicas para tirar armas
- Añadir mas puntos de respawn aleatorios
- Añadir indicador de balas
- Añadir efectos visuales
- Añadir mas efectos de sonido
- Añadir musica (gameplays y menus)
- Pantalla de registro.
- Pantalla de login.
- Seleccion de Jugador 1 y Jugador 2 para modo local.
- Perfil de usuario.
- Estadisticas del jugador.
- Historial de partidas.
- Configuración de preferencias.
