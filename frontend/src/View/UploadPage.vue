<script setup>
import { ref } from "vue";
import FileDropzone from "../components/FileDropzone.vue";
import UploadOptions from "../components/UploadOptions.vue";
import UploadResult from "../components/UploadResult.vue";

// All state lives here — children are just views into it
const selectedFile = ref(null);
const expiresIn = ref("24h");
const maxDownloads = ref("");
const password = ref("");

const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadComplete = ref(false);
const result = ref(null);

function handleFileSelected(file) {
  selectedFile.value = file;
}

function resetForm() {
  selectedFile.value = null;
  expiresIn.value = "24h";
  maxDownloads.value = "";
  password.value = "";
  isUploading.value = false;
  uploadProgress.value = 0;
  uploadComplete.value = false;
  result.value = null;
}

// SIMULATED for now — once the backend exists, replace this with a real
// axios/XHR call that reports progress via onUploadProgress.
// See note below the template for exactly how that swap will work.
function submitUpload() {
  if (!selectedFile.value) return;

  isUploading.value = true;
  uploadProgress.value = 0;

  const interval = setInterval(() => {
    uploadProgress.value += 10;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      isUploading.value = false;
      uploadComplete.value = true;
      result.value = {
        downloadUrl: `${window.location.origin}/d/${Math.random().toString(36).slice(2, 12)}`,
        fileName: selectedFile.value.name,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(),
      };
    }
  }, 150);
}
</script>

<template>
  <div class="max-w-xl mx-auto py-10 px-4">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">Upload a file</h2>

    <div v-if="!uploadComplete" class="space-y-6">
      <FileDropzone
        :selected-file="selectedFile"
        @file-selected="handleFileSelected"
      />

      <UploadOptions
        :expires-in="expiresIn"
        :max-downloads="maxDownloads"
        :password="password"
        @update:expires-in="expiresIn = $event"
        @update:max-downloads="maxDownloads = $event"
        @update:password="password = $event"
      />

      <div v-if="isUploading" class="space-y-1">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-500">{{ uploadProgress }}%</p>
      </div>

      <button
        @click="submitUpload"
        :disabled="!selectedFile || isUploading"
        class="w-full bg-blue-600 text-white py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
      >
        {{ isUploading ? "Uploading..." : "Upload" }}
      </button>
    </div>

    <UploadResult
      v-else
      :download-url="result.downloadUrl"
      :file-name="result.fileName"
      :expires-at="result.expiresAt"
      @reset="resetForm"
    />
  </div>
</template>
