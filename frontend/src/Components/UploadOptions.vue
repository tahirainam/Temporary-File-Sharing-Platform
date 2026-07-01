<script setup>
// Props: parent passes current values down
defineProps({
  expiresIn: { type: String, default: "24h" },
  maxDownloads: { type: String, default: "" },
  password: { type: String, default: "" },
});

// Emits: we tell the parent when the user changes something
defineEmits(["update:expiresIn", "update:maxDownloads", "update:password"]);
</script>

<template>
  <div class="space-y-4">
    <!-- Expiry selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Link expires after
      </label>
      <select
        :value="expiresIn"
        @change="$emit('update:expiresIn', $event.target.value)"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
      >
        <option value="1h">1 hour</option>
        <option value="24h">24 hours</option>
        <option value="7d">7 days</option>
      </select>
    </div>

    <!-- Max downloads -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Max downloads <span class="text-gray-400 font-normal">(optional)</span>
      </label>
      <input
        type="number"
        min="1"
        placeholder="Unlimited"
        :value="maxDownloads"
        @input="$emit('update:maxDownloads', $event.target.value)"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
    </div>

    <!-- Password -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Password <span class="text-gray-400 font-normal">(optional)</span>
      </label>
      <input
        type="password"
        placeholder="Leave blank for no password"
        :value="password"
        @input="$emit('update:password', $event.target.value)"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
    </div>
  </div>
</template>
