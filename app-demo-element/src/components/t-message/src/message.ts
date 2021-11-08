import type {
  IMessage,
  MessageQueue,
  IMessageOptions,
  MessageVm,
  MessageParams,
  IMessageHandle,
} from "./types";
import type { ComponentPublicInstance } from "vue";

import { createVNode, render } from "vue";

import TMessage from "./index.vue";
let seed = 1;
const instanceArray: MessageQueue = [];
const Message = function (
  opt: MessageParams = {} as MessageParams
): IMessageHandle {
  // 将组件内部的props和调用message方法时候 传入的options进行合并
  if (typeof opt === "string") {
    opt = {
      message: opt,
    };
  }
  let options: IMessageOptions = <IMessageOptions>opt;
  const id = "tmessage" + seed++;
  const userClose = opt.onClose;
  options = {
    ...options,
    onClose: () => {
      close(id, userClose);
    },
  };
  // 创建vnode
  const childrenNode =
    typeof options.message === "string"
      ? { default: () => options.message }
      : null;
  const instance = createVNode(TMessage, options, childrenNode);

  // 渲染vnode
  const container = document.createElement("div");
  container.className = "container_" + id;
  render(instance, container);
  document.body.appendChild(container);

  // 定义$emit()触发的事件
  instance.props.onDestroy = () => {
    render(null, container);
  };
  //
  instanceArray.push({ vm: instance });
  return {
    close(): void {},
  };
};
const close = (id: string, fn: () => void) => {};
export default Message;
