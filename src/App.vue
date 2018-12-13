<template>
  <div id="app" class="app">
    <NavBar />
    <div class="content">
      <ModuleRepository />
      <ModelingCanvas />
      <ModuleAttributes />
    </div>
    <AppNotifications position="bottom left" />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import ModuleRepository from './components/ModuleRepository.vue'
import ModuleAttributes from './components/ModuleAttributes.vue'
import ModelingCanvas from './components/ModelingCanvas.vue'

export default {
  name: 'app',
  components: {
    NavBar,
    ModelingCanvas,
    ModuleRepository,
    ModuleAttributes
  }
}
</script>

<style>
body {
  height: 100vh;
}
.app {
  transition: .1s;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.content {
  display: flex;
  flex: 1;
}
</style>
