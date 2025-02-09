<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { get, post } from '@/utils/api.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Popover from 'primevue/popover';

const employees = ref([]);


const fetchEmployees = async () => {
    try {
        const response = await get('/api/employees', {});
        employees.value = response.data || [];
        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }
    } catch (err) {
        err.value = err.message;
    }
};


fetchEmployees();


const op = ref();
const viewShift = ref()
const selectedEmployee = ref(null);

const openConflictMessage = (event, employee) => {
    selectedEmployee.value = employee;
    op.value.toggle(event);
}
const showShift = (event, employee) => {
    viewShift.value.toggle(event);
    selectedEmployee.value = employee;
}

</script>


<template>
    <div class="mr-0">
        <div class="flex w-full text-black justify-between items-center py-8 ">
            <h2 class="text-xl font-bold text-[28px]">Employee Management</h2>
            <div class="flex gap-4">
                <!-- <Button icon="pi pi-sparkles" label="Add New Employee" variant="outlined" @click=""></Button> -->
            </div>
        </div>
        <DataTable :value="employees" tableStyle="min-width: 50rem">
            <Column field="no" header="SI No">
                <template #body="slotProps">
                    <div class="flex items-center">
                        {{ slotProps.index + 1 }}
                    </div>
                </template>
            </Column>

            <Column field="name" header="Name" class="whitespace-nowrap"></Column>
            <Column field="email" header="Email"></Column>

            <Column field="availability" header="Availability">
                <template #body="slotProps">
                    {{ slotProps.data.availability?.map(day => day.slice(0, 3)).join(', ') }}
                </template>
            </Column>
            <Column field="max_hours_per_week" header="Max Hours" class="text-center"></Column>

            <Column field="shift" header="Shift">
                <template #body="slotProps">
                    <div v-if="slotProps.data.assigned_shifts?.length" class="">
                        <Button @mouseover="(event) => { showShift(event, slotProps.data) }" @mouseout="viewShift?.hide"
                            :label="slotProps.data.assigned_shifts?.length" severity="secondary" variant="outlined"
                            icon="pi pi-eye" />
                    </div>
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
            <!-- <Column field="action" header="Action">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Button label="Add Shift" icon="pi pi-plus" size="small" @click="{ }" />
                    </div>
                </template>
            </Column> -->
            <template #footer> In total, there are {{ employees.length }} shifts. </template>
        </DataTable>
    </div>

    <Popover ref="viewShift">
        <div>
            <ul class="divide-y divide-gray-200 space-y-1">
                <li v-for="(shift, index) in selectedEmployee.assigned_shifts" :key="index" class="py-2">
                    <span class="text-gray-600">
                        Shift on {{ shift.date }}: From {{ shift.start }} to {{ shift.end }}
                    </span>
                </li>
            </ul>
        </div>
    </Popover>


    <Popover ref="op">
        <div class="text-red-500">
            {{ selectedEmployee.conflict_messages?.join(', ') }}
        </div>
    </Popover>
    <!-- <ConfirmDialog /> -->
    <!-- <Add v-model:visible="showAdd" /> -->

</template>
