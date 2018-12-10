<template>
  <div class="container-repository">
    <div class="repository-filter">
      <input type="text" class="form-control form-control-sm" id="repository-filter-textbox" placeholder="Filter..." v-model="filter">
    </div>
    <div class="repository-components">
      <div class="repository-component" v-for="item in modules" v-on:click="selectModule(item.id)" v-bind:class="{'selected': item.id === selected}">
        <div class="component-title">
          {{ item.name }}
        </div>
        <div class="component-info">
          {{ $tc('modal.in_information', item.inputInformation.length) }} / {{ $tc('modal.out_information', item.outputInformation.length) }}
        </div>
      </div>
    </div>
    <div class="repository-actions">
      <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-secondary" v-on:click="addModule"><font-awesome-icon icon="plus" /></button>
        <button type="button" class="btn btn-secondary action-component-edit" @click="editSelectedModule"><font-awesome-icon icon="pen" /> {{ $t('generic.edit') }}</button>
        <button type="button" class="btn btn-secondary" v-on:click="removeSelectedModule"><font-awesome-icon icon="minus" /></button>
      </div>
    </div>
    <ModuleEditModal />
  </div>
</template>

<script>
import ModuleEditModal from './ModuleEditModal.vue'
export default {
  name: 'ModelRepository',
  components: {
    ModuleEditModal
  },
  computed: {
    modules() {
      if (this.filter) {
        return this.$store.getters.filteredPlanningModules(this.filter);
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
    addModule: function(evt) {
      this.$root.$emit('addModule', 'payload');
      this.$root.$emit('modal.createModule');
    },
    selectModule: function(evt) {
      this.selected = evt
    },
    removeSelectedModule: function(evt) {
      if (this.selected) {
        this.$store.commit('REMOVE_PLANNING_MODULE', this.selected);
        this.selected = null;
      }
    },
    editSelectedModule: function(evt,a,b) {
      if (this.selected) {
        this.$root.$emit('modal.editModule', this.selected);
      } else {
        // todo: err, no module selected
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
  cursor: pointer;
  border: 1px solid #999;
  border-radius: 1rem;
  text-align: center;
  min-height: 5rem;
  vertical-align: middle;
  margin: 1.25rem .5rem 1.25rem .5rem;
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
