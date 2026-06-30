import { reactive } from 'vue';
import type { CurrentUser } from '../types/user';

export const uiState = reactive({
    isMenu: true,
    p1: { lives: 3, color: '#ff0000' },
    p2: { lives: 3, color: '#0000ff' },
    currentUser: null as CurrentUser | null,
    authModal: 'hidden' as 'hidden' | 'login' | 'register' | 'verify',
    authForm: { email: '', username: '', password: '', confirmPassword: '', verificationCode: '' }
});