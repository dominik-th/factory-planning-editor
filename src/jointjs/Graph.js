import joint from 'jointjs';
import Util from './Util';
import C from './Constants';

class Graph extends joint.dia.Graph {

  constructor(...args) {
    super(...args);
    if (!joint.shapes.fpe || !joint.shapes.fpe.Module) {
      Util.initShapes();
    }
  }

  addPlanningModule(position, name, informationTypes) {
    let module = new joint.shapes.fpe.Module({
      position: {
        x: roundNearest(C.GRID_SIZE, position.x),
        y: roundNearest(C.GRID_SIZE, position.y)
      },
      question: name,
      options: informationTypes
    });
    this.addCell(module);
    return module;
  }

  removePlanningModule(id) {
    this.getCell(id).remove();
  }

  updatePlanningModule(id, name, informationTypes) {
    // todo: this is too hacky but the shape itself has to be fixed first
    let cachedCell = this.getCell(id);
    this.getCell(id).remove();
    let module = new joint.shapes.fpe.Module({
      position: cachedCell.get('position'),
      question: name,
      options: informationTypes
    });
    module.set('id', id);
    this.addCell(module);
  }

  connectPlanningModules(sourceId, targetId, informationId) {

  }

}

const roundNearest = (n, value) => {
  return Math.round(value / n) * n;
}

export default Graph;
