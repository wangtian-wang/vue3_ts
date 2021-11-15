import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import installElementPlus from "./plugins/element";
import TMessage from "@/components/t-message/index";
import TMessageBox from "@/components/t-messagebox/index";
import "element-plus/lib/theme-chalk/index.css";
const app = createApp(App);
installElementPlus(app);
app.use(TMessageBox);
app.use(store).use(router).use(TMessage).mount("#app");
