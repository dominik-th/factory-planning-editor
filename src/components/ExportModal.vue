<template>
  <div>
    <b-modal
      id="myModal"
      size="lg"
      ref="myModalRef"
      ok-variant="success"
      :title="$t('modal.export.title')"
      :ok-title="$t('generic.save_to_file')"
      :cancel-title="$t('generic.cancel')"
      @ok="exportData"
    >
      <div>
        <b-form-textarea
          plaintext
          ref="textfield"
          :rows="9"
          :value="applicationState"
          @click.native="$event.target.select()"
          @dblclick.native="exportDataToClipboard"
        />
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
  methods: {
    exportData: function(evt) {
      // https://stackoverflow.com/a/18197341
      this.$notify({
        type: 'warn',
        text: this.$t('warning.not_yet_implemented')
      });
      return evt.preventDefault();
    },
    exportDataToClipboard: function() {
      // assuming the textarea is selected
      document.execCommand('copy');
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
