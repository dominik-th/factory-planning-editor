'use strict';

import joint from 'jointjs';
import svgPanZoom from 'svg-pan-zoom';
import Link from './Link';
import { GRID_SIZE } from './constants';

/**
 * Extend jointjs Paper class
 * with pan and zoom and appropriate api
 */
class Paper extends joint.dia.Paper {
  scale = 1;

  constructor(element, graph) {
    super({
      el: element,
      model: graph,
      width: '100%',
      height: '100%',
      gridSize: GRID_SIZE,
      drawGrid: { name: 'mesh', color: '#EEE' },
      async: true,
      linkPinning: false,
      snapLinks: { radius: 50 },
      validateConnection: validateConnection(graph),
      markAvailable: true,
      highlighting: {
        default: {
          name: 'addClass',
          options: {
            className: 'highlighted'
          }
        }
      },
      defaultLink: new Link()
    });
    this.element = element;
  }

  enableSvgPanZoom() {
    let targetElement = this.element.children[2];
    // add svgPanZoom package
    this.panZoom = svgPanZoom(targetElement, {
      fit: false,
      panEnabled: false,
      minZoom: 0.05,
      maxZoom: 3,
      zoomScaleSensitivity: 1,
      dblClickZoomEnabled: false,
      onZoom: scale => {
        this.scale = scale;
        this._setGrid(GRID_SIZE * 15 * this.scale, '#808080');
      },
      beforePan: (oldpan, newpan) => {
        this._setGrid(GRID_SIZE * 15 * this.scale, '#808080', newpan);
      }
    });

    this.on('blank:pointerdown', () => {
      this.panZoom.enablePan();
    });

    this.on('cell:pointerup blank:pointerup', () => {
      this.panZoom.disablePan();
    });
  }

  zoom(scale) {
    if (this.panZoom) {
      this.panZoom.zoom(scale);
    }
  }

  zoomBy(scale) {
    if (this.panZoom) {
      this.panZoom.zoomBy(scale);
    }
  }

  zoomIn() {
    if (this.panZoom) {
      this.panZoom.zoomIn();
    }
  }

  zoomOut() {
    if (this.panZoom) {
      this.panZoom.zoomOut();
    }
  }

  zoomAtPointBy(scale, position) {
    if (this.panZoom) {
      this.panZoom.zoomAtPointBy(scale, position);
    }
  }

  pan(position) {
    if (this.panZoom) {
      this.panZoom.pan(position);
    }
  }

  _setGrid(size, color, offset) {
    let $ = require('jquery');
    localStorage.setItem(
      'window',
      JSON.stringify({
        size,
        offset
      })
    );
    // Set grid size on the JointJS paper object (joint.dia.Paper instance)
    // this.options.gridsize = gridsize;
    // Draw a grid into the HTML 5 canvas and convert it to a data URI image
    let canvas = $('<canvas/>', { width: size, height: size });
    canvas[0].width = size;
    canvas[0].height = size;
    let context = canvas[0].getContext('2d');
    context.beginPath();
    context.rect(10, 10, 10, 10);
    context.fillStyle = color || '#AAAAAA';
    context.fill();
    // Finally, set the grid background image of the paper container element.
    // let gridBackgroundImage = canvas[0].toDataURL('image/png');
    // $(paper.el.childNodes[0]).css('background-image', 'url("' + gridBackgroundImage + '")');
    if (typeof offset != 'undefined') {
      $(this.el.childNodes[1]).css(
        'background-position',
        offset.x + 'px ' + offset.y + 'px'
      );
    }
  }
}

const validateConnection = graph => {
  return (cellViewS, magnetS, cellViewT, magnetT) => {
    // Link to the same cell is not allowed
    if (cellViewS === cellViewT) return false;

    // Target magnet has to be of input type
    if (!magnetT || magnetT.getAttribute('port-group') !== 'in') return false;

    // Do not allow links directed from input group
    if (!magnetS || magnetS.getAttribute('port-group') === 'in') return false;

    // Information types have to match
    if (magnetS.getAttribute('port') !== magnetT.getAttribute('port'))
      return false;

    // Input information already satisfied
    let satisfied =
      graph.getConnectedLinks(cellViewT.model).filter(link => {
        return link.get('target').port === magnetS.getAttribute('port');
      }).length !== 0;
    if (satisfied) return false;

    return !graph.isSuccessor(cellViewT.model, cellViewS.model);
  };
};

export default Paper;
