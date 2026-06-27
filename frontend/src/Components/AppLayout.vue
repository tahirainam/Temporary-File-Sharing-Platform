<script setup>
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
</script>

<template>
  <Navbar />
  <div class="flex flex-col min-h-screen">
    <main class="flex-grow">
      <div class="container mx-auto p-4 border-b border-gray-300 mb-4">
        <RouterLink to="/">Upload File</RouterLink>
        &nbsp;
        <RouterLink to="/download">Downloads</RouterLink>
      </div>
      <div class="container mx-auto p-4">
        <RouterView />
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
