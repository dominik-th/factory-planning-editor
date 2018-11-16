<template>
  <div id="app">
    <NavBar />
    <ModelingCanvas />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import NavBar from './components/NavBar.vue'
import ModelingCanvas from './components/ModelingCanvas.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    NavBar,
    ModelingCanvas
  }
}
</script>

<style>
</style>
