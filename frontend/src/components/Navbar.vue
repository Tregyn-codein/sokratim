<template>
  <nav>
    <div class="inline-block mx-auto">
    <span><router-link to="/">Главная</router-link> | </span>
    <span v-if="!isAuthenticated"><router-link to="/login">Вход</router-link> | </span>
    <span v-if="!isAuthenticated"><router-link to="/register">Регистрация</router-link></span>
    <span v-if="isAuthenticated"><router-link to="/shorten">Сократить</router-link> | </span>
    <span v-if="isAuthenticated"><router-link to="/dashboard">Мои ссылки</router-link></span>
    </div>
    <button v-if="isAuthenticated" @click="logout" class="ml-5 text-red-600 font-bold hover:text-red-500 hover:scale-105 transition-all">Выход</button>
<!--    <button v-if="isAuthenticated" @click="logout" class="ml-5 text-red-600 font-bold border-2 border-transparent rounded-md px-3 py-1 hover:text-white hover:bg-red-600 transition-colors">Выход</button>-->
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: null
    };
  },
  created() {
    if (localStorage.getItem('authToken')) {
      this.$store.commit('login');
    }
    },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('authToken');
      this.$store.commit('logout');
      this.$router.push('/login');
    }
  }
};
</script>