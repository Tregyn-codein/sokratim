<template>
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold pb-6">Сократить ссылку</h1>
    <form @submit.prevent="shortenLink" class="container max-w-lg mx-auto border-2 border-gray-200 bg-gray-100 rounded-xl p-5">
      <div class="mb-5">
        <label class="block mb-2 font-bold text-gray-900">🔗 Оригинальная ссылка</label>
        <input type="url" v-model="originalUrl" placeholder="Введите ссылку" required class="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-100 sm:text-sm sm:leading-6">
      </div>
      <div class="mb-2">
        <label class="block mb-2 font-bold text-gray-900">📜 Имя для сокращённой ссылки</label>
        <input type="text" v-model="shortenedName" placeholder="Введите имя или оставьте пустым для генерации" @blur="checkAvailability" class="block mb-2 w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-100 sm:text-sm sm:leading-6">
        <button type="button" @click="generateRandomName" class="font-bold text-amber-600 hover:text-amber-500 i-mdi-refresh">🎲 Сгенерировать случайное имя</button>
        <p v-if="nameAvailable === false" style="color:red;">Имя занято, выберите другое.</p>
      </div>
      <button type="submit" class=" border font-bold border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-2 py-1 rounded-md transition-colors"> ✂ Сократить ссылку</button>
    </form>


    <div v-if="successMessage" class="flex max-w-lg border border-green-300 mx-auto my-5 justify-center items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 " role="alert">
      <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <div>
        <span class="font-medium">{{ successMessage }}</span>
      </div>
    </div>
    <div v-if="errorMessage" class="flex max-w-lg border border-red-300 mx-auto my-5 justify-center items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 " role="alert">
      <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <div>
        <span class="font-medium">{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      originalUrl: '',
      shortenedName: '',
      nameAvailable: null, // null - не проверено, true - доступно, false - занято
      successMessage: '',
      errorMessage: '',
    };
  },
  // watch: {
  //   shortenedName() {
  //     this.checkAvailability();
  //   },
  // },
  methods: {
    async checkAvailability() {
      if (!this.shortenedName) {
        this.nameAvailable = null; // если поле пустое, не проверяем
        return;
      }
      try {
        const token = localStorage.getItem('authToken');

        const response = await axios.post('http://localhost:3000/api/url/check-name', {
          shortened_name: this.shortenedName
        },{
          headers: {
            Authorization: `Bearer ${token}`,
            'x-access-token': token
          }
        });
        this.nameAvailable = response.data.available;
        this.errorMessage = '';
        if (!this.nameAvailable) {
          // this.errorMessage = 'Имя занято, выберите другое.';
        }
      } catch (err) {
        this.errorMessage = 'Ошибка при проверке имени.';
      }
    },
    async generateRandomName() {
      let randomName;
      let available = false;

      // Генерация случайного имени и проверка доступности
      while (!available) {
        randomName = Math.random().toString(36).substring(2, 8); // Простая генерация
        const token = localStorage.getItem('authToken');
        const response = await axios.post('http://localhost:3000/api/url/check-name', {
          shortened_name: randomName
        },{
          headers: {
            Authorization: `Bearer ${token}`,
            'x-access-token': token
          }
        });
        available = response.data.available;
      }

      this.shortenedName = randomName;
      this.nameAvailable = true;
    },
    async shortenLink() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post('http://localhost:3000/api/url/shorten', {
          original_url: this.originalUrl,
          shortened_name: this.shortenedName, // если не указано, сервер должен сам сгенерировать
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-access-token': token
          }
        });

        this.successMessage = 'Ссылка успешно создана: ' + response.data.shortened_name;
        this.errorMessage = '';
        // Перенаправляем в личный кабинет через несколько секунд
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 1000);
      } catch (err) {
        this.errorMessage = 'Ошибка при создании ссылки.';
        this.successMessage = '';
      }
    }
  }
};
</script>

<style scoped>
.shorten-link {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}
button {
  margin-top: 10px;
}
</style>
