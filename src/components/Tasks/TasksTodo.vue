<template>
  <transition
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut absolute-top"
  >
    <div :class="{'q-mb-lg': !settings.showTasksInOneList}">
      <list-header
        v-if="!settings.showTasksInOneList"
        bg-color="bg-orange-4">Todo
      </list-header>
      <q-list
        bordered
        separator>
        <task
          v-for="(task, key) in tasksTodo"
          :task="task"
          :id="key"
          :key="key">
        </task>
      </q-list>
    </div>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'tasks-todo',
    props: ['tasksTodo'],
    components: {
      'list-header': () => import('components/Shared/ListHeader'),
      'task': () => import('./Task'),
    },
    computed: {
      ...mapGetters('settings', ['settings']),
    }
  }
</script>

