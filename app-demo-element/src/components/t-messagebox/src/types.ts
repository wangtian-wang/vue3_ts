import type { VNode } from "vue";

export type Action = "confirm" | "close" | "cancel";
export type MessageType = "" | "success" | "warning" | "info" | "error";
export type MessageBoxType = "" | "prompt" | "alert" | "confirm";
export type MessageBoxData = MessageBoxInputData & Action;

export interface MessageBoxInputData {
  value: string;
  action: Action;
}

export interface MessageBoxInputValidator {
  (value: string): boolean | string;
}

export declare interface MessageBoxState {
  title: string;
  message: string;
  type: MessageType;
  iconClass: string;
  customClass: string;
  showInput: boolean;
  inputValue: string;
  inputPlaceholder: string;
  inputType: string;
  //   inputPattern: RegExp;
  inputValidator: MessageBoxInputValidator;
  inputErrorMessage: string;
  showConfirmButton: boolean;
  showCancelButton: boolean;
  action: Action;
  confirmButtonText: string;
  cancelButtonText: string;
  confirmButtonLoading: boolean;
  cancelButtonLoading: boolean;
  confirmButtonClass: string;
  confirmButtonDisabled: boolean;
  cancelButtonClass: string;
  editorErrorMessage: string;
  beforeClose:
    | null
    | ((action: Action, instance: MessageBoxState, done: () => void) => void);
  callback: null | Callback;
  distinguishCancelAndClose: boolean;
  validateError: boolean;
  zIndex: number;
}

export type Callback =
  | ((value: string, action: Action) => any)
  | ((action: Action) => any);

export interface ElMessageBoxOptions {
  beforeClose?: (
    action: Action,
    instance: MessageBoxState,
    done: () => void
  ) => void;
  customClass?: string;
  callback?: Callback;
  cancelButtonText?: string;
  confirmButtonText?: string;
  cancelButtonClass?: string;
  confirmButtonClass?: string;
  center?: boolean;
  message?: string | VNode;
  title?: string;
  type?: MessageType;
  boxType?: MessageBoxType;
  iconClass?: string;
  distinguishCancelAndClose?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  showClose?: boolean;
  roundButton?: boolean;
  closeOnPressEscape?: boolean;
  closeOnHashChange?: boolean;
  showInput?: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
  //   inputPattern?: RegExp;
  inputType?: string;
  inputValidator?: MessageBoxInputValidator;
  inputErrorMessage?: string;
}

export type ElMessageBoxShortcutMethod = ((
  message: string,
  title: string,
  options?: ElMessageBoxOptions
) => Promise<MessageBoxData>) &
  ((message: string, options?: ElMessageBoxOptions) => Promise<MessageBoxData>);

export interface ElMessageBox {
  (options: ElMessageBoxOptions): Promise<MessageBoxData>;

  alert: ElMessageBoxShortcutMethod;

  confirm: ElMessageBoxShortcutMethod;

  prompt: ElMessageBoxShortcutMethod;

  close(): void;
}
