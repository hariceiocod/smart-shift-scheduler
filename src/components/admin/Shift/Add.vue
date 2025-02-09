<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { post } from '@/utils/api.js'; // For absolute path resolution

// Props to receive visibility state from the parent
const props = defineProps({
    visible: Boolean,
});

// Emit event to update visibility in the parent component
const emit = defineEmits(['update:visible', 'success']);

// Refs for the shift form data
const shift = ref({
    date: '',
    start_time: '',
    end_time: '',
    max_employees: '',
    assigned_employees: [],
});

// Toast for notifications
const toast = useToast();

// Validation state
const errors = ref({
    date: false,
    start_time: false,
    end_time: false,
    max_employees: false
});

// Loading state
const loading = ref(false);

// Function to close the dialog
const hideDialog = () => {
    emit('update:visible', false); // Update the visibility in the parent component
    resetForm();
};

// Reset form fields after closing
const resetForm = () => {
    shift.value = {
        date: '',
        start_time: '',
        end_time: '',
        max_employees: '',
        assigned_employees: [],
    };
    errors.value = {
        date: false,
        start_time: false,
        end_time: false,
        max_employees: false
    };
};

// Validate form fields
const validateForm = () => {
    let isValid = true;
    if (!shift.value.date) {
        errors.value.date = true;
        isValid = false;
    } else {
        errors.value.date = false;
    }
    if (!shift.value.start_time) {
        errors.value.start_time = true;
        isValid = false;
    } else {
        errors.value.start_time = false;
    }
    if (!shift.value.end_time) {
        errors.value.end_time = true;
        isValid = false;
    } else {
        errors.value.end_time = false;
    }
    if (!shift.value.max_employees || shift.value.max_employees <= 0) {
        errors.value.max_employees = true;
        isValid = false;
    } else {
        errors.value.max_employees = false;
    }
    return isValid;
};

// API call to add the shift
const addShift = async () => {
    if (!validateForm()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Please fill in all the required fields.',
            life: 3000,
        });
        return;
    }

    loading.value = true; // Set loading state to true

    // Placeholder API request
    try {
        const response = await post('/api/shifts/create', shift.value);
        if (response.status) {
            toast.add({
                severity: 'success',
                summary: 'Shift Created',
                detail: 'The shift has been added successfully.',
                life: 3000,
            });
            hideDialog(); // Close dialog after successful API call
            emit('success');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'There was an issue adding the shift.',
                life: 3000,
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.message || 'An error occurred while assigning employees.',
            life: 3000
        });
    } finally {
        loading.value = false; // Set loading state to false
    }
};
</script>

<template>
    <!-- Dialog to add a new shift -->
    <Dialog v-model:visible="props.visible" modal header="Add New Shift" :style="{ width: '25rem' }">
        <form @submit.prevent="addShift" class="flex flex-col gap-2">
            <!-- Shift Date -->
            <div class="flex items-center gap-4 mb-4">
                <label for="date" class="font-semibold w-24">Shift Date</label>
                <InputText id="date" v-model="shift.date" class="flex-auto" type="date" autocomplete="off" />
            </div>

            <!-- Start Time -->
            <div class="flex items-center gap-4 mb-4">
                <label for="start_time" class="font-semibold w-24">Start Time</label>
                <InputText id="start_time" v-model="shift.start_time" class="flex-auto" type="time"
                    autocomplete="off" />
            </div>

            <!-- End Time -->
            <div class="flex items-center gap-4 mb-4">
                <label for="end_time" class="font-semibold w-24">End Time</label>
                <InputText id="end_time" v-model="shift.end_time" class="flex-auto" type="time" autocomplete="off" />
            </div>

            <!-- Max Employees -->
            <div class="flex items-center gap-4 mb-4">
                <label for="max_employees" class="font-semibold w-24">Max Employees</label>
                <InputText id="max_employees" v-model="shift.max_employees" class="flex-auto" type="number" min="1"
                    autocomplete="off" />
            </div>

            <!-- Error Messages -->
            <div v-if="Object.values(errors).includes(true)" class="text-red-500 mb-4">
                <p v-if="errors.value.date">Please enter a valid date.</p>
                <p v-if="errors.value.start_time">Please enter a valid start time.</p>
                <p v-if="errors.value.end_time">Please enter a valid end time.</p>
                <p v-if="errors.value.max_employees">Please enter a valid number of max employees.</p>
            </div>

            <!-- Dialog Actions -->
            <div class="flex justify-end gap-2 mt-4">
                <Button type="button" label="Cancel" severity="secondary" @click="hideDialog" />
                <Button type="submit" label="Save" severity="primary" :loading="loading" />
            </div>
        </form>
    </Dialog>
</template>
