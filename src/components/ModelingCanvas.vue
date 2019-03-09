<template>
  <div class="container-modelling-canvas">
    <drop
      ref="modellingCanvas"
      v-shortkey="{up: ['arrowup'], down: ['arrowdown']}"
      @drop="drop"
      @shortkey.native="zoom"
    />
    <FloatingActionButton @click.native="$root.$emit('modal.informations')" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Drop } from 'vue-drag-drop';
import debounce from 'lodash/debounce';
import Paper from '../jointjs/Paper';
import Graph from '../jointjs/Graph';
import FloatingActionButton from './FloatingActionButton.vue';

export default {
  name: 'ModelingCanvas',
  components: {
    Drop,
    FloatingActionButton
  },
  data() {
    return {
      graph: null,
      paper: null
    };
  },
  computed: {
    ...mapGetters({
      statePlanningModules: 'planningModules',
      stateInformationTypes: 'informationTypes',
      stateModeling: 'modeling',
      stateSelectedModelingModuleId: 'selectedModelingModuleId'
    })
  },
  watch: {
    stateSelectedModelingModuleId: function(newval, oldval) {
      let cellView;
      if (oldval) {
        cellView = this.paper.findViewByModel(this.graph.getCell(oldval));
        cellView.unhighlight();
      }
      if (newval) {
        cellView = this.paper.findViewByModel(this.graph.getCell(newval));
        cellView.highlight();
      }
    },
    stateModeling: {
      handler: 'sync',
      deep: true
    },
    statePlanningModules: {
      handler: 'sync',
      deep: true
    },
    stateInformationTypes: {
      handler: 'sync',
      deep: true
    }
  },
  mounted() {
    let canvas = this.$refs.modellingCanvas.$el;
    let graph = new Graph();
    let paper = new Paper(canvas, graph);
    paper.enableSvgPanZoom();

    this.graph = graph;
    this.paper = paper;

    // fired on a single click on any module in the canvas
    paper.on('element:pointerclick', cellView => {
      this.$store.commit('SELECT_MODELING_MODULE', cellView.model.id);
    });

    paper.on('element:pointerup', cellView => {
      let element = this.graph.getCell(cellView.model.id);
      // update the stored position in vuex store
      if (element.get('type') === 'fpe.Module') {
        this.$store.dispatch('moveModelingModule', {
          id: element.get('id'),
          position: element.get('position')
        });
      }
    });

    // fired on a single click anywhere on the canvas to deselect the module
    paper.on('blank:pointerclick', () => {
      if (this.stateSelectedModelingModuleId) {
        this.$store.commit('SELECT_MODELING_MODULE', null);
      }
    });

    // fired when a link is connected a new target
    // also happens when the link already existed and is just updated
    graph.on('change:source change:target', link => {
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

    graph.on('remove', cell => {
      if (cell.isLink() && this.stateModeling.links[cell.id]) {
        this.$store.commit('REMOVE_MODELING_CELL', {
          type: 'link',
          id: cell.id
        });
      }
    });

    // fired when any cell on the canvas changed the position
    graph.on(
      'change:position',
      debounce(() => {
        // redraw all links in case the cell has moved onto a link
        for (let link of graph.getLinks()) {
          paper.findViewByModel(link).update();
        }
      }, 500)
    );

    // persistency, todo... make this better
    // graph.on('change add remove', () => {
    //   localStorage.setItem('graph', JSON.stringify(graph.toJSON()))
    // });
    // if (localStorage.getItem('graph')) {
    //   graph.fromJSON(JSON.parse(localStorage.getItem('graph')));
    // }
    this.sync();
    if (this.stateSelectedModelingModuleId) {
      this.paper
        .findViewByModel(this.graph.getCell(this.stateSelectedModelingModuleId))
        .highlight();
    }
    if (localStorage.getItem('window')) {
      let windowProperties = JSON.parse(localStorage.getItem('window'));
      paper.zoom(windowProperties.size / 150);
      paper.pan(windowProperties.offset);
    }

    this.$root.$on('clearModelingCanvas', () => {
      this.graph.clear();
    });
  },
  methods: {
    zoom: function(evt) {
      switch (evt.srcKey) {
        case 'up':
          this.paper.zoomBy(1.1);
          break;
        case 'down':
          this.paper.zoomBy(0.9);
          break;
      }
    },
    drop: function(moduleId, evt) {
      let canvas = this.$refs.modellingCanvas.$el;
      let canvasRect = canvas.getBoundingClientRect();
      let pan = this.paper.panZoom.getPan();
      let x =
        (evt.clientX - pan.x - canvasRect.left) / this.paper.panZoom.getZoom();
      let y =
        (evt.clientY - pan.y - canvasRect.top) / this.paper.panZoom.getZoom();

      let droppedModule = this.statePlanningModules[moduleId];
      let informations = { input: [], output: [] };
      for (let inId of droppedModule.inputInformation) {
        informations.input.push({
          id: inId,
          text: this.stateInformationTypes[inId].name
        });
      }
      for (let outId of droppedModule.outputInformation) {
        informations.output.push({
          id: outId,
          text: this.stateInformationTypes[outId].name
        });
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
            custom: {}
          }
        }
      });
    },
    sync: async function() {
      let modeling = this.stateModeling;
      // remove obsolete links
      let graphLinks = this.graph.getLinks();
      for (let link of graphLinks) {
        if (!modeling.links[link.id]) link.remove();
      }

      // remove obsolete modules
      let graphElements = this.graph.getElements();
      for (let element of graphElements) {
        if (!modeling.modules[element.id]) element.remove();
      }

      // add modules / update their name and positioning
      for (let modelingModuleId in modeling.modules) {
        let modelingModule = modeling.modules[modelingModuleId];
        let module = this.statePlanningModules[modelingModule.moduleId];
        let informations = { input: [], output: [] };
        for (let inId of module.inputInformation) {
          informations.input.push({
            id: inId,
            global: this.stateInformationTypes[inId].global,
            text: this.stateInformationTypes[inId].name
          });
        }
        for (let outId of module.outputInformation) {
          informations.output.push({
            id: outId,
            text: this.stateInformationTypes[outId].name
          });
        }

        let element = this.graph.getCell(modelingModuleId);
        // module in state but not on canvas
        if (!element) {
          element = this.graph.addPlanningModule(
            // substracting these values to approximately center the module at the cursor
            modelingModule.position,
            module.name,
            informations,
            modelingModuleId
          );
        } else {
          // the elements on the canvas will not change or fire events when the actual data did not change
          element.set('position', modelingModule.position);
          element.set('moduleTitle', module.name);
          element.set('informations', informations);
        }
      }

      // add links
      for (let modelingLinkId in modeling.links) {
        let modelingLink = modeling.links[modelingLinkId];
        let link = this.graph.getCell(modelingLinkId);
        if (!link) {
          this.graph.connectPlanningModules(
            modelingLink.fromModule,
            modelingLink.toModule,
            modelingLink.informationId,
            modelingLinkId
          );
        } else {
          link.set('source', {
            id: modelingLink.fromModule,
            port: modelingLink.informationId
          });
          link.set('target', {
            id: modelingLink.toModule,
            port: modelingLink.informationId
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.container-modelling-canvas {
  position: relative;
  flex: 1;
}
</style>

<!-- JointJS does not integrate that far in Vue js so unfortunately we cannot use scoped css attributes -->
<style>
/* available magnet when drawing a connection between to magnets */
.available-magnet {
  fill: yellow !important;
  transform: scale(1.25);
}
/* available cell when drawing a connection between to magnets */
.available-cell .border {
  /*stroke: yellow !important;*/
  /*stroke-width: 10px !important;*/
}

.highlighted .jointcell > .border {
  stroke: #e60000;
  stroke-width: 5px;
}

/* styling of the elements on the svg canvas */
.jointcell > .body {
  rx: 5px;
  ry: 5px;
  fill: #aaa;
}
.jointcell text {
  font-family: 'Arial';
  fill: black;
}
.jointcell > .module-title {
  font-weight: bold;
  font-size: 12pt;
  text-anchor: middle;
  fill: black;
}
.jointcell > .border {
  rx: 5px;
  ry: 5px;
  stroke: #777;
  stroke-width: 2px;
  fill: none;
  transition: all 0.25s ease;
}
.jointcell > .information-table > .grid {
  stroke: #333;
  stroke-width: 1px;
}
.jointcell > .information-table > .fill {
  fill: white;
}
.jointcell > .information-table > .stripe {
  fill: #e9e9e9;
}

.joint-cell > .joint-port > circle {
  stroke: #999;
  fill: #fff;
  r: 10px;
  transition: all 0.5s;
}
</style>
