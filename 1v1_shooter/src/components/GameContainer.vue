<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';
import PlayScene from '../game/scenes/PlayScene';
import { uiState } from '../state/uiState';

let game: Phaser.Game | null = null;

onMounted(() => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, //Usa WebGL si está disponible, si no, usa Canvas 2D
    width: 1280,
    height: 720,
    parent: 'game-container',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1200, x: 0 },
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
  <div class="game-wrapper">
    
    <div class="hud">
      <div class="health-bar p1">
        <svg v-for="i in 3" :key="'p1-'+i" class="heart" viewBox="0 0 24 24" 
             :stroke="uiState.p1.color" 
             :fill="i <= uiState.p1.lives ? uiState.p1.color : 'none'">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <div class="health-bar p2">
        <svg v-for="i in 3" :key="'p2-'+i" class="heart" viewBox="0 0 24 24" 
             :stroke="uiState.p2.color" 
             :fill="i <= uiState.p2.lives ? uiState.p2.color : 'none'">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    </div>
    
    <div id="game-container"></div>
  </div>
</template>

<style scoped>
.game-wrapper {
  position: relative;
  width: 1280px;
  max-width: 100vw;
  height: 720px;
  max-height: 100vh;
  box-shadow: 0 0 20px rgba(0,0,0,0.8);
  background-color: #2d2d2d;
}

#game-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hud {
  position: absolute;
  top: 20px;
  left: 30px;
  right: 30px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  pointer-events: none;
}

.health-bar {
  display: flex;
}

.heart {
  width: 40px;
  height: 40px;
  stroke-width: 2;
  margin: 0 5px;
  transition: fill 0.3s ease;
}
</style>