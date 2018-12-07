<template>
  <div id="app" class="app">
    <NavBar />
    <div class="content">
      <ModuleRepository />
      <ModelingCanvas />
      <ModuleAttributes />
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import NavBar from './components/NavBar.vue'
import ModuleRepository from './components/ModuleRepository.vue'
import ModuleAttributes from './components/ModuleAttributes.vue'
import ModelingCanvas from './components/ModelingCanvas.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    NavBar,
    ModelingCanvas,
    ModuleRepository,
    ModuleAttributes
  },
  created() {
    if (localStorage.getItem('graph')) {
      console.log('load app')
      console.log(JSON.parse(localStorage.getItem('graph')));
    }

    if (localStorage.getItem('window')) {
      console.log('load app')
      let windowProperties = JSON.parse(localStorage.getItem('window'));
      console.log(windowProperties)
    }
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
.container-repository {
  flex-direction: column;
  display: flex;
  align-items: stretch;
  /*background-color: red;*/
  width: 15rem;
  border-right: 1px solid rgba(68, 68, 68, 0.25);
}
.repository-actions > div {
  display: flex;
}
.repository-actions > div > button{
  border-radius: 0rem !important;
}
</style>
