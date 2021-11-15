<template>
  <div>
    <el-button type="primary" @click="handleShowMessage"
      >t-message-box</el-button
    >
  </div>
</template>

<script lang="ts">
  import { getCurrentInstance, ref, h } from "vue";
  export default {
    name: "App",
    components: {},
    setup(props, { emit }) {
      const vm = getCurrentInstance().appContext;
      const handleShowMessage = () => {
        vm.config.globalProperties.$tmessageBox
          .prompt("this is form prompt", "this is some tips from message box")
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      const input = ref("");
      return {
        input,
        handleShowMessage,
      };
    },
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
