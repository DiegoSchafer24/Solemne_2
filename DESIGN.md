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
├── .github/workflows/      #CI/CD: main.yml (Linter, Tests, DockerHub)<br>
├── public/                 #Assets estáticos (Imágenes, Sprites, SFX)<br>
├── src/<br>
│   ├── assets/             #Estilos CSS globales<br>
│   ├── components/         #Componentes Vue (El contenedor del Juego, HUD)<br>
│   │   └── GameContainer.vue<br>
│   ├── game/               #Archivos del motor de juego Phaser<br>
│   │   ├── scenes/         #Escenas: Boot, Menu, PlayScene<br>
│   │   ├── entities/       #Clases de Jugador y Proyectiles<br>
│   │   └── main.ts         #Configuración e inicio de Phaser<br>
│   ├── tests/              #Pruebas unitarias (Vitest)<br>
│   ├── App.vue             #Componente raíz<br>
│   └── main.ts             #Punto de entrada de Vue<br>
├── Dockerfile              #Configuración para contenerizar la app<br>
├── PLANNING                #Planificación semanal del avanze de desarrollo del juego<br>
├── README                  #Información importante; Titulo, instrucciones, links.<br>
├── DESIGN                  #Contiene diseño y especificaciones del juego<br>
├── Img_DSG                 #Imagenes para utilizar en el archivo DESIGN.md<br>
├── pnpm-lock.yaml          #Generado automáticamente por pnpm<br>
└── package.json            #Scripts y dependencias<br>
</p>
<h2>Dependencias principales</h2> 
<p>Las principales dependencias a ser instaladas utilizando pnpm seran: Vue, Phaser, Typescript, Vite, Vitest, Prettier.</p>
<h1>Descripción del juego</h1>
<p>Juego para dos jugadores, competitivo 1 contra 1, ambos son puestos en un escenario, sobre el cual apareceran en lados opuestos sin armas, deben recolectar un arma de las que aparecen sobre el escenario al inicio de la ronda, pudiendo moverse y saltar, con el fin de utilizar una de estas armas para disparar al otro jugador y ganar, el primero en ganar 3 rondas gana la partida.</p>
