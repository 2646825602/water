<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "App",
  computed: { ...mapGetters(["isLoggedIn"]) },
  mounted() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setToken(token);
    }
  },
  methods: { ...mapActions(["setToken"]) },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>
