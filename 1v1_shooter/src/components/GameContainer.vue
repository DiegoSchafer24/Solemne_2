<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';
import PlayScene from '../game/scenes/PlayScene';

let game: Phaser.Game | null = null;

onMounted(() => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, //Usa WebGL si está disponible, si no, usa Canvas 2D
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300, x: 0 },
        debug: true //Permite ver las hitboxes
      }
    },
    scene: [PlayScene]
  };

  game = new Phaser.Game(config);
});

onUnmounted(() => {
  if (game) {
    game.destroy(true);
  }
});
</script>

<template>
  <div id="game-container"></div>
</template>

<style scoped>
#game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.5); /* Un pequeño borde para distinguir el canvas */
}
</style>