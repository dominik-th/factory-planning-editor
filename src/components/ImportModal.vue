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
      this.importString = '{"planningModules":{"f747dc34-e148-4fd8-acee-f96a2cc266c2":{"inputInformation":["3dc1f331-3af2-420f-806e-287c78839ff3","45dbd580-bab8-4190-b519-87383a384952","20f315a7-8500-4aa7-8f61-31279c955046"],"outputInformation":["582425bf-5ef5-4135-8fbd-390a3a7a462e","7e81618a-2507-4c84-be0a-adf8975429cc","ff9dcb00-b157-4734-a0e9-5df36ace09dc","aa9f1105-d226-471c-9608-43592f262577"],"name":"Arbeitsplatzgestaltung","abbreviation":null},"35642ce6-e7e3-4901-92fb-e798abdcd696":{"inputInformation":[],"outputInformation":[],"name":"Prozessplanung","abbreviation":null},"6b3401e6-91df-4109-83d2-307bb4db222a":{"inputInformation":[],"outputInformation":[],"name":"Außenanlagenplanung","abbreviation":null},"22151247-6753-453b-9d11-84b86ae4f71d":{"inputInformation":[],"outputInformation":[],"name":"Brandschutzplanung","abbreviation":null},"671da1bd-b9ce-4ccf-ae7e-17d65803fa6a":{"inputInformation":[],"outputInformation":[],"name":"Fassadenplanung","abbreviation":null},"5de85249-79a6-422d-a9c4-403d46c06d36":{"inputInformation":[],"outputInformation":[],"name":"Standortplanung","abbreviation":null}},"informationTypes":{"3dc1f331-3af2-420f-806e-287c78839ff3":{"name":"Arbeitsplan"},"45dbd580-bab8-4190-b519-87383a384952":{"name":"Detaillayout"},"20f315a7-8500-4aa7-8f61-31279c955046":{"name":"Gebäudeplanung"},"582425bf-5ef5-4135-8fbd-390a3a7a462e":{"name":"Anforderung an: Belichtung"},"7e81618a-2507-4c84-be0a-adf8975429cc":{"name":"Anforderung an: Akustik"},"ff9dcb00-b157-4734-a0e9-5df36ace09dc":{"name":"Anforderung an: Raumluft"},"aa9f1105-d226-471c-9608-43592f262577":{"name":"Arbeitsplatzlayout"}},"modeling":{"modules":{},"links":{}}}';
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
