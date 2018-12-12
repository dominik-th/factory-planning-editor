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
      <div
        class="repository-component"
        v-for="(item, index) in modules"
        :key="item.id"
        :class="{'selected': item.id === selected}"
        @click="selectModule(item.id)"
        @dblclick="editSelectedModule"
      >
        <FuseHighlight
          :result="item.name"
          :indices="fuseIndices(index)"
        />
        <div class="component-info">
          {{ $tc('modal.in_information', item.inputInformation.length) }}<br />{{ $tc('modal.out_information', item.outputInformation.length) }}
        </div>
      </div>
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
    <ModuleEditModal />
  </div>
</template>

<script>
import FuseHighlight from './FuseHighlight'
import ModuleEditModal from './ModuleEditModal.vue'
export default {
  name: 'ModelRepository',
  components: {
    FuseHighlight,
    ModuleEditModal
  },
  computed: {
    modules() {
      if (this.filter) {
        // the filtered list also contains meta information
        // check fuse.js docs for more information
        return this.$store.getters.filteredPlanningModules(this.filter)
          .map(result => result.item);
      } else {
        return this.$store.getters.planningModules;
      }
    }
  },
  mounted() {
  },
  data() {
    return {
      selected: null,
      modal: null,
      filter: ''
    }
  },
  methods: {
    fuseIndices: function(index) {
      if (this.filter) {
        // we only search the module.name key, thus there is only going to be one match
        // once we also search different keys (abbreviation maybe?), we have to modify this
        return this.$store.getters.filteredPlanningModules(this.filter)[index].matches[0].indices;
      } else {
        return [];
      }
    },
    addModule: function() {
      this.$root.$emit('modal.createModule');
    },
    selectModule: function(id) {
      this.selected = id
    },
    removeSelectedModule: function() {
      if (this.selected) {
        this.$store.commit('REMOVE_PLANNING_MODULE', this.selected);
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
        this.$root.$emit('modal.editModule', this.selected);
      } else {
        this.$notify({
          type: 'warn',
          text: this.$t('warning.no_module_selected')
        });
      }
    }
  }
}
</script>

<style scoped>
.container-repository {
  flex-direction: column;
  display: flex;
  align-items: stretch;
  width: 240px;
  border-right: 1px solid rgba(68, 68, 68, 0.25);
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
.repository-actions > div > button{
  border-radius: 0rem !important;
}
.action-component-edit {
  flex: 1 !important;
}
.repository-component {
  transition: all .2s ease;
  cursor: pointer;
  user-select: none;
  border: 1px solid #999;
  border-radius: .25rem;
  text-align: center;
  min-height: 5rem;
  vertical-align: middle;
  margin: .75rem .5rem .75rem .5rem;
}
.repository-component.selected {
  box-shadow: 0 0 0 0.2rem rgba(40,167,69,.5);
  border-color: #28a745;
  background-color: rgba(0, 255, 0, .1);
}
.component-title {
  font-weight: bold;
}
.component-info {
  font-size: .7rem;
}
.repository-filter {
  padding: 5px;
}
</style>
