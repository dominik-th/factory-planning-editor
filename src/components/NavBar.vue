<template>
  <div class="navigation">
    <b-navbar
      type="dark"
      variant="dark"
      toggleable="md"
    >
      <b-navbar-brand href="#">FPE</b-navbar-brand>
      <b-navbar-nav>
        <LanguagePicker />
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-button variant="outline-primary" @click="$root.$emit('modal.import')">
            <font-awesome-icon icon="upload" />
            {{ $t('navbar.import_json') }}
          </b-button>
          <b-button variant="outline-success" @click="$root.$emit('modal.export')">
            <font-awesome-icon icon="save" />
            {{ $t('navbar.export_json') }}
          </b-button>
          <b-button variant="outline-success" @click="exportExcel">
            <font-awesome-icon icon="table" />
            {{ $t('navbar.export_excel') }}
          </b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import saveAs from 'file-saver';
import LanguagePicker from './LanguagePicker.vue';
import { generateExcelSheet } from '../helpers/excel';

export default {
  name: 'NavBar',
  components: {
    LanguagePicker
  },
  methods: {
    async exportExcel() {
      // actual excel generation is in a separate helper function
      let exportBlob = await generateExcelSheet(this.$store.state);
      let fileName = 'fpe_export_';
      let now = new Date();
      fileName += now.getFullYear();
      fileName += (now.getMonth() + 1).toString().padStart(2, '0');
      fileName += now
        .getDate()
        .toString()
        .padStart(2, '0');
      // initiate the download
      saveAs(exportBlob, fileName + '.xlsx');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn {
  margin-left: 0.5rem;
}
</style>
