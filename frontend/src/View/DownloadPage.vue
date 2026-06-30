<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const token = route.params.token;

// Possible states: 'loading' | 'ready' | 'not-found' | 'downloading' | 'done' | 'wrong-password'
const status = ref("loading");

const fileInfo = ref(null);
const passwordInput = ref("");

// SIMULATED for now — replace with a real GET /api/files/:token call.
// On 404/expired, set status = 'not-found'. On success, populate fileInfo.
onMounted(() => {
  setTimeout(() => {
    fileInfo.value = {
      fileName: "resume.pdf",
      fileSize: "204 KB",
      requiresPassword: true,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toLocaleString(),
    };
    status.value = "ready";
  }, 500);
});

// SIMULATED for now — replace with a real POST /api/files/:token/download call.
function handleDownload() {
  if (fileInfo.value.requiresPassword && !passwordInput.value) {
    status.value = "wrong-password";
    return;
  }
  status.value = "downloading";
  setTimeout(() => {
    status.value = "done";
  }, 1000);
}
</script>

<template>
  <div class="max-w-xl mx-auto py-10 px-4">
    <div v-if="status === 'loading'" class="text-center text-gray-500">
      Checking link...
    </div>

    <div v-else-if="status === 'not-found'" class="text-center">
      <p class="text-red-600 font-medium">
        This link is invalid or has expired.
      </p>
      <p class="text-sm text-gray-500 mt-2">
        The file may have been deleted, reached its download limit, or the link
        is wrong.
      </p>
    </div>

    <div v-else class="border border-gray-200 rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-1">
        {{ fileInfo.fileName }}
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        {{ fileInfo.fileSize }} &middot; expires {{ fileInfo.expiresAt }}
      </p>

      <div v-if="fileInfo.requiresPassword" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Password required</label
        >
        <input
          v-model="passwordInput"
          type="password"
          placeholder="Enter password"
          class="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <p v-if="status === 'wrong-password'" class="text-sm text-red-600 mt-1">
          Incorrect password, try again.
        </p>
      </div>

      <button
        v-if="status !== 'done'"
        @click="handleDownload"
        :disabled="status === 'downloading'"
        class="w-full bg-blue-600 text-white py-2 rounded-md font-medium disabled:opacity-50 hover:bg-blue-700"
      >
        {{ status === "downloading" ? "Downloading..." : "Download" }}
      </button>

      <p v-else class="text-green-700 text-center font-medium">
        Download started
      </p>
    </div>
  </div>
</template>
