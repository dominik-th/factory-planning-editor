<template>
  <div>
    <b-modal
      size="lg"
      ref="importModalRef"
      :title="$t('modal.import.title')"
      :ok-title="$t('generic.import')"
      :cancel-title="$t('generic.cancel')"
      @ok="importData"
    >
      <div>
        <b-form-textarea
          v-model="importString"
          :rows="9"
          :placeholder="$t('modal.import.paste_json')"
          @drop.native="dropFile"
          @input="resetFields"
        />
        <hr class="hr-text" :data-content="$t('generic.or').toUpperCase()">
        <b-form-group
          label-for="file-import"
          :label="$t('modal.import.upload_json_file')"
        >
          <b-form-file
            id="file-import"
            ref="fileInput"
            accept="application/json"
            :placeholder="$t('generic.select_a_file')"
            @input="handleFileUpload"
          />
        </b-form-group>
        <b-form-group
          label-for="example-import"
          :label="$t('modal.import.select_example')"
        >
          <b-form-select
            id="example-import"
            v-model="selectedDraft"
            :options="exampleDraftOptions"
            @input="selectDraft"
          />
        </b-form-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Ajv from 'ajv';
import drafts from '../drafts';
import { importExcelSheet } from '@/helpers/excel';
import jsonSchema from '@/helpers/schema.json';

export default {
  name: 'ImportModal',
  data() {
    return {
      resetExceptions: [],
      selectedDraft: null,
      importString: ''
    };
  },
  computed: {
    exampleDraftOptions: function() {
      // generate the options for the select field
      let draftOptions = Object.keys(drafts).map(key => {
        let meta = [
          this.$tc(
            'example_drafts.meta.num_planningmodules',
            drafts[key].numModules
          ),
          this.$tc(
            'example_drafts.meta.num_informations',
            drafts[key].numInformations
          )
        ];
        return {
          text: `${this.$t(drafts[key].title)} <${meta.join(' | ')}>`,
          value: key
        };
      });
      draftOptions.unshift({
        text: this.$t('modal.import.select_example_placeholder'),
        value: null
      });
      return draftOptions;
    }
  },
  methods: {
    // resets the input fields
    resetFields: function() {
      if (this.resetExceptions.indexOf('exampleInput') < 0) {
        this.selectedDraft = null;
      }
      if (this.resetExceptions.indexOf('fileInput') < 0) {
        this.$refs.fileInput.reset();
      }
      this.resetExceptions = [];
    },
    // loads sample into the text area
    selectDraft(key) {
      // key is undefined when we clear the select field
      if (key) {
        // load import string into the text area
        this.importString = JSON.stringify(drafts[key].state);
        // resetFields will be fired so add an exception to avoid clearing the just
        // set field
        this.resetExceptions.push('exampleInput');
      }
    },
    // handles drop events on the text area
    dropFile: function(evt) {
      // if multiple files are dropped, we just pick the first one
      this.handleFileUpload(evt.dataTransfer.files[0]);
      evt.preventDefault();
    },
    // reads the file and if its json fill the text area
    handleFileUpload: async function(file) {
      // when the user cancels the file browser dialog, file is going to be undefined
      if (!file) return;
      let reader = new FileReader();
      reader.onload = e => {
        try {
          // only accept if the file actually contains json
          this.importString = JSON.stringify(JSON.parse(e.target.result));
          // resetFields will be fired so add an exception to avoid clearing the just
          // set field
          this.resetExceptions.push('fileInput');
        } catch (e) {
          this.$notify({
            type: 'error',
            text: this.$t('error.json_invalid')
          });
        }
      };

      let excelTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12'
      ];
      excelTypes.map(type => type.toLocaleLowerCase());
      // filter incorrect content types
      if (file.type === 'application/json') {
        reader.readAsText(file);
      } else if (excelTypes.indexOf(file.type.toLocaleLowerCase()) >= 0) {
        this.importString = JSON.stringify(await importExcelSheet(file));
        this.resetExceptions.push('fileInput');
      } else {
        this.$notify({
          type: 'error',
          text: this.$t('error.mime_mismatch')
        });
      }
    },
    // parses the import string and puts it into vuex
    importData: function(evt) {
      let ajv = new Ajv();
      let validate = ajv.compile(jsonSchema);
      try {
        // any parsing issues with invalid json will throw an exception here
        let importState = JSON.parse(this.importString);
        if (validate(importState)) {
          // there should be checks if the entered state also is in a consistent state
          this.$store.replaceState(JSON.parse(this.importString));
          this.$store.commit('SAVE');
        } else {
          throw new Exception(
            'Entered JSON did not validate against JSON schema!'
          );
        }
      } catch (e) {
        // show notification to inform the user
        this.$notify({
          type: 'error',
          text: this.$t('error.json_invalid')
        });
        // disable modal closing when import did not succeed
        return evt.preventDefault();
      }
    }
  },
  mounted() {
    // initialize the event on when to show this modal
    this.$root.$on('modal.import', () => {
      this.$refs.importModalRef.show();
    });
  },
  beforeDestroy() {
    // unlink the event subscriptions
    // otherwise it could cause duplicate responses on remounting (live reloading for example)
    this.$root.$off('modal.import');
  }
};
</script>

<style scoped>
/*
  hr styling from
  https://codepen.io/scottzirkel/pen/yNxNME
*/
.hr-text {
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: black;
  text-align: center;
  height: 1.5em;
  opacity: 0.5;
}
.hr-text:before {
  content: '';
  background: linear-gradient(to right, transparent, #818078, transparent);
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
}
.hr-text:after {
  content: attr(data-content);
  position: relative;
  display: inline-block;
  color: black;
  padding: 0 0.5em;
  line-height: 1.5em;
  color: #818078;
  background-color: #fcfcfa;
}
</style>
