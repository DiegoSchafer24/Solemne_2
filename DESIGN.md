<h1>Mockups</h1>
<p>Boceto a mano pantalla de titulo</p>

![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/boceto_titulo.jpeg)
<p>Boceto a mano gameplay</p>

![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/boceto_gameplay.jpeg)
<p>Concepto digital pantalla de titulo</p>

![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/concepto_titulo.png)
<p>Concepto digital gameplay (1)</p>

![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/gameplay(1).png)
<p>Concepto digital gameplay (2)</p>

![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/gameplay(2).png)
<p>Concepto digital gameplay (3)</p>

![image alt](https://github.com/DiegoSchafer24/Solemne_2/blob/0d94fd08e91b1b2d03eff7194ba0ec7b7fbbac40/Img_DSG/gameplay(3).png)
<h1>Especificaciones de tecnología</h1>
<h2>Framework Base: Vue 3 (Vite)</h2>
<p>Cuenta con una alta eficiencia en el manejo del DOM para la interfaz de usuario (menús, HUD).</p>
<h2>Motor de juego: Phaser 3</h2>
<p>Cuenta con un alto rendimiento, ideal para este tipo de juego teniendo en cuenta la cantidad de proyectiles. Cuenta con un motor de físicas integrado llamado Arcade, ideal para realizar la idea de un shooter 2D, ya que lo podemos utilizar para gestionar hitboxes con un bajo costo de rendimiento.</p>
<p>Es un framework "Opensource" y altamente documentado, por lo que a la hora de investigar como realizar cierta función, utilizar alguna heramienta en especifico o como arreglar algun error, es fácil encontrar ayuda en internet.</p>
<h2>Estructura de carpetas</h2> 
<p>
Solemne_2/<br>
├── .github/<br>
│   └── workflows/<br>
│       └── main.yml                 #Configuración de GitHub Actions (CI/CD)<br>
├── Img_DSG/                         #Carpeta que contiene mockups y bocetos<br>
├── 1v1_shooter/                     #Carpeta principal del juego<br>
│   ├── public/<br>
│   ├── src/                         #Código fuente<br>
│   │   ├── assets/                  #Recursos de Vue<br>
│   │   ├── components/              #Componentes reactivos de Vue UI<br>
│   │   │   └── GameContainer.vue    #Contenedor que monta el canvas de Phaser<br>
│   │   ├── game/                    #Ecosistema exclusivo del motor Phaser<br>
│   │   │   ├── entities/            #Carpeta para clases de Jugadores/Balas<br>
│   │   │   └── scenes/<br>
│   │   │   │   └── PlayScene.ts     #Lógica del juego, suelo, plataformas<br>
│   │   │   └── utils/                  
│   │   │   │   └── physicsLogic.ts  #Logica de físicas y movimiento
│   │   ├── tests/                   #Pruebas unitarias
│   │   │   └── physicsLogic.test.ts
│   │   ├── App.vue                  #Componente raíz de la interfaz Vue<br>
│   │   ├── main.ts                  #Punto de arranque de Vue<br>
│   │   └── style.css                #Estilos globales de la página<br>
│   ├── Dockerfile                   #Configuración multi-etapa para contenerizar la aplicación web en Docker<br>
│   ├── index.html                   #HTML base donde se inyecta Vite y Vue<br>
│   ├── package.json                 #Dependencias (Vue, Phaser, Vitest, ESLint) y scripts (dev, build, lint, test)<br>
│   ├── pnpm-lock.yaml               #Archivo de bloqueo generado por el gestor de paquetes pnpm<br>
│   ├── tsconfig.json                #Configuración de TypeScript<br>
│   └── vite.config.ts               #Configuración del empaquetador Vite<br>
├── .gitattributes                   #Archivo que previene errores por inconsistencias en saltos de linea<br>
├── .gitignore                       #Archivo para excluir archivos innecesarios<br>
├── DESIGN.md                        #Documento de diseño inicial con especificaciones y descripción del juego<br>
├── PLANNING.md                      #Planificación del proyecto con objetivos semanales<br>
└── README.md                        #Archivo con título, descripción e instrucciones de ejecución local y Docker<br>
</p>
<h2>Dependencias principales</h2> 
<p>Las principales dependencias a ser instaladas utilizando pnpm seran: Vue, Phaser, Typescript, Vite, Vitest, Prettier.</p>
<h1>Descripción del juego</h1>
<p>Juego para dos jugadores, competitivo 1 contra 1, ambos son puestos en un escenario, sobre el cual apareceran en lados opuestos sin armas, deben recolectar un arma de las que aparecen sobre el escenario al inicio de la ronda, pudiendo moverse y saltar, con el fin de utilizar una de estas armas para disparar al otro jugador y ganar, el primero en ganar 3 rondas gana la partida.</p>
