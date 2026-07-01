<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import VuePdfEmbed from "vue-pdf-embed";

// Get the token from the URL (/d/:token)
const route = useRoute();
const token = route.params.token;

// State
const status = ref("loading");

// File info returned from the API
const fileInfo = ref(null);

// Password the user types in
const password = ref("");
const passwordError = ref(false);

// Whether to show the file preview
const showPreview = ref(false);

// Computed

// Get the file extension in uppercase (e.g. 'PDF', 'PNG')
const fileExtension = computed(() => {
  if (!fileInfo.value) return "";
  const parts = fileInfo.value.fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
});

// Should we show a preview option?
const canPreview = computed(() => {
  return ["PDF", "PNG", "JPG", "JPEG"].includes(fileExtension.value);
});

// Is this a PDF specifically?
const isPdf = computed(() => fileExtension.value === "PDF");

// Is this an image?
const isImage = computed(() =>
  ["PNG", "JPG", "JPEG"].includes(fileExtension.value),
);

// Lifecycle

// When the page loads, fetch file info from the backend
// SIMULATED  replace with: const res = await axios.get(`/api/files/${token}`)
onMounted(() => {
  setTimeout(() => {
    fileInfo.value = {
      fileName: `file-${token}.pdf`, // uses the actual token from the URL
      fileSize: 1.8 * 1024 * 1024,
      requiresPassword: true,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    };
    status.value = "ready";
  }, 600);
});

// Helpers

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function timeLeft(date) {
  const hours = Math.floor((date - new Date()) / (1000 * 60 * 60));
  if (hours < 1) return "less than an hour";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return `${Math.floor(hours / 24)} days`;
}

//  Actions

function handleDownload() {
  // Check password if required
  if (fileInfo.value.requiresPassword && !password.value) {
    passwordError.value = true;
    return;
  }

  passwordError.value = false;
  showPreview.value = true; // unlock preview at the same time
  status.value = "downloading";

  setTimeout(() => {
    status.value = "done";
  }, 1000);
}
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="status === 'loading'" class="text-center py-20 text-gray-400">
      Checking link...
    </div>

    <!-- Not found / expired -->
    <div v-else-if="status === 'not-found'" class="text-center py-20">
      <p class="text-4xl mb-4">🔗</p>
      <h2 class="text-lg font-semibold text-gray-800 mb-2">
        Link not found or expired
      </h2>
      <p class="text-sm text-gray-500">
        This file may have been deleted, expired, or reached its download limit.
      </p>
    </div>

    <!-- File found -->
    <div v-else>
      <!-- File info card -->
      <div class="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <!-- File name and size -->
        <div class="flex items-center gap-4 mb-4">
          <div
            class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs"
          >
            {{ fileExtension }}
          </div>
          <div>
            <p class="font-semibold text-gray-800">{{ fileInfo.fileName }}</p>
            <p class="text-sm text-gray-500">
              {{ formatSize(fileInfo.fileSize) }}
            </p>
          </div>
        </div>

        <p class="text-xs text-gray-400 border-t border-gray-100 pt-3">
          Link expires in {{ timeLeft(fileInfo.expiresAt) }}
        </p>
      </div>

      <!-- Password field (only shown if file requires a password) -->
      <div
        v-if="fileInfo.requiresPassword && status !== 'done'"
        class="bg-white border border-gray-200 rounded-lg p-6 mb-4"
      >
        <label class="block text-sm font-medium text-gray-700 mb-2">
          This file is password protected
        </label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter password to download"
          class="w-full border rounded-lg px-3 py-2 text-sm"
          :class="passwordError ? 'border-red-400' : 'border-gray-300'"
        />
        <p v-if="passwordError" class="text-xs text-red-500 mt-1">
          Please enter the password to continue.
        </p>
      </div>

      <!-- Download button -->
      <button
        v-if="status !== 'done'"
        @click="handleDownload"
        :disabled="status === 'downloading'"
        class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {{
          status === "downloading" ? "Preparing download..." : "Download File"
        }}
      </button>

      <!-- Download started message -->
      <div
        v-if="status === 'done'"
        class="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-4"
      >
        <p class="text-green-700 font-medium">✓ Download started</p>
      </div>

      <!-- Preview section (PDF or image) -->
      <!-- Only shown after the user clicks Download (password verified) -->
      <div
        v-if="showPreview && canPreview"
        class="bg-white border border-gray-200 rounded-lg p-4"
      >
        <p class="text-sm font-medium text-gray-700 mb-3">Preview</p>

        <!-- PDF preview using vue-pdf-embed -->
        <!-- In real version: pass the actual file URL from your backend -->
        <div v-if="isPdf" class="max-h-96 overflow-y-auto">
          <VuePdfEmbed source="https://www.w3.org/WAI/WCAG21/wcag-2.1.pdf" />
        </div>

        <!-- Image preview -->
        <div v-if="isImage" class="text-center">
          <img
            src="https://via.placeholder.com/400x300"
            alt="File preview"
            class="max-w-full max-h-96 object-contain mx-auto rounded"
          />
        </div>
      </div>
    </div>
  </div>
</template>
