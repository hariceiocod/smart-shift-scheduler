<script setup>
import { ref, onMounted } from 'vue';
import Preferences from '@/components/employee/Preferences.vue';
import EmployeeHeader from '@/components/employee/Header.vue';
import Button from 'primevue/button';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { get, post } from '@/utils/api.js';

const showPreferences = ref(false);
const events = ref([]);

const fetchEvents = async () => {
    try {
        const response = await get(('/api/assignments'));
        if (response.data?.length) {
            events.value = response.data;
        }

    } catch (error) {
        console.error('Error fetching event data:', error);
    }
};

onMounted(() => {
    fetchEvents();
});


</script>

<template>
    <div class="flex flex-col h-screen w-screen ml-0 overflow-hidden bg-[#fafafa]">
        <EmployeeHeader />
        <div class="flex flex-col flex-1 h-full p-8 w-full gap-4">
            <div class="flex justify-end">
                <Button icon="pi pi-pencil" label="Edit Preferences" @click="showPreferences = true" />
            </div>
            <vue-cal class="vuecal--green-theme w-full" :time-from="10 * 60" :events="events"
                :selected-date="new Date().toISOString().split('T')[0]" :disable-views="['years', 'year']"></vue-cal>
        </div>
    </div>
    <Preferences v-model:visible="showPreferences" />
</template>

<style>
.vuecal {
    height: 70vh;
}
</style>
