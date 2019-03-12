<template>
  <div>
    <b-modal
      size="lg"
      ref="informationEditorModalRef"
      ok-only
      :title="$t('modal.informations.title')"
    >
      <div>
        <b-tabs content-class="mt-3">
          <b-tab :title="$t('modal.informations.in_use')">
            <b-list-group class="information-list">
              <b-list-group-item
                v-for="information of mapInformationArr(informationInUse)"
                :key="information.id"
              >
                {{ information.data.name }}
              </b-list-group-item>
            </b-list-group>
          </b-tab>
          <b-tab :title="$t('modal.informations.unused')">
            <b-list-group class="information-list">
              <b-list-group-item
                class="d-flex justify-content-between align-items-center"
                v-for="information of mapInformationArr(informationNotInUse)"
                :key="information.id"
              >
                {{ information.data.name }}
                <font-awesome-icon
                  class="text-danger information-trash"
                  icon="trash-alt"
                  @click="$store.dispatch('deleteInformation', information.id)"
                />
              </b-list-group-item>
            </b-list-group>
          </b-tab>
          <b-tab :title="$t('modal.informations.potential_global')">
            <b-list-group class="information-list">
              <b-list-group-item
                v-for="information of mapInformationArr(allPotentialGlobalInformation)"
                :key="information.id"
              >
                <GlobalToggle :information="information" />
              </b-list-group-item>
            </b-list-group>
          </b-tab>
        </b-tabs>
      </div>
    </b-modal>
  </div>
</template>

<script>
import GlobalToggle from './GlobalToggle.vue';

export default {
  name: 'InformationEditorModal',
  components: {
    GlobalToggle
  },
  data() {
    return {};
  },
  computed: {
    allInformation() {
      return Object.keys(this.$store.state.informationTypes);
    },
    // all informations in use as either input or output information
    informationInUse() {
      return [
        ...new Set([
          ...new Set(this.allInputInformation),
          ...new Set(this.allOutputInformation)
        ])
      ];
    },
    // existing informations which are neither input nor output information
    informationNotInUse() {
      return this.allInformation.filter(id => {
        return this.informationInUse.indexOf(id) < 0;
      });
    },
    allInputInformation() {
      let inputInformation = new Set();
      for (let planningModuleId in this.$store.state.planningModules) {
        for (let id of this.$store.state.planningModules[planningModuleId]
          .inputInformation) {
          inputInformation.add(id);
        }
      }
      return [...inputInformation];
    },
    allOutputInformation() {
      let outputInformation = new Set();
      for (let planningModuleId in this.$store.state.planningModules) {
        for (let id of this.$store.state.planningModules[planningModuleId]
          .outputInformation) {
          outputInformation.add(id);
        }
      }
      return [...outputInformation];
    },
    // all input informations that never occur as output information
    allPotentialGlobalInformation() {
      return this.allInputInformation.filter(id => {
        return this.allOutputInformation.indexOf(id) < 0;
      });
    }
  },
  methods: {
    // maps array of information ids to the actual information
    mapInformationArr(arr) {
      let mapped = arr.map(id => {
        return {
          id,
          data: this.$store.state.informationTypes[id]
        };
      });
      return mapped;
    }
  },
  mounted() {
    // subscribe on $root so the modal can be opened from anywhere inside the application
    this.$root.$on('modal.informations', () => {
      this.$refs.informationEditorModalRef.show();
    });
  },
  beforeDestroy() {
    // unlink the event subscriptions
    // otherwise it could cause duplicate responses on remounting (live reloading for example)
    this.$root.$off('modal.informations');
  }
};
</script>

<style scoped>
.information-list {
  max-height: 500px;
  overflow-y: scroll;
}
.information-trash {
  cursor: pointer;
}
</style>
