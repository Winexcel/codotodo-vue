<template>
  <q-input
    label="Due Date"
    :value="dueDate"
    @input="$emit('update:dueDate', $event)"
    mask="date"
    outlined
    class="q-mb-sm">
    <template v-slot:append>
      <q-icon v-if="dueDate" name="cancel"
              @click.stop="$emit('update:dueDate', '')" class="cursor-pointer"/>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
          <q-date :value="dueDate" @input="$emit('update:dueDate', $event)">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat/>
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
  export default {
    name: 'modal-due-date',
    props: ['dueDate'],

  }
</script>
