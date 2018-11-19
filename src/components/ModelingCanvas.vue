<template>
  <div class="container-modelling-canvas myholder" id="myholder"></div>
</template>

<script>

export default {
  name: 'ModelingCanvas',
  mounted() {

    let { joint, $ } = window;

    let graph = new joint.dia.Graph;
    var paper = new joint.dia.Paper({
        el: document.getElementById('myholder'),
        model: graph,
        width: '100%',
        gridSize: 10,
        drawGrid: true,
                    background: {
                color: 'rgba(0, 255, 0, 0.3)'
            }
    });

// let dragStartPosition = false

// paper.on('blank:pointerdown',
//     function(event, x, y) {
//         dragStartPosition = { x: x, y: y};
//     }
// );

// paper.on('cell:pointerup blank:pointerup', function() {
//     dragStartPosition = false;
// });

// $("#myholder")
//     .mousemove(function(event) {
//         if (dragStartPosition)
//             paper.translate(
//                 event.offsetX - dragStartPosition.x,
//                 event.offsetY - dragStartPosition.y);
//     });




// paper.on('blank:mousewheel',
//     function(event, x, y, delta) {
//         paper.scale(paper.scale().sx + (delta * .1), paper.scale().sy + (delta * .1));
//     }
// );



let gridsize = 10
let targetElement = $("#myholder")[0];
var currentScale = 1;
var panAndZoom = window.svgPanZoom(targetElement.childNodes[2],
{
    viewportSelector: targetElement.childNodes[0].childNodes[0],
    fit: false,
    zoomScaleSensitivity: 0.4,
    panEnabled: false,
    onZoom: function(scale){
        currentScale = scale;
        setGrid(paper, 10*15*currentScale, '#808080');
    },
    beforePan: function(oldpan, newpan){
        setGrid(paper, 10*15*currentScale, '#808080', newpan);
    }
});

paper.on('blank:pointerdown', function () {
    panAndZoom.enablePan();
});

paper.on('cell:pointerup blank:pointerup', function() {
  panAndZoom.disablePan();
});

function setGrid(paper, size, color, offset) {
    // Set grid size on the JointJS paper object (joint.dia.Paper instance)
    paper.options.gridsize = gridsize;
    // Draw a grid into the HTML 5 canvas and convert it to a data URI image
    var canvas = $('<canvas/>', { width: size, height: size });
    canvas[0].width = size;
    canvas[0].height = size;
    var context = canvas[0].getContext('2d');
    context.beginPath();
    context.rect(1, 1, 1, 1);
    context.fillStyle = color || '#AAAAAA';
    context.fill();
    // Finally, set the grid background image of the paper container element.
    var gridBackgroundImage = canvas[0].toDataURL('image/png');
    $(paper.el.childNodes[0]).css('background-image', 'url("' + gridBackgroundImage + '")');
    if(typeof(offset) != 'undefined'){
        $(paper.el.childNodes[0]).css('background-position', offset.x + 'px ' + offset.y + 'px');
    }
}



    var rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
        body: {
            fill: 'blue'
        },
        label: {
            text: 'Hello2',
            fill: 'white'
        }
    });
    rect.addTo(graph);

    var rect2 = rect.clone();
    rect2.translate(300, 0);
    rect2.attr('label/text', 'World!');
    rect2.addTo(graph);

    var link = new joint.shapes.standard.Link();
    link.source(rect);
    link.target(rect2);
    link.addTo(graph);

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-modelling-canvas {
  width: 100vw;
  height: 95vh;
  overflow: hidden;
/*  background-color:#fff;
  background-image: linear-gradient(white 0px, transparent 0px),
  linear-gradient(90deg, white 0px, transparent 0px),
  linear-gradient(rgba(200,200,200,.3) 1px, transparent 1px),
  linear-gradient(90deg, rgba(200,200,200,.3) 1px, transparent 1px);
  background-size:100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position:-2px -2px, -2px -2px, -1px -1px, -1px -1px*/
  /*background-color: green;*/
}
#myholder {
  height: 90vh !important;
}
</style>
