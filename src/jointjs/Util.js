'use strict';

import 'jointjs/dist/joint.css';
import joint from 'jointjs';
import * as C from './constants';

class Util {
  static initShapes() {
    joint.dia.Element.define(
      'fpe.Module',
      {
        titleHeight: C.TITLE_HEIGHT,
        rowHeight: C.ROW_HEIGHT,
        bottomHeight: C.BOTTOM_HEIGHT,
        moduleWidth: C.MODULE_WIDTH,
        informations: {
          input: [],
          output: []
        },
        ports: {
          groups: {
            in: {
              position: 'left',
              attrs: {
                circle: {
                  magnet: 'passive'
                }
              }
            },
            out: {
              position: 'right',
              attrs: {
                circle: {
                  magnet: true
                }
              }
            }
          }
        },
        attrs: {
          // this disables connection to the rectangle body
          '.': {
            magnet: false
          },
          '.body': {
            refWidth: '100%',
            refHeight: '100%'
          },
          '.border': {
            refWidth: '100%',
            refHeight: '100%'
          },
          '.module-title': {
            refX: '50%',
            refY: 15
          }
        }
      },
      {
        markup:
          '<g class="jointcell"><rect class="body"/><text class="module-title"/><g class="information-table" shape-rendering="auto" /><rect class="border" /></g>',
        fillMarkup: '<rect class="fill" />',
        stripeMarkup: '<rect class="stripe" />',
        gridMarkup: '<path class="grid" />',
        textMarkup: '<text class="text" />',

        initialize: function() {
          joint.dia.Element.prototype.initialize.apply(this, arguments);
          this.on('change:moduleTitle', () => {
            this.attr('.module-title/text', this.get('moduleTitle'));
            this.autoresize();
          });
          this.on('change:informations', this.onChangeInformations);

          this.attr('.module-title/text', this.get('moduleTitle'), {
            silent: true
          });
          this.attr('.information-table/refY', this.get('titleHeight'), {
            silent: true
          });

          this.onChangeInformations();
        },

        onChangeInformations: function() {
          let informations = this.get('informations');
          let rowHeight = this.get('rowHeight');
          let titleHeight = this.get('titleHeight');

          // clean up previous ports which are not used anymore
          let connectedPorts = this.getPorts();
          for (let port of connectedPorts) {
            let searchPool = [];
            if (port.group === 'in') {
              searchPool = informations.input;
            } else if (port.group === 'out') {
              searchPool = informations.output;
            }
            if (!searchPool.some(item => item.id === port.id && !item.global)) {
              // this will also remove any connected links
              // and fire events accordingly
              this.removePort(port.id);
            }
          }

          // clean up previously added attributes
          let attrs = this.get('attrs');
          for (let selector in attrs) {
            if (attrs[selector].dynamic) {
              this.removeAttr(selector, { silent: true });
            }
          }

          let informationSources = [
            { group: 'in', data: informations.input },
            { group: 'out', data: informations.output }
          ];

          let attrsUpdate = {};
          for (let source of informationSources) {
            let offsetY = 0;
            for (let information of source.data) {
              // let selector = '.information-' + information.id;
              // attrsUpdate[selector] = {
              //   transform: `translate(0, ${offsetY})`,
              //   dynamic: true
              // };
              // attrsUpdate[selector + ' .table-cell'] = {
              //   height: rowHeight,
              //   dynamic: true
              // };
              // attrsUpdate[selector + ' .cell-text'] = {
              //   text: information.text,
              //   dynamic: true,
              //   refY: rowHeight / 2
              // };
              offsetY += rowHeight;
              if (information.global) {
                continue;
              }
              let portY = offsetY - rowHeight / 2 + titleHeight;
              if (!this.getPort(information.id)) {
                this.addPort({
                  group: source.group,
                  id: information.id,
                  args: { y: portY }
                });
              } else {
                this.portProp(information.id, 'args/y', portY);
              }
            }
          }
          // this.attr(attrsUpdate);
          this.autoresize();
        },

        autoresize: function() {
          let informations = this.get('informations');
          let gap = this.get('bottomHeight');
          let height =
            Math.max(informations.input.length, informations.output.length) *
              this.get('rowHeight') +
            this.get('titleHeight') +
            gap;
          this.resize(this.get('moduleWidth'), height);
        }
      }
    );

    joint.shapes.fpe.ModuleView = joint.dia.ElementView.extend({
      initialize: function() {
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.listenTo(
          this.model,
          'change:informations',
          this.renderInformations,
          this
        );
      },

      renderMarkup: function() {
        joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);
        this.$informationTable = this.$('.information-table');
        this.elFill = joint.V(this.model.fillMarkup);
        this.elStripe = joint.V(this.model.stripeMarkup);
        this.elGrid = joint.V(this.model.gridMarkup);
        this.elText = joint.V(this.model.textMarkup);
        this.renderInformations();
      },

      renderInformations: function() {
        this.$informationTable.empty();
        this._elements = [];
        this._renderStripes();
        this._renderGrid();
        this._renderValues();
        this.update();
      },

      update: function() {
        joint.dia.ElementView.prototype.update.apply(this, arguments);
        for (let i = 0; i < this._elements.length; i++) {
          let element = this._elements[i];
          this.updateDOMSubtreeAttributes(element[0], element[1], {
            rootBBox: element[2]
          });
        }
      },

      _renderStripes: function() {
        let rowHeight = this.model.get('rowHeight');
        let moduleWidth = this.model.get('moduleWidth');
        let informations = this.model.get('informations');
        let numRows = Math.max(
          informations.input.length,
          informations.output.length
        );

        let fill = this.elFill.clone();
        this.$informationTable.append(
          fill.attr({
            x: 0,
            y: 0,
            width: moduleWidth,
            height: rowHeight * numRows
          }).node
        );

        for (let i = 0; i < numRows; i += 2) {
          let stripe = this.elStripe.clone();
          this.$informationTable.append(
            stripe.attr({
              x: 0,
              y: i * rowHeight,
              width: moduleWidth,
              height: rowHeight
            }).node
          );
        }
      },

      _renderGrid: function() {
        let rowHeight = this.model.get('rowHeight');
        let moduleWidth = this.model.get('moduleWidth');
        let informations = this.model.get('informations');
        let numRows = Math.max(
          informations.input.length,
          informations.output.length
        );

        // inner grid
        let d = ['M', moduleWidth / 2, 0];
        d.push('V', numRows * rowHeight);
        d.push('M', 0, 0);
        d.push('H', moduleWidth);
        d.push('M', 0, numRows * rowHeight);
        d.push('H', moduleWidth);

        // outer grid left and right
        d.push('M', 0, 0);
        d.push('V', numRows * rowHeight);
        d.push('M', moduleWidth, 0);
        d.push('V', numRows * rowHeight);
        let grid = this.elGrid.clone();
        this.$informationTable.append(
          grid.attr({
            d: d.join(' ')
          }).node
        );
      },

      _renderValues: function() {
        let rowHeight = this.model.get('rowHeight');
        let moduleWidth = this.model.get('moduleWidth');
        let informations = this.model.get('informations');

        let informationSources = [
          { group: 'in', data: informations.input },
          { group: 'out', data: informations.output }
        ];

        for (let source of informationSources) {
          for (let [index, information] of source.data.entries()) {
            let text = this.elText.clone();
            let bbox = {
              x: source.group === 'in' ? 0 : moduleWidth / 2,
              y: index * rowHeight,
              width: moduleWidth / 2,
              height: rowHeight
            };
            let clippedText =
              information.text.length > 20
                ? information.text.substr(0, 28) + '...'
                : information.text;
            if (information.global) {
              // clippedText = '[GE] ' + clippedText;
              text.addClass('global');
            }
            text.attr(bbox).text(clippedText);
            this.$informationTable.append(text.node);

            this._elements.push([
              text.node,
              {
                '.': {
                  xAlignment: 'middle',
                  yAlignment: 'middle',
                  refX: 0.5,
                  refY: 0.5
                }
              },
              joint.g.Rect(bbox)
            ]);
          }
        }
      }
    });
  }
}

export default Util;
