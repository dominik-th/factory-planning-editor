import ExcelJS from 'exceljs/dist/es5/exceljs.browser';

export async function generateExcelSheet(state) {
  // create workbook and add worksheet
  let workbook = new ExcelJS.Workbook();
  let worksheet = workbook.addWorksheet('FPE-Export');

  worksheet.getRow(1).height = 200;
  worksheet.getColumn(1).width = 50;

  let informationIds = Object.keys(state.informationTypes);
  let moduleIds = Object.keys(state.planningModules);

  for (let [index, informationId] of informationIds.entries()) {
    let cell = worksheet.getRow(1).getCell(index + 2);
    cell.value = state.informationTypes[informationId].name;
    cell.alignment = { textRotation: 90 };
  }
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
        fgColor: { argb: '00A9D08E' } // green
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

  worksheet.views = [
    { state: 'frozen', xSplit: 1, ySplit: 1, topLeftCell: 'B2' }
  ];

  let mimeType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  let data = await workbook.xlsx.writeBuffer();
  return new Blob([data], { type: mimeType });
}
