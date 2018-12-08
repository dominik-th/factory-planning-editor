<template>
  <div class="container-repository">
    <div class="repository-filter">
      <input type="text" class="form-control form-control-sm" id="repository-filter-textbox" placeholder="Filter..." v-model="filter">
    </div>
    <div class="repository-components">
      <div class="repository-component" v-for="item in modules" v-on:click="selectModule(item.id)" v-bind:class="{'selected': item.id === selected}">
        <div class="component-title">
          {{ item.name }}<br/>{{ item.id }}
        </div>
        <div class="component-info">
          6 Eingabe- / 8 Ausgabeinformationen
        </div>
      </div>
    </div>
    <div class="repository-actions">
      <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-secondary" v-on:click="addModule"><i class="fas fa-plus"></i></button>
        <button type="button" class="btn btn-secondary action-component-edit"><i class="fas fa-pen"></i> Edit</button>
        <button type="button" class="btn btn-secondary" v-on:click="removeSelectedModule"><i class="fas fa-minus"></i></button>
      </div>
    </div>
    <b-btn v-b-modal="'myModal'">Launch demo modal</b-btn>
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
      filter: ''
    }
  },
  methods: {
    addModule: function(evt) {
      let randomNames  = ['Zielplanung', 'Brandschutzplanung', 'Testplanung', 'Planung 9001']
      this.$store.commit('ADD_PLANNING_MODULE', {
        id: Math.random(),
        name: randomNames[Math.floor(Math.random() * randomNames.length)]
      });
      this.$root.$emit('addModule', 'payload');
    },
    selectModule: function(evt) {
      this.selected = evt
    },
    removeSelectedModule: function(evt) {
      if (this.selected) {
        this.$store.commit('REMOVE_PLANNING_MODULE', this.selected);
        this.selected = null;
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-repository {
  flex-direction: column;
  display: flex;
  align-items: stretch;
  /*background-color: red;*/
  width: 240px;
  border-right: 1px solid rgba(68, 68, 68, 0.25);
}
.repository-components {
  flex: 1;
  border-top: 1px solid rgba(68, 68, 68, 0.25);
  border-bottom: 1px solid rgba(68, 68, 68, 0.25);
  overflow-y: scroll;
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
  background-color: rgba(0, 255, 0, .2);
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
