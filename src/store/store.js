import uuidv4 from 'uuid/v4';
import Fuse from 'fuse.js';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    createPersistedState({
      key: 'application_state'
    })
  ],
  state: {
    planningModules: {},
    informationTypes: {},
    modeling: {
      modules: {},
      links: {},
      selected: null
    }
  },
  mutations: {
    SAVE() {
      // do nothing, triggers vuex persisted state
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
      Vue.set(state.informationTypes, id, { name });
    },
    SET_MODELING_CELL(state, { type, id, cell }) {
      switch (type) {
        case 'module':
          Vue.set(state.modeling.modules, id, cell);
          break;
        case 'link':
          Vue.set(state.modeling.links, id, cell);
          break;
      }
    },
    REMOVE_MODELING_CELL(state, { type, id }) {
      switch (type) {
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
    },
    UPDATE_MODELING_ATTRIBUTE(state, { id, attribute, value }) {
      Vue.set(state.modeling.modules[id].attributes, attribute, value);
    },
    SELECT_MODELING_MODULE(state, id) {
      state.modeling.selected = id;
    }
  },
  actions: {
    addPlanningModule({ commit }, module) {
      let id = uuidv4();
      commit('SET_PLANNING_MODULE', { id, module });
      return id;
    },
    async removePlanningModule({ commit, dispatch, state }, id) {
      // remove all occurrences in the modeling
      for (let cellId in state.modeling.modules) {
        if (state.modeling.modules[cellId].moduleId === id) {
          await dispatch('removeModelingModule', cellId);
        }
      }
      // remove module from repository
      commit('REMOVE_PLANNING_MODULE', id);
    },
    addInformation({ commit }, name) {
      let id = uuidv4();
      commit('SET_INFORMATION_TYPE', { id, name });
      return id;
    },
    removeModelingModule({ commit, state }, id) {
      // remove all connected links
      for (let linkId in state.modeling.links) {
        let link = state.modeling.links[linkId];
        if (link.fromModule === id || link.toModule === id) {
          commit('REMOVE_MODELING_CELL', {
            type: 'link',
            id: linkId
          });
        }
      }
      // remove the module itself
      commit('REMOVE_MODELING_CELL', {
        type: 'module',
        id
      });
    },
    moveModelingModule({ commit, state }, { id, position }) {
      if (
        state.modeling.modules[id] &&
        state.modeling.modules[id].position !== position
      ) {
        commit('UPDATE_MODELING_POSITION', { id, position });
      }
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
        keys: ['name']
      };
      let fuse = new Fuse(getters.searchablePlanningModules, fuseOptions);
      return keyword => fuse.search(keyword);
    },
    informationTypes(state) {
      return state.informationTypes;
    },
    modeling(state) {
      return state.modeling;
    },
    selectedModelingModuleId(state) {
      return state.modeling.selected;
    },
    selectedModelingModule(state) {
      if (state.modeling.selected) {
        return state.modeling.modules[state.modeling.selected];
      }
      return null;
    }
  }
});
