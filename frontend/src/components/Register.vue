<template>
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold pb-6">Регистрация</h1>
    <form @submit.prevent="register" class="container max-w-sm mx-auto border-2 border-gray-200 bg-gray-100 rounded-xl p-5">
      <div class="mb-5">
        <label class="block mb-2 text-left font-bold text-gray-900">📧 Email</label>
        <input type="email" v-model="email" required class="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-100 sm:text-sm sm:leading-6">
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-left font-bold text-gray-900">🔑 Пароль</label>
        <input type="password" v-model="password" required class="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-100 sm:text-sm sm:leading-6">
      </div>
      <button type="submit" class="mb-5 border-2 font-bold border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-2 py-1 rounded-md transition-colors">Зарегистрироваться</button>
      <p v-if="error" class="font-bold text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/signup', {
          email: this.email,
          password: this.password
        });
        alert(response.data.message); // Показать сообщение об успешной регистрации
        this.$router.push('/login');  // Перейти на страницу логина после регистрации
      } catch (err) {
        this.error = err.response.data.message || 'Произошла ошибка.';
      }
    }
  }
};
</script>
