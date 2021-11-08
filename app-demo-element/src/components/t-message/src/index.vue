<template>
  <transition @before-leave="onClose" @after-leave="$emit('destroy')">
    <div
      class="message-wrapper"
      :class="[center ? 'is-center' : '', customClass]"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
  import { reactive, ref, computed, watch, defineComponent } from "vue";

  // 思考： thinking: 用户传进来的配置项是在调用$message的时候传进来的 那为啥还要定义这个组件的prop呢
  export default defineComponent({
    name: "TMessage",
    components: {},
    props: {
      customClass: {},
      center: {},
      onClose: {},
    },
    emits: ["destroy"],
    setup(props, { emit }) {
      return {};
    },
  });
</script>
<style scoped>
  .message-wrapper {
    position: fixed;
    width: 300px;
    line-height: 40px;
    color: blue;
    top: 50%;
    left: 50%;
    box-shadow: 0 0 0 1px gainsboro;
  }
</style>
