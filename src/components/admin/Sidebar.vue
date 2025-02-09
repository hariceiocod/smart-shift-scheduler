<script setup>
import { useRoute } from 'vue-router';

// import { ChevronRightIcon } from '@heroicons/vue/outline'; // Example of using Heroicons for arrow

const menuItems = [
    { name: 'Shift Management', route: '/admin/shifts' },
    { name: 'Employee Management', route: '/admin/employees' }
];

const route = useRoute();
</script>

<template>
    <div class="w-70 bg-gray-900 text-white h-screen text-md p-2 py-3 ">
        <ul>
            <li v-for="item in menuItems" :key="item.route" class="mb-3 flex items-center w-full p-2 py-1">
                <router-link :to="item.route"
                    class="flex items-center justify-between !py-3 !px-2 !pl-2.5 rounded transition-colors duration-300 w-full"
                    :class="{ 'bg-gray-700 font-bold': route.path === item.route, 'hover:bg-gray-700': true }">

                    {{ item.name }}
                    <i class="pi pi-chevron-right text-lg "></i>
                </router-link>
            </li>
        </ul>
    </div>
</template>
