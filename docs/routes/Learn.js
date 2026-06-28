var { useState, useMemo, useContext } = React;

var LESSONS = [
  {
    id: 'fig1-aaa', name: 'Barbara', mood: 'AAA', figure: 1, mnemonic: 'bArbArA',
    majorTerm: 'animals', minorTerm: 'humans', middleTerm: 'mortal',
    majorQ: 'A', minorQ: 'A', conclusionQ: 'A',
  },
  {
    id: 'fig1-eae', name: 'Celarent', mood: 'EAE', figure: 1, mnemonic: 'cElArEnt',
    majorTerm: 'reptiles', minorTerm: 'snakes', middleTerm: 'have fur',
    majorQ: 'E', minorQ: 'A', conclusionQ: 'E',
  },
  {
    id: 'fig1-aii', name: 'Darii', mood: 'AII', figure: 1, mnemonic: 'dArII',
    majorTerm: 'kittens', minorTerm: 'pets', middleTerm: 'playful',
    majorQ: 'A', minorQ: 'I', conclusionQ: 'I',
  },
  {
    id: 'fig1-eio', name: 'Ferio', mood: 'EIO', figure: 1, mnemonic: 'fErIO',
    majorTerm: 'homework', minorTerm: 'readings', middleTerm: 'fun',
    majorQ: 'E', minorQ: 'I', conclusionQ: 'O',
  },
  {
    id: 'fig2-aoo', name: 'Baroco', mood: 'AOO', figure: 2, mnemonic: 'bArOcO',
    majorTerm: 'useful', minorTerm: 'websites', middleTerm: 'informative',
    majorQ: 'A', minorQ: 'O', conclusionQ: 'O',
  },
];

var Q_TEXT = { A: 'All', E: 'No', I: 'Some', O: 'Some\u00a0\u2014\u00a0not' };
var Q_COLOR = { A: 'var(--palm)', E: 'var(--term-x)', I: 'var(--lagoon)', O: 'var(--sea-ink)' };

function premiseStr(q, s, p) { return Q_TEXT[q] + ' ' + s + ' are ' + p; }

function conclusionStr(q, s, p) {
  if (q === 'O') return 'Some ' + s + ' are not ' + p;
  return Q_TEXT[q] + ' ' + s + ' are ' + p;
}

function buildLessonData(lesson) {
  var M = lesson.middleTerm, S = lesson.minorTerm, P = lesson.majorTerm;
  var f = lesson.figure;
  var majorSubj = f === 1 || f === 3 ? M : P;
  var majorPred = f === 1 || f === 3 ? P : M;
  var minorSubj = f === 1 || f === 2 ? S : M;
  var minorPred = f === 1 || f === 2 ? M : S;
  return {
    major: { q: lesson.majorQ, s: majorSubj, p: majorPred },
    minor: { q: lesson.minorQ, s: minorSubj, p: minorPred },
    conclusion: { q: lesson.conclusionQ, s: S, p: P },
  };
}

function figureExplanation(figure) {
  return [
    '1: Middle term is subject of major, predicate of minor',
    '2: Middle term is predicate of both premises',
    '3: Middle term is subject of both premises',
    '4: Middle term is predicate of major, subject of minor',
  ][figure - 1];
}

var STEP_DESC = [
  {
    title: 'Meet the Syllogism',
    desc: 'A syllogism is a three-line argument. Two premises lead to one conclusion. Each line relates two of three terms: the major term (P), the minor term (S), and the middle term (M). The middle term connects the premises but disappears from the conclusion.',
  },
  {
    title: 'Major Premise',
    desc: 'The major premise relates the middle term (M) to the major term (P). It sets up the first constraint on the diagram. In Figure {figure}, the major premise is: {major}',
  },
  {
    title: 'Minor Premise',
    desc: 'The minor premise relates the minor term (S) to the middle term (M). It adds the second constraint. In Figure {figure}, the minor premise is: {minor}',
  },
  {
    title: 'Transfer to Small Diagram',
    desc: 'Now we ignore the middle term (M) and transfer only what we know about S and P to the Small (Biliteral) Diagram. If both LD cells for an SD cell are empty (0), that SD cell is empty. If either LD cell has a unit (1), that SD cell gets a unit.',
  },
  {
    title: 'Read the Conclusion',
    desc: 'The Small Diagram now shows the relationship between S (minor term) and P (major term). This gives us the conclusion. Check the pattern: which cells are empty and which have a unit determines the quantifier.',
  },
];

function CellGrid(props) {
  var cells = props.cells;
  var labels = props.labels;
  var cols = props.cols || 2;
  var cellSize = props.size || 48;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', ' + cellSize + 'px)', gap: '3px' }}>
      {cells.map(function(cell, idx) {
        var val = cell.val || '-';
        var bg = val === '0' ? 'var(--chip-line)' : val === '1' ? 'rgba(200,60,30,0.25)' : 'white';
        var border = cell.highlight ? '2px solid var(--lagoon)' : '1px solid var(--line)';
        var label = labels ? labels[idx] : cell.id;
        return (
          <div key={idx} title={cell.expression}
            style={{ width: cellSize + 'px', height: cellSize + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: bg, border: border, borderRadius: '4px', fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)', transition: 'all 300ms' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--sea-ink)' }}>{label}</span>
            {val !== '-' ? <span style={{ fontSize: '12px', fontWeight: 900, color: val === '0' ? 'var(--sea-ink-soft)' : 'var(--term-x)', marginTop: '2px' }}>{val}</span> : null}
          </div>
        );
      })}
    </div>
  );
}

function LearnPage() {
  var _state = useState(0);
  var lessonIdx = _state[0];
  var setLesson = _state[1];

  var _step = useState(0);
  var step = _step[0];
  var setStep = _step[1];

  var settings = useContext(SettingsContext);

  function nextStep() { if (step < 4) setStep(step + 1); }
  function prevStep() { if (step > 0) setStep(step - 1); }
  function nextLesson() { if (lessonIdx < LESSONS.length - 1) { setLesson(lessonIdx + 1); setStep(0); } }
  function prevLesson() { if (lessonIdx > 0) { setLesson(lessonIdx - 1); setStep(0); } }

  var lesson = LESSONS[lessonIdx];
  var data = useMemo(function() { return buildLessonData(lesson); }, [lessonIdx]);

  var terms = { minorTerm: lesson.minorTerm, majorTerm: lesson.majorTerm, middleTerm: lesson.middleTerm };
  var diagram = useMemo(function() {
    try {
      return Logic.generateDiagram(Logic.createSyllogism(lesson.figure, lesson.mood, terms));
    } catch(e) { return null; }
  }, [lessonIdx]);
  var ddCells = diagram ? diagram.ddCells : {};
  var mdCells = diagram ? diagram.mdCells : {};

  var stepInfo = STEP_DESC[step];
  var stepDesc = stepInfo.desc
    .replace('{figure}', lesson.figure)
    .replace('{major}', premiseStr(data.major.q, data.major.s, data.major.p))
    .replace('{minor}', premiseStr(data.minor.q, data.minor.s, data.minor.p));

  var ddCellList = [9,10,11,12,13,14,15,16].map(function(id) {
    return { id: id, val: ddCells[id] || '-', expression: '', highlight: step >= 1 && step <= 2 };
  });
  var mdCellList = [5,6,7,8].map(function(id) {
    return { id: id, val: mdCells[id] || '-', expression: '', highlight: step >= 3 };
  });

  var total = LESSONS.length;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 16px' }}>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', padding: '16px 0' }}>
        {LESSONS.map(function(l, idx) {
          var isActive = idx === lessonIdx;
          var isDone = idx < lessonIdx;
          return (
            <button key={l.id} onClick={function() { setLesson(idx); setStep(0); }}
              style={{
                flex: '1 0 auto', minWidth: '120px', padding: '10px 14px', borderRadius: '10px',
                border: isActive ? '2px solid var(--lagoon)' : '1px solid var(--line)',
                background: isActive ? 'var(--foam)' : isDone ? 'var(--sand)' : 'var(--surface)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 150ms',
                opacity: isActive ? 1 : isDone ? 0.7 : 0.5
              }}>
              <div style={{ fontSize: '9px', fontWeight: 900, color: 'var(--lagoon)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{lesson.mood + ' \u00b7 Figure ' + lesson.figure}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--sea-ink)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{lesson.name}</div>
              <div style={{ fontSize: '9px', color: 'var(--sea-ink-soft)', marginTop: '2px' }}>{lesson.mnemonic}</div>
              {isActive ? <div style={{ marginTop: '6px', height: '3px', background: 'var(--lagoon)', borderRadius: '2px', width: ((step + 1) / 5 * 100) + '%', transition: 'width 300ms' }} /> : null}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '2px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'var(--foam)', color: 'var(--lagoon)', padding: '2px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em' }}>{lesson.mood}</div>
                <span style={{ fontSize: '14px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--sea-ink)', fontWeight: 700 }}>{lesson.name}</span>
                <span style={{ fontSize: '9px', color: 'var(--sea-ink-soft)', fontFamily: 'var(--font-mono)' }}>{lesson.mnemonic}</span>
              </div>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)' }}>{'Fig. ' + lesson.figure}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-serif)', fontSize: '13px', lineHeight: 1.6 }}>
              <div>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', background: Q_COLOR[data.major.q], color: 'white', fontSize: '9px', fontWeight: 900, textAlign: 'center', lineHeight: '16px', marginRight: '8px' }}>{data.major.q}</span>
                {premiseStr(data.major.q, data.major.s, data.major.p)}
              </div>
              <div>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', background: Q_COLOR[data.minor.q], color: 'white', fontSize: '9px', fontWeight: 900, textAlign: 'center', lineHeight: '16px', marginRight: '8px' }}>{data.minor.q}</span>
                {premiseStr(data.minor.q, data.minor.s, data.minor.p)}
              </div>
              <div style={{ borderTop: '1px dashed var(--line)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--lagoon)', color: 'white', fontSize: '9px', fontWeight: 900, textAlign: 'center', lineHeight: '16px', marginRight: '8px' }}>{'\u2234'}</span>
                {conclusionStr(data.conclusion.q, data.conclusion.s, data.conclusion.p)}
              </div>
            </div>
            <div style={{ marginTop: '12px', padding: '8px 12px', background: 'var(--sand)', borderRadius: '6px', fontSize: '9px', color: 'var(--sea-ink-soft)', fontFamily: 'var(--font-mono)' }}>
              {'Figure ' + lesson.figure + ': ' + figureExplanation(lesson.figure)}
            </div>
          </div>

          <div style={{ background: 'var(--foam)', padding: '16px', borderRadius: '12px', border: '1px solid var(--lagoon)', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--lagoon)', color: 'white', fontSize: '11px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{step + 1}</div>
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--sea-ink)', margin: 0 }}>{stepInfo.title}</h3>
              <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)', fontFamily: 'var(--font-mono)' }}>{'Step ' + (step + 1) + ' / 5'}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--sea-ink)', lineHeight: 1.7, margin: 0 }}>{stepDesc}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '2px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '10px', fontWeight: 900, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Large Diagram (Premises)</h4>
              <span style={{ fontSize: '9px', fontWeight: 700, color: step >= 1 && step <= 2 ? 'var(--lagoon)' : 'var(--sea-ink-soft)', transition: 'color 300ms' }}>{step >= 1 && step <= 2 ? 'Active' : 'Ready'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CellGrid cells={ddCellList} cols={4} size={52} labels={['9','10','11','12','13','14','15','16']} />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '9px', color: 'var(--sea-ink-soft)', justifyContent: 'center', fontFamily: 'var(--font-mono)' }}>
              <span>{'\u25b2 x = ' + lesson.minorTerm}</span>
              <span>{'\u25c0 y = ' + lesson.majorTerm}</span>
              <span>{'\u25a0 m = ' + lesson.middleTerm}</span>
            </div>
          </div>

          <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '2px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '10px', fontWeight: 900, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Small Diagram (Conclusion)</h4>
              <span style={{ fontSize: '9px', fontWeight: 700, color: step >= 3 ? 'var(--lagoon)' : 'var(--sea-ink-soft)', transition: 'color 300ms' }}>{step >= 3 ? 'Active' : 'Ready'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CellGrid cells={mdCellList} cols={2} size={60} labels={['5','6','7','8']} />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '9px', color: 'var(--sea-ink-soft)', justifyContent: 'center', fontFamily: 'var(--font-mono)' }}>
              <span>{'\u25b2 x = ' + lesson.minorTerm}</span>
              <span>{'\u25c0 y = ' + lesson.majorTerm}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '16px 0', borderTop: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={prevLesson} disabled={lessonIdx === 0}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface)', cursor: lessonIdx === 0 ? 'default' : 'pointer', fontSize: '11px', fontWeight: 600, color: lessonIdx === 0 ? 'var(--sea-ink-soft)' : 'var(--sea-ink)', opacity: lessonIdx === 0 ? 0.4 : 1 }}>
            {'\u2190 Previous Lesson'}
          </button>
          <button onClick={nextLesson} disabled={lessonIdx === total - 1}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface)', cursor: lessonIdx === total - 1 ? 'default' : 'pointer', fontSize: '11px', fontWeight: 600, color: lessonIdx === total - 1 ? 'var(--sea-ink-soft)' : 'var(--sea-ink)', opacity: lessonIdx === total - 1 ? 0.4 : 1 }}>
            {'Next Lesson \u2192'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={prevStep} disabled={step === 0}
            style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface)', cursor: step === 0 ? 'default' : 'pointer', fontSize: '11px', fontWeight: 600, color: step === 0 ? 'var(--sea-ink-soft)' : 'var(--sea-ink)', opacity: step === 0 ? 0.4 : 1 }}>
            {'\u2190 Back'}
          </button>
          <button onClick={nextStep} disabled={step === 4}
            style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: step === 4 ? 'var(--sea-ink-soft)' : 'var(--lagoon)', color: 'white', cursor: step === 4 ? 'default' : 'pointer', fontSize: '11px', fontWeight: 700, opacity: step === 4 ? 0.4 : 1 }}>
            {step === 4 ? 'Complete' : 'Next Step \u2192'}
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '9px', color: 'var(--sea-ink-soft)', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em' }}>
        {'Lesson ' + (lessonIdx + 1) + ' of ' + total + ' \u00b7 ' + lesson.mood + ' Figure ' + lesson.figure + ' \u00b7 ' + lesson.name}
      </div>
    </div>
  );
}
