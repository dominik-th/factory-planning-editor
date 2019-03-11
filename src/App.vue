<template>
  <div id="app" class="app">
    <NavBar />
    <div class="content">
      <ModuleRepository />
      <ModelingCanvas />
      <ModuleAttributes />
    </div>
    <AppNotifications position="bottom left" />
    <ImportModal />
    <ExportModal />
    <ModuleEditModal />
    <InformationEditorModal />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import ModuleRepository from './components/ModuleRepository.vue';
import ModuleAttributes from './components/ModuleAttributes.vue';
import ModelingCanvas from './components/ModelingCanvas.vue';
import ImportModal from './components/ImportModal.vue';
import ExportModal from './components/ExportModal.vue';
import ModuleEditModal from './components/ModuleEditModal.vue';
import InformationEditorModal from './components/InformationEditorModal.vue';

export default {
  name: 'app',
  components: {
    NavBar,
    ModelingCanvas,
    ModuleRepository,
    ModuleAttributes,
    ImportModal,
    ExportModal,
    ModuleEditModal,
    InformationEditorModal
  }
};
</script>

<style>
body {
  height: 100vh;
}
.app {
  transition: 0.1s;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.content {
  display: flex;
  flex: 1;
  overflow-y: hidden;
}
</style>
