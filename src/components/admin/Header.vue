<script setup>
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { post } from '@/utils/api.js';

const router = useRouter();

const handleLogout = async () => {
    try {
        await post('/api/logout');
        window.location.href = '/login';
    } catch (error) {
        console.error('Logout failed', error);
    }
};
</script>

<template>
    <header class="bg-gray-100 p-4 shadow mb-6 text-black flex items-center justify-between">
        <h1 class="text-xl font-semibold">Admin Dashboard</h1>
        <Button label="Logout" icon="pi pi-power-off" severity="danger" variant="text" @click="handleLogout" />
    </header>
</template>
