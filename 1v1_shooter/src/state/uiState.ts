import { reactive } from 'vue';

export const uiState = reactive({
    p1: { lives: 3, color: '#ff0000' }, // Rojo
    p2: { lives: 3, color: '#0000ff' }  // Azul
});