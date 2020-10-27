<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <template v-if="firstAuthStateChanged">
          <q-btn
            v-if="loggedIn"
            class="header-burger"
            dense
            flat
            round
            icon="menu"
            @click="toggleLeftDrawer"
          />

          <router-link
            is="q-btn"
            v-for="link in navs"
            v-if="loggedIn"
            :to="link.to"
            :label="link.label"
            :icon="link.icon"
            :key="link.label"
            :class="{'link-active': $route.path === link.to}"
            flat
            style="height: 100%"
            class="header-menu"
          ></router-link>
        </template>

        <q-toolbar-title
          class="absolute-center all-pointer-events cursor-pointer"
          to="/"
        >
          <router-link
            tag="span"
            to="/"
            class="header-siteName"
          >CodoTodo
          </router-link>

        </q-toolbar-title>

        <template v-if="!firstAuthStateChanged">
          <q-skeleton
            type="QBtn"
            class="login-skeleton bg-white"
            style="position: absolute;right: 16px;"
            animation="pulse"
          />
        </template>

        <template v-if="firstAuthStateChanged">
          <q-btn
            v-if="!loggedIn"
            to="/auth"
            label="Login"
            icon-right="account_circle"
            flat
            class="absolute"
            style="right: 12px"
          ></q-btn>
          <q-btn
            v-if="loggedIn"
            @click="logoutUser"
            to="/auth"
            label="Logout"
            icon-right="account_circle"
            flat
            class="absolute"
            style="right: 12px"
          ></q-btn>
        </template>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="loggedIn && $route.path === '/'"
      v-model="leftDrawerOpen"
      show-if-above
      :width="300"
      :breakpoint="767"
      content-class="bg-primary"
    >
      <q-item-label
        header
        class="q-mt-sm text-grey-4"
      >
        <span>Categories</span>
      </q-item-label>
      <categories-list @category-changed="toggleLeftDrawer"/>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer
      elevated
      v-if="loggedIn"
    >
      <q-tabs align="justify">
        <q-route-tab
          v-for="nav in navs"
          :key="nav.label"
          :to="nav.to"
          :icon="nav.icon"
          :label="nav.label"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import CategoriesList from "components/Tasks/Categories";

  export default {
    name: 'MainLayout',
    components: {CategoriesList},
    data() {
      return {
        leftDrawerOpen: false,
        navs: [
          {
            label: 'Tasks',
            icon: 'list',
            to: '/',
          },
          {
            label: 'Settings',
            icon: 'settings',
            to: '/settings',
          }
        ],
      }
    },
    methods: {
      ...mapActions('auth', ['logoutUser']),
      toggleLeftDrawer() {
        if (window.innerWidth < 768) {
          this.leftDrawerOpen = !this.leftDrawerOpen;
        }
      }
    },
    computed: {
      ...mapState('auth', ['loggedIn', 'firstAuthStateChanged']),
    },
  }
</script>


<style lang="scss">
  .login-skeleton {
    opacity: .2;
  }

  .category {
    &-item {
      font-weight: 400;
      font-size: 17px;
    }
  }

  .link-active {
    background: rgba(#fff, .1);
  }

  .header {
    &-siteName {
      display: none;
    }

    &-menu {
      display: none;
    }
  }

  @media screen and (min-width: 768px) {
    .header-burger {
      display: none;
    }

    .header {
      &-siteName {
        display: inline-block;
      }

      &-menu {
        display: block;
      }
    }

    .q-footer {
      display: none;
    }

    .q-drawer {
      .q-router-link--exact-active {
        color: white !important;
      }
    }
  }
</style>
