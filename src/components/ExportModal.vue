<template>
  <div>
    <b-modal
      id="myModal"
      size="lg"
      ref="myModalRef"
      :title="$t('modal.export.title')"
    >
      <div>
        <b-form-textarea
          plaintext
          ref="textfield"
          :rows="9"
          :value="applicationState"
          @click.native="$event.target.select()"
        />
      </div>
      <div slot="modal-footer" class="w-100">
        <b-btn class="float-right" variant="primary" @click="show=false">
          {{ $t('generic.close') }}
        </b-btn>
        <b-btn class="float-right" variant="primary" @click="show=false">
          {{ $t('generic.save_to_file') }}
        </b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ExportModal',
  computed: {
    applicationState() {
      return JSON.stringify(this.$store.getters.fullState)
    }
  },
  mounted() {
    this.$root.$on('modal.export', () => {
      this.$refs.myModalRef.show();
    });
  },
  beforeDestroy() {
    // unlink the event subscriptions
    // otherwise it could cause duplicate responses on remounting (live reloading for example)
    this.$root.$off('modal.export');
  }
}
</script>

<style scoped>
</style>
