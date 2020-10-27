<template>
  <q-input
    label="Name"
    outlined
    :value="name"
    @input="$emit('update:name', $event)"
    class="q-mb-sm"
    :rules="[val => !!val || 'Field is required']"
    ref="name"
    v-select-all
  >
    <template
      v-if="name"
      v-slot:append>
      <q-icon
        name="cancel"
        @click.stop="$emit('update:name', '')"
        class="cursor-pointer"/>
    </template>
  </q-input>
</template>

<script>
  import {selectAll} from '../../../../directives/select-all.directive'

  export default {
    name: 'modal-task-name',
    props: ['name'],
    directives: {
      selectAll,
    },
    mounted() {
      setTimeout(() => {
        this.$refs.name.focus();
      }, 0);
    },
  }
</script>
