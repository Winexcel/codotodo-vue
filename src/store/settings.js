import { LocalStorage } from 'quasar'

export default {
  namespaced: true,
  state: {
    settings: {
      show12HourTimeFormat: false,
      showTasksInOneList: false,
    }
  },
  mutations: {
    setShow12HourTimeFormat(state, payload) {
      state.settings.show12HourTimeFormat = payload;
    },
    setShowTasksInOneList(state, payload) {
      state.settings.showTasksInOneList = payload;
    },
    setSettings(state, payload) {
      Object.assign(state.settings, payload);
    }
  },
  actions: {
    setShow12HourTimeFormat({commit, dispatch}, payload) {
      commit('setShow12HourTimeFormat', payload);
      dispatch('saveSettings');
    },
    setShowTasksInOneList({commit, dispatch}, payload) {
      commit('setShowTasksInOneList', payload);
      dispatch('saveSettings');
    },
    saveSettings({state}) {
      LocalStorage.set('settings', state.settings);
    },
    getSettings({commit}) {
      const settings = LocalStorage.getItem('settings');
      if(settings) {
        commit('setSettings', settings);
      }
    }
  },
  getters: {
    settings(state) {
      return state.settings;
    }
  },
}
