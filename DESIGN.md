<h1>Mockups</h1>
<p>Boceto a mano pantalla de titulo</p>
![image alt]()
<p>Boceto a mano gameplay</p>
![image alt]()
<p>Concepto digital pantalla de titulo</p>
![image alt]()
<p>Concepto digital gameplay (1)</p>
![image alt]()
<p>Concepto digital gameplay (2)</p>
![image alt]()
<p>Concepto digital gameplay (3)</p>
![image alt]()
<h1>Especificaciones de tecnología</h1>
<h2>Framework Base: Vue 3 (Vite)</h2>
<p>Cuenta con una alta eficiencia en el manejo del DOM para la interfaz de usuario (menús, HUD).</p>
<h2>Motor de juego: Phaser 3</h2>
<p>Cuenta con un alto rendimiento, ideal para este tipo de juego teniendo en cuenta la cantidad de proyectiles. Cuenta con un motor de físicas integrado llamado Arcade, ideal para realizar la idea de un shooter 2D, ya que lo podemos utilizar para gestionar hitboxes con un bajo costo de rendimiento.</p>
<p>Es un framework "Opensource" y altamente documentado, por lo que a la hora de investigar como realizar cierta función, utilizar alguna heramienta en especifico o como arreglar algun error, es fácil encontrar ayuda en internet.</p>
<h2>Estructura de carpetas</h2> 
<p>
Solemne_2/
├── .github/workflows/      #CI/CD: main.yml (Linter, Tests, DockerHub)
├── public/                 #Assets estáticos (Imágenes, Sprites, SFX)
├── src/
│   ├── assets/             #Estilos CSS globales
│   ├── components/         #Componentes Vue (El contenedor del Juego, HUD)
│   │   └── GameContainer.vue
│   ├── game/               #Archivos del motor de juego Phaser
│   │   ├── scenes/         #Escenas: Boot, Menu, PlayScene
│   │   ├── entities/       #Clases de Jugador y Proyectiles
│   │   └── main.ts         #Configuración e inicio de Phaser
│   ├── tests/              #Pruebas unitarias (Vitest)
│   ├── App.vue             #Componente raíz
│   └── main.ts             #Punto de entrada de Vue
├── Dockerfile              #Configuración para contenerizar la app
├── PLANNING                #Planificación semanal del avanze de desarrollo del juego
├── README                  #Información importante; Titulo, instrucciones, links.
├── DESIGN                  #Contiene diseño y especificaciones del juego
├── Img_DSG                 #Imagenes para utilizar en el archivo DESIGN.md
├── pnpm-lock.yaml          #Generado automáticamente por pnpm
└── package.json            #Scripts y dependencias
</p>
<h2>Dependencias principales</h2> 
<p>Las principales dependencias a ser instaladas utilizando pnpm seran: Vue, Phaser, Typescript, Vite, Vitest, Prettier.</p>
<h1>Descripción del juego</h1>
<p>Juego para dos jugadores, competitivo 1 contra 1, ambos son puestos en un escenario, sobre el cual apareceran en lados opuestos sin armas, deben recolectar un arma de las que aparecen sobre el escenario al inicio de la ronda, pudiendo moverse y saltar, con el fin de utilizar una de estas armas para disparar al otro jugador y ganar, el primero en ganar 3 rondas gana la partida.</p>