import joint from 'jointjs';
import Link from './Link';
import Util from './Util';
import { GRID_SIZE } from './constants';

/**
 * Extended joint Graph class
 * support easy adding and connecting
 * plannung modules
 */
class Graph extends joint.dia.Graph {
  constructor(...args) {
    super(...args);
    if (!joint.shapes.fpe || !joint.shapes.fpe.Module) {
      Util.initShapes();
    }
  }

  addPlanningModule(position, name, informationTypes, id) {
    let module = new joint.shapes.fpe.Module({
      id,
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
    let cell = this.getCell(id);
    if (cell) {
      cell.remove();
    }
  }

  updatePlanningModule(id, name, informationTypes) {
    let cell = this.getCell(id);
    cell.set('moduleTitle', name);
    cell.set('informations', informationTypes);
  }

  connectPlanningModules(sourceId, targetId, informationId, id) {
    let link = new Link({
      id,
      source: { id: sourceId, port: informationId },
      target: { id: targetId, port: informationId }
    });
    this.addCell(link);
    return link;
  }
}

const roundNearest = (n, value) => {
  return Math.round(value / n) * n;
};

export default Graph;
