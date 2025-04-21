import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from './components/LoginForm.vue';
import BlogDashboard from './components/BlogDashboard.vue';

const routes = [
  { path: '/', component: LoginForm },
  { 
    path: '/dashboard', 
    component: BlogDashboard,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Versión limpia (sin 'from' no utilizado)
router.beforeEach((to, _, next) => {  // Usamos '_' para ignorar el parámetro
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/');
  } else {
    next();
  }
});

export default router;