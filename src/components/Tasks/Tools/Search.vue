<template>

  <q-input
    outlined
    label="Search"
    class="input-no-border-radius"
    v-model="searchText"
    v-select-all
    @keyup.esc="searchText = ''"
  >
    <template v-slot:append>
      <q-icon name="search"/>
      <q-icon
        v-if="searchText !== ''"
        @click="searchText = ''"
        name="close"
        class="cursor-pointer"/>
    </template>
  </q-input>
</template>
<script>

  import {mapState, mapMutations} from 'vuex';
  import {selectAll} from '../../../directives/select-all.directive'

  export default {
    name: 'search',
    methods: {
      ...mapMutations('tasks', ['setSearch']),
    },
    computed: {
      ...mapState('tasks', ['search']),
      searchText: {
        get() {
          return this.search;
        },
        set(newValue) {
          this.setSearch(newValue);
        }
      }
    },
    directives: {
      selectAll,
    }
  }
</script>

<style
  lang="scss"
  scoped
>
  .input-no-border-radius::v-deep {
    .q-field__control {
      border-radius: 0px;
    }
  }
</style>
