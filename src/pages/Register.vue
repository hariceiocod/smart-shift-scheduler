<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { post } from '@/utils/api.js';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);

const preferences = ref({
    max_hours_per_week: 1,
    availability: [],
});

const availableDays = ref([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]);

const errors = ref({
    name: '', email: '', password: '', max_hours_per_week: '', availability: '',
});

const validateRequired = (field, key) => {
    errors.value[key] = field.value?.trim() ? '' : `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
};

const validatePreferences = () => {
    errors.value.max_hours_per_week = preferences.value.max_hours_per_week < 1 ? 'Max Working Hours must be at least 1' : '';
    errors.value.availability = preferences.value.availability.length === 0 ? 'At least one availability day is required' : '';
};

const handleRegister = async () => {
    validateRequired(name, 'name');
    validateRequired(email, 'email');
    validateRequired(password, 'password');
    validatePreferences();

    if (errors.value.name || errors.value.email || errors.value.password || errors.value.max_hours_per_week || errors.value.availability) return;

    loading.value = true;
    try {
        const response = await post(`/api/register`, {
            name: name.value,
            email: email.value,
            password: password.value,
            role: 'employee',
            max_hours_per_week: preferences.value.max_hours_per_week,
            availability: preferences.value.availability,
        });

        const { name: _name, token, role, id } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('name', _name);
        authStore.setToken(token, role);
        localStorage.setItem('userId', id);
        setTimeout(() => {
            router.push(role === 'employee' ? '/employee/dashboard' : '/admin/shifts');
        }, 500);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Registration Error',
            detail: 'Registration failed. Please check your details.',
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
            <h2 class="text-center text-3xl font-bold text-gray-800">Register</h2>
            <form @submit.prevent="handleRegister" novalidate class="!space-y-2">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" v-model="name" id="name" required
                        class="mt-2 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200"
                        :class="{ 'border-red-500': errors.name }" />
                    <div v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</div>
                </div>
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
                <div class="flex flex-col">
                    <label for="max_hours_per_week" class="font-semibold w-36">Max Working Hours</label>
                    <InputText v-model="preferences.max_hours_per_week" id="max_hours_per_week" type="number" min="1"
                        class="flex-auto" />
                </div>
                <div v-if="errors.max_hours_per_week" class="mt-1 text-sm text-red-600">{{ errors.max_hours_per_week }}
                </div>
                <div class="flex flex-col">
                    <label class="block font-semibold">Select Availability Days</label>
                    <MultiSelect v-model="preferences.availability" :options="availableDays" filter
                        placeholder="Select Days" class="w-full" />
                </div>
                <div v-if="errors.availability" class="mt-1 text-sm text-red-600">{{ errors.availability }}
                </div>
                <Button :label="loading ? 'Registering...' : 'Register'" :disabled="loading" icon="pi pi-check"
                    class="w-full py-3 !mt-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    @click="handleRegister" />
            </form>
            <div class="text-center mt-4">
                <small class="text-gray-600">Already have an account? <RouterLink to="/login"
                        class="text-green-600 hover:underline">Login</RouterLink></small>
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
