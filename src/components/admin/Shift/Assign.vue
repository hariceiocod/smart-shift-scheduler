<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import { post } from '@/utils/api.js';

const props = defineProps({
    visible: Boolean,
    employeeList: Array,
    selectedShift: Object
});

const emit = defineEmits(['update:visible', 'success']);
const toast = useToast();
const selectedEmployees = ref([]);
const employeeOptions = ref(props.employeeList);
const loading = ref(false);

watch(
    () => props.employeeList,
    (newEmployeeList) => {
        employeeOptions.value = newEmployeeList;
    },
    { immediate: true }
);

watch(
    () => props.selectedShift,
    (newShift) => {
        if (newShift && newShift.assigned_employees) {
            selectedEmployees.value = employeeOptions.value.filter(emp => newShift.assigned_employees.map(item => item?.employee_id).includes(emp.id));
        }
    },
    { immediate: true }
);

const hideDialog = () => {
    emit('update:visible', false);
};

const assignEmployees = async () => {
    if (selectedEmployees.value.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one employee.', life: 3000 });
        return;
    }

    loading.value = true;

    try {
        const response = await post('/api/assignments/update', {
            shift_id: props.selectedShift.shift_id,
            employee_ids: selectedEmployees.value.map(emp => emp.id)
        });
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Employees Assigned', detail: 'The selected employees have been assigned to the shift.', life: 3000 });
            emit('success');
            hideDialog();
        } else {
            toast.add({ severity: 'error', summary: 'Assignment Failed', detail: response.message || 'There was an issue assigning employees.', life: 3000 });
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
    <Dialog v-model:visible="props.visible" modal header="Assign Employees" :style="{ width: '25rem' }">
        <div class="card flex justify-center">
            <MultiSelect v-model="selectedEmployees" :options="employeeOptions" optionLabel="name" filter
                placeholder="Select Employees" :maxSelectedLabels="3" class="w-full " />
        </div>
        <div class="flex justify-end gap-2 !mt-4">
            <Button type="button" label="Cancel" severity="secondary" @click="hideDialog" />
            <Button type="button" label="Assign" severity="primary" @click="assignEmployees" :loading="loading" />
        </div>
    </Dialog>
</template>

<style>
.p-dialog-close-button {
    opacity: 0 !important;
}
</style>
