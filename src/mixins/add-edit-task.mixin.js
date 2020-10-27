import ModalButtons from "components/Tasks/Modals/Shared/ModalButtons";
import ModalDueTime from "components/Tasks/Modals/Shared/ModalDueTime";
import ModalDueDate from "components/Tasks/Modals/Shared/ModalDueDate";
import ModalTaskName from "components/Tasks/Modals/Shared/ModalTaskName";
import ModalHeader from "components/Tasks/Modals/Shared/ModalHeader";
import ModalTaskCategory from "components/Tasks/Modals/Shared/ModalTaskCategory";

export default {
  components: {ModalButtons, ModalDueTime, ModalDueDate, ModalTaskName, ModalHeader, ModalTaskCategory},
  data() {
    return {
      categoryName: '',
      taskToSubmit: {
        name: '',
        dueDate: '',
        dueTime: '',
        completed: false,
      }
    }
  },
  methods: {
    submitForm() {
      if (this.$refs.modalTaskName.$refs.name.validate()) {
        this.submitTask();
      }
    },
    clearDueDate() {
      this.dueDate = '';
      this.dueTime = '';
    }
  },
}
