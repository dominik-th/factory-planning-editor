<template>
  <div>
    <b-modal
      size="lg"
      ref="exportModalRef"
      ok-variant="success"
      :title="$t('modal.export.title')"
      :ok-title="$t('generic.save_to_file')"
      :cancel-title="$t('generic.cancel')"
      @ok="exportData"
    >
      <div>
        <b-form-textarea
          id="export-json-string"
          plaintext
          ref="textfield"
          :rows="9"
          :value="applicationState"
          @click.native="$event.target.select()"
          @dblclick.native="exportDataToClipboard"
        />
        <b-tooltip
          target="export-json-string"
          placement="top"
          triggers="focus"
        >
          {{ $t(tooltipLabel) }}
        </b-tooltip>
      </div>
    </b-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import saveAs from 'file-saver';

export default {
  name: 'ExportModal',
  data() {
    return {
      tooltipLabel: 'modal.export.doubleclick_copy',
      // resetToolipLabel has to be defined in data to prevent issues when
      // there are multiple instances of this component
      // see https://stackoverflow.com/a/49780382
      resetTooltipLabel: debounce(function() {
        this.tooltipLabel = 'modal.export.doubleclick_copy';
      }, 3000)
    };
  },
  computed: {
    applicationState() {
      return JSON.stringify(this.$store.state);
    }
  },
  methods: {
    exportData: function() {
      let exportBlob = new Blob([this.applicationState], {
        type: 'application/json;charset=utf-8'
      });
      let fileName = 'fpe_export_';
      let now = new Date();
      fileName += now.getFullYear();
      fileName += (now.getMonth() + 1).toString().padStart(2, '0');
      fileName += now
        .getDate()
        .toString()
        .padStart(2, '0');
      saveAs(exportBlob, fileName + '.json');
    },
    exportDataToClipboard: function() {
      this.tooltipLabel = 'modal.export.copied';
      document.execCommand('copy');
      this.resetTooltipLabel();
    }
  },
  mounted() {
    this.$root.$on('modal.export', () => {
      this.$refs.exportModalRef.show();
    });
  },
  beforeDestroy() {
    // unlink the event subscriptions
    // otherwise it could cause duplicate responses on remounting (live reloading for example)
    this.$root.$off('modal.export');
  }
};
</script>
