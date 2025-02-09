<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { del, post, get } from '@/utils/api.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Add from '@/components/admin/Shift/Add.vue';
import Edit from '@/components/admin/Shift/Edit.vue';
import Assign from '@/components/admin/Shift/Assign.vue';
import Popover from 'primevue/popover';

const toast = useToast();
const confirm = useConfirm();

const shifts = ref([]);
const loading = ref(true);
const error = ref('');

const showAdd = ref(false);
const showEdit = ref(false);
const showAssign = ref(false);
const selectedShift = ref(null);

const pendingStatus = ref({
    delete: false,
    assign: false,
})

const employees = ref([]);


const fetchShifts = async () => {
    loading.value = true;
    error.value = '';
    try {
        const response = await get('/api/shifts', {});
        shifts.value = response.data || [];
        if (!response.ok) {
            throw new Error('Failed to fetch shifts');
        }

    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};


const fetchEmployees = async () => {
    try {
        const response = await get('/api/employees', {});
        employees.value = response.data || [];
        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }

    } catch (err) {
        error.value = err.message;
    }
};



const editShift = (shift) => {
    selectedShift.value = shift;
    showEdit.value = true;
};

const assignShift = (shift) => {
    selectedShift.value = shift;
    showAssign.value = true;
};

const deleteShift = async (shift) => {
    selectedShift.value = shift;
    confirm.require({
        message: 'Do you want to delete this shift?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async () => {
            pendingStatus.value.delete = true;
            try {
                const response = await del('/api/shifts/delete', {
                    shift_id: shift.shift_id,
                });

                if (response.status) {
                    toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Shift deleted', life: 3000 });
                    fetchShifts();
                } else {
                    toast.add({ severity: 'error', summary: 'Failed', detail: 'There was an issue deleting the shift.', life: 3000 });
                }
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the shift', life: 3000 });
            } finally {
                pendingStatus.value.delete = false;
            }
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};


const autoAssign = async () => {
    confirm.require({
        header: 'Confirmation',
        message: 'Are you sure you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Confirm'
        },
        accept: async () => {
            pendingStatus.value.assign = true;
            try {
                const response = await post('/api/assignments/auto-assign', {});
                if (response.status) {
                    toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Auto assignment successful', life: 3000 });
                    fetchShifts();
                } else {
                    toast.add({ severity: 'error', summary: 'Failed', detail: 'There was an issue with auto assignment', life: 3000 });
                }
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred during auto assignment', life: 3000 });
            }
            finally {
                pendingStatus.value.assign = false;
            }
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Auto assignment cancelled', life: 3000 });
        }
    });
};

fetchEmployees();
fetchShifts();

const op = ref();
const selectedEmployee = ref(null);

const openConflictMessage = (event, employee) => {
    selectedEmployee.value = employee;
    op.value.toggle(event);
}

</script>


<template>
    <div class="mr-0">
        <div class="flex w-full text-black justify-between items-center py-8 ">
            <h2 class="text-xl font-bold text-[28px]">Shift Management</h2>
            <div class="flex gap-4">
                <Button icon="pi pi-sparkles" label="Auto Assign" variant="outlined" @click="autoAssign"></Button>
                <Button @click=" showAdd = true" icon="pi pi-plus" label="Add New Shift"></Button>
            </div>
        </div>
        <DataTable :value="shifts" tableStyle="min-width: 50rem">
            <Column field="no" header="SI No">
                <template #body="slotProps">
                    <div class="flex items-center">
                        {{ slotProps.index + 1 }}
                    </div>
                </template>
            </Column>

            <Column field="date" header="Date" class="whitespace-nowrap"></Column>
            <Column field="start_time" header="Start Time"></Column>
            <Column field="end_time" header="End Time"></Column>
            <Column field="max_employees" header="Max Employees"></Column>

            <Column header="Assigned Employees">
                <template #body="slotProps">
                    {{ slotProps.data.assigned_employees.length > 0 ? slotProps.data.assigned_employees.map(item =>
                        item.name).join(', ')
                        :
                        'None' }}
                </template>
            </Column>
            <Column field="conflict" header="">
                <template #body="slotProps">
                    <div class=" ">
                        <button @mouseover="(event) => { openConflictMessage(event, slotProps.data) }"
                            @mouseout="op.hide" v-if="slotProps.data.conflict" class="cursor-pointer">
                            <i class="pi pi-exclamation-triangle text-red-500"></i>
                        </button>
                    </div>
                </template>
            </Column>
            <Column field="edit" header="Action">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Button icon="pi pi-user" :loading="pendingStatus.assign" label="Assign"
                            @click="assignShift(slotProps.data)" />
                        <Button icon="pi pi-pencil" severity="secondary" variant="outlined"
                            @click="editShift(slotProps.data)" />
                        <Button icon="pi pi-trash" severity="danger"
                            :loading="pendingStatus.delete && selectedShift.shift_id === slotProps.data.shift_id"
                            variant="outlined" @click="deleteShift(slotProps.data)" />
                    </div>
                </template>
            </Column>
            <template #footer> In total, there are {{ shifts.length }} shifts. </template>
        </DataTable>
    </div>
    <ConfirmDialog />
    <Popover ref="op">
        <div class="text-red-500">
            {{ selectedEmployee.conflict_messages?.join(', ') }}
        </div>
    </Popover>
    <Add v-model:visible="showAdd" @success="fetchShifts" />
    <Edit v-model:visible="showEdit" :shiftToEdit="selectedShift" @success="fetchShifts" />
    <Assign v-model:visible="showAssign" :selectedShift="selectedShift" :employeeList="employees"
        @success="fetchShifts" />
</template>
