'use strict';

import 'jointjs/dist/joint.css';
import joint from 'jointjs';
import _ from 'lodash';
import C from './constants';

class Util {
  static initShapes() {
    joint.dia.Element.define('fpe.Module', {
      titleHeight: 45,
      rowHeight: 30,
      bottomHeight: 30,
      moduleWidth: 400,
      informations: {
        input: [],
        output: []
      },
      ports: {
        groups: {
          'in': {
            position: 'left',
            attrs: {
              'circle': {
                magnet: 'passive',
                stroke: '#999',
                fill: '#fff',
                r: 10
              }
            }
          },
          'out': {
            position: 'right',
            attrs: {
              'circle': {
                magnet: true,
                stroke: '#999',
                fill: '#fff',
                r: 10
              }
            }
          }
        },
      },
      attrs: {
        text: {
          fontFamily: 'Arial'
        },
        // this disables connection to the rectangle body
        '.': {
          magnet: false
        },
        '.body': {
          refWidth: '100%',
          refHeight: '100%',
          rx: '5',
          ry: '5',
          stroke: '#000000',
          strokeWidth: 1,
          fill: '#ccc'
        },
        '.module-title': {
          fill: '#333',
          fontWeight: 'bold',
          refX: '50%',
          refY: 15,
          fontSize: 15,
          textAnchor: 'middle',
        },
        '.information-table': {
          refWidth: '100%'
        },
        '.table-row': {
          refWidth: '100%',
        },
        '.table-cell': {
          refWidth: '50%',
          refX: '25%',
          textAnchor: 'middle',
          overflow: 'hidden',
        },
        '.cell-rect':  {
          stroke: 'black',
          strokeWidth: '1'
        },
        '.right': {
          refX: '75%'
        }
      }
    }, {
      markup: '<rect class="body"/><text class="module-title"/><g class="information-table"></g>',
      rowMarkup: '<g class="table-row"></g>',
      cellMarkup: '<g class="table-cell"><rect class="cell-rect"/><text class="cell-text"/></g>',

      initialize: function() {
        joint.dia.Element.prototype.initialize.apply(this, arguments);
        this.on('change:moduleTitle', () => {
          this.attr('.module-title/text', this.get('moduleTitle') || '');
          this.autoresize();
        });
        this.on('change:informations', this.onChangeInformations);

        this.attr('.module-title/text', this.get('moduleTitle'), { silent: true });
        this.attr('.information-table/refY', this.get('titleHeight'), { silent: true });

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
          if (!searchPool.some(item => item.id === port.id)) {
            // this will also remove any connected links
            // and fire events accordingly
            this.removePort(port.id)
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
            let selector = '.information-' + information.id;
            attrsUpdate[selector] = { transform: `translate(0, ${offsetY})`, dynamic: true };
            attrsUpdate[selector + ' .table-cell'] = { height: rowHeight, dynamic: true };
            attrsUpdate[selector + ' .cell-text'] = { text: information.text, dynamic: true, refY: rowHeight / 2 };
            offsetY += rowHeight;
            let portY = offsetY - rowHeight / 2 + titleHeight;
            if (!this.getPort(information.id)) {
              this.addPort({ group: source.group, id: information.id, args: { y: portY }});
            } else {
              this.portProp(information.id, 'args/y', portY);
            }
          }
        }
        this.attr(attrsUpdate);
        this.autoresize();
        // helpful link: http://svg-whiz.com/svg/table.svg
      },

      autoresize: function() {
        let informations = this.get('informations');
        let gap = this.get('bottomHeight');
        let height = Math.max(informations.input.length, informations.output.length)
          * this.get('rowHeight')
          + this.get('titleHeight')
          + gap;
        this.resize(this.get('moduleWidth'), height);
      }
    });

    joint.shapes.fpe.ModuleView = joint.dia.ElementView.extend({
      initialize: function() {
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, 'change:informations', this.renderInformations, this);
      },

      renderMarkup: function() {
        joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);
        this.$informationTable = this.$('.information-table');
        this.elRow = joint.V(this.model.rowMarkup);
        this.elCell = joint.V(this.model.cellMarkup);
        this.renderInformations();
      },

      renderInformations: function() {
        this.$informationTable.empty();

        let informations = this.model.get('informations');
        let iterations = Math.max(informations.input.length, informations.output.length);
        for (let i = 0; i < iterations; i++) {
          let row = this.elRow.clone();
          let cell = this.elCell.clone();
          // console.log(this.elRow)
          // console.log(this.elCell)
          if (informations.input[i]) {
            cell.addClass('information-' + informations.input[i].id)
          } else {

          }
          row.append(cell);
          cell = this.elCell.clone();
          if (informations.output[i]) {
            cell.addClass('information-' + informations.output[i].id)
            cell.addClass('right')
          } else {

          }
          row.append(cell);
          this.$informationTable.append(row.node);
        }

        // var that = this;
        // _.each(this.model.get('informations'), function(option) {

        //   var className = 'information-' + option.id;
        //   var elOption = that.elOption.clone().addClass(className);
        //   elOption.attr('information-id', option.id);
        //   that.$informationTable.append(elOption.node);

        // }, that);

        // Apply `attrs` to the newly created SVG elements.
        this.update();
      }
    });

// OLD
    joint.dia.Element.define('fpe.OldModule', {
      titleHeight: 45,
      rowHeight: 30,
      bottomHeight: 30,
      moduleWidth: 200,
      optionHeight: 30,
      questionHeight: 45,
      paddingBottom: 0,
      minWidth: 200,
      ports: {
        groups: {
          'in': {
            position: 'left',
            attrs: {
              'circle': {
                magnet: 'passive',
                stroke: '#999',
                fill: '#fff',
                r: 10
              }
            }
          },
          'out': {
            position: 'right',
            attrs: {
              'circle': {
                magnet: true,
                stroke: '#999',
                fill: '#fff',
                r: 10
              }
            }
          }
        },
      },
      attrs: {
        text: {
          fontFamily: 'Arial'
        },
        // this disables connection to the rectangle body
        '.': {
          magnet: false
        },
        '.body': {
          refWidth: '100%',
          refHeight: '100%',
          rx: '5',
          ry: '5',
          stroke: '#000000',
          strokeWidth: 1,
          fill: '#ccc'
        },
        '.module-title': {
          fill: '#333',
          fontWeight: 'bold',
          refX: '50%',
          refY: 15,
          fontSize: 15,
          textAnchor: 'middle',
        },

        '.option-text': {
          fontSize: 11,
          fill: '#4b4a67',
          refX: '50%',
          yAlignment: 'middle',
          textAnchor: 'middle',
        },
        // Options styling.
        '.option-rect': {
          rx: 0,
          ry: 0,
          stroke: 'black',
          strokeWidth: .5,
          strokeOpacity: 1,
          fillOpacity: 0,
          fill: 'white',
          refWidth: '100%'
        },
        '.test-line': {
          refPoints: '10,10 20,10, 10,10',
          fill: 'none',
          stroke: 'black'
        }
      }
    }, {
      markup: '<rect class="body"/><text class="module-title"/><g class="options"></g>',
      optionMarkup: '<g class="option"><polyline class="test-line" /><text class="option-text"/></g>',
      initialize: function() {
        joint.dia.Element.prototype.initialize.apply(this, arguments);
        this.on('change:moduleTitle', () => {
          this.attr('.module-title/text', this.get('moduleTitle') || '');
          this.autoresize();
        });
        this.on('change:options', this.onChangeOptions);

        this.attr('.module-title/text', this.get('moduleTitle'), { silent: true });
        this.attr('.options/refY', this.get('titleHeight'), { silent: true });

        this.onChangeOptions();
      },

      onChangeOptions: function() {
        var options = this.get('options');
        var optionHeight = this.get('optionHeight');

        // First clean up the previously set attrs for the old options object.
        // We mark every new attribute object with the `dynamic` flag set to `true`.
        // This is how we recognize previously set attributes.
        var attrs = this.get('attrs');
        var that = this;
        _.each(attrs, function(attrs, selector) {
          if (attrs.dynamic) {
            // Remove silently because we're going to update `attrs`
            // later in this method anyway.
            that.removeAttr(selector, { silent: true });
          }
        }, that);

        // Collect new attrs for the new options.
        var offsetY = 0;
        var attrsUpdate = {};
        var questionHeight = this.get('titleHeight');
        _.each(options, function(option) {
          var selector = '.option-' + option.id;
          attrsUpdate[selector] = { transform: 'translate(0, ' + offsetY + ')', dynamic: true };
          attrsUpdate[selector + ' .option-rect'] = { height: optionHeight, dynamic: true };
          attrsUpdate[selector + ' .option-text'] = { text: option.text, dynamic: true, refY: optionHeight / 2 };
          offsetY += optionHeight;
          var portY = offsetY - optionHeight / 2 + questionHeight;
          if (!that.getPort(option.id)) {
            if (option.payload && option.payload === 'IN') {
              that.addPort({ group: 'in', id: option.id, args: { y: portY }});
            } else {
              that.addPort({ group: 'out', id: option.id, args: { y: portY }});
            }
          } else {
            that.portProp(option.id, 'args/y', portY);
          }
        }, this);

        this.attr(attrsUpdate);
        this.autoresize();
      },

      autoresize: function() {
        var options = this.get('options') || [];
        var gap = this.get('paddingBottom') || 20;
        var height = options.length * this.get('optionHeight') + this.get('questionHeight') + gap;
        var width = 10;
        this.resize(Math.max(this.get('minWidth') || 150, width), height);
      },

      addOption: function(option) {
        var options = JSON.parse(JSON.stringify(this.get('options')));
        options.push(option);
        this.set('options', options);
      },

      removeOption: function(id) {
        var options = JSON.parse(JSON.stringify(this.get('options')));
        this.removePort(id);
        this.set('options', _.without(options, _.findWhere(options, { id: id })));
      },

      changeOption: function(id, option) {
        if (!option.id) {
            option.id = id;
        }
        var options = JSON.parse(JSON.stringify(this.get('options')));
        options[_.findIndex(options, { id: id })] = option;
        this.set('options', options);
      }
    });

    joint.shapes.fpe.OldModuleView = joint.dia.ElementView.extend({
      events: {
        'click .btn-add-option': 'onAddOption',
        'click .btn-remove-option': 'onRemoveOption'
      },

      initialize: function() {
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, 'change:options', this.renderOptions, this);
      },

      renderMarkup: function() {
        joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);

        // A holder for all the options.
        this.$options = this.$('.options');
        // Create an SVG element representing one option. This element will
        // be cloned in order to create more options.
        this.elOption = joint.V(this.model.optionMarkup);

        this.renderOptions();
      },

      renderOptions: function() {
        this.$options.empty();

        var that = this;
        _.each(this.model.get('options'), function(option) {

          var className = 'option-' + option.id;
          var elOption = that.elOption.clone().addClass(className);
          elOption.attr('option-id', option.id);
          that.$options.append(elOption.node);

        }, that);

        // Apply `attrs` to the newly created SVG elements.
        // this.update();
      },

      onAddOption: function() {
        this.model.addOption({
          id: _.uniqueId('option-'),
          text: 'Option ' + this.model.get('options').length
        });
      },

      onRemoveOption: function(evt) {
        this.model.removeOption(joint.V(evt.target.parentNode).attr('option-id'));
      }
    });
// OLD
  }
}

export default Util;
