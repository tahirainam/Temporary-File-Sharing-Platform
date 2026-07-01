<script setup>
// This is the shell of the entire app.
// Every page renders inside <RouterView />.
// The navbar appears on every page automatically.
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white border-b border-gray-200">
      <div
        class="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between"
      >
        <RouterLink to="/" class="text-xl font-bold text-blue-600">
          QuickShare
        </RouterLink>
        <span class="text-sm text-gray-400">Temporary File Sharing</span>
      </div>
    </nav>

    <!-- Page content goes here -->
    <main class="max-w-2xl mx-auto px-4 py-10">
      <RouterView />
    </main>
  </div>
</template>
