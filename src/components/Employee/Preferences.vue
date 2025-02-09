<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { get, patch, post } from '@/utils/api.js';
import MultiSelect from 'primevue/multiselect';

const props = defineProps({
    visible: Boolean,
});

const emit = defineEmits(['update:visible']);

const preferences = ref({
    max_hours_per_week: '',
    availability: ''
});

const toast = useToast();

const errors = ref({
    max_hours_per_week: false,
    availability: false
});

const loadingPreferences = ref(false);
const savingPreferences = ref(false);

const hideDialog = () => {
    emit('update:visible', false);
    resetForm();
};

const resetForm = () => {
    preferences.value = {
        max_hours_per_week: '',
        availability: ''
    };
    errors.value = {
        max_hours_per_week: false,
        availability: false
    };
};

const fetchPreferences = async () => {
    loadingPreferences.value = true;
    try {
        const response = await post('/api/employee', { employee_id: localStorage.getItem('userId') });
        if (response.status) {
            preferences.value = {
                max_hours_per_week: response.data.max_hours_per_week,
                availability: response.data.availability
            };
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load preferences.',
                life: 3000,
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'API Error',
            detail: 'An error occurred while fetching preferences.',
            life: 3000,
        });
    } finally {
        loadingPreferences.value = false;
    }
};

watch(
    () => props.visible,
    (newVal) => {
        if (newVal) {
            fetchPreferences();
        }
    }
);

const validateForm = () => {
    let isValid = true;
    if (!preferences.value.max_hours_per_week || preferences.value.max_hours_per_week <= 0) {
        errors.value.max_hours_per_week = true;
        isValid = false;
    } else {
        errors.value.max_hours_per_week = false;
    }

    if (!preferences.value.availability || preferences.value.availability.length === 0) {
        errors.value.availability = true;
        isValid = false;
    } else {
        errors.value.availability = false;
    }

    return isValid;
};

const savePreferences = async () => {
    if (!validateForm()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Please fill in all the required fields.',
            life: 3000,
        });
        return;
    }

    savingPreferences.value = true;
    try {
        const response = await patch('/api/update-availability', preferences.value);
        if (response.status) {
            toast.add({
                severity: 'success',
                summary: 'Preferences Updated',
                detail: 'Your preferences have been updated successfully.',
                life: 3000,
            });
            hideDialog();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'There was an issue updating preferences.',
                life: 3000,
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.message || 'An error occurred while updating preferences.',
            life: 3000,
        });
    } finally {
        savingPreferences.value = false;
    }
};

const availableDays = ref(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
</script>

<template>
    <Dialog v-model:visible="props.visible" modal header="Update Preferences" :style="{ width: '25rem' }">
        <form @submit.prevent="savePreferences" class="flex flex-col gap-2">
            <p v-if="loadingPreferences" class="text-gray-500">Loading preferences...</p>

            <div class="flex items-center gap-4 mb-4">
                <label for="max_hours_per_week" class="font-semibold w-36">Max Working Hours</label>
                <InputText id="max_hours_per_week" v-model="preferences.max_hours_per_week" class="flex-auto"
                    type="number" min="1" autocomplete="off" />
            </div>

            <div class="flex items-center gap-4 mb-4">
                <label class="block font-semibold mb-2">Select Availability Days:</label>
                <MultiSelect v-model="preferences.availability" :options="availableDays" filter
                    placeholder="Select Days" class="w-full" />
            </div>

            <div class="flex justify-end gap-2 mt-4">
                <Button type="button" label="Cancel" severity="secondary" @click="hideDialog" />
                <Button :loading="savingPreferences" label="Save Preferences" class="p-button-primary" type="submit" />
            </div>
        </form>
    </Dialog>
</template>
