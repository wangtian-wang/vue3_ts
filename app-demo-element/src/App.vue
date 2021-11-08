<template>
  <img src="./assets/logo.png" />
  <div>
    <el-button type="primary" @click="handleShowMessage">el-button</el-button>
  </div>
</template>

<script lang="ts">
  import { getCurrentInstance, ref } from "vue";
  export default {
    name: "App",
    components: {},
    setup(props, { emit }) {
      const vm = getCurrentInstance().appContext;
      const handleShowMessage = () => {
        vm.config.globalProperties.$tmessage({
          message: "hi moring",
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
