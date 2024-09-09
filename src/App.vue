<template>
  <navbar-comp/>
  <router-view/>
  <FooterComp/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
body {
  box-sizing: border-box;
  padding: 0;
  margin: 0;

}

::-webkit-scrollbar {
  display: none;
}
</style>
<script>
import NavbarComp from '@/components/NavbarComp.vue';
import FooterComp from "./components/FooterComp.vue";
export default {
  components: {
    NavbarComp,
    FooterComp
  }
}
</script>