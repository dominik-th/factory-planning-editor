<template>
  <div class="container-modelling-canvas" id="container-modelling-canvas"></div>
</template>

<script>

export default {
  name: 'ModelingCanvas',
  computed: {
    modules() {
      return JSON.stringify(this.$store.getters.planningModules)
    }
  },
  mounted() {
    let { joint, $ } = window;
    let gridsize = 10

// https://codepen.io/fxaeberard/pen/reGvjm

    let graph = new joint.dia.Graph;
    let paper = new joint.dia.Paper({
      el: document.getElementById('container-modelling-canvas'),
      model: graph,
      width: '100%',
      height: '100%',
      gridSize: 10,
      drawGrid: true,
      background: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    });

    let targetElement = $("#container-modelling-canvas")[0];
    let currentScale = 1;
    let panAndZoom = window.svgPanZoom(targetElement.childNodes[2], {
      viewportSelector: targetElement.childNodes[0].childNodes[0],
      fit: false,
      zoomScaleSensitivity: 1,
      maxZoom: 3,
      minZoom: 0.1,
      dblClickZoomEnabled: false,
      panEnabled: true,
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
      // console.log(paper)
      // panAndZoom.enablePan();
      setGrid(paper, windowProperties.size, '#808080', windowProperties.offset)
    }

    graph.on('add', function() {
      // console.log('xx')
      // console.log(graph.toJSON())
      localStorage.setItem('graph', JSON.stringify(graph.toJSON()))
    })
    var that = this;
    paper.on('blank:pointerdown', function () {
    // console.log(that.$store.getters.planningModules[0].id)
      panAndZoom.enablePan();
    });

    paper.on('cell:pointerup blank:pointerup', function() {
      panAndZoom.disablePan();
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
      rect.addTo(graph);
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
      let gridBackgroundImage = canvas[0].toDataURL('image/png');
      $(paper.el.childNodes[0]).css('background-image', 'url("' + gridBackgroundImage + '")');
      if(typeof(offset) != 'undefined'){
        $(paper.el.childNodes[0]).css('background-position', offset.x + 'px ' + offset.y + 'px');
      }
    }


  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-modelling-canvas {
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
