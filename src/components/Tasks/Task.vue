<template>
    <q-item
      v-ripple
      :class="task.completed? 'bg-green-1' : 'bg-orange-1'"
      v-touch-hold:1000.mouse="showEditModal"
      @click="updateTask({taskKey: id, updates: {completed: !task.completed}})"
      clickable
    >
      <q-item-section
        side
        top
      >
        <q-checkbox
          :value="task.completed"
          class="no-pointer-events"
        />
      </q-item-section>

      <q-item-section class="trim-text">
        <q-item-label
          v-touch-hold:1000.mouse="showEditModal"
          :class="{'text-strike': task.completed}"
          v-html="$options.filters.searchHighlight(task.name, search)"
        ></q-item-label>
      </q-item-section>

      <q-item-section side>{{ task.category }}</q-item-section>

      <q-item-section
        side
        v-if="task.dueDate"
      >
        <div class="row">
          <div class="column justify-center q-mr-xs">
            <q-icon
              name="event"
              size="18px"
            />
          </div>
          <!-- /.column -->
          <div class="column">
            <q-item-label
              class="row justify-end"
              caption
            >
              {{ task.dueDate | niceDate }}
            </q-item-label>
            <small
              class="row justify-end"
            >
              {{ taskDueTime }}
            </small>
          </div>
          <!-- /.column -->

        </div>
      </q-item-section>

      <q-item-section side>
        <div class="row">
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            dense
            @click.stop="showEditTask = true"
          />
          <q-btn
            flat
            round
            color="red"
            icon="delete"
            dense
            @click.stop="promptToDelete"
          />
        </div>

      </q-item-section>

      <q-dialog v-model="showEditTask">
        <edit-task
          :task="task"
          :id="id"
          @close="showEditTask = false"
        ></edit-task>
      </q-dialog>
    </q-item>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import {date} from 'quasar'

  const {formatDate} = date;


  export default {
    props: ['task', 'id'],
    name: 'task',
    components: {
      'edit-task': () => import('components/Tasks/Modals/EditTask')
    },
    methods: {
      ...mapActions('tasks', ['updateTask', 'deleteTask']),
      promptToDelete() {
        this.$q.dialog({
          title: 'Confirm',
          message: 'Do you really want to delete this task?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.deleteTask({taskKey: this.id});
        })
      },
      showEditModal() {
        this.showEditTask = true;
      }
    },
    computed: {
      ...mapState('tasks', ['search']),
      ...mapGetters('settings', ["settings"]),
      taskDueTime() {
        if (this.settings.show12HourTimeFormat) {
          return formatDate(this.task.dueDate + ' ' + this.task.dueTime, 'h:mmA')
        }
        return this.task.dueTime;
      }
    },
    filters: {
      niceDate(value) {
        return formatDate(value, 'MMM D')
      },
      searchHighlight(value, search) {
        if (search) {
          const searchRegExp = new RegExp('(' + search + ')', 'gi');
          return value.replace(searchRegExp, '<span class="bg-yellow-6">$1</span>');
        }

        return value;
      }
    },
    data() {
      return {
        showEditTask: false,
      }
    }
  }
</script>

<style scoped>
  .trim-text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
