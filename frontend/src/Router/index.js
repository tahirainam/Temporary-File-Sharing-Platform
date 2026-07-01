import { createRouter, createWebHistory } from "vue-router";
import UploadPage from "../View/UploadPage.vue";
import DownloadPage from "../View/DownloadPage.vue";

const routes = [
  { path: "/", component: UploadPage },
  { path: "/d/:token", component: DownloadPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
