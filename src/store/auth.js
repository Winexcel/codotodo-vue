import {firebaseAuth} from 'boot/firebase'
import {LocalStorage} from "quasar";
import {showErrorMessage} from "src/functions/show-error-message";
import {Loading} from 'quasar'

export default {
  namespaced: true,
  state: {
    loggedIn: false,
    firstAuthStateChanged: false,
  },
  mutations: {
    setLoggedIn(state, payload) {
      state.loggedIn = payload;
    },
    setFirstAuthStateChanged(state) {
      state.firstAuthStateChanged = true;
    }
  },
  actions: {
    registerUser({}, payload) {
      Loading.show();
      firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          console.log('response:', response);

        })
        .catch(error => {
          showErrorMessage(error.message);
          console.log('error message:', error.message);
        })
    },
    loginUser({}, payload) {
      Loading.show();
      firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          console.log('response:', response);
        })
        .catch(error => {
          showErrorMessage(error.message);
          console.log('error message:', error.message);
        })
    },
    logoutUser() {
      firebaseAuth.signOut();
    },
    authStateChanged({commit, state, dispatch}) {
      firebaseAuth.onAuthStateChanged(user => {
        Loading.hide();
        if (user) {
          commit('setLoggedIn', true);
          LocalStorage.set('loggedIn', true);
          if(this.$router.app.$route.path !== '/') {
            this.$router.push('/');
          }
          dispatch('tasks/fbReadDataBase', null, {root: true});
        } else {
          commit('setLoggedIn', false);
          commit('tasks/setTasksDownloaded', false, {root: true});
          commit('tasks/clearCategories', false, {root: true});
          LocalStorage.set('loggedIn', false);
          // this.$router.replace('/auth');
        }

        if (!state.firstAuthStateChanged) {
          commit('setFirstAuthStateChanged');
        }
      })
    }
  },
  getters: {},
}
