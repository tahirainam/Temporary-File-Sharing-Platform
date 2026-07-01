<script setup>
import { ref } from "vue";
import FileDropzone from "../Components/FileDropzone.vue";
import UploadOptions from "../Components/UploadOptions.vue";
import UploadResult from "../Components/UploadResult.vue";

//  State (all owned here — children just display and report back)

const selectedFile = ref(null); // the File object the user picked
const expiresIn = ref("24h"); // expiry choice from UploadOptions
const maxDownloads = ref(""); // optional download cap
const password = ref(""); // optional password

const uploading = ref(false); // true while upload is in progress
const progress = ref(0); // 0–100
const result = ref(null); // set after successful upload

//  Handlers

// Called when FileDropzone emits 'file-selected'
function onFileSelected(file) {
  selectedFile.value = file;
}

// Reset everything back to the initial state
function reset() {
  selectedFile.value = null;
  expiresIn.value = "24h";
  maxDownloads.value = "";
  password.value = "";
  uploading.value = false;
  progress.value = 0;
  result.value = null;
}

// SIMULATED upload — replace with real axios call when backend is ready.
// A real call would look like:
//   const formData = new FormData()
//   formData.append('file', selectedFile.value)
//   formData.append('expiresIn', expiresIn.value)
//   const response = await axios.post('/api/files/upload', formData, {
//     onUploadProgress: e => { progress.value = Math.round(e.loaded / e.total * 100) }
//   })
//   result.value = response.data
function upload() {
  if (!selectedFile.value || uploading.value) return;

  uploading.value = true;
  progress.value = 0;

  const interval = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      clearInterval(interval);
      uploading.value = false;

      // Simulated server response — matches the real API contract
      const token = Math.random().toString(36).slice(2, 12);
      result.value = {
        downloadUrl: `${window.location.origin}/d/${token}`,
        fileName: selectedFile.value.name,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(),
      };
    }
  }, 150);
}
</script>

<template>
  <div>
    <!-- STEP 1 & 2: Upload form (hidden once upload succeeds) -->
    <div v-if="!result" class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-800">Share a file</h1>

      <!-- Child 1: drag-drop zone -->
      <!-- We pass selectedFile DOWN as a prop so it can show the preview -->
      <!-- We listen for 'file-selected' event coming UP from the child -->
      <FileDropzone
        :selected-file="selectedFile"
        @file-selected="onFileSelected"
      />

      <!-- Child 2: options form -->
      <!-- We pass current values DOWN as props -->
      <!-- We listen for update events coming UP and update our own refs -->
      <UploadOptions
        :expires-in="expiresIn"
        :max-downloads="maxDownloads"
        :password="password"
        @update:expires-in="expiresIn = $event"
        @update:max-downloads="maxDownloads = $event"
        @update:password="password = $event"
      />

      <!-- Progress bar — only shown while uploading -->
      <div v-if="uploading">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-150"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <p class="text-sm text-gray-500 mt-1">{{ progress }}%</p>
      </div>

      <!-- Upload button -->
      <button
        @click="upload"
        :disabled="!selectedFile || uploading"
        class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ uploading ? "Uploading..." : "Upload & Get Link" }}
      </button>
    </div>

    <!-- STEP 3: Result (shown after upload completes) -->
    <!-- Child 3: result card -->
    <!-- We pass result data DOWN as props -->
    <!-- We listen for 'reset' event to start over -->
    <UploadResult
      v-else
      :download-url="result.downloadUrl"
      :file-name="result.fileName"
      :expires-at="result.expiresAt"
      @reset="reset"
    />
  </div>
</template>
