// ============================================================================
// LEWIS CARROLL SYLLOGISM DIAGRAM ENGINE
// Compact, algorithmic approach with explicit logical expressions
// ============================================================================
import standardSyllogisms from '../data/syllogisms_standard.json';
import validAnswers from '../data/syllogism_answers.json';

// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

export type Quantifier = 'A' | 'E' | 'I' | 'O'; // A=All, E=No, I=Some, O=Some-not
export type Figure = 1 | 2 | 3 | 4;
export type CellValue = '0' | '1' | '-'; // 0=empty, 1=exists, -=unknown
export type Mood = `${Quantifier}${Quantifier}${Quantifier}`; // e.g., "AAA", "EAE"

export interface Terms {
  majorTerm: string;   // P (predicate of conclusion)
  minorTerm: string;   // S (subject of conclusion)
  middleTerm: string;  // M (middle term)
}

export interface Proposition {
  quantifier: Quantifier;
  subject: string;
  predicate: string;
}

export interface Syllogism {
  id: string;
  figure: Figure;
  mood: Mood;
  name: string;
  mnemonic: string;
  terms: Terms;
  premises: { major: Proposition; minor: Proposition };
  conclusion: Proposition;
}

export interface DiagramCell {
  id: number;
  x: boolean;      // has minor term (S)
  y: boolean;      // has major term (P)
  m: boolean | null; // has middle term (M), null for MD
  expression: string; // Logical expression (e.g., "x∧y∧¬m")
  diagram: 'DD' | 'MD';
}

export interface DiagramEncoding {
  dd: string; // e.g., "DD=9-0,10-0,11-1,12-0,13-0,14-0,15-0,16--"
  md: string; // e.g., "MD=5-1,6-0,7-0,8--"
  ddCells: Record<number, CellValue>;
  mdCells: Record<number, CellValue>;
  explicitDDCells: Record<number, CellValue>; // State before existential import
  explicitMDCells: Record<number, CellValue>; // MD derived before existential import
  ddCellDetails: DiagramCell[]; // Full cell info with expressions
  mdCellDetails: DiagramCell[];
}

export interface ValidationResult {
  isCorrect: boolean;
  errors: string[];
  correctDD: string;
  correctMD: string;
}

// ----------------------------------------------------------------------------
// CARROLL DIAGRAM CELL DEFINITIONS WITH LOGICAL EXPRESSIONS
// x = minor term (S), y = major term (P), m = middle term (M)
// ----------------------------------------------------------------------------

export const DD_CELLS: DiagramCell[] = [
  { id: 9,  x: true,  y: true,  m: false, expression: 'x∧y∧¬m', diagram: 'DD' },
  { id: 10, x: true,  y: false, m: false, expression: 'x∧¬y∧¬m', diagram: 'DD' },
  { id: 11, x: true,  y: true,  m: true,  expression: 'x∧y∧m',  diagram: 'DD' },
  { id: 12, x: true,  y: false, m: true,  expression: 'x∧¬y∧m', diagram: 'DD' },
  { id: 13, x: false, y: true,  m: true,  expression: '¬x∧y∧m', diagram: 'DD' },
  { id: 14, x: false, y: false, m: true,  expression: '¬x∧¬y∧m', diagram: 'DD' },
  { id: 15, x: false, y: true,  m: false, expression: '¬x∧y∧¬m', diagram: 'DD' },
  { id: 16, x: false, y: false, m: false, expression: '¬x∧¬y∧¬m', diagram: 'DD' },
];

export const MD_CELLS: DiagramCell[] = [
  { id: 5, x: true,  y: true,  m: null, expression: 'x∧y',  diagram: 'MD' },
  { id: 6, x: true,  y: false, m: null, expression: 'x∧¬y', diagram: 'MD' },
  { id: 7, x: false, y: true,  m: null, expression: '¬x∧y', diagram: 'MD' },
  { id: 8, x: false, y: false, m: null, expression: '¬x∧¬y', diagram: 'MD' },
];

// ----------------------------------------------------------------------------
// VALID SYLLOGISMS DATABASE (24 total)
// ----------------------------------------------------------------------------

export const VALID_SYLLOGISMS: Record<Figure, Mood[]> = {
  1: ['AAA', 'EAE', 'AII', 'EIO', 'AAI', 'EAO'],
  2: ['EAE', 'AEE', 'EIO', 'AOO', 'EAO', 'AEO'],
  3: ['AAI', 'IAI', 'AII', 'EAO', 'OAO', 'EIO'],
  4: ['AAI', 'AEE', 'IAI', 'EAO', 'EIO', 'AEO'],
};

export const SYLLOGISM_NAMES: Partial<Record<Mood, string>> = {
  'AAA': 'Barbara', 'EAE': 'Celarent', 'AII': 'Darii', 'EIO': 'Ferio',
  'AAI': 'Barbari', 'EAO': 'Celaront', 'AEE': 'Camestres', 'AOO': 'Baroco',
  'AEO': 'Camestros', 'IAI': 'Disamis', 'OAO': 'Bocardo',
} as const;

export const MNEMONICS: Record<string, string> = {
  '1-AAA': 'bArbArA', '1-EAE': 'cElArEnt', '1-AII': 'dArII', '1-EIO': 'fErIO',
  '1-AAI': 'bArbArI', '1-EAO': 'cElArOnt', '2-EAE': 'cEsArE', '2-AEE': 'cAmEstrEs',
  '2-EIO': 'fEstInO', '2-AOO': 'bArOcO', '2-EAO': 'cEsArO', '2-AEO': 'cAmEstrOs',
  '3-AAI': 'dArAptI', '3-IAI': 'dIsAmIs', '3-AII': 'dAtIsI', '3-EAO': 'fElAptOn',
  '3-OAO': 'bOcArdO', '3-EIO': 'fErIsOn', '4-AAI': 'brAmAntIp', '4-AEE': 'cAmEnEs',
  '4-IAI': 'dImArIs', '4-EAO': 'fEsApO', '4-EIO': 'frEsIsOn', '4-AEO': 'cAmEnOs',
};

// ----------------------------------------------------------------------------
// HELPER: Build logical expression with actual terms
// ----------------------------------------------------------------------------

export function buildTermExpression(
  cell: DiagramCell,
  terms: Terms
): string {
  const { x, y, m } = cell;
  const { minorTerm: S, majorTerm: P, middleTerm: M } = terms;

  const parts: string[] = [];

  // X term (minor/S)
  parts.push(x ? S : `¬${S}`);

  // Y term (major/P)
  parts.push(y ? P : `¬${P}`);

  // M term (middle) - only for DD
  if (m !== null) {
    parts.push(m ? M : `¬${M}`);
  }

  return parts.join('∧');
}

// ----------------------------------------------------------------------------
// CORE: DIAGRAM GENERATION ENGINE
// ----------------------------------------------------------------------------

/**
 * Maps proposition terms to x, y, m based on syllogism structure
 */
function mapTermsToXYM(
  terms: Terms,
  position: 'major' | 'minor' | 'conclusion',
  figure: Figure
): {
  subjectIsX: boolean;
  subjectIsY: boolean;
  subjectIsM: boolean;
  predicateIsX: boolean;
  predicateIsY: boolean;
  predicateIsM: boolean;
  actualSubject: string;
  actualPredicate: string;
} {

  const { majorTerm: P, minorTerm: S, middleTerm: M } = terms;

  let actualSubject: string, actualPredicate: string;

  if (position === 'major') {
    switch (figure) {
      case 1: actualSubject = M; actualPredicate = P; break; // M-P
      case 2: actualSubject = P; actualPredicate = M; break; // P-M
      case 3: actualSubject = M; actualPredicate = P; break; // M-P
      case 4: actualSubject = P; actualPredicate = M; break; // P-M
    }
  } else if (position === 'minor') {
    switch (figure) {
      case 1: actualSubject = S; actualPredicate = M; break; // S-M
      case 2: actualSubject = S; actualPredicate = M; break; // S-M
      case 3: actualSubject = M; actualPredicate = S; break; // M-S
      case 4: actualSubject = M; actualPredicate = S; break; // M-S
    }
  } else { // conclusion (always S-P)
    actualSubject = S;
    actualPredicate = P;
  }

  return {
    subjectIsX: actualSubject === S,
    subjectIsY: actualSubject === P,
    subjectIsM: actualSubject === M,
    predicateIsX: actualPredicate === S,
    predicateIsY: actualPredicate === P,
    predicateIsM: actualPredicate === M,
    actualSubject,
    actualPredicate,
  };
}

/**
 * Applies a single proposition to diagram cells
 */
function applyPropositionToCells(
  quantifier: Quantifier,
  termMapping: ReturnType<typeof mapTermsToXYM>,
  cells: Record<number, CellValue>
): Record<number, CellValue> {

  const result = { ...cells };

  DD_CELLS.forEach(cell => {
    const { id, x, y, m } = cell;
    const { subjectIsX, subjectIsY, subjectIsM, predicateIsX, predicateIsY, predicateIsM } = termMapping;

    // Determine if cell matches subject
    let subjectMatches = false;
    if (subjectIsX) subjectMatches = x;
    else if (subjectIsY) subjectMatches = y;
    else if (subjectIsM) subjectMatches = m === true;

    // Determine if cell matches predicate
    let predicateMatches = false;
    if (predicateIsX) predicateMatches = x;
    else if (predicateIsY) predicateMatches = y;
    else if (predicateIsM) predicateMatches = m === true;

    // Apply quantifier rules
    switch (quantifier) {
      case 'A': // All S are P → Empty S∧¬P
        if (subjectMatches && !predicateMatches) {
          result[id] = '0';
        }
        break;
      case 'E': // No S are P → Empty S∧P
        if (subjectMatches && predicateMatches) {
          result[id] = '0';
        }
        break;
      case 'I': // Some S are P → Mark S∧P as exists (if not empty)
        if (subjectMatches && predicateMatches && result[id] !== '0') {
          result[id] = '1';
        }
        break;
      case 'O': // Some S are not P → Mark S∧¬P as exists (if not empty)
        if (subjectMatches && !predicateMatches && result[id] !== '0') {
          result[id] = '1';
        }
        break;
    }
  });

  return result;
}

/**
 * Derives MD cells from DD cells (sum across m/¬m)
 */
function deriveMDFromDD(ddCells: Record<number, CellValue>): Record<number, CellValue> {
  const mdCells: Record<number, CellValue> = { 5: '-', 6: '-', 7: '-', 8: '-' };

  MD_CELLS.forEach(mdCell => {
    const { id, x, y } = mdCell;

    // Find corresponding DD cells (with m=true and m=false)
    const ddWithM = DD_CELLS.find(c => c.x === x && c.y === y && c.m === true);
    const ddWithoutM = DD_CELLS.find(c => c.x === x && c.y === y && c.m === false);

    if (ddWithM && ddWithoutM) {
      const val1 = ddCells[ddWithM.id];
      const val2 = ddCells[ddWithoutM.id];

      // MD logic: 1 if either DD is 1, 0 if both DD are 0, - otherwise
      if (val1 === '1' || val2 === '1') {
        mdCells[id] = '1';
      } else if (val1 === '0' && val2 === '0') {
        mdCells[id] = '0';
      } else {
        mdCells[id] = '-';
      }
    }
  });

  return mdCells;
}

/**
 * Formats cells into Lewis Carroll code string
 */
function formatDiagramCode(diagram: 'DD' | 'MD', cells: Record<number, CellValue>): string {
  const cellIds = diagram === 'DD'
    ? [9, 10, 11, 12, 13, 14, 15, 16]
    : [5, 6, 7, 8];

  const parts = cellIds.map(id => `${id}-${cells[id]}`);
  return `${diagram}=${parts.join(',')}`;
}

/**
 * MAIN FUNCTION: Generate DD and MD for any syllogism
 */
export function generateDiagram(syllogism: Syllogism): DiagramEncoding {
  const { figure, mood, terms } = syllogism;

  // Try to use pre-calculated answer if available
  const predefined = getPredefinedAnswer(figure, mood);
  
  // We need to calculate explicit cells even if predefined is available
  // for the relaxed validation to work properly.
  
  // Initialize all cells as unknown
  let ddCells: Record<number, CellValue> = {
    9: '-', 10: '-', 11: '-', 12: '-', 13: '-', 14: '-', 15: '-', 16: '-'
  };

  // Apply major premise
  const majorMapping = mapTermsToXYM(terms, 'major', figure);
  ddCells = applyPropositionToCells(syllogism.premises.major.quantifier, majorMapping, ddCells);

  // Apply minor premise
  const minorMapping = mapTermsToXYM(terms, 'minor', figure);
  ddCells = applyPropositionToCells(syllogism.premises.minor.quantifier, minorMapping, ddCells);

  const explicitDDCells = { ...ddCells };
  const explicitMDCells = deriveMDFromDD(explicitDDCells);

  if (predefined) {
    const finalDDCells = parseUserDiagramCode(predefined.dd);
    const finalMDCells = parseUserDiagramCode(predefined.md);

    // Build cell details with expressions
    const ddCellDetails = DD_CELLS.map(cell => ({
      ...cell,
      id: cell.id,
      x: cell.x,
      y: cell.y,
      m: cell.m,
      diagram: cell.diagram,
      expression: buildTermExpression(cell, terms),
    }));

    const mdCellDetails = MD_CELLS.map(cell => ({
      ...cell,
      id: cell.id,
      x: cell.x,
      y: cell.y,
      m: cell.m,
      diagram: cell.diagram,
      expression: buildTermExpression(cell, terms),
    }));

    return {
      dd: predefined.dd,
      md: predefined.md,
      ddCells: finalDDCells,
      mdCells: finalMDCells,
      explicitDDCells,
      explicitMDCells,
      ddCellDetails,
      mdCellDetails,
    };
  }

  // Final result continues from explicit state
  ddCells = { ...explicitDDCells };

  // Already applied premises above



  // FORCE EXISTENTIAL IMPORT FOR ALL TERMS (S, P, M)
  // Lewis Carroll assumes all terms exist. If 3 cells in a term's region 
  // are empty (0), and the 4th is unknown (-), mark it as Exists (1).
  const termRegions = [
    { name: 'S', ids: [9, 10, 11, 12] },
    { name: 'P', ids: [9, 11, 13, 15] },
    { name: 'M', ids: [11, 12, 13, 14] }
  ];

  termRegions.forEach(region => {
    const cells = region.ids.map(id => ({ id, val: ddCells[id] }));
    const zeros = cells.filter(c => c.val === '0');
    const ones = cells.filter(c => c.val === '1');
    const unknowns = cells.filter(c => c.val === '-');

    // If no cell is marked 1, and only one cell is unknown (others are 0), mark it 1
    if (ones.length === 0 && unknowns.length === 1 && zeros.length === 3) {
      ddCells[unknowns[0].id] = '1';
    }
  });

  // Derive MD from DD
  const mdCells = deriveMDFromDD(ddCells);

  // Build cell details with expressions
  const ddCellDetails = DD_CELLS.map(cell => ({
    ...cell,
    expression: buildTermExpression(cell, terms),
  }));

  const mdCellDetails = MD_CELLS.map(cell => ({
    ...cell,
    expression: buildTermExpression(cell, terms),
  }));

  return {
    dd: formatDiagramCode('DD', ddCells),
    md: formatDiagramCode('MD', mdCells),
    ddCells,
    mdCells,
    explicitDDCells,
    explicitMDCells,
    ddCellDetails,
    mdCellDetails,
  };
}

// ----------------------------------------------------------------------------
// SYLLOGISM FACTORY
// ----------------------------------------------------------------------------

export function createSyllogism(
  figure: Figure,
  mood: Mood,
  terms: Terms
): Syllogism {
  if (!VALID_SYLLOGISMS[figure].includes(mood)) {
    throw new Error(`Invalid mood ${mood} for Figure ${figure}`);
  }

  const [majorQ, minorQ, conclusionQ] = mood.split('') as Quantifier[];
  const { majorTerm: P, minorTerm: S, middleTerm: M } = terms;

  let majorSubject: string, majorPredicate: string;
  let minorSubject: string, minorPredicate: string;

  switch (figure) {
    case 1: // M-P, S-M
      majorSubject = M; majorPredicate = P;
      minorSubject = S; minorPredicate = M;
      break;
    case 2: // P-M, S-M
      majorSubject = P; majorPredicate = M;
      minorSubject = S; minorPredicate = M;
      break;
    case 3: // M-P, M-S
      majorSubject = M; majorPredicate = P;
      minorSubject = M; minorPredicate = S;
      break;
    case 4: // P-M, M-S
      majorSubject = P; majorPredicate = M;
      minorSubject = M; minorPredicate = S;
      break;
  }

  const key = `${figure}-${mood}`;

  return {
    id: `fig${figure}-${mood.toLowerCase()}`,
    figure,
    mood,
    name: SYLLOGISM_NAMES[mood] || 'Unknown',
    mnemonic: MNEMONICS[key] || '',
    terms,
    premises: {
      major: { quantifier: majorQ, subject: majorSubject, predicate: majorPredicate },
      minor: { quantifier: minorQ, subject: minorSubject, predicate: minorPredicate },
    },
    conclusion: { quantifier: conclusionQ, subject: S, predicate: P },
  };
}

// ----------------------------------------------------------------------------
// VALIDATION
// ----------------------------------------------------------------------------

export function parseUserDiagramCode(code: string): Record<number, CellValue> {
  const match = code.match(/^(DD|MD)=(.+)$/);
  if (!match) {
    throw new Error(`Invalid diagram code format: ${code}`);
  }

  const cells: Record<number, CellValue> = {};
  const parts = match[2].split(',');

  parts.forEach(part => {
    const cellMatch = part.match(/^(\d+)-([01-])$/);
    if (cellMatch) {
      const cellId = parseInt(cellMatch[1]);
      const value = cellMatch[2] as CellValue;
      cells[cellId] = value;
    }
  });

  return cells;
}

export function validateUserDiagram(
  userDD: string,
  userMD: string,
  correct: DiagramEncoding
): ValidationResult {
  const userDDCells = parseUserDiagramCode(userDD);
  const userMDCells = parseUserDiagramCode(userMD);

  const errors: string[] = [];

  [9, 10, 11, 12, 13, 14, 15, 16].forEach(cell => {
    const user = userDDCells[cell] || '-';
    const correctVal = correct.ddCells[cell];

    if (user !== correctVal) {
      // STRICT VALIDATION:
      // - Reject '1' when correct is '0' (marked occupied but should be empty)
      // - Reject '0' when correct is '1' (marked empty but should be occupied)
      // - Reject '-' when correct is '1' (blank when red counter required)
      // - Reject '-' when correct is '0' AND cell was explicitly emptied by a premise
      // - Accept '-' when correct is '0' but only via inference (not explicit premise result)
      // - Accept '0' when correct is '-' (extra empty marking)
      if (user === '1' && correctVal === '0') {
        errors.push(`DD${cell}: marked occupied but should be empty`);
      } else if (user === '0' && correctVal === '1') {
        errors.push(`DD${cell}: marked empty but should be occupied`);
      } else if (user === '-' && correctVal === '1') {
        // Relaxed logic: If this '1' was inferred via existential import 
        // (i.e. not in explicitDDCells), it's optional.
        if (correct.explicitDDCells[cell] === '1') {
          errors.push(`DD${cell}: missing red counter (should be occupied)`);
        }
      } else if (user === '-' && correctVal === '0') {
        // Require the user to explicitly mark cells that were emptied by a premise.
        // Only skip if this cell is 0 purely due to inference (not from a direct premise).
        if (correct.explicitDDCells[cell] === '0') {
          errors.push(`DD${cell}: missing grey counter (should be marked empty)`);
        }
      }
    }
  });

  [5, 6, 7, 8].forEach(cell => {
    const user = userMDCells[cell] || '-';
    const correctVal = correct.mdCells[cell];

    if (user !== correctVal) {
      if (user === '1' && correctVal === '0') {
        errors.push(`MD${cell}: marked occupied but should be empty`);
      } else if (user === '0' && correctVal === '1') {
        errors.push(`MD${cell}: marked empty but should be occupied`);
      } else if (user === '-' && correctVal === '1') {
        // Relaxed logic: Optional if inferred
        if (correct.explicitMDCells[cell] === '1') {
          errors.push(`MD${cell}: missing red counter (should be occupied)`);
        }
      } else if (user === '-' && correctVal === '0') {
        // Require explicit marking of cells derived from premises in MD too.
        if (correct.explicitMDCells[cell] === '0') {
          errors.push(`MD${cell}: missing grey counter (should be marked empty)`);
        }
      }
    }
  });

  return {
    isCorrect: errors.length === 0,
    errors,
    correctDD: correct.dd,
    correctMD: correct.md,
  };
}

/**
 * Derives a logical subset chain (sorites-style) for universal syllogisms.
 * e.g., x ⊆ m ⊆ y
 */
export function getLogicalSequence(syllogism: Syllogism): { terms: string[], isUniversal: boolean } | null {
  const { figure, mood } = syllogism;
  const [majorQ, minorQ] = mood.split('');
  
  // Only universal premises form strict subset chains in this system
  const isUniversal = majorQ !== 'I' && majorQ !== 'O' && minorQ !== 'I' && minorQ !== 'O';
  if (!isUniversal) return null;

  // We map Carroll's terms: x (minor), y (major), m (middle)
  // Notation: 'x' is x, 'nx' is x' (not x)
  
  switch (figure) {
    case 1:
      // M-P (Major), S-M (Minor)
      // AAA: m ⊆ y, x ⊆ m => x ⊆ m ⊆ y
      // EAE: m ⊆ y', x ⊆ m => x ⊆ m ⊆ y'
      if (majorQ === 'A' && minorQ === 'A') return { terms: ['x', 'm', 'y'], isUniversal: true };
      if (majorQ === 'E' && minorQ === 'A') return { terms: ['x', 'm', 'y\''], isUniversal: true };
      break;
    case 2:
      // P-M (Major), S-M (Minor)
      // EAE: y ⊆ m', x ⊆ m => x ⊆ m ⊆ y'
      // AEE: y ⊆ m, x ⊆ m' => x ⊆ m' ⊆ y'
      if (majorQ === 'E' && minorQ === 'A') return { terms: ['x', 'm', 'y\''], isUniversal: true };
      if (majorQ === 'A' && minorQ === 'E') return { terms: ['x', 'm\'', 'y\''], isUniversal: true };
      break;
    case 4:
      // P-M (Major), M-S (Minor)
      // AEE: y ⊆ m, m ⊆ x' => y ⊆ m ⊆ x'
      if (majorQ === 'A' && minorQ === 'E') return { terms: ['y', 'm', 'x\''], isUniversal: true };
      break;
    default:
      break;
  }

  return null;
}

// ----------------------------------------------------------------------------
// PRE-BUILT 24 SYLLOGISMS
// ----------------------------------------------------------------------------

export const SYLLOGISM_EXAMPLES: Syllogism[] = standardSyllogisms.map(d => 
  createSyllogism(d.figure as Figure, d.mood as Mood, d.terms)
);

// ----------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ----------------------------------------------------------------------------

export function getRandomSyllogism(): Syllogism {
  const figures: Figure[] = [1, 2, 3, 4];
  const randomFigure = figures[Math.floor(Math.random() * figures.length)];
  const moods = VALID_SYLLOGISMS[randomFigure];
  const randomMood = moods[Math.floor(Math.random() * moods.length)];

  return createSyllogism(randomFigure, randomMood, {
    majorTerm: 'P',
    minorTerm: 'S',
    middleTerm: 'M',
  });
}

export function getAllMoods(): Mood[] {
  return ([1, 2, 3, 4] as Figure[]).flatMap(f => VALID_SYLLOGISMS[f]);
}

export function getSyllogismById(id: string): Syllogism | undefined {
  return SYLLOGISM_EXAMPLES.find(s => s.id === id);
}

export function getCellExpression(cellId: number, terms: Terms, diagram: 'DD' | 'MD'): string {
  const cells = diagram === 'DD' ? DD_CELLS : MD_CELLS;
  const cell = cells.find(c => c.id === cellId);
  if (!cell) return '';
  return buildTermExpression(cell, terms);
}

export function getAllCellExpressions(terms: Terms): { dd: string[]; md: string[] } {
  return {
    dd: DD_CELLS.map(cell => buildTermExpression(cell, terms)),
    md: MD_CELLS.map(cell => buildTermExpression(cell, terms)),
  };
}

/**
 * Retrieves a pre-calculated answer for a standard figure/mood combination.
 */
export function getPredefinedAnswer(figure: Figure, mood: Mood): { dd: string, md: string } | null {
  const key = `${figure}-${mood}`;
  const answer = (validAnswers as Record<string, { dd: string, md: string }>)[key];
  return answer || null;
}

// ----------------------------------------------------------------------------
// EXPORT
// ----------------------------------------------------------------------------

export default {
  types: {
    Quantifier: null as unknown as Quantifier,
    Figure: null as unknown as Figure,
    Mood: null as unknown as Mood,
    Syllogism: null as unknown as Syllogism,
    DiagramCell: null as unknown as DiagramCell,
    DiagramEncoding: null as unknown as DiagramEncoding,
  },
  constants: {
    DD_CELLS,
    MD_CELLS,
    VALID_SYLLOGISMS,
    SYLLOGISM_EXAMPLES,
  },
  functions: {
    generateDiagram,
    createSyllogism,
    validateUserDiagram,
    parseUserDiagramCode,
    getRandomSyllogism,
    getAllMoods,
    getSyllogismById,
    buildTermExpression,
    getCellExpression,
    getAllCellExpressions,
    getLogicalSequence,
    getPredefinedAnswer,
  },
};