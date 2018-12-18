import joint from 'jointjs'

class Graph extends joint.dia.Graph {
  constructor(...args) {
    console.log('this')
    super(...args);
  }
}

export default Graph;
