import { h, watch, render } from "vue";
import { hasOwn } from "@vue/shared";
import { isVNode, isString } from "element-plus/lib/utils/util";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  Action,
  Callback,
  MessageBoxState,
  ElMessageBox,
  ElMessageBoxOptions,
  MessageBoxData,
} from "./types";
import MessageBoxDom from "./message-box.vue";
const messageInstance = new Map<
  ComponentPublicInstance<{ doClose: () => void }>,
  {
    options: any;
    callback: Callback;
    resolve: (res: any) => void;
    reject: (reson?: any) => void;
  }
>();
const getContainer = () => {
  return document.createElement("div");
};
const initInstance = (props: any, container: HTMLElement) => {
  const vnode = h(MessageBoxDom, props);
  render(vnode, container);
  document.body.appendChild(container.firstChild);
  return vnode.component;
};
const showMessage = (Options: any) => {
  const container = getContainer();
  Options.onClose = () => {
    render(null, container);
    messageInstance.delete(vm);
  };
  Options.onAction = (action: Action) => {
    const curInsatnce = messageInstance.get(vm);
    let resolve: Action | { value: string; action: Action }; // promise 的返回值
    if (Options.showInput) {
      resolve = { value: vm.inputValue, action };
    } else {
      resolve = action;
    }
    /*  
    当action的类型为confirm时候
    当调用者传入回调函数的时候 将input的值传递给回调函数里面，执行这个回调函数，外界可以拿到input的值
    当调用者没有传递回调函数 使用promise.resolve将input的value传送出去
    
    */
    if (Options.callback) {
      Options.callback(resolve, instance.proxy);
    } else {
      if (action === "cancel" || action === "close") {
        if (Options.distinguishCancelAndClose && action !== "cancel") {
          curInsatnce.reject("close");
        } else {
          curInsatnce.reject("cancel");
        }
      } else {
        curInsatnce.resolve(resolve);
      }
    }
  };

  const instance = initInstance(Options, container);
  const vm = instance.proxy as ComponentPublicInstance<
    { visible: boolean; doClose: () => void } & MessageBoxState
  >;
  for (const prop in Options) {
    // 将用户传入的options 存储到vm 当中
    if (hasOwn(Options, prop) && !hasOwn(vm.$props, prop)) {
      vm[prop as string] = Options[prop];
    }
  }

  watch(
    () => vm.message,
    (newVal, oldValue) => {
      if (isVNode(newVal)) {
        instance.slots.default = () => [newVal];
      } else if (isVNode(oldValue) && !isVNode(newVal)) {
        delete instance.slots.default;
      }
    },
    { immediate: true }
  );

  vm.visible = true;
  return vm;
};
async function MessageBox(
  options: ElMessageBoxOptions
): Promise<MessageBoxData>;
function MessageBox(
  options: ElMessageBoxOptions | string | VNode
): Promise<{ value: string; action: Action } | Action> {
  let callback: Callback;
  if (isString(options) || isVNode(options)) {
    options = {
      message: options,
    };
  } else {
    callback = options.callback;
  }
  /**
     初始化实例：
       
       将实例化时候的resolve reject 方法保存到实例上面。
       实例根据当前action的类型 决定promise的状态
     */
  return new Promise((resolve, reject) => {
    const vm = showMessage(options);
    messageInstance.set(vm, {
      options,
      callback,
      resolve,
      reject,
    });
  });
}
MessageBox.alert = function (
  message: string,
  title: string,
  options?: ElMessageBoxOptions
) {
  if (typeof title === "object") {
    options = title;
    title = "";
  } else if (title === undefined) {
    title = "";
  }
  return MessageBox(
    Object.assign(
      {
        title: title,
        message: message,
        type: "",
        closeOnPressEscape: false,
      },
      options,
      { boxType: "alert" }
    )
  );
};
MessageBox.confirm = function (
  message: string,
  title: string,
  options?: ElMessageBoxOptions
) {
  if (typeof title === "object") {
    options = title;
    title = "";
  } else if (title === undefined) {
    title = "";
  }
  return MessageBox(
    Object.assign(
      {
        title: title,
        message: message,
        type: "",
        showCancelButton: true,
      },
      options,
      { boxType: "confirm" }
    )
  );
};
MessageBox.prompt = function (
  message: string,
  title: string,
  options?: ElMessageBoxOptions
) {
  if (typeof title === "object") {
    options = title;
    title = "";
  } else if (title === undefined) {
    title = "";
  }
  return MessageBox(
    Object.assign(
      {
        title: title,
        message: message,
        type: "",
        showCancelButton: true,
        showInput: true,
      },
      options,
      { boxType: "prompt" }
    )
  );
};
MessageBox.close = function () {
  messageInstance.forEach((key, vm) => {
    vm.doClose();
  });
};
export default MessageBox as ElMessageBox;
