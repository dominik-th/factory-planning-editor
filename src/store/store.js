import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    planningModules: [],
    informationTypes: []
  },
  mutations: {
    SET_PLANNING_MODULES(state, modules) {
      state.planningModules = modules;
    },
    ADD_PLANNING_MODULE(state, module) {
      state.planningModules.push(module);
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
    }
  },
  actions: {},
  getters: {
    planningModules(state) {
      return state.planningModules;
    },
    informationTypes(state) {
      return state.informationTypes;
    },
    filteredPlanningModules(state) {
      return keyword => state.planningModules.filter(item => {
        return (item.id + '').indexOf(keyword) >= 0;
      });
    }
  }
})
