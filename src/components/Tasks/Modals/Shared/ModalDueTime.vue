<template>
  <q-input label="Due Time"
           outlined :value="dueTime" @input="$emit('update:dueTime', $event)" mask="time"
           class="q-mb-sm">
    <template v-slot:append>
      <q-icon v-if="dueTime" name="cancel" @click.stop="$emit('update:dueTime', '')"
              class="cursor-pointer"/>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-time :value="dueTime" @input="$emit('update:dueTime', $event)">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat/>
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
  export default {
    name: 'modal-due-time',
    props: ['dueTime'],

  }
</script>
