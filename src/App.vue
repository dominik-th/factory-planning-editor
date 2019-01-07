<template>
  <div id="app" class="app">
    <NavBar />
    <div class="content">
      <ModuleRepository />
      <Modeling />
      <ModuleAttributes />
    </div>
    <AppNotifications position="bottom left" />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import ModuleRepository from './components/ModuleRepository.vue';
import ModuleAttributes from './components/ModuleAttributes.vue';
import Modeling from './components/Modeling.vue';

export default {
  name: 'app',
  components: {
    NavBar,
    Modeling,
    ModuleRepository,
    ModuleAttributes
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
