<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted() {
    this.$store.dispatch('auth/authStateChanged');
    this.$store.dispatch('settings/getSettings');
  }
}
</script>
