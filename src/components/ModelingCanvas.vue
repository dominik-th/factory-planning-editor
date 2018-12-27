<template>
  <drop
    class="container-modelling-canvas"
    id="container-modelling-canvas"
    ref="modellingCanvas"
    @drop="drop"
  />
</template>

<script>
import { mapGetters } from 'vuex';
import { Drop } from 'vue-drag-drop';
import debounce from 'lodash/debounce';
import Paper from '../jointjs/Paper';
import Graph from '../jointjs/Graph';

export default {
  name: 'ModelingCanvas',
  components: {
    Drop
  },
  data() {
    return {
      unsubscribeStoreMutations: this.$store.subscribe(this.handleMutationEvents),
      graph: null,
      paper: null
    }
  },
  computed: {
    ...mapGetters({
      statePlanningModules: 'planningModules',
      stateInformationTypes: 'informationTypes',
      stateModeling: 'modeling'
    })
  },
  mounted() {
    let canvas = this.$refs.modellingCanvas.$el;
    let graph = new Graph();
    let paper = new Paper(canvas, graph);
    paper.enableSvgPanZoom();

    this.graph = graph;
    this.paper = paper;

    // fired when a link is connected a new target
    // also happens when the link already existed and is just updated
    graph.on('change:source change:target', (link) => {
      if (link.get('source').id && link.get('target').id) {
        this.$store.commit('SET_MODELING_CELL', {
          type: 'link',
          id: link.get('id'),
          cell: {
            informationId: link.get('target').port,
            fromModule: link.get('source').id,
            toModule: link.get('target').id
          }
        });
      }
    });

    // fired when any cell on the canvas changed the position
    graph.on('change:position', debounce((element) => {
      // update the stored position in vuex store
      if (element.get('type') === 'fpe.Module') {
        this.$store.commit('UPDATE_MODELING_POSITION', {
          id: element.get('id'),
          position: element.get('position')
        });
      }
      // redraw all links in case the cell has moved onto a link
      for (let link of graph.getLinks()) {
        paper.findViewByModel(link).update();
      }
    }, 500));

    // persistency, todo... make this better
    graph.on('change add remove', () => {
      localStorage.setItem('graph', JSON.stringify(graph.toJSON()))
    });
    if (localStorage.getItem('graph')) {
      graph.fromJSON(JSON.parse(localStorage.getItem('graph')));
    }
    if (localStorage.getItem('window')) {
      let windowProperties = JSON.parse(localStorage.getItem('window'));
      paper.zoom(windowProperties.size / 150)
      paper.pan(windowProperties.offset)
    }

    this.$root.$on('clearModelingCanvas', () => {
      this.graph.clear();
    })
  },
  beforeDestroy() {
    this.unsubscribeStoreMutations();
  },
  methods: {
    drop: function(moduleId, evt) {
      let canvas = this.$refs.modellingCanvas.$el;
      let canvasRect = canvas.getBoundingClientRect();
      let pan = this.paper.panZoom.getPan();
      let x = (evt.clientX - pan.x - canvasRect.left) / this.paper.panZoom.getZoom();
      let y = (evt.clientY - pan.y - canvasRect.top) / this.paper.panZoom.getZoom();

      let droppedModule = this.statePlanningModules[moduleId];
      let informations = { input: [], output: [] };
      for (let inId of droppedModule.inputInformation) {
        informations.input.push({ id: inId, text: this.stateInformationTypes[inId].name });
      }
      for (let outId of droppedModule.outputInformation) {
        informations.output.push({ id: outId, text: this.stateInformationTypes[outId].name });
      }

      let plannedModule = this.graph.addPlanningModule(
        // substracting these values to approximately center the module at the cursor
        { x: x - 100, y: y - 20 },
        droppedModule.name,
        informations
      );

      // store information about the module in vuex store
      // additional attributes are going to be stored there aswell
      this.$store.commit('SET_MODELING_CELL', {
        type: 'module',
        id: plannedModule.get('id'),
        cell: {
          moduleId,
          position: plannedModule.get('position'),
          attributes: {
            numEmployees: 0,
            cost: 0,
            duration: 0,
            custom: []
          }
        }
      });
    },
    sync: function() {
      // remove links
      // remove modules
      // add/update modules
      // add links
    },
    handleMutationEvents: function(mutation, state) {
      switch(mutation.type) {
        case 'SET_FULL_STATE':
        case 'SET_PLANNING_MODULES':
        case 'SET_INFORMATION_TYPES':
          break;
        case 'SET_PLANNING_MODULE':
          this.updateModule(mutation.payload.id);
          break;
        case 'SET_MODELING_CELL':
          break;
        case 'REMOVE_MODELING_CELL':
          this.graph.removePlanningModule(mutation.payload.id);
          break;
        case 'UPDATE_MODELING_POSITION':
          break;
      }
    },
    updateModule(id) {
      let cells = this.graph.getCells();
      for (let cellId in this.stateModeling.modules) {
        let moduleId = this.stateModeling.modules[cellId].moduleId
        if (moduleId === id) {
          this.graph.updatePlanningModule(
            cellId,
            this.statePlanningModules[moduleId].name,
            {
              input: this.statePlanningModules[moduleId].inputInformation.map(id => ({
                id,
                text: this.stateInformationTypes[id].name
              })),
              output: this.statePlanningModules[moduleId].outputInformation.map(id => ({
                id,
                text: this.stateInformationTypes[id].name
              })),
            }
          )
        }
      }
    },
    updateModelingCellPosition(id) {
    }
  }
}
</script>

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
