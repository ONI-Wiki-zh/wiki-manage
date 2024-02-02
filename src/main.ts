import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import routes from "virtual:generated-pages";
import CodeDiff from "v-code-diff";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
const vuetify = createVuetify({
  components,
  directives,
});

createApp(App)
.use(router)
.use(vuetify)
.use(CodeDiff)
.mount("#app");
