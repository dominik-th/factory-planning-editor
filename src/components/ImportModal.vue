<template>
  <div>
    <b-modal
      id="myModal"
      size="lg"
      ref="myModalRef"
      :title="$t('modal.import.title')"
    >
      <div>
        <b-form-textarea
          v-model="importString"
          :rows="9"
        />
      </div>
      <div slot="modal-footer" class="w-100">
        <b-btn class="float-right" variant="primary" @click="show=false">
          {{ $t('generic.close') }}
        </b-btn>
        <b-btn class="float-right" variant="primary" @click="importData">
          {{ $t('generic.import') }}
        </b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ImportModal',
  data() {
    return {
      importString: '{"planningModules":[{"id":1,"inputInformation":[1,2,3],"outputInformation":[4,5,6,7],"name":"Arbeitsplatzgestaltung","abbreviation":null},{"id":2,"inputInformation":[],"outputInformation":[],"name":"Prozessplanung","abbreviation":null},{"id":3,"inputInformation":[],"outputInformation":[],"name":"Außenanlagenplanung","abbreviation":null},{"id":4,"inputInformation":[],"outputInformation":[],"name":"Brandschutzplanung","abbreviation":null},{"id":5,"inputInformation":[],"outputInformation":[],"name":"Fassadenplanung","abbreviation":null},{"id":6,"inputInformation":[],"outputInformation":[],"name":"Standortplanung","abbreviation":null}],"informationTypes":{"1":{"name":"Arbeitsplan"},"2":{"name":"Detaillayout"},"3":{"name":"Gebäudeplanung"},"4":{"name":"Anforderung an: Belichtung"},"5":{"name":"Anforderung an: Akustik"},"6":{"name":"Anforderung an: Raumluft"},"7":{"name":"Arbeitsplatzlayout"}}}'
    };
  },
  methods: {
    importData: function() {
      console.log(JSON.parse(this.importString))
      this.$store.commit('SET_FULL_STATE', JSON.parse(this.importString));
    }
  },
  mounted() {
    this.$root.$on('modal.import', () => {
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
