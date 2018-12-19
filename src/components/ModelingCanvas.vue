<template>
  <drop
    class="container-modelling-canvas"
    id="container-modelling-canvas"
    ref="modellingCanvas"
    @drop="drop"
  />
</template>

<script>
import { Drop } from 'vue-drag-drop';
import debounce from 'lodash/debounce';
import Paper from '../jointjs/Paper';
import Graph from '../jointjs/Graph';

export default {
  name: 'ModelingCanvas',
  components: {
    Drop
  },
  computed: {
  },
  data() {
    return {
      graph: null,
      paper: null
    }
  },
  methods: {
    drop: function(moduleId, evt) {
      let canvas = this.$refs.modellingCanvas.$el;
      let canvasRect = canvas.getBoundingClientRect();
      let pan = this.paper.panZoom.getPan();
      let x = (evt.clientX - pan.x - canvasRect.left) / this.paper.panZoom.getZoom();
      let y = (evt.clientY - pan.y - canvasRect.top) / this.paper.panZoom.getZoom();

      let droppedModule = this.$store.getters.planningModules.filter((ele) => {
        return ele.id === moduleId
      })[0];

      let options = [];

      for (let inId of droppedModule.inputInformation) {
        options.push({ id: inId + '', text: this.$store.getters.informationTypes[inId].name, payload: "IN" });
      }
      for (let outId of droppedModule.outputInformation) {
        options.push({ id: outId + '', text: this.$store.getters.informationTypes[outId].name, payload: "OUT" });
      }

      this.graph.addPlannungModule(
        // substracting these values to approximately center the module at the cursor
        { x: x - 100, y: y - 20 },
        droppedModule.name,
        options
      );
    }
  },
  mounted() {
    let canvas = this.$refs.modellingCanvas.$el;
    let graph = new Graph();
    let paper = new Paper(canvas, graph);
    paper.enableSvgPanZoom();

    this.graph = graph;
    this.paper = paper;

    if (localStorage.getItem('graph')) {
      graph.fromJSON(JSON.parse(localStorage.getItem('graph')));
    }

    if (localStorage.getItem('window')) {
      let windowProperties = JSON.parse(localStorage.getItem('window'));
      paper.zoom(windowProperties.size / 150)
      paper.pan(windowProperties.offset)
    }

    graph.on('change add remove', () => {
      localStorage.setItem('graph', JSON.stringify(graph.toJSON()))
    });

    graph.on('change:position', debounce(() => {
      for (let link of graph.getLinks()) {
        paper.findViewByModel(link).update();
      }
    }, 500));
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-modelling-canvas {
  position: relative;
  flex: 1;
}
</style>

<!-- JointJS does not integrate that far in Vue js so unfortunately we cannot use scoped css attributes -->
<style>
/* port styling */
.available-magnet {
  fill: yellow;
  transform: scale(1.25);
}
/* element styling */
.available-cell rect {
/*  stroke: green;
  stroke-width: 5px;*/
}
</style>
