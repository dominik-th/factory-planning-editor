import uuidv4 from 'uuid/v4'
import Fuse from 'fuse.js'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [createPersistedState({
    key: 'application_state'
  })],
  state: {
    planningModules: {},
    informationTypes: {},
    modeling: {
      modules: {},
      links: {}
    }
  },
  mutations: {
    SET_FULL_STATE(state, importedState) {
      for (let key in importedState) {
        state[key] = importedState[key];
      }
    },
    SET_PLANNING_MODULES(state, modules) {
      state.planningModules = modules;
    },
    SET_PLANNING_MODULE(state, { id, module }) {
      Vue.set(state.planningModules, id, module);
    },
    REMOVE_PLANNING_MODULE(state, id) {
      Vue.delete(state.planningModules, id);
    },
    SET_INFORMATION_TYPES(state, types) {
      state.informationTypes = types;
    },
    SET_INFORMATION_TYPE(state, { id, name }) {
      Vue.set(state.informationTypes, id, {name});
    },
    SET_MODELING_CELL(state, { type, id, cell }) {
      switch(type) {
        case 'module':
          Vue.set(state.modeling.modules, id, cell);
          break;
        case 'link':
          Vue.set(state.modeling.links, id, cell);
          break;
      }
    },
    REMOVE_MODELING_CELL(state, { type, id }) {
      switch(type) {
        case 'module':
          Vue.delete(state.modeling.modules, id);
          break;
        case 'link':
          Vue.delete(state.modeling.links, id);
          break;
      }
    },
    UPDATE_MODELING_POSITION(state, { id, position }) {
      Vue.set(state.modeling.modules[id], 'position', position);
    }

  },
  actions: {
    addPlanningModule({ commit }, module) {
      let id = uuidv4();
      commit('SET_PLANNING_MODULE', {id, module});
      return id;
    },
    addInformation({ commit }, name) {
      let id = uuidv4();
      commit('SET_INFORMATION_TYPE', {id, name});
      return id;
    }
  },
  getters: {
    fullState(state) {
      return state;
    },
    planningModules(state) {
      return state.planningModules;
    },
    searchablePlanningModules(state) {
      return Object.keys(state.planningModules).map(key => {
        return { id: key, ...state.planningModules[key] };
      });
    },
    filteredPlanningModules(state, getters) {
      let fuseOptions = {
        shouldSort: true,
        includeMatches: true,
        threshold: 0.6,
        location: 0,
        minMatchCharLength: 1,
        keys: [
          "name"
        ]
      };
      let fuse = new Fuse(getters.searchablePlanningModules, fuseOptions);
      return keyword => fuse.search(keyword);
    },
    informationTypes(state) {
      return state.informationTypes;
    }
  }
})
