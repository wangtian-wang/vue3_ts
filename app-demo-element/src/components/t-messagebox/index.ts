import MessageBox from "./src/index";
import type { SFCWithInstall } from "element-plus/lib/utils/types";
const _Messagebox: SFCWithInstall<typeof MessageBox> =
  MessageBox as SFCWithInstall<typeof MessageBox>;
_Messagebox.install = (app) => {
  app.config.globalProperties.$tmessageBox = _Messagebox;
};
export default _Messagebox;
