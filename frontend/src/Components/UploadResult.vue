<script setup>
import { ref, onMounted } from "vue";
import QRCode from "qrcode";

const props = defineProps({
  downloadUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  expiresAt: { type: String, required: true },
});

const emit = defineEmits(["reset"]);

// Whether the link was just copied
const copied = ref(false);

// The QR code image (base64 data URL)
const qrDataUrl = ref("");

// Which sharing tab is active: 'link' or 'qr'
const activeTab = ref("link");

// Generate QR code when this component appears
onMounted(async () => {
  qrDataUrl.value = await QRCode.toDataURL(props.downloadUrl, { width: 200 });
});

function copyLink() {
  navigator.clipboard.writeText(props.downloadUrl);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <!-- Success header -->
    <div class="text-center mb-6">
      <div
        class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
      >
        <span class="text-green-600 text-xl">✓</span>
      </div>
      <p class="font-semibold text-gray-800">{{ fileName }} uploaded</p>
      <p class="text-sm text-gray-400 mt-1">Expires: {{ expiresAt }}</p>
    </div>

    <!-- Tab buttons: Link or QR Code -->
    <div class="flex border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        @click="activeTab = 'link'"
        class="flex-1 py-2 text-sm font-medium transition-colors"
        :class="
          activeTab === 'link'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        "
      >
        Share Link
      </button>
      <button
        @click="activeTab = 'qr'"
        class="flex-1 py-2 text-sm font-medium transition-colors"
        :class="
          activeTab === 'qr'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        "
      >
        QR Code
      </button>
    </div>

    <!-- Link tab -->
    <div v-if="activeTab === 'link'">
      <div class="flex gap-2">
        <input
          :value="downloadUrl"
          readonly
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50"
        />
        <button
          @click="copyLink"
          class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          {{ copied ? "Copied!" : "Copy" }}
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-2">
        Share this link with anyone. No account needed to download.
      </p>
    </div>

    <!-- QR Code tab -->
    <div v-if="activeTab === 'qr'" class="text-center">
      <img
        v-if="qrDataUrl"
        :src="qrDataUrl"
        alt="QR Code"
        class="mx-auto rounded-lg"
      />
      <p class="text-xs text-gray-400 mt-3">
        Scan this code to open the download link.
      </p>
    </div>

    <!-- Upload another file -->
    <button
      @click="$emit('reset')"
      class="w-full mt-6 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
    >
      Upload another file
    </button>
  </div>
</template>
