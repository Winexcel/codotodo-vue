<template>
  <q-card style="width: 300px">
    <modal-header>
      <template slot="title">Edit Task</template>
    </modal-header>


    <q-form @submit="submitForm">
      <q-card-section class="q-pt-none">
        <modal-task-name
          :name.sync="taskToSubmit.name"
          ref="modalTaskName"
        />

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
    name: 'edit-task',
    props: ['task', 'id'],
    mixins: [mixinAddEditTask],
    methods: {
      ...mapActions('tasks', ["updateTask"]),
      submitTask() {
        this.updateTask({taskKey: this.id, updates: {...this.taskToSubmit, categoryName: this.categoryName}});
        this.$emit('close');
      },
    },
    mounted() {
      this.taskToSubmit = Object.assign({}, this.task);
      this.categoryName = this.task.category;
    }
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
