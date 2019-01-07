<template>
  <ModelingCanvas v-model="stateModeling" />
</template>

<script>
import ModelingCanvas from './ModelingCanvas.vue';

export default {
  name: 'Modeling',
  components: {
    ModelingCanvas
  },
  computed: {
    stateModeling: {
      get: function() {
        // todo
        return null;
      },
      set: function() {
        // todo
      }
    }
  }
};
</script>
