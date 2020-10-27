<template>
  <q-page>
    <div class="q-pa-md absolute full-width full-height column">
      <div class="row q-mb-lg">
        <search class="col q-mr-sm"/>
        <task-sort class="col"/>
      </div>

      <p v-if="search && !Object.keys(tasksTodo).length && !Object.keys(tasksCompleted).length">No search results</p>

      <template v-if="tasksDownloaded">
        <q-scroll-area class="q-scroll-area-tasks">
          <no-tasks
            v-if="!Object.keys(tasksTodo).length && !search"
            class="q-mb-lg"
          ></no-tasks>

          <tasks-todo
            v-if="Object.keys(tasksTodo).length"
            :tasksTodo="tasksTodo"
          ></tasks-todo>

          <tasks-completed
            v-if="Object.keys(tasksCompleted).length"
            :tasksCompleted="tasksCompleted"
          ></tasks-completed>
        </q-scroll-area>

        <div class="absolute-bottom text-center q-mb-lg no-pointer-events">
          <q-btn
            @click="showAddTask = true"
            size="24px"
            color="primary"
            round
            class="all-pointer-events"
            icon="add"
          ></q-btn>
          <q-dialog v-model="showAddTask">
            <add-task @close="showAddTask = false"></add-task>
          </q-dialog>
        </div>
      </template>

      <template v-if="!tasksDownloaded">
        <q-spinner
          class="absolute-center"
          color="primary"
          size="3em"
        />
      </template>
    </div>
  </q-page>
</template>

<script>
  import {mapGetters, mapState} from 'vuex';
  import Search from "components/Tasks/Tools/Search";
  import TaskSort from "components/Tasks/Sort";
  import tasks from "src/store/tasks";

  export default {
    data() {
      return {
        showAddTask: false,
        stuffName: 'today'
      }
    },
    components: {
      TaskSort,
      Search,
      'no-tasks': () => import('../components/Tasks/NoTasks'),
      'tasks-todo': () => import('../components/Tasks/TasksTodo'),
      'tasks-completed': () => import('../components/Tasks/TasksCompleted'),
      'add-task': () => import('../components/Tasks/Modals/AddTask')
    },
    computed: {
      ...mapGetters('tasks', ['tasksTodo', 'tasksCompleted', 'tasksSorted', 'activeCategoryTasks']),
      ...mapState('tasks', ['search', 'tasksDownloaded']),
    },
    mounted() {
      this.$root.$on('showAddTask', () => {
        this.showAddTask = true;
      })
    },
  }
</script>

<style
  lang="scss"
  scoped
>
  .q-scroll-area-tasks {
    display: flex;
    flex-grow: 1;
  }

  // bug fix with scroll on old browsers like chrome
  ::v-deep .scroll.relative-position.fit.hide-scrollbar {
    position: absolute;
  }
</style>
