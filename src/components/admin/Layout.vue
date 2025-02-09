<script setup lang="ts">
import AdminSidebar from '@/components/admin/Sidebar.vue'
import AdminHeader from '@/components/admin/Header.vue'
</script>

<template>
    <div class="flex flex-col h-screen w-screen  ml-0 overflow-hidden bg-[#fafafa]">
        <AdminHeader />
        <div class="flex flex-1 h-full ">
            <AdminSidebar />
            <div class="overflow-scroll h-full p-8 w-full">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* You can style the layout here if needed */
</style>