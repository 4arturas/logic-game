var DD_CELLS = [
  { id: 9,  x: true,  y: true,  m: false, expression: 'x\u2227y\u2227\u00acm', diagram: 'DD' },
  { id: 10, x: true,  y: false, m: false, expression: 'x\u2227\u00acy\u2227\u00acm', diagram: 'DD' },
  { id: 11, x: true,  y: true,  m: true,  expression: 'x\u2227y\u2227m',  diagram: 'DD' },
  { id: 12, x: true,  y: false, m: true,  expression: 'x\u2227\u00acy\u2227m', diagram: 'DD' },
  { id: 13, x: false, y: true,  m: true,  expression: '\u00acx\u2227y\u2227m', diagram: 'DD' },
  { id: 14, x: false, y: false, m: true,  expression: '\u00acx\u2227\u00acy\u2227m', diagram: 'DD' },
  { id: 15, x: false, y: true,  m: false, expression: '\u00acx\u2227y\u2227\u00acm', diagram: 'DD' },
  { id: 16, x: false, y: false, m: false, expression: '\u00acx\u2227\u00acy\u2227\u00acm', diagram: 'DD' },
];

var MD_CELLS = [
  { id: 5, x: true,  y: true,  m: null, expression: 'x\u2227y',  diagram: 'MD' },
  { id: 6, x: true,  y: false, m: null, expression: 'x\u2227\u00acy', diagram: 'MD' },
  { id: 7, x: false, y: true,  m: null, expression: '\u00acx\u2227y', diagram: 'MD' },
  { id: 8, x: false, y: false, m: null, expression: '\u00acx\u2227\u00acy', diagram: 'MD' },
];

var DD_CELL_IDS = [9, 10, 11, 12, 13, 14, 15, 16];
var MD_CELL_IDS = [5, 6, 7, 8];
