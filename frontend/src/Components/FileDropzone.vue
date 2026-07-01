<script setup>
import { ref } from "vue";

// Props: parent passes selectedFile down so we can show preview
const props = defineProps({
  selectedFile: {
    type: File,
    default: null,
  },
});

// Emits: we tell the parent which file the user picked
const emit = defineEmits(["file-selected"]);

// Tracks whether the user is dragging over the zone right now
const isDragging = ref(false);

// Hidden file input element
const fileInput = ref(null);

// When user clicks the zone, open the OS file picker
function openFilePicker() {
  fileInput.value.click();
}

// When user picks via the file picker
function onFileInputChange(event) {
  const file = event.target.files[0];
  if (file) emit("file-selected", file);
}

// While dragging over the zone, MUST call preventDefault or drop won't fire
function onDragOver(event) {
  event.preventDefault();
  isDragging.value = true;
}

// When the drag leaves our zone
function onDragLeave() {
  isDragging.value = false;
}

// When the user drops a file onto the zone
function onDrop(event) {
  event.preventDefault();
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) emit("file-selected", file);
}

// Convert bytes to KB or MB for display
function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
</script>

<template>
  <div
    @click="openFilePicker"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    class="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors"
    :class="
      isDragging
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-300 bg-white hover:border-blue-400'
    "
  >
    <!-- Hidden real file input -->
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      @change="onFileInputChange"
    />

    <!-- No file selected yet -->
    <div v-if="!selectedFile">
      <p class="text-gray-500 font-medium">
        Drop a file here, or click to browse
      </p>
      <p class="text-sm text-gray-400 mt-1">Max size: 250MB</p>
    </div>

    <!-- File has been selected, show its name and size -->
    <div v-else class="text-left">
      <p class="font-medium text-gray-800">{{ selectedFile.name }}</p>
      <p class="text-sm text-gray-500 mt-1">
        {{ formatSize(selectedFile.size) }}
      </p>
      <p class="text-xs text-blue-500 mt-2">Click to change file</p>
    </div>
  </div>
</template>
