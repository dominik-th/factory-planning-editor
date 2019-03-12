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
      @hidden="clearModal"
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
              :pool="informationPoolOutput"
              :blacklist="informationBlacklistOutput"
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
import InformationPicker from './InformationPicker.vue';
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
    };
  },
  computed: {
    title() {
      // this modal is reused for creating new modules
      // and editing existing ones
      // use modal title accordingly
      return this.moduleId
        ? this.$t('modal.edit_module')
        : this.$t('modal.create_module');
    },
    informationBlacklist() {
      // blacklist consisting of all already assigned input and output information
      return this.module.inputInformation
        .concat(this.module.outputInformation)
        .map(id => this.$store.getters.informationTypes[id].name);
    },
    informationBlacklistOutput() {
      // same as blacklist, but also include global information
      return this.$store.getters.allGlobalInformation
        .map(id => this.$store.state.informationTypes[id].name)
        .concat(this.informationBlacklist);
    },
    informationPool() {
      // all the remaining existing information types which arent blacklisted
      let informationPool = [];
      for (let id in this.$store.getters.informationTypes) {
        if (
          this.module.inputInformation.indexOf(id) < 0 &&
          this.module.outputInformation.indexOf(id) < 0
        ) {
          informationPool.push({
            id,
            ...this.$store.getters.informationTypes[id]
          });
        }
      }
      return informationPool;
    },
    informationPoolOutput() {
      // informationPool without global informations
      return this.informationPool.filter(information => !information.global);
    }
  },
  mounted() {
    // show modal when the event is fired (edit existing)
    this.$root.$on('modal.editModule', moduleId => {
      this.moduleId = moduleId;
      // clone module so we dont change vuex state directly
      this.module = JSON.parse(
        JSON.stringify(this.$store.getters.planningModules[moduleId])
      );
      this.$refs.myModalRef.show();
    });
    // show modal when the event is fired (create new)
    this.$root.$on('modal.createModule', () => {
      // create a blank module which will be filled in this modal
      this.moduleId = null;
      this.module = {
        inputInformation: [],
        outputInformation: [],
        name: null,
        abbreviation: null
      };
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
    clearModal: function() {
      this.moduleId = null;
      this.module = {
        inputInformation: [],
        outputInformation: [],
        name: null,
        abbreviation: null
      };
    },
    clearInformationPicker: function() {
      // the modal component itself is never unmounted so we clear previous data manually
      this.$refs.inputPicker.clear();
      this.$refs.outputPicker.clear();
    },
    createInputInformation: async function(name) {
      this.module.inputInformation.push(
        await this.$store.dispatch('addInformation', name)
      );
    },
    createOutputInformation: async function(name) {
      this.module.outputInformation.push(
        await this.$store.dispatch('addInformation', name)
      );
    },
    addInputInformation: function(id) {
      this.module.inputInformation.push(id);
    },
    addOutputInformation: function(id) {
      this.module.outputInformation.push(id);
    },
    removeInformation: function(type, id) {
      if (type === 'in') {
        this.module.inputInformation = this.module.inputInformation.filter(
          module => module !== id
        );
      } else if (type === 'out') {
        this.module.outputInformation = this.module.outputInformation.filter(
          module => module !== id
        );
      }
    },
    save: async function(evt) {
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
        this.$store.commit('SET_PLANNING_MODULE', {
          id: this.moduleId,
          module: this.module
        });
      } else {
        // create a new module
        await this.$store.dispatch('addPlanningModule', this.module);
      }
    }
  }
};
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
  transition: all 0.2s ease;
  user-select: none;
  border: 1px solid #999;
  border-radius: 0.25rem;
  text-align: center;
  min-height: 5rem;
  vertical-align: middle;
  margin: 0.75rem 0.5rem 0.75rem 0.5rem;
}
.information-trash {
  cursor: pointer;
}
.information-picker-wrapper {
  flex: 3;
}
.component-title {
  font-weight: bold;
  margin: 0.5em 0.5em 0.2em 0.5em;
  text-align: center;
}
.component-title input {
  text-align: center;
}
.component-info {
  font-size: 0.7rem;
}
.module-edit-wrapper {
  display: flex;
  max-height: 70vh;
}
.module-edit-information-in {
  flex: 1;
}
.information-picker {
  padding: 1.25em 0em 0.2em 0em;
}
.information-list {
  /*max-height: 50vh;*/
  height: 200px;
  overflow-y: auto;
}
.information-list > .list-group > .list-group-item {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
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
