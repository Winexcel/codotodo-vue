<template>
  <q-card-section class="row">
    <div class="text-h6"><slot name="title"></slot></div>
    <q-space></q-space>
    <q-btn flat round dense icon="close" v-close-popup></q-btn>
  </q-card-section>
</template>

<script>
  export default {
    name: 'modal-header',
  }
</script>
