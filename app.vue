<template>
  <div class="p-6">
    <div class="max-w-3xl mx-auto space-y-8">
      <div class="flex space-x-4 justify-between items-center">
        <header class="text-neutral-100">
          <h1 class="text-3xl font-bold">CHATLAS</h1>
          <h2>Your custom AI-powered chatbot</h2>
        </header>

        <NuxtLink
          class="bg-sky-700 text-white w-8 h-8 rounded flex items-center justify-center"
          to="/"
          v-if="$route.name === 'about'">‹</NuxtLink>

        <NuxtLink
          class="bg-sky-700 text-white w-8 h-8 rounded flex items-center justify-center"
          to="/about"
          v-else>?</NuxtLink>
      </div>

      <NuxtPage />
    </div>
  </div>
</template>
