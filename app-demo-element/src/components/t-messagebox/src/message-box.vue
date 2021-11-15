<template>
  <transition name="fade-in-linear" @after-leave="$emit('close')">
    <div
      ref="root"
      v-show="visible"
      :class="[
        'el-message-box',
        'message-box-container',
        customClass,
        { 'el-message-box--center': center },
      ]"
    >
      <div class="el-message-box__header">
        <div class="el-message-box__title">
          <div :class="['el-message-box__status', icon]"></div>
          <span>{{ title }}</span>
        </div>
        <button
          class="el-message-box__headerbtn"
          v-if="showClose"
          type="button"
          @click="handleAction(distinguishCancelAndClose ? 'close' : 'confirm')"
          @keydown.prevent.enter="
            handleAction(distinguishCancelAndClose ? 'close' : 'confirm')
          "
        >
          <i class="el-message-box__close el-icon-close"></i>
        </button>
      </div>
      <div class="el-message-box__content">
        <div class="el-box-message__container">
          <div v-if="hasMessage">
            <slot>
              <p>{{ message }}</p>
            </slot>
          </div>
        </div>
        <div class="el-message-box__input" v-show="showInput">
          <el-input
            ref="inputRef"
            v-model="inputValue"
            :type="inputType"
            :placeholder="inputPlaceholder"
            :class="{ invalid: validateError }"
            @keydown.prevent.enter="handleInputEnter"
          ></el-input>
          <div
            class="el-message-box__errormsg"
            :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }"
          >
            {{ editorErrorMessage }}
          </div>
        </div>
      </div>
      <div class="el-message-box__btns">
        <el-button
          v-if="showCancelButton"
          :loading="cancelButtonLoading"
          :class="[cancelButtonClass]"
          :round="roundButton"
          :size="buttonSize || 'small'"
          @click="handleAction('cancel')"
          @keydown.prevent.enter="handleAction('cancel')"
        >
          {{ cancelButtonText || "cancel" }}
        </el-button>
        <el-button
          v-show="showConfirmButton"
          ref="confirmRef"
          :loading="confirmButtonLoading"
          :class="[confirmButtonClasses]"
          :round="roundButton"
          :disabled="confirmButtonDisabled"
          :size="buttonSize || 'small'"
          @click="handleAction('confirm')"
          @keydown.prevent.enter="handleAction('confirm')"
        >
          {{ confirmButtonText || "confirm" }}
        </el-button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import {
    reactive,
    ref,
    computed,
    watch,
    defineComponent,
    toRefs,
    nextTick,
  } from "vue";
  import type { ComponentPublicInstance } from "vue";
  import { ElButton, ElInput } from "element-plus";
  import { isValidComponentSize } from "element-plus/lib/utils/validators";

  import type { Action, MessageBoxState, MessageBoxType } from "./types";
  const TypeMaping = {
    success: "success",
    warning: "warning",
    info: "info",
    error: "error",
  };
  /**  哪些属性和方法西药定义在组件模板内部 哪些需要在render函数里面处理呢 */
  export default defineComponent({
    name: "TMessageBox",
    components: { ElButton, ElInput },
    inheritAttrs: false,
    props: {
      buttonSize: {
        type: String,
        validator: isValidComponentSize,
      },
      showClose: {
        type: Boolean,
        default: true,
      },
      closeOnPressEscape: {
        type: Boolean,
        default: true,
      },
      center: Boolean,
      roundButton: {
        default: false,
        type: Boolean,
      },
      container: {
        type: String, // default append to body
        default: "body",
      },
      boxType: {
        type: String,
        default: "",
      },
    },
    emits: ["close", "action"],
    setup(props, { emit }) {
      const visible = ref(false);
      const hasMessage = computed(() => {
        return !!state.message;
      });
      const inputRef = ref<ComponentPublicInstance>(null);
      watch(
        () => inputRef.value,
        (value) => {
          console.log(inputRef.value);
        }
      );
      const confirmRef = ref<ComponentPublicInstance>(null);
      const confirmButtonClasses = computed(() => {
        return `el-button--primary ${state.confirmButtonClass}`;
      });
      const icon = computed(() => {
        state.iconClass ||
          (state.type && TypeMaping[state.type]
            ? `el-icon-${TypeMaping[state.type]}`
            : "");
      });
      const state = reactive<MessageBoxState>({
        beforeClose: null,
        callback: null,
        cancelButtonText: "",
        cancelButtonClass: "",
        confirmButtonText: "",
        confirmButtonClass: "",
        customClass: "",
        distinguishCancelAndClose: false,
        iconClass: "",
        inputPlaceholder: "",
        inputType: "text",
        inputValue: null,
        inputValidator: null,
        inputErrorMessage: "",
        message: null,
        showCancelButton: false,
        showConfirmButton: true,
        type: "",
        title: undefined,
        showInput: false,
        action: "" as Action,
        confirmButtonLoading: false,
        cancelButtonLoading: false,
        confirmButtonDisabled: false,
        editorErrorMessage: "",
        validateError: false,
        zIndex: 9999,
      });
      const getInputElement = () => {
        let inputRefs = inputRef.value.$refs;
        return (inputRefs.input || inputRefs.textarea) as HTMLElement;
      };
      watch(
        () => visible.value,
        (val) => {
          if (val) {
            if (props.boxType === "alert" || props.boxType === "confirm") {
              nextTick().then(() => {
                confirmRef.value?.$el.focus?.();
                console.log(
                  confirmRef.value?.$el,
                  "confirmRef.value?.$elconfirmRef.value?.$el"
                );
                /** 这个ref的元素是button元素，button元素有focus事件吗？ */
              });
            }
          }
          if (props.boxType !== "prompt") return;
          if (val) {
            nextTick().then(() => {
              if (inputRef.value && inputRef.value.$el) {
                getInputElement().focus();
              }
            });
          } else {
            state.editorErrorMessage = "";
            state.validateError = false;
          }
        }
      );
      const validate = () => {
        /** 当弹框类型为prompt的时候 校验的结果返回的都为false */
        if (props.boxType === "prompt") {
          const inputValidator = state.inputValidator;
          if (typeof inputValidator === "function") {
            const res = inputValidator(state.inputValue);
            if (res === false) {
              state.editorErrorMessage = state.inputErrorMessage;
              state.validateError = true;
              return false;
            }
            if (typeof res === "string") {
              state.editorErrorMessage = res;
              state.validateError = true;
              return false;
            }
          } else {
            return true;
          }
        }
        state.editorErrorMessage = "";
        state.validateError = false;
        return true;
      };
      watch(
        () => state.inputValue,
        async (val) => {
          await nextTick();
          if (props.boxType === "prompt" && val !== null) {
            validate();
          }
        },
        {
          immediate: true,
        }
      );

      const doClose = () => {
        if (!visible.value) return;
        visible.value = false;
        nextTick(() => {
          if (state.action) emit("action", state.action);
        });
      };
      const handleAction = (action: Action) => {
        if (props.boxType === "prompt" && action === "confirm" && !validate()) {
          return;
        }
        state.action = action;
        if (state.beforeClose) {
          state.beforeClose?.(action, state, doClose);
        } else {
          doClose();
        }
      };
      const handleInputEnter = (value: string) => {
        if (state.inputType !== "textarea") {
          return handleAction("confirm");
        }
      };

      return {
        visible,
        inputRef,
        confirmRef,
        ...toRefs(state),
        icon,
        confirmButtonClasses,
        handleAction,
        handleInputEnter,
        doClose,
        hasMessage,
      };
    },
  });
</script>
<style scoped>
  .message-box-container {
    position: fixed;
    width: 500px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: antiquewhite;
  }
</style>
