import uuidv4 from 'uuid/v4';
import Fuse from 'fuse.js';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export const mutations = {
  SAVE() {
    // do nothing, triggers vuex persisted state
  },
  // replace all existing planning modules
  SET_PLANNING_MODULES(state, modules) {
    state.planningModules = modules;
  },
  // add or override a plannung module
  SET_PLANNING_MODULE(state, { id, module }) {
    Vue.set(state.planningModules, id, module);
  },
  // remove an existing plannung module
  REMOVE_PLANNING_MODULE(state, id) {
    Vue.delete(state.planningModules, id);
  },
  // replace all informations
  SET_INFORMATION_TYPES(state, types) {
    state.informationTypes = types;
  },
  // add or override an information
  SET_INFORMATION_TYPE(state, { id, name }) {
    Vue.set(state.informationTypes, id, { name });
  },
  // sets global attribute on an information by its id
  SET_GLOBAL(state, { id, value }) {
    Vue.set(state.informationTypes[id], 'global', value);
  },
  // add a jointjs like cell to the store
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
  // remove a jointjs like cell from the store
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
  // change position attribute of a cell
  UPDATE_MODELING_POSITION(state, { id, position }) {
    Vue.set(state.modeling.modules[id], 'position', position);
  },
  // update metadata of a modeling cell
  UPDATE_MODELING_ATTRIBUTE(state, { id, attribute, value }) {
    Vue.set(state.modeling.modules[id].attributes, attribute, value);
  },
  // select a modeling cell
  SELECT_MODELING_MODULE(state, id) {
    state.modeling.selected = id;
  },
  // delete an information type
  DELETE_INFORMATION(state, id) {
    Vue.delete(state.informationTypes, id);
  }
};

export const actions = {
  // add a new planning module with a new id
  addPlanningModule({ commit }, module) {
    let id = uuidv4();
    commit('SET_PLANNING_MODULE', { id, module });
    return id;
  },
  // remove planning module with all of its instances in the modeling canvas
  // and clear the selection on the canvas
  async removePlanningModule({ commit, getters, dispatch, state }, id) {
    // remove selection if it is highlighted in the modeling
    if (
      getters.selectedModelingModule &&
      getters.selectedModelingModule.moduleId
    ) {
      commit('SELECT_MODELING_MODULE', null);
    }
    // remove all occurrences in the modeling
    for (let cellId in state.modeling.modules) {
      if (state.modeling.modules[cellId].moduleId === id) {
        await dispatch('removeModelingModule', cellId);
      }
    }
    // remove module from repository
    commit('REMOVE_PLANNING_MODULE', id);
  },
  // add a new information type with new id
  addInformation({ commit }, name) {
    let id = uuidv4();
    commit('SET_INFORMATION_TYPE', { id, name });
    return id;
  },
  // delete an information, if it is not in use anymore
  deleteInformation({ commit, getters }, id) {
    if (getters.allUsedInformation.indexOf(id) < 0) {
      commit('DELETE_INFORMATION', id);
    }
  },
  // remove an instance of a planning module from the modeling canvas
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
  // updates the position attribute of an instance if it actually has moved
  moveModelingModule({ commit, state }, { id, position }) {
    if (
      state.modeling.modules[id] &&
      state.modeling.modules[id].position !== position
    ) {
      commit('UPDATE_MODELING_POSITION', { id, position });
    }
  }
};

export const getters = {
  fullState(state) {
    return state;
  },
  planningModules(state) {
    return state.planningModules;
  },
  // convert planning modules to an array and include the id inside the object
  // the given array is searchable by fuse.js
  searchablePlanningModules(state) {
    return Object.keys(state.planningModules).map(key => {
      return { id: key, ...state.planningModules[key] };
    });
  },
  // returns a function with pre set fuse.js configuration which allowes to search
  // the whole repository
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
  },
  // returns an array of information ids which are in use as input information
  allInputInformation(state) {
    let inputInformation = new Set();
    for (let planningModuleId in state.planningModules) {
      for (let id of state.planningModules[planningModuleId].inputInformation) {
        inputInformation.add(id);
      }
    }
    return [...inputInformation];
  },
  // returns an array of information ids which are in use as output information
  allOutputInformation(state) {
    let outputInformation = new Set();
    for (let planningModuleId in state.planningModules) {
      for (let id of state.planningModules[planningModuleId]
        .outputInformation) {
        outputInformation.add(id);
      }
    }
    return [...outputInformation];
  },
  // returns an array of information ids which are in use either input, or output
  allUsedInformation(state, getters) {
    return [
      ...new Set([
        ...new Set(getters.allInputInformation),
        ...new Set(getters.allOutputInformation)
      ])
    ];
  },
  // returns an array all input information which are never used as output information
  // thus potentially global
  allGlobalInformation(state) {
    return Object.keys(state.informationTypes).filter(
      ele => state.informationTypes[ele].global
    );
  }
};

export const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    // stores state on each mutation in local storage
    createPersistedState({
      key: 'application_state'
    })
  ],
  // initial state
  state: {
    planningModules: {},
    informationTypes: {},
    modeling: {
      modules: {},
      links: {},
      selected: null
    }
  },
  mutations,
  actions,
  getters
});
