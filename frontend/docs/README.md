# QuickShare — Deliverable 1: Client-Side Architecture

## Project Overview

QuickShare is a temporary file sharing platform. A user uploads a file, sets an expiry time and optional password, and receives a shareable link. The recipient opens the link, enters the password if required, previews the file, and downloads it.

This deliverable covers the complete client-side frontend built with Vue 3, Vue Router, and Tailwind CSS. All API calls are simulated. The backend (Express.js + MongoDB) is Deliverable 2.

---

## Tech Stack

| Technology              | Purpose                                |
| ----------------------- | -------------------------------------- |
| Vue 3 (Composition API) | Frontend framework                     |
| Vue Router 4            | SPA routing                            |
| Tailwind CSS            | Utility-first styling                  |
| Vite                    | Dev server and build tool              |
| qrcode                  | Generate QR code from share link       |
| vue-pdf-embed           | Render PDF files inline in the browser |

---

## 1. SPA Routing

Vue Router handles navigation without full page reloads. Routes are nested under `AppLayout` so the navbar appears on every page automatically.

```js
// src/router/index.js
const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", name: "upload", component: UploadPage },
      { path: "d/:token", name: "download", component: DownloadPage },
    ],
  },
];

export default createRouter({ history: createWebHistory(), routes });
```

**Why `createWebHistory()`:** Produces clean URLs like `/d/:token` instead of `/#/d/:token`. Clean URLs are required because share links are sent via messaging apps and email.

**Why nested under AppLayout:** The navbar is defined once in `AppLayout.vue` and all child routes inherit it automatically, without duplicating markup.

---

## 2. Component Architecture

```
App.vue
  └── AppLayout.vue               navbar + RouterView
        ├── UploadPage.vue        route: /  — owns all upload state
        │     ├── FileDropzone.vue
        │     ├── UploadOptions.vue
        │     └── UploadResult.vue
        └── DownloadPage.vue      route: /d/:token
```

### Directory Structure

```
src/
  views/
    UploadPage.vue
    DownloadPage.vue
  components/
    AppLayout.vue
    FileDropzone.vue
    UploadOptions.vue
    UploadResult.vue
  router/
    index.js
  App.vue
  main.js
```

---

## 3. Props and Emits

All upload state lives in `UploadPage.vue` (the parent). Children receive values via props and report changes via emits. This is called lifting state up — one source of truth, easy to reset.

### Props example (FileDropzone.vue)

```vue
<script setup>
const props = defineProps({
  selectedFile: { type: File, default: null },
});

const emit = defineEmits(["file-selected"]);

function onDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) emit("file-selected", file);
}
</script>
```

### Emits example (UploadOptions.vue)

```vue
<script setup>
defineProps({
  expiresIn: { type: String, default: "24h" },
  maxDownloads: { type: String, default: "" },
  password: { type: String, default: "" },
});

defineEmits(["update:expiresIn", "update:maxDownloads", "update:password"]);
</script>

<template>
  <select
    :value="expiresIn"
    @change="$emit('update:expiresIn', $event.target.value)"
  >
    <option value="1h">1 hour</option>
    <option value="24h">24 hours</option>
    <option value="7d">7 days</option>
  </select>
</template>
```

### Parent wiring (UploadPage.vue)

```vue
<FileDropzone :selected-file="selectedFile" @file-selected="onFileSelected" />

<UploadOptions
  :expires-in="expiresIn"
  :max-downloads="maxDownloads"
  :password="password"
  @update:expires-in="expiresIn = $event"
  @update:max-downloads="maxDownloads = $event"
  @update:password="password = $event"
/>
```

---

## 4. Screenshots

**Upload Page**

![Upload page](screenshots/upload.png)

**Upload Result — Link and QR Code**

![Upload result](screenshots/result.png)

**Download Page**

![Download page](screenshots/download.png)

**PDF Preview**

![PDF preview](screenshots/preview.png)

**Expired Link State**

![Not found](screenshots/not-found.png)

---

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

**Student Name: Tahira Inam 23010101-105**
**Student Name: Raeesa Riaz 23010101-007**
**Instructor:** Museb Khalid
**Submission Date:** July 1, 2026

---
