import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import routes from "virtual:generated-pages";
import CodeDiff from "v-code-diff";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { IconOptions } from "vuetify/dist/vuetify-labs.js";
const vuetify = createVuetify({
  components,
  directives,
  icons: <IconOptions>{
    iconfont: "mdi",
  },
});

createApp(App)
.use(router)
.use(vuetify)
.use(CodeDiff)
.mount("#app");
