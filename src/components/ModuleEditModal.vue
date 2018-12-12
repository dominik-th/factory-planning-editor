<template>
  <div>
    <b-modal
      id="myModal"
      size="lg"
      ref="myModalRef"
      ok-variant="success"
      :title="title"
      :ok-title="$t('generic.save')"
      :cancel-title="$t('generic.cancel')"
      @ok="save"
      @show="clearInformationPicker"
    >
      <div>
        <div class="modal-body module-edit-wrapper">
          <div class="information-picker-wrapper">
            <InformationPicker
              ref="inputPicker"
              :placeholder="$t('modal.information_picker_in')"
              :pool="informationPool"
              :blacklist="informationBlacklist"
              @add-information="addInputInformation"
              @create-information="createInputInformation"
            />
            <div class="information-list">
              <b-list-group v-if="module.inputInformation.length">
                <b-list-group-item
                  class="d-flex justify-content-between align-items-center"
                  v-for="informationId in module.inputInformation"
                  :key="informationId"
                >
                  {{ $store.getters.informationTypes[informationId].name }}
                  <font-awesome-icon
                    class="text-danger information-trash"
                    icon="trash-alt"
                    @click="removeInformation('in', informationId)"
                  />
                </b-list-group-item>
              </b-list-group>
              <div v-else>
                <div class="empty-list text-secondary">
                  <font-awesome-icon icon="list" />
                  <div>
                    {{ $t('modal.no_in_information') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="module-edit-name">
            <div class="repository-component">
              <div class="component-title">
                <b-form-input v-model="module.name"
                  size="sm"
                  type="text"
                  :placeholder="$t('modal.module_placeholder')"
                />
              </div>
              <div class="component-info">
                {{ $tc('modal.in_information', module.inputInformation.length) }}<br />{{ $tc('modal.out_information', module.outputInformation.length) }}
              </div>
            </div>
          </div>
          <div class="information-picker-wrapper">
            <InformationPicker
              ref="outputPicker"
              :placeholder="$t('modal.information_picker_out')"
              :pool="informationPool"
              :blacklist="informationBlacklist"
              @add-information="addOutputInformation"
              @create-information="createOutputInformation"
            />
            <div class="information-list">
              <b-list-group v-if="module.outputInformation.length">
                <b-list-group-item
                  class="d-flex justify-content-between align-items-center"
                  v-for="informationId in module.outputInformation"
                  :key="informationId"
                >
                  {{ $store.getters.informationTypes[informationId].name }}
                  <font-awesome-icon
                    class="text-danger information-trash"
                    icon="trash-alt"
                    @click="removeInformation('out', informationId)"
                  />
                </b-list-group-item>
              </b-list-group>
              <div v-else>
                <div class="empty-list text-secondary">
                  <font-awesome-icon icon="list" />
                  <div>
                    {{ $t('modal.no_out_information') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import InformationPicker from './InformationPicker.vue'
export default {
  name: 'ModuleEditModal',
  components: {
    InformationPicker
  },
  data() {
    return {
      moduleId: null,
      module: {
        inputInformation: [],
        outputInformation: [],
        name: null,
        abbreviation: null
      }
    }
  },
  computed: {
    title() {
      return this.moduleId ? this.$t('modal.edit_module') : this.$t('modal.create_module')
    },
    informationBlacklist() {
      // blacklist consisting of all already assigned input and output information
      return this.module.inputInformation
        .concat(this.module.outputInformation)
        .map(id => this.$store.getters.informationTypes[id].name);
    },
    informationPool() {
      // all the remaining existing information types which arent blacklisted
      let informationPool = [];
      for (let id in this.$store.getters.informationTypes) {
        if (this.module.inputInformation.indexOf(parseInt(id)) < 0 &&
            this.module.outputInformation.indexOf(parseInt(id)) < 0) {
          informationPool.push({
            id: parseInt(id),
            ...this.$store.getters.informationTypes[id]
          });
        }
      }
      return informationPool;
    },
  },
  mounted() {
    this.$root.$on('modal.editModule', (moduleId) => {
      this.moduleId = moduleId;
      // clone module so we dont change vuex state directly
      this.module = JSON.parse(JSON.stringify(this.$store.getters.planningModuleById(moduleId)));
      this.$refs.myModalRef.show();
    });
    this.$root.$on('modal.createModule', () => {
      // create a blank module which will be filled in this modal
      this.moduleId = null;
      this.module = {
        inputInformation: [],
        outputInformation: [],
        name: null,
        abbreviation: null
      }
      this.$refs.myModalRef.show();
    });
  },
  beforeDestroy() {
    // unlink the event subscriptions
    // otherwise it could cause duplicate responses on remounting (live reloading for example)
    this.$root.$off('modal.editModule');
    this.$root.$off('modal.createModule');
  },
  methods: {
    clearInformationPicker: function() {
      // the modal component itself is never unmounted so we clear previous data manually
      this.$refs.inputPicker.clear();
      this.$refs.outputPicker.clear();
    },
    save: function(evt) {
      // empty names are not allowed
      if (!this.module.name) {
        this.$notify({
          type: 'warn',
          text: this.$t('warning.empty_module_name')
        });
        // prevent closing the modal
        return evt.preventDefault();
      }
      if (this.moduleId) {
        // update existing module
        this.$store.commit('EDIT_PLANNING_MODULE', this.module);
      } else {
        // create a new module
        this.$store.commit('ADD_PLANNING_MODULE', this.module);
      }
    },
    addInputInformation: function(id) {
      this.module.inputInformation.push(id);
    },
    createInputInformation: async function(name) {
      this.module.inputInformation.push(await this.$store.dispatch('addInformation', name));
    },
    addOutputInformation: function(id) {
      this.module.outputInformation.push(id);
    },
    createOutputInformation: async function(name) {
      this.module.outputInformation.push(await this.$store.dispatch('addInformation', name));
    },
    removeInformation: function(type, id) {
      if (type === 'in') {
        this.module.inputInformation = this.module.inputInformation.filter(module => module !== id)
      } else if (type === 'out') {
        this.module.outputInformation = this.module.outputInformation.filter(module => module !== id)
      }
    }
  }
}
</script>

<style scoped>
.empty-list {
  padding-top: 1.25em;
  text-align: center;
}
.empty-list svg {
  font-size: 3em;
}
.repository-component {
  transition: all .2s ease;
  user-select: none;
  border: 1px solid #999;
  border-radius: .25rem;
  text-align: center;
  min-height: 5rem;
  vertical-align: middle;
  margin: .75rem .5rem .75rem .5rem;
}
.information-trash {
  cursor: pointer;
}
.information-picker-wrapper {
  flex: 3;
}
.component-title {
  font-weight: bold;
  margin: .5em .5em .2em .5em;
  text-align: center;
}
.component-title input {
  text-align: center;
}
.component-info {
  font-size: .7rem;
}
.module-edit-wrapper {
  display: flex;
  max-height: 70vh;
}
.module-edit-information-in {
  flex: 1;
}
.information-picker {
  padding: 1.25em 0em .2em 0em;
}
.information-list {
  /*max-height: 50vh;*/
  height: 200px;
  overflow-y: auto;
}
.information-list > .list-group > .list-group-item {
  padding-top: .50rem;
  padding-bottom: .50rem;
}
.information-list i {
  color: red;
}
.module-edit-name {
  align-self: center;
  flex: 2;
}
.module-edit-information-out {
  flex: 3;
}
</style>
