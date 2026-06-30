<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
import Phaser from 'phaser';
import { controlState } from '../game/scenes/controlState';
import PlayScene from '../game/scenes/PlayScene';
import MainMenuScene from '../game/scenes/MainMenuScene';
import CharacterSelectScene from '../game/scenes/CharacterSelectScene';
import { uiState } from '../state/uiState';

let game: Phaser.Game | null = null;
const authError = ref('');
const isLoading = ref(false);

const isUsernameTooLong = computed(() => uiState.authForm.username.length > 15);
const doPasswordsMatch = computed(() => uiState.authForm.password === uiState.authForm.confirmPassword);

async function handleRegister() {
  if (isUsernameTooLong.value || !doPasswordsMatch.value) {
    authError.value = "Por favor, corrige los errores del formulario.";
    return;
  }
  try {
    isLoading.value = true;
    authError.value = '';

    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uiState.authForm.email,
        username: uiState.authForm.username,
        password: uiState.authForm.password
      })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en el registro');
    
    uiState.authModal = 'verify';
  } catch (error: any) {
    authError.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

async function handleLogin() {
  try {
    isLoading.value = true;
    authError.value = '';

    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: uiState.authForm.email, password: uiState.authForm.password })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Credenciales incorrectas');

    uiState.currentUser = data.user;
    localStorage.setItem('token', data.token);

    if (data.user.onlineControls) {
      Object.assign(controlState.online, JSON.parse(JSON.stringify(data.user.onlineControls)));
    }

    uiState.authModal = 'hidden';

  } catch (error: any) {
    authError.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

async function handleVerify() {
  try {
    isLoading.value = true;
    authError.value = '';

    const response = await fetch('http://localhost:3001/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: uiState.authForm.email, 
        verificationCode: uiState.authForm.verificationCode 
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Código incorrecto o expirado.');

    alert('¡Cuenta verificada con éxito! Ya puedes iniciar sesión.');
    uiState.authModal = 'login';
    uiState.authForm.verificationCode = '';

  } catch (error: any) {
    authError.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

function closeAuthModal() {
  uiState.authModal = 'hidden';
}

watch(() => uiState.authModal, (newValue) => {
  if (!game) return;

  const isModalOpen = newValue !== 'hidden';

  game.scene.getScenes(true).forEach(scene => {
    authError.value = '';
    scene.input.enabled = !isModalOpen;
  });
});

onMounted(() => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
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
        debug: true
      }
    },
    scene: [MainMenuScene, CharacterSelectScene, PlayScene]
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
    
    <div id="game-container"></div>
    
    <div class="hud" :style="{ visibility: uiState.isMenu ? 'hidden' : 'visible' }">
      
      <div class="health-bar p1">
        <svg v-for="i in 3" :key="'p1-'+i" class="heart" viewBox="0 0 24 24" 
             :stroke="uiState.p1.color" 
             :fill="i <= uiState.p1.lives ? uiState.p1.color : 'none'">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div v-if="uiState.currentUser?.countryCode" class="player-info p1">
        <img 
          :src="`https://flagcdn.com/w40/${uiState.currentUser.countryCode.toLowerCase()}.png`" 
          :alt="`Bandera de ${uiState.currentUser.countryCode}`"
          class="player-flag"
        />
        <span>{{ uiState.currentUser.username }}</span>
      </div>

      <div class="health-bar p2">
        <svg v-for="i in 3" :key="'p2-'+i" class="heart" viewBox="0 0 24 24" 
             :stroke="uiState.p2.color" 
             :fill="i <= uiState.p2.lives ? uiState.p2.color : 'none'">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <!-- Placeholder for Player 2 info in online mode -->
      <div class="player-info p2">
        <!-- This will be populated in online mode -->
      </div>

    </div>

    <!-- Auth Modals -->
    <div v-if="uiState.authModal !== 'hidden'" class="auth-overlay">
      <div class="auth-modal">
        <button @click="closeAuthModal" class="close-button">X</button>

        <!-- Register Form -->
        <form v-if="uiState.authModal === 'register'" @submit.prevent="handleRegister">
          <h2>REGISTRO</h2>
          <input type="email" v-model="uiState.authForm.email" placeholder="Correo electrónico" required>
          <input type="text" v-model="uiState.authForm.username" placeholder="Nombre de usuario (max 15)" maxlength="15" required>
          <small v-if="isUsernameTooLong" class="error-text">Nombre de usuario demasiado largo.</small>
          <input type="password" v-model="uiState.authForm.password" placeholder="Contraseña" required>
          <input type="password" v-model="uiState.authForm.confirmPassword" placeholder="Confirmar contraseña" required>
          <small v-if="uiState.authForm.password && !doPasswordsMatch" class="error-text">Las contraseñas no coinciden.</small>
          <button type="submit" :disabled="isLoading">{{ isLoading ? 'ENVIANDO...' : 'ENVIAR' }}</button>
        </form>

        <!-- Login Form -->
        <form v-if="uiState.authModal === 'login'" @submit.prevent="handleLogin">
          <h2>INICIAR SESIÓN</h2>
          <input type="text" v-model="uiState.authForm.email" placeholder="Correo electrónico" required>
          <input type="password" v-model="uiState.authForm.password" placeholder="Contraseña" required>
          <button type="submit" :disabled="isLoading">{{ isLoading ? 'INGRESANDO...' : 'LOGIN' }}</button>
        </form>

        <!-- Verify Form -->
        <form v-if="uiState.authModal === 'verify'" @submit.prevent="handleVerify">
          <h2>VERIFICAR CUENTA</h2>
          <p>Se ha enviado un código de 6 dígitos a tu correo.</p>
          <input type="text" v-model="uiState.authForm.verificationCode" placeholder="Código de verificación" required maxlength="6">
          <button type="submit" :disabled="isLoading">{{ isLoading ? 'VERIFICANDO...' : 'VERIFICAR' }}</button>
        </form>

        <p v-if="authError" class="error-text">{{ authError }}</p>

        <div class="auth-switch">
          <template v-if="uiState.authModal === 'login'">
            ¿No tienes cuenta? <a @click="() => { uiState.authModal = 'register' }">Regístrate</a>
          </template>
          <template v-if="uiState.authModal === 'register'">
            ¿Ya tienes cuenta? <a @click="() => { uiState.authModal = 'login' }">Inicia sesión</a>
          </template>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.error-text {
  color: #ff5555;
  font-size: 0.8rem;
  text-align: left;
  width: 100%;
}

.game-wrapper {
  display: grid;
  width: 100vw;
  height: 100vh;
  place-items: center;
  background-color: #2d2d2d;
}

#game-container, .hud {
  grid-column: 1;
  grid-row: 1;
  width: 100%;
  max-width: 1280px; 
  aspect-ratio: 16 / 9;
}

.hud {
  position: relative;
  z-index: 10;
  pointer-events: none;
}

.health-bar {
  position: absolute;
  top: 20px;
  display: flex;
}

.health-bar.p1 { left: 30px; }
.health-bar.p2 { right: 30px; }

.heart {
  width: 40px;
  height: 40px;
  stroke-width: 2;
  margin: 0 5px;
  transition: fill 0.3s ease;
}

.player-info {
  position: absolute;
  top: 70px; /* Debajo de la barra de vida */
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-family: '"Press Start 2P", monospace';
  font-size: 14px;
}

.player-info.p1 { left: 30px; }
.player-info.p2 { right: 30px; flex-direction: row-reverse; }

.player-flag {
  width: 30px;
}
/* Auth Styles */
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
  z-index: 100;
  font-family: '"Press Start 2P", monospace';
}

.auth-modal {
  position: relative;
  background-color: #1a1a1a;
  padding: 40px;
  border: 2px solid #444;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  color: white;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.auth-modal h2 {
  margin-bottom: 20px;
}

.auth-modal form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-modal input, .auth-modal button {
  padding: 10px;
  font-family: inherit;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
}

.auth-modal button {
  background-color: #007bff;
  cursor: pointer;
  margin-top: 10px;
}
.auth-modal button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.auth-switch {
  margin-top: 20px;
}
.auth-switch a {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}
</style>