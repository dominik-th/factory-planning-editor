import joint from 'jointjs';

/**
 * Style default Links
 * and add metro routing
 */
class Link extends joint.dia.Link {
  constructor(options, ...args) {
    // default options include:
    // thicker lines
    // metro style routing
    // arrow head at the target
    let defaultOptions = {
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
        }
      }
    };
    super({ ...defaultOptions, ...options }, ...args);
  }
}

export default Link;
