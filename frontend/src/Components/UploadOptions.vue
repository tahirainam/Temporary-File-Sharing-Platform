<script setup>
defineProps({
  expiresIn: String,
  maxDownloads: [Number, String],
  password: String,
});

defineEmits(["update:expiresIn", "update:maxDownloads", "update:password"]);
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"
        >Expires in</label
      >
      <select
        :value="expiresIn"
        @change="$emit('update:expiresIn', $event.target.value)"
        class="w-full border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="1h">1 hour</option>
        <option value="24h">24 hours</option>
        <option value="7d">7 days</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Max downloads (optional)
      </label>
      <input
        type="number"
        min="1"
        :value="maxDownloads"
        @input="$emit('update:maxDownloads', $event.target.value)"
        placeholder="Unlimited"
        class="w-full border border-gray-300 rounded-md px-3 py-2"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Password (optional)
      </label>
      <input
        type="password"
        :value="password"
        @input="$emit('update:password', $event.target.value)"
        placeholder="Leave blank for no password"
        class="w-full border border-gray-300 rounded-md px-3 py-2"
      />
    </div>
  </div>
</template>
