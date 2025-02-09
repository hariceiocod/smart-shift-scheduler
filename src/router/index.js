import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import { useAuthStore } from '../stores/auth';
import AdminLayout from '@/components/admin/Layout.vue';  
import Shifts from '../pages/admin/Shifts.vue';
import Employees from '../pages/admin/Employees.vue';
import EmployeeDashboard from '../pages/employee/Dashboard.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { requiresGuest: true } },
  { path: '/register', component: Register, meta: { requiresGuest: true } },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: 'shifts', component: Shifts },
      { path: 'employees', component: Employees },
    ]
  },
  { path: '/employee/dashboard', component: EmployeeDashboard, meta: { requiresAuth: true, role: 'employee' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;
  const userRole = authStore?.role;

  if (to.meta.requiresGuest && isAuthenticated) {
    if (userRole === 'admin') {
      return next('/admin/shifts');
    } else if (userRole === 'employee') {
      return next('/employee/dashboard');
    }
  }

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next('/login');
    }

    if (to.meta.role && to.meta.role !== userRole) {
      if (userRole === 'admin') {
        return next('/admin/shifts');
      } else if (userRole === 'employee') {
        return next('/employee/dashboard');
      }
    }
  }

  next();
});

export default router;
