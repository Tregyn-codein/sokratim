<template>
  <div>
    <h1 class="text-4xl font-bold pb-6">Мои сокращенные ссылки</h1>

    <div v-if="urls.length === 0" class="text-amber-500 font-bold text-2xl hover:underline">
      <router-link to="/shorten">✂ Создайте свою первую ссылку</router-link>
    </div>

    <table v-if="urls.length > 0" class="container mx-auto max-w-xl">
      <thead class="">
      <tr class="border-b-2 border-gray-400 bg-gray-200 px-3">
        <th class="rounded-tl-xl px-3">Имя</th>
        <th>Оригнальная ссылка</th>
        <th>Дата создания</th>
        <th>Кол-во кликов</th>
<!--        <th></th>-->
        <th class="rounded-tr-xl">✖</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="url in urls" :key="url.id" class="border-b border-gray-400  hover:bg-gray-100">
        <td class="px-2"><a :href="url.shortened_name" class="text-orange-600 font-bold hover:underline">{{ url.shortened_name }}</a></td>
        <td class="px-2 max-w-lg text-wrap"><a :href="url.original_url" class="break-words text-amber-800 text-left hover:underline">{{ url.original_url }}</a></td>
        <td class="px-2">{{ new Date(url.createdAt).toLocaleDateString('ru-RU', { year: '2-digit', month: 'short', day: 'numeric' }) }}</td>
        <td class="px-2">{{ url.clicks }}</td>
<!--        <td class="px-2"><button @click="hideUrl(url.id)" class="text-amber-600 font-bold hover:text-amber-500 hover:underline">Скрыть</button></td>-->
        <td class="px-2"><button @click="deleteUrl(url.id)" class="text-red-600 font-bold px-3 py-1 text-nowrap rounded hover:text-white hover:bg-red-600 transition-colors ">🗑 Удалить</button></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      urls: [],
    };
  },
  async created() {
    // Получаем ссылки пользователя с сервера
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:3000/api/url/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-access-token': token
        }
      });
      this.urls = response.data;
    } catch (err) {
      console.error('Ошибка при загрузке ссылок', err);
    }
  },
  methods: {
    hideUrl(id) {
      this.urls = this.urls.filter(url => url.id !== id);
    },
    async deleteUrl(id) {
      if (confirm('Вы уверены, что хотите удалить эту ссылку?')) {
        try {
          const token = localStorage.getItem('authToken');
          await axios.delete(`http://localhost:3000/api/url/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'x-access-token': token
            }
          });
          this.urls = this.urls.filter(url => url.id !== id);
        } catch (err) {
          console.error('Ошибка при удалении ссылки', err);
        }
      }
    }
  }
};
</script>
