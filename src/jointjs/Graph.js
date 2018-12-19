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
    let module = new joint.shapes.fpe.Module({
      position,
      question: name,
      options: informationTypes
    });
    this.addCell(module);
    return module.id;
  }

  removePlanningModule(id) {
    this.getCell(id).remove();
  }

  updatePlanningModule(id, name, informationTypes) {

  }

  connectPlanningModules(sourceId, targetId, informationId) {

  }

}

export default Graph;
