# SOLEMNE 2

---

# Semana 1
## Tareas planificadas

- [x] Hacer "Brainstorming" para decidir que tipo de juego queremos desarrollar.
- [x] Estudiar y elegir un motor de juego para utilizar junto a Vue.
- [x] Crear repositorio en Github.
- [x] Crear archivo DESIGN.md en el repositorio; este contiene las imagenes conceptuales y especificaciones tecnológicas del juego.
- [x] Crear archivo PLANNING.md en el repositorio; este contiene la planificación de tareas semana a semana por cumplir en el desarrollo del juego.

---

# Semana 2
## Tareas planificadas

- [x] Utilizando pnpm, crear proyecto con plantilla Vue + TypeScript con Vite.
- [x] Utilizando pnpm, instalar las dependencias base junto con phaser (nuestro motor de juego escogido previamente).
- [x] Crear archivo PlayScene.ts, el cual contendra toda la lógica de los personajes, el escenario, las plataformas, las armas.
- [x] Crear archivo GameContainer.vue, el cual contiene las configuraciones más generales del juego (físicas, relacion de aspecto de la ventana).
- [x] Modificar el archivo principal de Vue (App.vue) que viene en la plantilla para que al ejecutar "pnpm run dev" muestre el juego y poder probar que funcione correctamente el codigo de los archivos "PlayScene.ts" y "GameContainer.vue".
- [x] Crear una piso basico para que nuestros personajes no esten flotando o caigan al vacio, defininiendo sus propiedades para que los personajes puedan pararse sobre este.
- [x] Creación de los 2 personajes (por ahora representados por un cuadrado rojo y uno azul)
- [x] Probar la interacción entre los personajes y el escenario, por ejemplo que estos no lo atraviesen.
- [x] Crear la lógica de movimiento de los jugadores; que puedan moverse de lado a lado, saltar y agacharse.

***

# Semana 3
## Tareas planificadas

- [x] Implementación de GitHubs actions en el repositorio del proyecto.
- [x] Implementación de Dockerfile en el repositorio del proyecto.
- [x] Añadir más complejidad al escenario (plataformas, obstáculos).
- [x] Agregar al movimiento la capacidad para deslizarse y tener un salto en el aire (segundo salto).
- [x] Creación de las armas (representadas por ahora por un cuadrado pequeño de color amarillo), haciendo  que aparezcan y que colisionen con el piso (que no atraviesen el escenario).
- [x] Crear lógica que permita a los jugadores recoger y soltar estas armas que se encontraran en el piso.
- [x] Crear lógica para que las armas puedan ser utilizadas por los jugadores para disparar
- [x] Lograr que las balas hagan daño al entrar en contacto con el otro jugador y que esto se registre correctamente (se le resta un punto de vida).
- [x] Hacer que el juego termine correctamente al momento que un jugador gane.

___

# Semana 4
## Tareas planificadas

- [x] Crear las visuales para los personajes.
- [x] Crear las visuales para el escenario.
- [x] Crear las visuales para las armas.
- [x] Crear las animaciones para los personajes y lograr implementarlas correctamente.
- [x] Creación de efectos de sonido.
- [ ] Creación de música.
- [x] Creación de menú principal.
- [x] Creación de skins seleccionable para los personajes.
- [x] Creación de pantalla para seleccionar skins de personaje.
- [x] Creación de pantalla de victoria al finalizar la partida

***

# SOLEMNE 3

---

# Semana 1

- [x] Atualizar el PLANNING.md
- [x] Actualizar el DESIGN.md
- [x] Inicio de desarrollo del backend
- [x] Conexión a MongoDB como base de datos
- [x] Agregar opciónes de registro de usuario y configuraciónes
- [ ] Integración con servicio externo (REST)

___

# Semana 2

- [ ] Inicio de implementación de jugabilidad online
- [x] Mejorar consistencia tamaño personajes
- [ ] Mejorar animaciones de personaje
- [ ] Añadir personajes distintos
- [x] Añadir mecanicas para tirar armas
- [x] Añadir mas puntos de respawn aleatorios
- [x] Añadir indicador de balas

***

# Semana 3

- [ ] Mejorar diseño de plataformas
- [ ] Añadir plataformas moviles
- [ ] Añadir distintas plataformas
- [ ] Añadir mas escenarios con distintas tematicas
- [ ] Añadir mas elementos ineteractivos para los escenarios
- [ ] Añadir mas efectos de sonido
- [ ] Añadir musica (gameplays y menus)
- [ ] Añadir efectos visuales