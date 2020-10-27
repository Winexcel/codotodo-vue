<template>
  <transition
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <div>
      <list-header v-if="!settings.showTasksInOneList" bg-color="bg-green-4">Completed</list-header>
      <q-list
        bordered
        separator>
        <task
          v-for="(task, key) in tasksCompleted"
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
    props: ['tasksCompleted'],
    components: {
      'task': () => import('./Task'),
      'list-header': () => import('components/Shared/ListHeader'),
    },
    computed: {
      ...mapGetters('settings', ['settings']),
    }
  }
</script>

