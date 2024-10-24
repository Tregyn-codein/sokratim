import { createRouter, createWebHistory } from 'vue-router';
import axios from "axios";
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Dashboard from '../components/Dashboard.vue'
import ShortenLink from '../views/ShortenLink.vue'
import NotFound from '../views/NotFound.vue'
import Loading from '../views/Loading.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Главная'}},
  { path: '/login', name: 'Login', component: Login, meta: { title: 'Вход'}},
  { path: '/register', name: 'Register', component: Register, meta: { title: 'Регистрация'}},
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true , title: 'Личный кабинет'}},
  { path: '/shorten', name: 'ShortenLink', component: ShortenLink , meta: { requiresAuth: true , title: 'Сократить ссылку'}},
  { path: '/notfound', name: 'NotFound', component: NotFound},
  { path: '/redirect', name: 'Loading', component: Loading, meta: { hideNavbar: true }},
  {
    path: '/:shortLinkName',
    name: 'ShortLinkRedirect',
    beforeEnter: async (to, from, next) => {
      const shortLinkName = to.params.shortLinkName;

      try {
        console.log("ShortLinkName: " + shortLinkName);
        const response = await axios.get(`http://localhost:3000/${shortLinkName}`);
        // Если сокращённая ссылка найдена, перенаправляем на оригинальный URL
        next({ name: 'Loading' });
        window.location.href = response.data.original_url;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Если ссылка не найдена, перенаправляем на страницу 404
          next({ name: 'NotFound' });
        } else {
          console.error('Ошибка при проверке сокращенной ссылки:', error);
          next(false); // Останавливаем навигацию в случае ошибки
        }
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Middleware для проверки авторизации
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Sokratim';
  const isAuthenticated = localStorage.getItem('authToken');

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router
