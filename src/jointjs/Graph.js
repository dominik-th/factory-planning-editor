import joint from 'jointjs';
import Util from './Util';
import { GRID_SIZE } from './constants';

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
        x: roundNearest(GRID_SIZE, position.x),
        y: roundNearest(GRID_SIZE, position.y)
      },
      moduleTitle: name,
      informations: informationTypes
    });
    this.addCell(module);
    return module;
  }

  removePlanningModule(id) {
    this.getCell(id).remove();
  }

  updatePlanningModule(id, name, informationTypes) {
    let cell = this.getCell(id);
    cell.set('moduleTitle', name);
    cell.set('informations', informationTypes);
  }

  connectPlanningModules(sourceId, targetId, informationId) {

  }

}

const roundNearest = (n, value) => {
  return Math.round(value / n) * n;
}

export default Graph;
