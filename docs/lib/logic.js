window.LogicGame = window.LogicGame || {};

(function() {
  'use strict';

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

  var VALID_SYLLOGISMS = {
    1: ['AAA', 'EAE', 'AII', 'EIO', 'AAI', 'EAO'],
    2: ['EAE', 'AEE', 'EIO', 'AOO', 'EAO', 'AEO'],
    3: ['AAI', 'IAI', 'AII', 'EAO', 'OAO', 'EIO'],
    4: ['AAI', 'AEE', 'IAI', 'EAO', 'EIO', 'AEO'],
  };

  var SYLLOGISM_NAMES = {
    'AAA': 'Barbara', 'EAE': 'Celarent', 'AII': 'Darii', 'EIO': 'Ferio',
    'AAI': 'Barbari', 'EAO': 'Celaront', 'AEE': 'Camestres', 'AOO': 'Baroco',
    'AEO': 'Camestros', 'IAI': 'Disamis', 'OAO': 'Bocardo',
  };

  var MNEMONICS = {
    '1-AAA': 'bArbArA', '1-EAE': 'cElArEnt', '1-AII': 'dArII', '1-EIO': 'fErIO',
    '1-AAI': 'bArbArI', '1-EAO': 'cElArOnt', '2-EAE': 'cEsArE', '2-AEE': 'cAmEstrEs',
    '2-EIO': 'fEstInO', '2-AOO': 'bArOcO', '2-EAO': 'cEsArO', '2-AEO': 'cAmEstrOs',
    '3-AAI': 'dArAptI', '3-IAI': 'dIsAmIs', '3-AII': 'dAtIsI', '3-EAO': 'fElAptOn',
    '3-OAO': 'bOcArdO', '3-EIO': 'fErIsOn', '4-AAI': 'brAmAntIp', '4-AEE': 'cAmEnEs',
    '4-IAI': 'dImArIs', '4-EAO': 'fEsApO', '4-EIO': 'frEsIsOn', '4-AEO': 'cAmEnOs',
  };

  function buildTermExpression(cell, terms) {
    var S = terms.minorTerm, P = terms.majorTerm, M = terms.middleTerm;
    var parts = [];
    parts.push(cell.x ? S : '\u00ac' + S);
    parts.push(cell.y ? P : '\u00ac' + P);
    if (cell.m !== null) parts.push(cell.m ? M : '\u00ac' + M);
    return parts.join('\u2227');
  }

  function mapTermsToXYM(terms, position, figure) {
    var P = terms.majorTerm, S = terms.minorTerm, M = terms.middleTerm;
    var actualSubject, actualPredicate;
    if (position === 'major') {
      switch (figure) {
        case 1: actualSubject = M; actualPredicate = P; break;
        case 2: actualSubject = P; actualPredicate = M; break;
        case 3: actualSubject = M; actualPredicate = P; break;
        case 4: actualSubject = P; actualPredicate = M; break;
      }
    } else if (position === 'minor') {
      switch (figure) {
        case 1: actualSubject = S; actualPredicate = M; break;
        case 2: actualSubject = S; actualPredicate = M; break;
        case 3: actualSubject = M; actualPredicate = S; break;
        case 4: actualSubject = M; actualPredicate = S; break;
      }
    } else {
      actualSubject = S; actualPredicate = P;
    }
    return {
      subjectIsX: actualSubject === S, subjectIsY: actualSubject === P, subjectIsM: actualSubject === M,
      predicateIsX: actualPredicate === S, predicateIsY: actualPredicate === P, predicateIsM: actualPredicate === M,
      actualSubject: actualSubject, actualPredicate: actualPredicate,
    };
  }

  function applyPropositionToCells(quantifier, termMapping, cells) {
    var result = Object.assign({}, cells);
    DD_CELLS.forEach(function(cell) {
      var id = cell.id, x = cell.x, y = cell.y, m = cell.m;
      var subjectMatches = false;
      if (termMapping.subjectIsX) subjectMatches = x;
      else if (termMapping.subjectIsY) subjectMatches = y;
      else if (termMapping.subjectIsM) subjectMatches = m === true;
      var predicateMatches = false;
      if (termMapping.predicateIsX) predicateMatches = x;
      else if (termMapping.predicateIsY) predicateMatches = y;
      else if (termMapping.predicateIsM) predicateMatches = m === true;
      switch (quantifier) {
        case 'A': if (subjectMatches && !predicateMatches) result[id] = '0'; break;
        case 'E': if (subjectMatches && predicateMatches) result[id] = '0'; break;
        case 'I': if (subjectMatches && predicateMatches && result[id] !== '0') result[id] = '1'; break;
        case 'O': if (subjectMatches && !predicateMatches && result[id] !== '0') result[id] = '1'; break;
      }
    });
    return result;
  }

  function deriveMDFromDD(ddCells) {
    var mdCells = { 5: '-', 6: '-', 7: '-', 8: '-' };
    MD_CELLS.forEach(function(mdCell) {
      var id = mdCell.id, x = mdCell.x, y = mdCell.y;
      var ddWithM = DD_CELLS.find(function(c) { return c.x === x && c.y === y && c.m === true; });
      var ddWithoutM = DD_CELLS.find(function(c) { return c.x === x && c.y === y && c.m === false; });
      if (ddWithM && ddWithoutM) {
        var val1 = ddCells[ddWithM.id], val2 = ddCells[ddWithoutM.id];
        if (val1 === '1' || val2 === '1') mdCells[id] = '1';
        else if (val1 === '0' && val2 === '0') mdCells[id] = '0';
        else mdCells[id] = '-';
      }
    });
    return mdCells;
  }

  function formatDiagramCode(diagram, cells) {
    var cellIds = diagram === 'DD' ? [9,10,11,12,13,14,15,16] : [5,6,7,8];
    var parts = cellIds.map(function(id) { return id + '-' + cells[id]; });
    return diagram + '=' + parts.join(',');
  }

  function getPredefinedAnswer(figure, mood) {
    var key = figure + '-' + mood;
    var answers = LogicGame.SyllogismAnswers;
    return answers && answers[key] ? answers[key] : null;
  }

  function generateDiagram(syllogism) {
    var figure = syllogism.figure, mood = syllogism.mood, terms = syllogism.terms;
    var predefined = getPredefinedAnswer(figure, mood);
    var ddCells = { 9: '-', 10: '-', 11: '-', 12: '-', 13: '-', 14: '-', 15: '-', 16: '-' };
    var majorMapping = mapTermsToXYM(terms, 'major', figure);
    ddCells = applyPropositionToCells(syllogism.premises.major.quantifier, majorMapping, ddCells);
    var minorMapping = mapTermsToXYM(terms, 'minor', figure);
    ddCells = applyPropositionToCells(syllogism.premises.minor.quantifier, minorMapping, ddCells);
    var explicitDDCells = Object.assign({}, ddCells);
    var explicitMDCells = deriveMDFromDD(explicitDDCells);
    if (predefined) {
      var finalDDCells = parseUserDiagramCode(predefined.dd);
      var finalMDCells = parseUserDiagramCode(predefined.md);
      var ddCellDetails = DD_CELLS.map(function(cell) {
        return { id: cell.id, x: cell.x, y: cell.y, m: cell.m, diagram: cell.diagram, expression: buildTermExpression(cell, terms) };
      });
      var mdCellDetails = MD_CELLS.map(function(cell) {
        return { id: cell.id, x: cell.x, y: cell.y, m: cell.m, diagram: cell.diagram, expression: buildTermExpression(cell, terms) };
      });
      return { dd: predefined.dd, md: predefined.md, ddCells: finalDDCells, mdCells: finalMDCells, explicitDDCells: explicitDDCells, explicitMDCells: explicitMDCells, ddCellDetails: ddCellDetails, mdCellDetails: mdCellDetails };
    }
    var termRegions = [
      { name: 'S', ids: [9,10,11,12] },
      { name: 'P', ids: [9,11,13,15] },
      { name: 'M', ids: [11,12,13,14] }
    ];
    termRegions.forEach(function(region) {
      var cells = region.ids.map(function(id) { return { id: id, val: ddCells[id] }; });
      var zeros = cells.filter(function(c) { return c.val === '0'; });
      var ones = cells.filter(function(c) { return c.val === '1'; });
      var unknowns = cells.filter(function(c) { return c.val === '-'; });
      if (ones.length === 0 && unknowns.length === 1 && zeros.length === 3) {
        ddCells[unknowns[0].id] = '1';
      }
    });
    var mdCells = deriveMDFromDD(ddCells);
    var ddCellDetails = DD_CELLS.map(function(cell) {
      return Object.assign({}, cell, { expression: buildTermExpression(cell, terms) });
    });
    var mdCellDetails = MD_CELLS.map(function(cell) {
      return Object.assign({}, cell, { expression: buildTermExpression(cell, terms) });
    });
    return {
      dd: formatDiagramCode('DD', ddCells), md: formatDiagramCode('MD', mdCells),
      ddCells: ddCells, mdCells: mdCells, explicitDDCells: explicitDDCells, explicitMDCells: explicitMDCells,
      ddCellDetails: ddCellDetails, mdCellDetails: mdCellDetails,
    };
  }

  function createSyllogism(figure, mood, terms) {
    if (!VALID_SYLLOGISMS[figure] || VALID_SYLLOGISMS[figure].indexOf(mood) === -1) {
      throw new Error('Invalid mood ' + mood + ' for Figure ' + figure);
    }
    var majorQ = mood[0], minorQ = mood[1], conclusionQ = mood[2];
    var P = terms.majorTerm, S = terms.minorTerm, M = terms.middleTerm;
    var majorSubject, majorPredicate, minorSubject, minorPredicate;
    switch (figure) {
      case 1: majorSubject = M; majorPredicate = P; minorSubject = S; minorPredicate = M; break;
      case 2: majorSubject = P; majorPredicate = M; minorSubject = S; minorPredicate = M; break;
      case 3: majorSubject = M; majorPredicate = P; minorSubject = M; minorPredicate = S; break;
      case 4: majorSubject = P; majorPredicate = M; minorSubject = M; minorPredicate = S; break;
    }
    var key = figure + '-' + mood;
    return {
      id: 'fig' + figure + '-' + mood.toLowerCase(),
      figure: figure, mood: mood,
      name: SYLLOGISM_NAMES[mood] || 'Unknown',
      mnemonic: MNEMONICS[key] || '',
      terms: terms,
      premises: {
        major: { quantifier: majorQ, subject: majorSubject, predicate: majorPredicate },
        minor: { quantifier: minorQ, subject: minorSubject, predicate: minorPredicate },
      },
      conclusion: { quantifier: conclusionQ, subject: S, predicate: P },
    };
  }

  function parseUserDiagramCode(code) {
    var match = code.match(/^(DD|MD)=(.+)$/);
    if (!match) throw new Error('Invalid diagram code format: ' + code);
    var cells = {};
    match[2].split(',').forEach(function(part) {
      var cellMatch = part.match(/^(\d+)-([01-])$/);
      if (cellMatch) cells[parseInt(cellMatch[1])] = cellMatch[2];
    });
    return cells;
  }

  function validateUserDiagram(userDD, userMD, correct) {
    var userDDCells = parseUserDiagramCode(userDD);
    var userMDCells = parseUserDiagramCode(userMD);
    var errors = [];
    [9,10,11,12,13,14,15,16].forEach(function(cell) {
      var user = userDDCells[cell] || '-';
      var correctVal = correct.ddCells[cell];
      if (user !== correctVal) {
        if (user === '1' && correctVal === '0') errors.push('DD' + cell + ': marked occupied but should be empty');
        else if (user === '0' && correctVal === '1') errors.push('DD' + cell + ': marked empty but should be occupied');
        else if (user === '-' && correctVal === '1') { if (correct.explicitDDCells[cell] === '1') errors.push('DD' + cell + ': missing red counter (should be occupied)'); }
        else if (user === '-' && correctVal === '0') { if (correct.explicitDDCells[cell] === '0') errors.push('DD' + cell + ': missing grey counter (should be marked empty)'); }
      }
    });
    [5,6,7,8].forEach(function(cell) {
      var user = userMDCells[cell] || '-';
      var correctVal = correct.mdCells[cell];
      if (user !== correctVal) {
        if (user === '1' && correctVal === '0') errors.push('MD' + cell + ': marked occupied but should be empty');
        else if (user === '0' && correctVal === '1') errors.push('MD' + cell + ': marked empty but should be occupied');
        else if (user === '-' && correctVal === '1') { if (correct.explicitMDCells[cell] === '1') errors.push('MD' + cell + ': missing red counter (should be occupied)'); }
        else if (user === '-' && correctVal === '0') { if (correct.explicitMDCells[cell] === '0') errors.push('MD' + cell + ': missing grey counter (should be marked empty)'); }
      }
    });
    return { isCorrect: errors.length === 0, errors: errors, correctDD: correct.dd, correctMD: correct.md };
  }

  function getLogicalSequence(syllogism) {
    var figure = syllogism.figure, mood = syllogism.mood;
    var majorQ = mood[0], minorQ = mood[1];
    var isUniversal = majorQ !== 'I' && majorQ !== 'O' && minorQ !== 'I' && minorQ !== 'O';
    if (!isUniversal) return null;
    switch (figure) {
      case 1:
        if (majorQ === 'A' && minorQ === 'A') return { terms: ['x', 'm', 'y'], isUniversal: true };
        if (majorQ === 'E' && minorQ === 'A') return { terms: ['x', 'm', "y'"], isUniversal: true };
        break;
      case 2:
        if (majorQ === 'E' && minorQ === 'A') return { terms: ['x', 'm', "y'"], isUniversal: true };
        if (majorQ === 'A' && minorQ === 'E') return { terms: ['x', "m'", "y'"], isUniversal: true };
        break;
      case 4:
        if (majorQ === 'A' && minorQ === 'E') return { terms: ['y', 'm', "x'"], isUniversal: true };
        break;
    }
    return null;
  }

  function getRandomSyllogism() {
    var figures = [1,2,3,4];
    var randomFigure = figures[Math.floor(Math.random() * figures.length)];
    var moods = VALID_SYLLOGISMS[randomFigure];
    var randomMood = moods[Math.floor(Math.random() * moods.length)];
    return createSyllogism(randomFigure, randomMood, { majorTerm: 'P', minorTerm: 'S', middleTerm: 'M' });
  }

  function getAllMoods() {
    return [1,2,3,4].reduce(function(acc, f) { return acc.concat(VALID_SYLLOGISMS[f]); }, []);
  }

  function getSyllogismById(id) {
    if (!LogicGame.SyllogismExamples) return undefined;
    return LogicGame.SyllogismExamples.find(function(s) { return s.id === id; });
  }

  function getCellExpression(cellId, terms, diagram) {
    var cells = diagram === 'DD' ? DD_CELLS : MD_CELLS;
    var cell = cells.find(function(c) { return c.id === cellId; });
    return cell ? buildTermExpression(cell, terms) : '';
  }

  function getAllCellExpressions(terms) {
    return {
      dd: DD_CELLS.map(function(cell) { return buildTermExpression(cell, terms); }),
      md: MD_CELLS.map(function(cell) { return buildTermExpression(cell, terms); }),
    };
  }

  var SYLLOGISM_EXAMPLES = null;
  function initExamples(standardData) {
    SYLLOGISM_EXAMPLES = standardData.map(function(d) {
      return createSyllogism(d.figure, d.mood, d.terms);
    });
    LogicGame.SyllogismExamples = SYLLOGISM_EXAMPLES;
  }

  LogicGame.Logic = {
    DD_CELLS: DD_CELLS,
    MD_CELLS: MD_CELLS,
    VALID_SYLLOGISMS: VALID_SYLLOGISMS,
    SYLLOGISM_NAMES: SYLLOGISM_NAMES,
    MNEMONICS: MNEMONICS,
    generateDiagram: generateDiagram,
    createSyllogism: createSyllogism,
    validateUserDiagram: validateUserDiagram,
    parseUserDiagramCode: parseUserDiagramCode,
    getRandomSyllogism: getRandomSyllogism,
    getAllMoods: getAllMoods,
    getSyllogismById: getSyllogismById,
    buildTermExpression: buildTermExpression,
    getCellExpression: getCellExpression,
    getAllCellExpressions: getAllCellExpressions,
    getLogicalSequence: getLogicalSequence,
    getPredefinedAnswer: getPredefinedAnswer,
    initExamples: initExamples,
  };
})();
