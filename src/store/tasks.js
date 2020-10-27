import Vue from 'vue';
import {firebase, firebaseApp, firebaseAuth, firebaseData, firebaseDB} from "boot/firebase";
import {showErrorMessage} from "src/functions/show-error-message";
import {Notify} from 'quasar'
import {base64Encode} from "src/functions/base64";

export default {
  namespaced: true,
  state: {
    categories: {},
    search: '',
    sort: 'name',
    activeCategory: 'All',
    tasksDownloaded: false,
  },
  mutations: {
    updateTask(state, payload) {
      Object.assign(state.categories[payload.category][payload.id], payload.updates);
    },
    addCategory(state, payload) {
      Vue.set(state.categories, payload.id, payload.body);
    },
    deleteCategory(state, payload) {
      Vue.delete(state.categories, payload);
    },
    updateCategory(state, payload) {
      // if tasks dont exists then create reactive field
      if (!state.categories[payload.id].tasks && payload.updates.tasks) {
        Vue.set(state.categories[payload.id], 'tasks', {});
      }

      // if tasks don't exists then delete reactive field
      if(!payload.updates.tasks && state.categories[payload.id].tasks) {
        Vue.delete(state.categories[payload.id], 'tasks');
      }

      Object.assign(state.categories[payload.id], payload.updates);
    },
    clearCategories(state) {
      state.categories = {};
    },
    setActiveCategory(state, payload) {
      state.activeCategory = payload;
    },
    setSort(state, payload) {
      state.sort = payload;
    },
    setSearch(state, payload) {
      state.search = payload;
    },
    setTasksDownloaded(state, payload) {
      state.tasksDownloaded = payload;
    }
  },
  actions: {
    updateTask({dispatch}, payload) {
      dispatch('fbUpdateTask2', payload);
    },
    deleteTask({dispatch}, payload) {
      dispatch('fbDeleteTask2', payload);
    },
    addTask({dispatch}, payload) {
      dispatch('fbAddTask2', payload);
    },
    addCategory({dispatch}, payload) {
      dispatch('fbAddCategory2', payload);
    },
    deleteCategory({dispatch}, payload) {
      dispatch('fbDeleteCategory2', payload);
    },
    updateCategory({dispatch}, payload) {
      dispatch('fbUpdateCategory2', payload);
    },
    fbReadDataBase({commit, dispatch, state}) {
      let userId = firebaseAuth.currentUser.uid;
      const userCategories = firebaseDB.ref(`${userId}/categories`);

      userCategories.once('value', (snapshot) => {
        commit('setTasksDownloaded', true);
      }, error => {
        //commit('setTasksDownloaded', true);
        dispatch('auth/logoutUser', null, {root: true});
        showErrorMessage(error.message);
        this.$router.replace('/auth');
      });

      userCategories.on('child_added', (snapshot) => {
        const category = snapshot.val();

        const payload = {
          id: snapshot.key,
          body: category,
        };

        commit('addCategory', payload);
      });

      userCategories.on('child_changed', (snapshot) => {
        const category = snapshot.val();

        const payload = {
          id: snapshot.key,
          updates: category,
        }

        commit('updateCategory', payload);
      });

      userCategories.on('child_removed', snapshot => {
        commit('deleteCategory', snapshot.key);
      });
    },
    async fbAddCategory2({}, payload) {
      let userId = firebaseAuth.currentUser.uid;

      //iterate categories to get all names
      const snapshot = (await firebaseDB.ref(`${userId}/categories/`).once('value')).val();

      // if category name is already exists then return
      if (snapshot) {
        const snapshotKeys = Object.keys(snapshot);
        for (let i = 0; i < snapshotKeys.length; i++) {
          const key = snapshotKeys[i];

          if (snapshot[key].name.toLowerCase() === payload.name.toLowerCase()) {
            return
          }
        }
      }

      // add new category
      firebaseDB.ref(`${userId}/categories/`).push().set({name: payload.name});
    },

    async fbDeleteCategory2({}, payload) {
      let userId = firebaseAuth.currentUser.uid;
      //iterate categories to get uid by name
      const snapshot = (await firebaseDB.ref(`${userId}/categories/`).once('value')).val();

      // if uid was find then delete category
      if (snapshot) {
        Object.keys(snapshot).map(key => {
          if (snapshot[key].name.toLowerCase() === payload.name.toLowerCase()) {
            firebaseDB.ref(`${userId}/categories/${key}`).remove();
          }
        })
      }
    },

    async fbUpdateCategory2({commit}, payload) {
      let userId = firebaseAuth.currentUser.uid;
      //iterate categories to get uid by name
      const snapshot = (await firebaseDB.ref(`${userId}/categories/`).once('value')).val();

      // if uid was find then update category
      if (snapshot) {
        Object.keys(snapshot).map(key => {
          if (snapshot[key].name.toLowerCase() === payload.name.toLowerCase()) {
            firebaseDB.ref(`${userId}/categories/${key}`).update({...payload.updates});

            if(payload.updates.name) {
              commit('setActiveCategory', payload.updates.name);
            }
          }
        })
      }
    },

    async fbAddTask2({dispatch}, payload) {
      let userId = firebaseAuth.currentUser.uid;
      //iterate categories to get uid by name
      let snapshot = (await firebaseDB.ref(`${userId}/categories/`).once('value')).val();

      if (snapshot) {
        const snapshotKeys = Object.keys(snapshot);
        for (let i = 0; i < snapshotKeys.length; i++) {
          const category = snapshot[snapshotKeys[i]];

          // if uid was find then add task
          if (category.name.toLowerCase() === payload.categoryName.toLowerCase()) {
            firebaseDB.ref(`${userId}/categories/${snapshotKeys[i]}/tasks`).push().set({...payload.task});
            return;
          }
        }
      }

      // if uid wasn't find then add new category and then task into it
      await dispatch('fbAddCategory2', {name: payload.categoryName});
      dispatch('fbAddTask2', payload);
    },

    async fbDeleteTask2({}, payload) {
      let userId = firebaseAuth.currentUser.uid;
      //iterate user categories to get task by key
      const userCategories = await firebaseDB.ref(`${userId}/categories/`).once('value');

      if (!userCategories.val()) {
        return
      }

      const userCategoriesKeys = Object.keys(userCategories.val());
      for (let i = 0; i < userCategoriesKeys.length; i++) {
        const userCategory = userCategories.child(userCategoriesKeys[i]);
        const categoryTasks = userCategory.child('/tasks');

        if (!categoryTasks.val()) {
          continue;
        }

        const categoryTasksKeys = Object.keys(categoryTasks.val());

        if (categoryTasksKeys.includes(payload.taskKey)) {
          //task was found, delete it
          const urlDb = `${userId}/categories/${userCategory.key}/tasks/${payload.taskKey}`;
          const key = firebaseDB.ref(urlDb).remove();
        }
      }
    },

    async fbUpdateTask2({dispatch}, payload) {
      // because we mutate this task in getter activeCategoryTasks
      delete payload.updates.category;

      let userId = firebaseAuth.currentUser.uid;
      //iterate user categories to get task by key
      const userCategories = await firebaseDB.ref(`${userId}/categories/`).once('value');

      if (!userCategories.val()) {
        return
      }

      const userCategoriesKeys = Object.keys(userCategories.val());
      for (let i = 0; i < userCategoriesKeys.length; i++) {
        const userCategory = userCategories.child(userCategoriesKeys[i]);
        const categoryTasks = userCategory.child('/tasks');

        if (!categoryTasks.val()) {
          continue;
        }

        const categoryTasksKeys = Object.keys(categoryTasks.val());

        if (categoryTasksKeys.includes(payload.taskKey)) {
          //task was found, update it
          if (payload.updates.categoryName) {
            // remember category name and delete it from updates
            const categoryName = payload.updates.categoryName;
            delete payload.updates.categoryName;
            // create category if it doesnt exists
            dispatch('fbAddCategory2', {name: categoryName});
            // move task to new category with new updates
            const task = categoryTasks.child(payload.taskKey).val();
            dispatch('fbAddTask2', {
              categoryName: categoryName,
              task: {
                ...task,
                ...payload.updates,
              }
            });

            //delete task from old category
            dispatch('fbDeleteTask2', {taskKey: payload.taskKey});
            return;
          }

          const urlDb = `${userId}/categories/${userCategory.key}/tasks/${payload.taskKey}`;
          const key = firebaseDB.ref(urlDb).update({...payload.updates});
        }
      }
    },

    fbAddCategory({}, payload) {
      let userId = firebaseAuth.currentUser.uid;
      const category = base64Encode(payload);

      firebaseDB.ref('tasks/' + userId + '/' + category).set({empty: true});
    },
  },
  getters: {
    activeCategoryTasks(state) {
      let tasks = {};

      if (state.activeCategory === 'All') {
        Object.keys(state.categories).forEach(category => {
          // mutate every task in order to add category field to them
          const tasksCategory = {...state.categories[category].tasks};
          Object.keys(tasksCategory).forEach(key => {
            tasks[key] = {...tasksCategory[key], category: state.categories[category].name};
          });
        });

        return tasks;
      }

      const categoriesKeys = Object.keys(state.categories);
      for (let i = 0; i < categoriesKeys.length; i++) {
        const categoryName = state.categories[categoriesKeys[i]].name;
        const tasksCategory = state.categories[categoriesKeys[i]].tasks;

        if (categoryName === state.activeCategory && tasksCategory) {
          Object.keys(tasksCategory).forEach(key => {
            tasks[key] = {...tasksCategory[key], category: categoryName};
          });

          return tasks;
        }
      }

      return tasks;
    },
    tasksSorted(state, getters) {
      let tasksSorted = {};
      let keysOrdered = Object.keys(getters.activeCategoryTasks);

      keysOrdered = keysOrdered.sort((a, b) => {
        const taskA = getters.activeCategoryTasks[a][state.sort].toLowerCase();
        const taskB = getters.activeCategoryTasks[b][state.sort].toLowerCase();

        if (taskA > taskB) {
          return 1;
        }

        if (taskA < taskB) {
          return -1;
        }

        return 0;

      })

      keysOrdered.forEach(key => {
        tasksSorted[key] = getters.activeCategoryTasks[key];
      })

      return tasksSorted;
    },
    tasksFiltered(state, getters) {
      const tasks = {};

      if (!state.search) {
        return getters.tasksSorted;
      }

      Object.keys(getters.tasksSorted).forEach(key => {
        const task = getters.tasksSorted[key];

        if (task.name.toLowerCase().includes(state.search.toLowerCase())) {
          tasks[key] = task;
        }
      })

      return tasks;
    },
    tasksTodo(state, getters) {
      const tasks = {};
      Object.keys(getters.tasksFiltered).forEach(key => {
        const task = getters.tasksFiltered[key];

        if (!task.completed) {
          tasks[key] = task;
        }
      })

      return tasks;
    },
    tasksCompleted(state, getters) {
      const tasks = {};
      Object.keys(getters.tasksFiltered).forEach(key => {
        const task = getters.tasksFiltered[key];

        if (task.completed) {
          tasks[key] = task;
        }
      })

      return tasks;
    },
  },
}
