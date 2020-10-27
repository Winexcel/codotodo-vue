<template>
  <div ref="drawerList">
    <q-list dark>
      <q-item
        clickable
        v-ripple
        exact
        class="category-item"
        :active="activeCategory === 'All'"
        @click="setActiveCategory('All')"
      >
        <q-item-section>All</q-item-section>
      </q-item>
      <draggable
        @start="dragging = true"
        @end="dragging = false"
        :disabled="!draggingEnabled"
        :class="{'hide-fallback': !draggingEnabled}"
        :force-fallback="true"
        :fallback-tolerance="10"
      >
        <q-item
          v-for="(category) in categoriesList"
          clickable
          v-ripple
          exact
          :key="category"
          class="category-item"
          :active="activeCategory === category"

          @touchstart="touchStart($event, category)"
          @touchend="touchEnd"
        >
          <q-item-section
            @click="setActiveCategory(category)"
            @dblclick.stop="editCategory(category)"
          >
            <span v-if="categoryEditedName !== category">{{ category }}</span>
            <q-input
              :value="category"
              :ref="category + 'InputCategory'"
              v-if="categoryEditedName === category"
              class="all-pointer-events"
              @blur="commitEditedCategory"
              @keydown.enter="commitEditedCategory"
              @click.stop
              v-model="categoryEditedNewName"
              dark
              color="white"
              dense
              type="text"
            />
          </q-item-section>

          <q-item-section side>
            <q-btn
              @click.stop=""
              flat
              round
              @click="confirmDeleteCategory(category)"
              icon="delete"
            />
          </q-item-section>
        </q-item>
      </draggable>
    </q-list>

    <q-separator
      class="q-mt-sm q-mb-sm"
      style="background: white; opacity: .2"
    />

    <template>
      <div class="newListName">
        <q-btn
          size="md"
          flat
          align="left"
          style=""
          color="white"
          @click="showNewListInput = true"
          style="width: 100%"
          :class="{'no-pointer-events': showNewListInput}"
        >
          <q-icon name="add"/>
          <span
            class="q-ml-sm"
            v-show="!showNewListInput"
          >Add New Category</span>
        </q-btn>

        <input
          v-show="showNewListInput"
          v-model="newListName"
          class="q-ml-sm newListName-input newListName-input__white"
          type="text"
          ref="newListInput"
          @blur="showNewListInput = false; newListName = ''"
          @keyup.enter="addNewList"
        >
      </div>
    </template>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {mapState, mapActions} from 'vuex';
  import {showErrorMessage} from "src/functions/show-error-message";
  import draggable from 'vuedraggable'

  export default Vue.extend({
    name: 'categories-list',
    components: {draggable},
    data() {
      return {
        newListName: '',
        showNewListInputVal: false,
        mapLists: new Map(),
        categoryEditedName: '',
        categoryEditedNewName: '',
        categoryLongTouched: false,

        dragging: false,
        draggingEnabled: true,
      };
    },
    computed: {
      ...mapState('tasks', ['categories', 'activeCategory']),
      showNewListInput: {
        get() {
          return this.showNewListInputVal;
        },
        set(value) {
          this.showNewListInputVal = value;
          this.$nextTick(() => {
            if (value === true) {
              this.$refs.newListInput.focus();
            }
          })
        }
      },
      categoriesList() {
        const categoriesKeys = Object.keys(this.categories).map(c => this.categories[c].name);
        return categoriesKeys.filter(categoryKey => categoryKey.toLowerCase() !== 'all');
      }
    },
    updated() {
      console.log('updated');
    },
    methods: {
      ...mapActions('tasks', ['addCategory', 'deleteCategory', 'updateCategory']),
      confirmDeleteCategory(categoryName) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Do you really want to delete <b>${categoryName}</b> category?`,
          cancel: true,
          html: true,
        }).onOk(() => {
          this.deleteCategory({name: categoryName});
        })
      },
      setActiveCategory(category) {
        this.$emit('category-changed', category);
        this.$store.commit('tasks/setActiveCategory', category);
      },
      addNewList() {
        if (this.newListName.toLowerCase() === 'all' ||
          this.categoriesList.map(c => c.toLowerCase()).includes(this.newListName.toLowerCase())) {
          showErrorMessage('This category name is already in use.');
          return;
        }

        if (this.newListName) {
          this.addCategory({name: this.newListName});
          this.newListName = '';
          this.showNewListInput = false;
        }
      },
      async editCategory(key) {
        console.log('editCategory');

        this.draggingEnabled = false;
        this.categoryEditedName = key;
        this.categoryEditedNewName = key;

        await this.$nextTick();

        if (this.$refs[key + 'InputCategory']) {
          const input = this.$refs[key + 'InputCategory'][0].$el.querySelector('input');
          input.focus();
        }
      },
      commitEditedCategory() {
        this.draggingEnabled = true;

        if (!this.categoryEditedNewName) {
          this.categoryEditedName = ''
          return
        }

        if (!this.categoryEditedNewName === this.categoryEditedName) {
          this.categoryEditedName = ''
          return
        }

        if (this.categoriesList.map(c => c.toLowerCase()).includes(this.categoryEditedNewName.toLowerCase()) &&
          this.categoryEditedName.toLowerCase() !== this.categoryEditedNewName.toLowerCase()) {
          showErrorMessage('This category name already in use.');
          this.categoryEditedName = ''
          return
        }

        this.updateCategory({
          name: this.categoryEditedName,
          updates: {name: this.categoryEditedNewName}
        });

        this.categoryEditedName = ''
      },
      touchStart(event, category) {
        this.categoryLongTouched = true;

        this.$store.commit('tasks/setActiveCategory', category);
        event.stopImmediatePropagation();
        setTimeout(() => {
          // if it's long touch then edit category
          if (this.categoryLongTouched && !this.dragging) {
            this.editCategory(category);
          }
        }, 1000);
      },
      touchEnd() {
        this.categoryLongTouched = false;
      },
    }
  })
</script>

<style
  lang="scss"
  scoped
>
  .newListName {
    position: relative;

    &-input {
      width: 233px;
      position: absolute;
      left: 38px;
      line-height: 33px;
      border: none;
      outline: none;
      background: none;
      font-weight: 500;

      &__white {
        color: white;
      }
    }
  }

  .q-item--active {
    background: rgba(#fff, .1);
    color: white;
  }

  .list-group-item {
    padding: 20px;
    color: #fff;
  }
</style>

<style>
  /*  .sortable-chosen.sortable-ghost {
      opacity: 0;
    }
    .sortable-fallback {
      opacity: 1 !important;
    }
  */
  .hide-fallback .sortable-fallback {
    opacity: 0 !important;
  }

</style>
