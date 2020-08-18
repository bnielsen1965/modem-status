
const JSDOM = require('jsdom').JSDOM;

const ProcedureFields = [
  { label: 'procedure', index: 0 },
  { label: 'status', index: 1 },
  { label: 'comment', index: 2 }
];

const DownstreamFields = [
  { label: 'channel', index: 0 },
  { label: 'lock_status', index: 1 },
  { label: 'modulation', index: 2 },
  { label: 'channel_id', index: 3 },
  { label: 'frequency', index: 4 },
  { label: 'power_dbmv', index: 5, isfloat: true },
  { label: 'snr_db', index: 6, isFloat: true },
  { label: 'corrected', index: 7, isInt: true },
  { label: 'uncorrectables', index: 8, isInt: true }
];

const UpstreamFields = [
  { label: 'channel', index: 0 },
  { label: 'lock_status', index: 1 },
  { label: 'channel_type', index: 2 },
  { label: 'channel_id', index: 3 },
  { label: 'symbol_rate', index: 4 },
  { label: 'frequency', index: 5 },
  { label: 'power_dbmv', index: 6, isFloat: true }
];

const Parser = (content) => {
  let data = {};
  let dom = new JSDOM(content);
  let tables = dom.window.document.body.getElementsByTagName('table');
  for (let i = 0; i < tables.length; i++) {
    let table = tables[i];
    data = Object.assign({}, parseTable(table), data);
  }
  return data;
};


function parseTable(table) {
  let headers = table.getElementsByTagName('th');
  for (let i = 0; i < headers.length; i++) {
    let header = cleanTextContent(headers[i]);
    if (/Startup\s+Procedure/.test(header)) return parseProcedureTable(table);
    if (/Downstream\s+Bonded\s+Channels/.test(header)) return parseDownstreamChannelsTable(table);
    if (/Upstream\s+Bonded\s+Channels/.test(header)) return parseUpstreamChannelsTable(table);
  }
}


function parseProcedureTable (table) {
  let data = { procedures: [] };
  let rows = table.getElementsByTagName('tr');
  // skip first 2 rows that are headers
  for (let j = 2; j < rows.length; j++) {
    let row = rows[j];
    let rowData = parseRowData(row, ProcedureFields);
    if (rowData) data.procedures.push(rowData);
  }
  return data;
}


function parseDownstreamChannelsTable (table) {
  let data = { downstream_channels: [] };
  let rows = table.getElementsByTagName('tr');
  // skip first 2 rows that are headers
  for (let j = 2; j < rows.length; j++) {
    let row = rows[j];
    let rowData = parseRowData(row, DownstreamFields);
    if (rowData) data.downstream_channels.push(rowData);
  }
  return data;
}


function parseUpstreamChannelsTable (table) {
  let data = { upstream_channels: [] };
  let rows = table.getElementsByTagName('tr');
  // skip first 2 rows that are headers
  for (let j = 2; j < rows.length; j++) {
    let row = rows[j];
    let rowData = parseRowData(row, UpstreamFields);
    if (rowData) data.upstream_channels.push(rowData);
  }
  return data;
}


// dynamically parse table row data based on the passed fields structure
function parseRowData (row, fields) {
  let data = {};
  let maxIndex = fields.reduce((max, field) => field.index > max ? field.index : max, 0);
  let tds = row.getElementsByTagName('td');
  if (tds.length < maxIndex + 1) return;
  fields.forEach(field => {
    let value = (tds[field.index] ? cleanTextContent(tds[field.index]) : null);
    if (field.isInt && value) value = parseInt(value);
    else if (field.isFloat && value) value = parseFloat(value);
    data[field.label] = value;
  });
  return data;
}

// process element textContent into a clean string
function cleanTextContent(elem) {
  return elem.textContent.replace(/(\r\n|\n|\r)/gm, ' ').trim();
}


module.exports = Parser;
