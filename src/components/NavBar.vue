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
          <b-button variant="outline-success">
            <font-awesome-icon icon="table" />
            {{ $t('navbar.export_excel') }}
          </b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
    <ImportModal />
    <ExportModal />
  </div>
</template>

<script>
import ImportModal from './ImportModal.vue'
import ExportModal from './ExportModal.vue'
import LanguagePicker from './LanguagePicker.vue'

export default {
  name: 'NavBar',
  components: {
    ImportModal,
    ExportModal,
    LanguagePicker
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn {
  margin-left: .5rem;
}
</style>
