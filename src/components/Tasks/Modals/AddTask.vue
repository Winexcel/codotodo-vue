<template>
  <q-card style="width: 300px">
    <modal-header>
      <template slot="title">Add Task</template>
    </modal-header>


    <q-form @submit="submitForm">
      <q-card-section class="q-pt-none">
        <modal-task-name
          :name.sync="taskToSubmit.name"
          ref="modalTaskName"
        ></modal-task-name>

        <modal-task-category :category.sync="categoryName"/>

        <modal-due-date
          :due-date.sync="taskToSubmit.dueDate"
          @clear="clearDueDate"
        ></modal-due-date>

        <modal-due-time
          v-show="taskToSubmit.dueDate"
          :due-time.sync="taskToSubmit.dueTime"
        ></modal-due-time>
      </q-card-section>

      <modal-buttons></modal-buttons>

    </q-form>
  </q-card>
</template>

<script>
  import {mapActions} from 'vuex';
  import mixinAddEditTask from '../../../mixins/add-edit-task.mixin'

  export default {
    name: 'add-task',
    mixins: [mixinAddEditTask],
    methods: {
      ...mapActions('tasks', ['addTask']),
      submitTask() {
        this.addTask({
          categoryName: this.categoryName,
          task: {
            ...this.taskToSubmit,
          },
        });

        this.$emit('close');
      },
    },
    mounted() {
      this.categoryName = this.$store.state.tasks.activeCategory;
    },
  }
</script>

<style
  lang="scss"
  scoped
>
  ::v-deep .q-form {
    .q-field__label {
      font-size: 14px;
    }
  }
</style>
