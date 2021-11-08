import type { VNode } from "vue";
export interface IMessageHandle {
  close: () => void;
}
export type IMessageOptions = {
  customClass?: string;
  center?: boolean;
  duration?: number;
  id?: string;
  type?: "success" | "warning" | "info" | "error" | "";
  zIndex?: number;
  message?: string | void;
  onClose?: () => void;
  offset?: number;
};
export type MessageParams = IMessageOptions | string;

export type MessageVm = VNode;

type MessageQueueItem = {
  vm: MessageVm;
};
export type MessageQueue = Array<MessageQueueItem>;

export type MessageType = "success" | "warning" | "info" | "error" | "";
export type TypedMessageParams<T extends MessageType> =
  | ({ type: T } & Omit<IMessageOptions, "type">)
  | string;

export type IMessage = {
  (options?: MessageParams): IMessageHandle;
  success: (options?: TypedMessageParams<"success">) => IMessageHandle;
  warning: (options?: TypedMessageParams<"warning">) => IMessageHandle;
  info: (options?: TypedMessageParams<"info">) => IMessageHandle;
  error: (options?: TypedMessageParams<"error">) => IMessageHandle;
};
