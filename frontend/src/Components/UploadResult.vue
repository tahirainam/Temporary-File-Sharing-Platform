<script setup>
import { ref } from "vue";

defineProps({
  downloadUrl: String,
  fileName: String,
  expiresAt: String,
});

defineEmits(["reset"]);

const copied = ref(false);

function copyLink(url) {
  navigator.clipboard.writeText(url);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <div class="border border-green-200 bg-green-50 rounded-lg p-6 text-center">
    <p class="text-green-700 font-medium mb-1">File uploaded successfully</p>
    <p class="text-sm text-gray-600 mb-4">{{ fileName }}</p>

    <div
      class="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2"
    >
      <input
        :value="downloadUrl"
        readonly
        class="flex-1 text-sm text-gray-700 outline-none"
      />
      <button
        @click="copyLink(downloadUrl)"
        class="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
      >
        {{ copied ? "Copied!" : "Copy" }}
      </button>
    </div>

    <p class="text-xs text-gray-500 mt-3">Expires: {{ expiresAt }}</p>

    <button
      @click="$emit('reset')"
      class="mt-4 text-sm text-blue-600 hover:underline"
    >
      Upload another file
    </button>
  </div>
</template>
