<template>
  <div class="container-repository">
    <div class="repository-filter">
      <b-form-input
        size="sm"
        v-model="filter"
        :placeholder="$t('generic.filter')"
      />
    </div>
    <div class="repository-components">
      <drag
        class="repository-component"
        v-for="(module, key) in modules"
        drop-effect="copy"
        :effect-allowed="['copy']"
        :transfer-data="key"
        :key="key"
        :class="{'selected': key === selected}"
        @click.native="selectModule(key)"
        @dblclick.native="editSelectedModule"
      >
        <FuseHighlight
          :result="module.name"
          :indices="fuseIndices(key)"
        />
        <div class="component-info">
          {{ $tc('modal.in_information', module.inputInformation.length) }}
          <br />
          {{ $tc('modal.out_information', module.outputInformation.length) }}
        </div>
      </drag>
    </div>
    <div class="repository-actions">
      <b-button-group size="sm">
        <b-button @click="addModule"><font-awesome-icon icon="plus" /></b-button>
        <b-button
          class="action-component-edit"
          @click="editSelectedModule"
        >
          <font-awesome-icon icon="pen" /> {{ $t('generic.edit') }}
        </b-button>
        <b-button @click="removeSelectedModule"><font-awesome-icon icon="minus" /></b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
import FuseHighlight from './FuseHighlight';

import { Drag } from 'vue-drag-drop';

export default {
  name: 'ModelRepository',
  components: {
    FuseHighlight,
    Drag
  },
  computed: {
    modules() {
      if (this.filter) {
        let filteredModules = {};
        // the filtered list also contains meta information
        // check fuse.js docs for more information
        let fuseFilteredModules = this.$store.getters.filteredPlanningModules(
          this.filter
        );
        // bring the search result in the same structure as the planning modules in store
        for (let module of fuseFilteredModules) {
          filteredModules[module.item.id] = module.item;
        }
        return filteredModules;
      } else {
        return this.$store.getters.planningModules;
      }
    }
  },
  data() {
    // initial state, none selected, filter empty
    return {
      selected: null,
      filter: ''
    };
  },
  methods: {
    fuseIndices: function(id) {
      if (this.filter) {
        // we only search the module.name key, thus there is only going to be one match
        // once we also search different keys (abbreviation maybe?), we have to modify this
        // and include multiple matches
        return this.$store.getters
          .filteredPlanningModules(this.filter)
          .find(fuseResult => fuseResult.item.id === id).matches[0].indices;
      } else {
        return [];
      }
    },
    addModule: function() {
      // show modal ModuleEditModal.vue
      this.$root.$emit('modal.createModule');
    },
    selectModule: function(id) {
      this.selected = id;
    },
    removeSelectedModule: function() {
      if (this.selected) {
        // remove selected module from vuex store
        this.$store.dispatch('removePlanningModule', this.selected);
        // remove selection
        this.selected = null;
      } else {
        this.$notify({
          type: 'warn',
          text: this.$t('warning.no_module_selected')
        });
      }
    },
    editSelectedModule: function() {
      if (this.selected) {
        // show modal ModuleEditModal.vue
        this.$root.$emit('modal.editModule', this.selected);
      } else {
        this.$notify({
          type: 'warn',
          text: this.$t('warning.no_module_selected')
        });
      }
    }
  }
};
</script>

<style scoped>
.container-repository {
  flex-direction: column;
  display: flex;
  align-items: stretch;
  min-width: 13rem;
  max-width: 16rem;
  border-right: 2px solid rgba(68, 68, 68, 0.25);
}
.repository-components {
  flex: 1;
  border-top: 1px solid rgba(68, 68, 68, 0.25);
  border-bottom: 1px solid rgba(68, 68, 68, 0.25);
  overflow-y: auto;
}
.repository-actions > div {
  display: flex;
}
.repository-actions > div > button {
  border-radius: 0rem !important;
}
.action-component-edit {
  flex: 1 !important;
}
.repository-component {
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  border: 1px solid #999;
  border-radius: 0.25rem;
  text-align: center;
  min-height: 5rem;
  vertical-align: middle;
  margin: 0.75rem 0.5rem 0.75rem 0.5rem;
}
.repository-component.selected {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);
  border-color: #28a745;
  background-color: rgba(0, 255, 0, 0.1);
}
.component-title {
  font-weight: bold;
}
.component-info {
  font-size: 0.7rem;
}
.repository-filter {
  padding: 5px;
}
</style>
