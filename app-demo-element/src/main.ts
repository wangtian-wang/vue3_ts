import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import installElementPlus from "./plugins/element";
import TMessage from "@/components/t-message/index";
const app = createApp(App);
installElementPlus(app);
app.use(store).use(router).use(TMessage).mount("#app");
