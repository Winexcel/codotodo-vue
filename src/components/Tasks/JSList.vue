<template>
  <div>
    <ul>
      <li v-for="item in list">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'js-list',
    data() {
      return {
        list: []
      };
    },
    methods: {
      getList() {
        return this.list
      }
    }
  }
</script>

<style scoped>

</style>
