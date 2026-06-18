# SOLEMNE 2

---

# Mockups  
Boceto a mano pantalla de titulo  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/boceto_titulo.jpeg)  

Boceto a mano gameplay  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/boceto_gameplay.jpeg)  

Concepto digital pantalla de titulo  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/concepto_titulo.png)  

Concepto digital gameplay (1)  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/gameplay(1).png)  

Concepto digital gameplay (2)  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/gameplay(2).png)  

Concepto digital gameplay (3)  
![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/gameplay(3).png)  

---

# Especificaciones de tecnología  
## Framework Base: Vue 3 (Vite)  
Cuenta con una alta eficiencia en el manejo del DOM para la interfaz de usuario (menús, HUD).  
## Motor de juego: Phaser 3  
Cuenta con un alto rendimiento, ideal para este tipo de juego teniendo en cuenta la cantidad de proyectiles. Cuenta con un motor de físicas integrado llamado Arcade, ideal para realizar la idea de un shooter 2D, ya que lo podemos utilizar para gestionar hitboxes con un bajo costo de rendimiento.  
Es un framework "Opensource" y altamente documentado, por lo que a la hora de investigar como realizar cierta función, utilizar alguna heramienta en especifico o como arreglar algun error, es fácil encontrar ayuda en internet.  

---

##Estructura de carpetas

---

Solemne_2/  
├── .github/  
│   └── workflows/  
│       └── main.yml                 #Configuración de GitHub Actions (CI/CD)  
├── Img_DSG/                         #Carpeta que contiene mockups y bocetos  
├── 1v1_shooter/                     #Carpeta principal del juego  
│   ├── public/  
│   ├── src/                         #Código fuente  
│   │   ├── assets/                  #Recursos de Vue  
│   │   ├── components/              #Componentes reactivos de Vue UI  
│   │   │   └── GameContainer.vue    #Contenedor que monta el canvas de Phaser  
│   │   ├── game/                    #Ecosistema exclusivo del motor Phaser  
│   │   │   ├── entities/            #Carpeta para clases de Jugadores/Balas  
│   │   │   │   └── Weapon.ts        #Clases con rango y velocidad de armas  
│   │   │   └── scenes/  
│   │   │   │   └── PlayScene.ts     #Lógica del juego, suelo, plataformas  
│   │   │   └── utils/  
│   │   │       ├── gameLogic.ts     #Logica de condiciones de victoria/empate  
│   │   │       ├── physicsLogic.ts  #Logica de físicas y movimiento  
│   │   │       ├── weaponLogic.ts   #Lógica de disparo  
│   │   │       └── playerLogic.ts   #Lógica de daño a jugadores  
│   │   ├── state/                   #Directorio de estado global  
│   │   │   └── uiState.ts           #Puente reactivo entre Vue y Phaser para manejar la UI (Vidas y colores)  
│   │   ├── tests/                   #Pruebas unitarias  
│   │   │   ├── gameLogic.test.ts    #Pruebas unitarias de condiciones de victoria/empate  
│   │   │   ├── physicsLogic.test.ts #Pruebas unitarias de físicas y movimiento  
│   │   │   ├── weaponLogic.test.ts  #Pruebas unitarias de armas  
│   │   │   └── playerLogic.test.ts  #Pruebas unitarias de daño a jugadores  
│   │   ├── App.vue                  #Componente raíz de la interfaz Vue  
│   │   ├── main.ts                  #Punto de arranque de Vue  
│   │   └── style.css                #Estilos globales de la página  
├── backend/                         #API REST Node + Express + TypeScript  
│   ├── src/  
│   │   ├── config/                  #Conexion a MongoDB  
│   │   ├── controllers/             #Controladores REST  
│   │   ├── middlewares/             #Manejo de errores, 404, auth  
│   │   ├── models/                  #Modelos Mongoose  
│   │   ├── routes/                  #Rutas REST  
│   │   ├── schemas/                 #Validaciones Zod  
│   │   ├── services/                #Logica de negocio  
│   │   └── utils/                   #Utilidades compartidas  
│   ├── package.json  
│   ├── tsconfig.json  
│   ├── .env.example  
│   ├── Dockerfile                   #Configuración multi-etapa para contenerizar la aplicación web en Docker  
│   ├── eslint.config.js             #Configuración para el linter  
│   ├── index.html                   #HTML base donde se inyecta Vite y Vue  
│   ├── package.json                 #Dependencias (Vue, Phaser, Vitest, ESLint) y scripts (dev, build, lint, test)  
│   ├── pnpm-lock.yaml               #Archivo de bloqueo generado por el gestor de paquetes pnpm  
│   ├── tsconfig.app.json            #Configuración de TypeScript para el código de tu juego y frontend (Phaser/Vue)  
│   ├── tsconfig.json                #Archivo principal que agrupa y coordina las configuraciones de TypeScript (app y node)  
│   ├── tsconfig.node.json           #Configuración de TypeScript para los archivos de configuración del entorno (como vite.config.ts)  
│   └── vite.config.ts               #Configuración del empaquetador Vite  
├── .gitattributes                   #Archivo que previene errores por inconsistencias en saltos de linea  
├── .gitignore                       #Archivo para excluir archivos innecesarios  
├── DESIGN.md                        #Documento de diseño inicial con especificaciones y descripción del juego  
├── PLANNING.md                      #Planificación del proyecto con objetivos semanales  
└── README.md                        #Archivo con título, descripción e instrucciones de ejecución local y Docker  

---

## Dependencias principaleS  
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

El frontend se mantiene en la carpeta `1v1_shooter/` y conserva la estructura Vue + Phaser. Vue se encarga de la interfaz, menus, HUD y futuras pantallas de login/perfil. Phaser gestiona la logica visual e interactiva del juego.

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
