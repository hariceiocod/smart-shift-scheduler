<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { patch } from '@/utils/api.js';

const props = defineProps({
    visible: Boolean,
    shiftToEdit: Object,
});

const emit = defineEmits(['update:visible', 'success']);

const toast = useToast();
const shift = ref({
    shift_id: '',
    date: '',
    start_time: '',
    end_time: '',
    max_employees: '',
    assigned_employees: [],
});

const errors = ref({
    date: false,
    start_time: false,
    end_time: false,
    max_employees: false
});

const loading = ref(false);

watch(() => props.shiftToEdit, (newShift) => {
    if (newShift) {
        shift.value = { ...newShift };
    }
}, { immendiate: true });

const hideDialog = () => {
    emit('update:visible', false);
};

const resetForm = () => {
    shift.value = {
        shift_id: '',
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

const validateForm = () => {
    let isValid = true;
    if (!shift.value.date) {
        errors.value.date = true;
        isValid = false;
    }
    if (!shift.value.start_time) {
        errors.value.start_time = true;
        isValid = false;
    }
    if (!shift.value.end_time) {
        errors.value.end_time = true;
        isValid = false;
    }
    if (!shift.value.max_employees || shift.value.max_employees <= 0) {
        errors.value.max_employees = true;
        isValid = false;
    }
    return isValid;
};

const editShift = async () => {
    if (!validateForm()) {
        toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill in all fields.', life: 3000 });
        return;
    }

    loading.value = true;

    try {
        const response = await patch(`/api/shifts/update`, shift.value);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Shift Updated', detail: 'The shift has been updated.', life: 3000 });
            hideDialog();
            emit('success');
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error updating the shift.', life: 3000 });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.message || 'An error occurred while assigning employees.',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <Dialog v-model:visible="props.visible" modal header="Edit Shift" :style="{ width: '25rem' }">
        <form @submit.prevent="editShift" class="flex flex-col gap-2">
            <div class="flex items-center gap-4 mb-4">
                <label for="date" class="font-semibold w-24">Shift Date</label>
                <InputText id="date" v-model="shift.date" class="flex-auto" type="date" autocomplete="off" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="start_time" class="font-semibold w-24">Start Time</label>
                <InputText id="start_time" v-model="shift.start_time" class="flex-auto" type="time"
                    autocomplete="off" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="end_time" class="font-semibold w-24">End Time</label>
                <InputText id="end_time" v-model="shift.end_time" class="flex-auto" type="time" autocomplete="off" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="max_employees" class="font-semibold w-24">Max Employees</label>
                <InputText id="max_employees" v-model="shift.max_employees" class="flex-auto" type="number" min="1"
                    autocomplete="off" />
            </div>
            <div v-if="Object.values(errors).includes(true)" class="text-red-500 mb-4">
                <p v-if="errors.value.date">Please enter a valid date.</p>
                <p v-if="errors.value.start_time">Please enter a valid start time.</p>
                <p v-if="errors.value.end_time">Please enter a valid end time.</p>
                <p v-if="errors.value.max_employees">Please enter a valid number of max employees.</p>
            </div>
            <div class="flex justify-end gap-2 mt-4">
                <Button type="button" label="Cancel" severity="secondary" @click="hideDialog" />
                <Button type="submit" label="Save Changes" severity="primary" :loading="loading" />
            </div>
        </form>
    </Dialog>
</template>
