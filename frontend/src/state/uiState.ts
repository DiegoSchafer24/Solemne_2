import { reactive } from 'vue';

export const uiState = reactive({
    isMenu: true,
    p1: { lives: 3, color: '#ff0000' },
    p2: { lives: 3, color: '#0000ff' }
});