import joint from 'jointjs';
import Util from './Util';

class Graph extends joint.dia.Graph {

  constructor(...args) {
    super(...args);
    if (!joint.shapes.fpe || !joint.shapes.fpe.Module) {
      Util.initShapes();
    }
  }

  addPlannungModule(position, name, informationTypes) {
    this.addCell(new joint.shapes.fpe.Module({
      position,
      question: name,
      options: informationTypes
    }));
  }

}

export default Graph;
