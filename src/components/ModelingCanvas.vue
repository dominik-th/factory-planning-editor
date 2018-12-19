<template>
  <drop
    class="container-modelling-canvas"
    id="container-modelling-canvas"
    @drop="drop"
  />
</template>

<script>
import 'jointjs/dist/joint.css'
import { Drop } from 'vue-drag-drop';
import Util from '../jointjs/Util';

export default {
  name: 'ModelingCanvas',
  components: {
    Drop
  },
  computed: {
  },
  data() {
    return {
      panAndZoom: null,
      graph: null
    }
  },
  methods: {
    drop: function(moduleId, evt) {
      let canvas = document.getElementById('container-modelling-canvas').children[2];
      let canvasRect = canvas.getBoundingClientRect();
      let pan = this.panAndZoom.getPan();
      let x = (evt.clientX - pan.x - canvasRect.left) / this.panAndZoom.getZoom();
      let y = (evt.clientY - pan.y - canvasRect.top) / this.panAndZoom.getZoom();

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
  mounted() {

    window.$ = require('jquery')
    window.joint = require('jointjs')
    window.svgPanZoom = require('svg-pan-zoom')

    let { joint, $ } = window;
    let gridsize = 10

    Util.initShapes(joint)

// https://codepen.io/fxaeberard/pen/reGvjm

    let graph = new joint.dia.Graph;
    let paper = new joint.dia.Paper({
      el: document.getElementById('container-modelling-canvas'),
      model: graph,
      width: '100%',
      height: '100%',
      gridSize: 10,
      drawGrid: {
        name: 'mesh',
        color: '#EEE'
      },
      linkPinning: false,
      async: true,
      snapLinks: { radius: 50 },
      validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        // Link to the same cell is not allowed
        if (cellViewS === cellViewT) return false;

        // Target magnet has to be of input type
        if (!magnetT || magnetT.getAttribute('port-group') !== 'in') return false;

        // Do not allow links directed from input group
        if (!magnetS || magnetS.getAttribute('port-group') === 'in') return false;

        // Information types have to match
        if (magnetS.getAttribute('port') !== magnetT.getAttribute('port')) return false;

        // Input information already satisfied
        let satisfied = graph.getConnectedLinks(cellViewT.model).filter(link => {
          return link.get('target').port === magnetS.getAttribute('port');
        }).length === 0;

        return satisfied;
      },
      markAvailable: true,
        //       defaultLink: new joint.dia.Link({
        //     attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
        // }),
      defaultLink: new joint.dia.Link({
        router: { name: 'metro' },
        connector: { name: 'rounded' },
        attrs: {
          '.connection': {
            stroke: '#333333',
            'stroke-width': 3
          },
          '.marker-target': {
            fill: '#333333',
            d: 'M 10 0 L 0 5 L 10 10 z'
          },
        }
      }),
    });

    this.graph = graph;

    let targetElement = document.getElementById('container-modelling-canvas').children[2];
    let currentScale = 1;
    var that = this;
    that.panAndZoom = window.svgPanZoom(targetElement, {
      fit: false,
      zoomScaleSensitivity: 1,
      maxZoom: 3,
      minZoom: 0.05,
      dblClickZoomEnabled: false,
      panEnabled: false,
      onZoom: function(scale){
        currentScale = scale;
        setGrid(paper, 10*15*currentScale, '#808080');
      },
      beforePan: function(oldpan, newpan){
        setGrid(paper, 10*15*currentScale, '#808080', newpan);
      }
    });

    if (localStorage.getItem('graph')) {
      graph.fromJSON(JSON.parse(localStorage.getItem('graph')));
    }

    if (localStorage.getItem('window')) {
      let windowProperties = JSON.parse(localStorage.getItem('window'));
      that.panAndZoom.zoom(windowProperties.size / 150)
      that.panAndZoom.pan(windowProperties.offset)
    }

    graph.on('change', function() {
      // console.log('xx')
      // console.log(graph.toJSON())
      localStorage.setItem('graph', JSON.stringify(graph.toJSON()))
    })
    paper.on('blank:pointerdown', function () {
    // console.log(that.$store.getters.planningModules[0].id)
      that.panAndZoom.enablePan();
    });




    paper.on('blank:mouseover', function(evt, x, y) {
      // console.log(`X: ${x} Y: ${y}`)
    })


    paper.on('cell:pointerup blank:pointerup', function() {
      that.panAndZoom.disablePan();
    });
let lastEle = null;
// Single port definition
var port = {
    // id: 'abc', // generated if `id` value is not present
    group: 'a',
    args: {}, // extra arguments for the port layout function, see `layout.Port` section
    label: {
        position: {
            name: 'right',
            args: { y: 6 } // extra arguments for the label layout function, see `layout.PortLabel` section
        },
        markup: '<text class="label-text" fill="blue"/>'
    },
    attrs: { text: { text: 'port1' } },
    markup: '<rect width="16" height="16" x="-8" strokegit ="red" fill="red"/>'
};
    paper.on('blank:pointerclick', function(evt, x, y) {
      console.log(x)
      console.log(y)
      let rect = new joint.shapes.standard.Rectangle({
          position: { x, y},
          size: { width: 90, height: 90 },
          ports: {
              groups: {
                  'a': {}
              },
              items: [port]
          }
      });
      // rect.position(x, y);
      // rect.resize(100, 100);
      // rect.attr({
      //     body: {
      //         fill: 'green'
      //     },
      //     label: {
      //         text: 'x' + Math.random(),
      //         fill: 'white'
      //     }
      // });
      // rect.addTo(graph);
      // let a = rect.addPort({ markup: '<rect width="10" height="10" fill="brown"/>' })
      // console.log(a)
      // console.log(rect)


if (lastEle !== null) {
  // console.log(lastEle.id)
  // console.log(rect.id)
  // var link = new joint.shapes.standard.Link({
  //     source: { id: lastEle.id },
  //     target: { id: rect.id },
  //     router: { name: 'manhattan' },
  //     connector: { name: 'rounded' },
  //     attrs: {
  //         line: {
  //             stroke: '#333333',
  //             strokeWidth: 3
  //         }
  //     }
  // });
  // link.addTo(graph)
}




      lastEle = rect;
    });

    let clickEle = null;
    paper.on('element:pointerclick', function(evt, x, y) {
      function link(source, target, label, vertices) {
          // console.log(source.id)
          // console.log(target)
          var cell = new joint.shapes.standard.Link({
              source: { id: source.id },
              target: { id: target.id },
              labels: [{ position: .5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
              vertices: vertices || [],
              router: { name: 'manhattan' },
              connector: { name: 'rounded' }
          });
          graph.addCell(cell);
          return cell;
      }

      // lastEle.attr({
      //     body: {
      //         fill: 'red'
      //     },
      //     label: {
      //         text: 'x' + Math.random(),
      //         fill: 'white'
      //     }
      // });
      // evt.model.attr('label/text', 'World!');
      // console.log(evt)
      // console.log(x)
      // console.log(y)
      if (!clickEle) {
        // console.log('set click ele')
        clickEle = evt.model
      } else {
        // console.log('link both')
        // console.log(graph.toJSON())
        link(clickEle, evt.model, '');
        clickEle = null;
      }
    });

    function setGrid(paper, size, color, offset) {
      localStorage.setItem('window', JSON.stringify({
        size,
        offset
      }));
      // console.log(size)
      // console.log(offset)
      // Set grid size on the JointJS paper object (joint.dia.Paper instance)
      paper.options.gridsize = gridsize;
      // Draw a grid into the HTML 5 canvas and convert it to a data URI image
      let canvas = $('<canvas/>', { width: size, height: size });
      canvas[0].width = size;
      canvas[0].height = size;
      let context = canvas[0].getContext('2d');
      context.beginPath();
      context.rect(1, 1, 1, 1);
      context.fillStyle = color || '#AAAAAA';
      context.fill();
      // Finally, set the grid background image of the paper container element.
      // let gridBackgroundImage = canvas[0].toDataURL('image/png');
      // $(paper.el.childNodes[0]).css('background-image', 'url("' + gridBackgroundImage + '")');
      if(typeof(offset) != 'undefined'){
        $(paper.el.childNodes[1]).css('background-position', offset.x + 'px ' + offset.y + 'px');
      }
    }


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
