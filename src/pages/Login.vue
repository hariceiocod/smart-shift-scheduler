<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { post } from '@/utils/api.js';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const email = ref('');
const password = ref('');
const loading = ref(false);

const errors = ref({
    email: '', password: '',
});

const validateRequired = (field, key) => {
    errors.value[key] = field.value?.trim() ? '' : `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
};

const handleLogin = async () => {
    validateRequired(email, 'email');
    validateRequired(password, 'password');

    if (errors.value.email || errors.value.password) return;

    loading.value = true;
    try {
        const response = await post(`/api/login`, {
            email: email.value,
            password: password.value,
        });

        const { name, token, role, id } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', id);
        localStorage.setItem('name', name);
        authStore.setToken(token, role);

        setTimeout(() => {
            router.push(role === 'employee' ? '/employee/dashboard' : '/admin/shifts');
        }, 500);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Login Error',
            detail: 'Invalid credentials. Please try again.',
            life: 3000,
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div
        class="flex items-center justify-center min-h-screen w-screen mr-0 bg-gradient-to-r from-[#117257] to-[#101828] overflow-hidden">
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
            <h2 class="text-center text-3xl font-bold text-gray-800">Login</h2>
            <form @submit.prevent="handleLogin" novalidate class="!space-y-4">

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" v-model="email" id="email" required
                        class="mt-2 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200"
                        :class="{ 'border-red-500': errors.email }" />
                    <div v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" v-model="password" id="password" required
                        class="mt-2 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200"
                        :class="{ 'border-red-500': errors.password }" />
                    <div v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</div>
                </div>

                <Button @click="handleLogin" :label="loading ? 'Logging in...' : 'Login'" :disabled="loading"
                    icon="pi pi-check"
                    class="w-full py-3 !mt-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" />
            </form>

            <div class="text-center mt-4">
                <small class="text-gray-600">Don't have an account? <RouterLink to="/register"
                        class="text-green-600 hover:underline">Register</RouterLink></small>
            </div>
        </div>
    </div>
</template>

<style scoped>
html,
body {
    height: 100%;
    margin: 0;
}

body {
    padding: 0;
    background-color: #f9fafb;
}
</style>
