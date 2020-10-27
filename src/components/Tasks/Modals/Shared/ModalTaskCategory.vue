<template>
  <q-select
    :value="category"
    @input="$emit('update:category', $event)"
    outlined
    :options="categoriesList"
    label="Category"
    class="q-mb-sm"
  />
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: 'modal-task-category',
    props: ['category'],
    data() {
      return {
        mapLists: new Map(),
      }
    },
    computed: {
      ...mapState('tasks', ['categories']),
      categoriesList() {
        let categoriesKeys = Object.keys(this.categories).map(c => this.categories[c].name);
        if(!categoriesKeys.includes('All')) {
          categoriesKeys.unshift('All');
        }
        return categoriesKeys;
      }
    }
  }
</script>
