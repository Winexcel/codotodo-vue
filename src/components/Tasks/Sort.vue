<template>
  <q-select
    v-model="sortBy"
    :options="options"
    emit-value
    map-options
    filled
    label="Sort By"
    @input="setSort"
  />
</template>
<script>
  import {mapMutations, mapState} from 'vuex';

  export default {
    name: 'task-sort',
    data() {
      return {
        options: [
          {
            label: 'Name',
            value: 'name',
          },
          {
            label: 'Date',
            value: 'dueDate',
          }
        ]
      }
    },
    mounted() {
      this.sortBy = this.sort;
    },
    computed: {
      ...mapState('tasks', ['sort']),
      sortBy: {
        get() {
          return this.sort;
        },
        set(value) {
          this.setSort(value);
        }
      }
    },
    methods: {
      ...mapMutations('tasks', ["setSort"]),
    }
  }
</script>

<style scoped>
  .q-select {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 120px;
  }
</style>
