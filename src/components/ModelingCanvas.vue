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
import joint from 'jointjs';
import Util from '../jointjs/Util';
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

      let obj = new joint.shapes.qad.Question({
        position: { x: x - 100, y: y - 20 },
        question: droppedModule.name,
        options
      }).addTo(this.graph);
    }
  },
  created() {
    Util.initShapes()
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

    graph.on('change add remove', function() {
      localStorage.setItem('graph', JSON.stringify(graph.toJSON()))
    });
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-modelling-canvas {
  position: relative;
  flex: 1;
/*  background-color:#fff;
  background-image: linear-gradient(white 0px, transparent 0px),
  linear-gradient(90deg, white 0px, transparent 0px),
  linear-gradient(rgba(200,200,200,.3) 1px, transparent 1px),
  linear-gradient(90deg, rgba(200,200,200,.3) 1px, transparent 1px);
  background-size:100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position:-2px -2px, -2px -2px, -1px -1px, -1px -1px
  /*background-color: green;*/
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
