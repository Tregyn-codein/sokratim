<template>
  <div class="container mx-auto h-screen -mt-[84px] p-4 pt-6 content-center max-w-4xl">
    <h1 class="text-[14rem] font-bold ">
      <span class="text-amber-600">4</span>0<span class="text-amber-600">4</span>
    </h1>
    <h2 class="text-5xl font-bold mb-12">Страница не найдена</h2>
    <p class="text-2xl text-gray-600 mb-6">К сожалению, введённая вами ссылка не существует.</p>
    <router-link to="/" class="text-2xl text-amber-600 underline hover:text-amber-800 transition-colors">Вернуться на главную</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>
