'use strict';

class Util {
  static initShapes(joint) {
    joint.dia.Element.define('qad.Question', {

        optionHeight: 30,
        questionHeight: 45,
        paddingBottom: 30,
        minWidth: 150,
        ports: {
            groups: {
                'in': {
                    position: 'top',
                    attrs: {
                        circle: {
                            magnet: 'passive',
                            stroke: 'white',
                            fill: '#feb663',
                            r: 14
                        },
                        text: {
                            pointerEvents: 'none',
                            fontSize: 12,
                            fill: 'white'
                        }
                    },
                    label: {
                        position: {
                            name: 'left',
                            args: { x: 5 }
                        }
                    }
                },
                'out': {
                    position: 'right',
                    attrs: {
                        'circle': {
                            magnet: true,
                            stroke: 'none',
                            fill: '#31d0c6',
                            r: 14
                        }
                    }
                }
            },
            items: [{
                group: 'in',
                attrs: {
                    text: { text: 'in' }
                }
            }]
        },
        attrs: {
            '.': {
                magnet: false
            },
            '.body': {
                refWidth: '100%',
                refHeight: '100%',
                rx: '0%',
                ry: '0%',
                stroke: '#000000',
                strokeWidth: 1,
                fill: {
                    type: 'linearGradient',
                    stops: [
                        { offset: '0%', color: '#FEB663' },
                        { offset: '100%', color: '#31D0C6' }
                    ],
                    // Top-to-bottom gradient.
                    attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
                }
            },
            '.btn-add-option': {
                refX: 10,
                refDy: -22,
                cursor: 'pointer',
                fill: 'white'
            },
            '.btn-remove-option': {
                xAlignment: 10,
                yAlignment: 13,
                cursor: 'pointer',
                fill: 'white'
            },
            '.options': {
                refX: 0
            },

            // Text styling.
            text: {
                fontFamily: 'Arial'
            },
            '.option-text': {
                fontSize: 11,
                fill: '#4b4a67',
                refX: 30,
                yAlignment: 'middle'
            },
            '.question-text': {
                fill: 'white',
                refX: '50%',
                refY: 15,
                fontSize: 15,
                textAnchor: 'middle',
                style: {
                    textShadow: '1px 1px 0px gray'
                }
            },

            // Options styling.
            '.option-rect': {
                rx: 0,
                ry: 0,
                stroke: 'white',
                strokeWidth: 1,
                strokeOpacity: .5,
                fillOpacity: .5,
                fill: 'white',
                refWidth: '100%'
            }
        }
    }, {

        markup: '<rect class="body"/><text class="question-text"/><g class="options"></g><path class="btn-add-option" d="M5,0 10,0 10,5 15,5 15,10 10,10 10,15 5,15 5,10 0,10 0,5 5,5z"/>',
        optionMarkup: '<g class="option"><rect class="option-rect"/><path class="btn-remove-option" d="M0,0 15,0 15,5 0,5z"/><text class="option-text"/></g>',

        initialize: function() {

            joint.dia.Element.prototype.initialize.apply(this, arguments);
            this.on('change:options', this.onChangeOptions, this);
            this.on('change:question', function() {
                this.attr('.question-text/text', this.get('question') || '');
                this.autoresize();
            }, this);

            this.on('change:questionHeight', function() {
                this.attr('.options/refY', this.get('questionHeight'), { silent: true });
                this.autoresize();
            }, this);

            this.on('change:optionHeight', this.autoresize, this);

            this.attr('.options/refY', this.get('questionHeight'), { silent: true });
            this.attr('.question-text/text', this.get('question'), { silent: true });

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
            var questionHeight = this.get('questionHeight');

            _.each(options, function(option) {

                var selector = '.option-' + option.id;

                attrsUpdate[selector] = { transform: 'translate(0, ' + offsetY + ')', dynamic: true };
                attrsUpdate[selector + ' .option-rect'] = { height: optionHeight, dynamic: true };
                attrsUpdate[selector + ' .option-text'] = { text: option.text, dynamic: true, refY: optionHeight / 2 };

                offsetY += optionHeight;

                var portY = offsetY - optionHeight / 2 + questionHeight;
                if (!that.getPort(option.id)) {
                    that.addPort({ group: 'out', id: option.id, args: { y: portY }});
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

    joint.shapes.qad.QuestionView = joint.dia.ElementView.extend({

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
            _.each(this.model.get('options'), function(option, index) {

                var className = 'option-' + option.id;
                var elOption = that.elOption.clone().addClass(className);
                elOption.attr('option-id', option.id);
                that.$options.append(elOption.node);

            }, that);

            // Apply `attrs` to the newly created SVG elements.
            this.update();
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
  }
}

export default Util;
