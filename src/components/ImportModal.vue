<template>
  <div>
    <b-modal
      size="lg"
      ref="myModalRef"
      :title="$t('modal.import.title')"
      :ok-title="$t('generic.import')"
      :cancel-title="$t('generic.cancel')"
      @ok="importData"
    >
      <div>
        <b-form-textarea
          v-model="importString"
          :rows="9"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ImportModal',
  data() {
    return {
      importString: ''
    };
  },
  methods: {
    importData: function(evt) {
      try {
        this.$store.commit('SET_FULL_STATE', JSON.parse(this.importString));
      } catch(e) {
        this.$notify({
          type: 'error',
          text: this.$t('error.json_invalid')
        });
        return evt.preventDefault();
      }
    }
  },
  mounted() {
    this.$root.$on('modal.import', () => {
      this.importString = '{"planningModules":[{"id":1,"inputInformation":[1,2,3],"outputInformation":[4,5,6,7],"name":"Arbeitsplatzgestaltung","abbreviation":null},{"id":2,"inputInformation":[],"outputInformation":[],"name":"Prozessplanung","abbreviation":null},{"id":3,"inputInformation":[],"outputInformation":[],"name":"Außenanlagenplanung","abbreviation":null},{"id":4,"inputInformation":[],"outputInformation":[],"name":"Brandschutzplanung","abbreviation":null},{"id":5,"inputInformation":[],"outputInformation":[],"name":"Fassadenplanung","abbreviation":null},{"id":6,"inputInformation":[],"outputInformation":[],"name":"Standortplanung","abbreviation":null}],"informationTypes":{"1":{"name":"Arbeitsplan"},"2":{"name":"Detaillayout"},"3":{"name":"Gebäudeplanung"},"4":{"name":"Anforderung an: Belichtung"},"5":{"name":"Anforderung an: Akustik"},"6":{"name":"Anforderung an: Raumluft"},"7":{"name":"Arbeitsplatzlayout"}}}';
      this.$refs.myModalRef.show();
    });
  },
  beforeDestroy() {
    // unlink the event subscriptions
    // otherwise it could cause duplicate responses on remounting (live reloading for example)
    this.$root.$off('modal.import');
  }
}
</script>

<style scoped>
</style>
