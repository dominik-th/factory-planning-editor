import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  plugins: [createPersistedState({
    key: 'application_state'
  })],
  state: {
    planningModules: [],
    informationTypes: {}
  },
  mutations: {
    SET_PLANNING_MODULES(state, modules) {
      state.planningModules = modules;
    },
    ADD_PLANNING_MODULE(state, module) {
      // get highest id in use by planning modules
      let max = state.planningModules.reduce((max, ele) => ele.id > max ? ele.id : max, 0);
      state.planningModules.push({
        id: max + 1,
        ...module
      });
    },
    EDIT_PLANNING_MODULE(state, module) {
      for (let i = 0; i < state.planningModules.length; i++) {
        if (state.planningModules[i].id === module.id) {
          Vue.set(state.planningModules, i, module);
        }
      }
    },
    REMOVE_PLANNING_MODULE(state, module) {
      let id = module;
      if (typeof(module) === 'object') {
        id = module.id;
      }
      state.planningModules = state.planningModules.filter((module) => {
        return module.id !== id;
      });
    },
    SET_INFORMATION_TYPES(state, types) {
      state.informationTypes = types;
    },
    ADD_INFORMATION_TYPE(state, { id, name }) {
      Vue.set(state.informationTypes, id, {name});
      // let max = state.informationTypes.reduce((max, ele) => ele.id > max ? ele.id : max, 0);
      // state.informationTypes.push({
      //   id: max + 1,
      //   name: type
      // });
    }
  },
  actions: {
    editModule({ commit, state }) {

    },
    addInformation({ commit, state }, name) {
      // get highest id in use by information types
      let max = Math.max(0, ...Object.keys(state.informationTypes));
      commit('ADD_INFORMATION_TYPE', {id: max + 1, name});
      return max + 1;
    }
  },
  getters: {
    planningModules(state) {
      return state.planningModules;
    },
    planningModuleById(state) {
      // todo: fix this method
      return id => state.planningModules.filter(item => {
        return item.id === id;
      })[0];
    },
    filteredPlanningModules(state) {
      return keyword => state.planningModules.filter(item => {
        return (item.name + '').indexOf(keyword) >= 0;
      });
    },
    informationTypes(state) {
      return state.informationTypes;
    }
  }
})
