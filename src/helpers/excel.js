import ExcelJS from 'exceljs/dist/es5/exceljs.browser';
import uuidv4 from 'uuid/v4';

export async function generateExcelSheet(state) {
  // create workbook and add worksheet
  let workbook = new ExcelJS.Workbook();
  let worksheet = workbook.addWorksheet('FPE-Export');

  // make enough space for long titles
  worksheet.getRow(1).height = 200;
  worksheet.getColumn(1).width = 50;

  let informationIds = Object.keys(state.informationTypes);
  let moduleIds = Object.keys(state.planningModules);

  // write all information types in the first row
  for (let [index, informationId] of informationIds.entries()) {
    let cell = worksheet.getRow(1).getCell(index + 2);
    cell.value = state.informationTypes[informationId].name;
    cell.alignment = { textRotation: 90 };
  }
  // fill the rest with modules in the first column and information types in the matrix
  for (let [index, moduleId] of moduleIds.entries()) {
    let moduleRow = worksheet.getRow(index + 2);
    moduleRow.getCell(1).value = state.planningModules[moduleId].name;
    let module = state.planningModules[moduleId];
    for (let inId of module.inputInformation) {
      let cell = moduleRow.getCell(informationIds.indexOf(inId) + 2);
      cell.value = 'LE';
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00A9D08E' } // light green
      };
    }
    for (let outId of module.outputInformation) {
      let cell = moduleRow.getCell(informationIds.indexOf(outId) + 2);
      cell.value = 'LA';
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '009BC2E6' } // light blue
      };
    }
  }

  // lock first row and column
  worksheet.views = [
    { state: 'frozen', xSplit: 1, ySplit: 1, topLeftCell: 'B2' }
  ];

  // second worksheet for modeling modules
  let modelingModulesWs = workbook.addWorksheet('Modeling-Modules');
  // break down object in separate columns
  modelingModulesWs.getRow(1).getCell(1).value =
    'Module (referencing row number)';
  modelingModulesWs.getRow(1).getCell(2).value = 'Position X';
  modelingModulesWs.getRow(1).getCell(3).value = 'Position Y';
  modelingModulesWs.getRow(1).getCell(4).value = 'Num. Employees';
  modelingModulesWs.getRow(1).getCell(5).value = 'Cost (in cents)';
  modelingModulesWs.getRow(1).getCell(6).value = 'Duration (in minutes)';
  modelingModulesWs.getRow(1).getCell(7).value = 'Custom';
  let modelingModuleIds = Object.keys(state.modeling.modules);
  for (let [index, modelingModuleId] of modelingModuleIds.entries()) {
    let modelingModule = state.modeling.modules[modelingModuleId];
    modelingModulesWs.getRow(2 + index).getCell(1).value =
      moduleIds.indexOf(modelingModule.moduleId) + 2;
    modelingModulesWs.getRow(2 + index).getCell(2).value =
      modelingModule.position.x;
    modelingModulesWs.getRow(2 + index).getCell(3).value =
      modelingModule.position.y;
    modelingModulesWs.getRow(2 + index).getCell(4).value =
      modelingModule.attributes.numEmployees;
    modelingModulesWs.getRow(2 + index).getCell(5).value =
      modelingModule.attributes.cost;
    modelingModulesWs.getRow(2 + index).getCell(6).value =
      modelingModule.attributes.duration;
    modelingModulesWs.getRow(2 + index).getCell(7).value = JSON.stringify(
      modelingModule.attributes.custom
    );
  }

  // thirs worksheet for connection between modeling modules
  let modelingLinksWs = workbook.addWorksheet('Modeling-Links');
  modelingLinksWs.getRow(1).getCell(1).value = 'From (row number)';
  modelingLinksWs.getRow(1).getCell(2).value = 'To (row number)';
  modelingLinksWs.getRow(1).getCell(3).value = 'Connecting Information';
  let modelingLinkIds = Object.keys(state.modeling.links);
  for (let [index, modelingLinkId] of modelingLinkIds.entries()) {
    let modelingLink = state.modeling.links[modelingLinkId];
    modelingLinksWs.getRow(2 + index).getCell(1).value =
      modelingModuleIds.indexOf(modelingLink.fromModule) + 2;
    modelingLinksWs.getRow(2 + index).getCell(2).value =
      modelingModuleIds.indexOf(modelingLink.toModule) + 2;
    modelingLinksWs.getRow(2 + index).getCell(3).value =
      informationIds.indexOf(modelingLink.informationId) + 2;
  }

  let mimeType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  let data = await workbook.xlsx.writeBuffer();
  return new Blob([data], { type: mimeType });
}

export async function importExcelSheet(file) {
  let informations = [];
  let modules = [];

  let workbook = await readExcelFileAsync(file);
  let worksheet = workbook.getWorksheet(1);
  let informationRow = worksheet.getRow(1);
  for (let i = 2; informationRow.getCell(i).value !== null; i++) {
    informations[i] = {
      id: uuidv4(),
      name: parseCellValue(informationRow.getCell(i).value),
      abbreviation: null
    };
  }
  let moduleValues = worksheet.getColumn(1).values;
  for (let i = 2; moduleValues !== null && i < moduleValues.length; i++) {
    modules[i] = {
      id: uuidv4(),
      name: parseCellValue(moduleValues[i]),
      abbreviation: null,
      inputInformation: [],
      outputInformation: []
    };
  }

  for (let i = 0; i < modules.length; i++) {
    if (!modules[i]) continue;
    for (let u = 0; u < informations.length; u++) {
      if (!informations[u]) continue;

      let cell = worksheet.getRow(i).getCell(u);
      if (!cell.value) continue;

      if (cell.value === 'LE' || cell.value === 'GE') {
        modules[i].inputInformation.push(informations[u].id);
      } else if (cell.value === 'LA') {
        modules[i].outputInformation.push(informations[u].id);
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `Invalid value: ${modules[i].name} - ${informations[u].name}`
        );
      }
    }
  }

  let state = {
    planningModules: {},
    informationTypes: {},
    modeling: {
      modules: {},
      links: {},
      selected: null
    }
  };

  for (let i = 0; i < modules.length; i++) {
    if (!modules[i]) continue;
    state.planningModules[modules[i].id] = {
      name: modules[i].name,
      abbreviation: modules[i].abbreviation,
      inputInformation: modules[i].inputInformation,
      outputInformation: modules[i].outputInformation
    };
  }

  for (let i = 0; i < informations.length; i++) {
    if (!informations[i]) continue;
    state.informationTypes[informations[i].id] = {
      name: informations[i].name,
      abbreviation: informations[i].abbreviation
    };
  }
  return state;
}

function readExcelFileAsync(file) {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.onload = async evt => {
      // sometimes the Workbook xlsx load function is really slow, prepare for a few secs wait
      let workbook = await new ExcelJS.Workbook().xlsx.load(evt.target.result);
      resolve(workbook);
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(file);
  });
}

let parseCellValue = value => {
  if (typeof value === 'string') {
    return value;
  } else if (value.richText) {
    return value.richText.map(part => part.text).join(' ');
  }
  return 'PARSING ERROR';
};
