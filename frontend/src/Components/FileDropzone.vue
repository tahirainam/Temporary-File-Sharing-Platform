<script setup>
import { ref } from "vue";

const props = defineProps({
  selectedFile: {
    type: File,
    default: null,
  },
});

const emit = defineEmits(["file-selected"]);

const isDragging = ref(false);
const fileInput = ref(null);

function handleDrop(event) {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) emit("file-selected", file);
}

function handleFileInputChange(event) {
  const file = event.target.files[0];
  if (file) emit("file-selected", file);
}

function openFilePicker() {
  fileInput.value.click();
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
</script>

<template>
  <div
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="openFilePicker"
    class="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors"
    :class="
      isDragging
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-300 hover:border-gray-400'
    "
  >
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      @change="handleFileInputChange"
    />

    <div v-if="!selectedFile">
      <p class="text-gray-600">Drag & drop a file here, or click to select</p>
      <p class="text-sm text-gray-400 mt-1">Max size: 100MB</p>
    </div>

    <div v-else class="text-left">
      <p class="font-medium text-gray-800">{{ selectedFile.name }}</p>
      <p class="text-sm text-gray-500">{{ formatSize(selectedFile.size) }}</p>
    </div>
  </div>
</template>
