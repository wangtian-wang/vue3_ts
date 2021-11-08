import TMessage from "./src/message";
import { Plugin } from "vue";
type SFCInstall<T> = T & Plugin;
const _TMessage: SFCInstall<typeof TMessage> = TMessage as SFCInstall<
  typeof TMessage
>;
_TMessage.install = (app) => {
  app.config.globalProperties.$tmessage = _TMessage;
};
export default _TMessage;
