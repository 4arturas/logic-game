window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;

  function LargeDiagram(props) {
    var state = props.state || {};
    var onCellClick = props.onCellClick;
    var minorTerm = props.minorTerm;
    var majorTerm = props.majorTerm;
    var middleTerm = props.middleTerm;
    var t = props.t || function(k) { return k; };
    var isReadOnly = props.isReadOnly;

    var largeCells = [
      { id: 'lg_9',  x: 10, y: 10, w: 95, h: 95, cx: 57,  cy: 57 },
      { id: 'lg_10', x: 295, y: 10, w: 95, h: 95, cx: 343, cy: 57 },
      { id: 'lg_11', x: 105, y: 105, w: 95, h: 95, cx: 152, cy: 152 },
      { id: 'lg_12', x: 200, y: 105, w: 95, h: 95, cx: 247, cy: 152 },
      { id: 'lg_13', x: 105, y: 200, w: 95, h: 95, cx: 152, cy: 247 },
      { id: 'lg_14', x: 200, y: 200, w: 95, h: 95, cx: 247, cy: 247 },
      { id: 'lg_15', x: 10, y: 295, w: 95, h: 95, cx: 57,  cy: 343 },
      { id: 'lg_16', x: 295, y: 295, w: 95, h: 95, cx: 343, cy: 343 },
    ];

    var counters = Object.keys(state).map(function(id) {
      var st = state[id];
      var cell = largeCells.find(function(c) { return c.id === id; });
      if (!cell || !st) return null;
      var radius = 12;
      var fill = st === 'red' ? '#dc2626' : '#6b7280';
      return h('g', { key: id },
        h('circle', { cx: cell.cx, cy: cell.cy, r: radius, fill: fill, stroke: 'rgba(0,0,0,0.5)', strokeWidth: '2' }),
        h('text', { x: cell.cx, y: cell.cy + 4, textAnchor: 'middle', fill: 'white', style: { fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' } },
          st === 'red' ? '1' : '0'
        )
      );
    });

    return h('div', { style: { background: 'var(--surface)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,.08)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid var(--chip-line)', overflow: 'hidden' } },
      h('svg', { width: 320, height: 320, viewBox: '0 0 400 400', style: { userSelect: 'none' } },
        h('rect', { x: 10, y: 10, width: 380, height: 380, fill: 'none', stroke: 'black', strokeWidth: 2 }),
        h('rect', { x: 105, y: 105, width: 190, height: 190, fill: 'none', stroke: 'black', strokeWidth: 1.5 }),
        h('line', { x1: 10, y1: 200, x2: 390, y2: 200, stroke: 'black', strokeWidth: 1.5 }),
        h('line', { x1: 200, y1: 10, x2: 200, y2: 390, stroke: 'black', strokeWidth: 1.5 }),
        h('text', { x: 13, y: 21, fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '9'),
        h('text', { x: 387, y: 21, textAnchor: 'end', fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '10'),
        h('text', { x: 108, y: 117, fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '11'),
        h('text', { x: 292, y: 117, textAnchor: 'end', fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '12'),
        h('text', { x: 108, y: 292, fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '13'),
        h('text', { x: 292, y: 292, textAnchor: 'end', fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '14'),
        h('text', { x: 13, y: 387, fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '15'),
        h('text', { x: 387, y: 387, textAnchor: 'end', fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '16'),
        h('text', { x: 200, y: 85, textAnchor: 'middle', fill: 'var(--term-x)', style: { fontSize: '24px', fontStyle: 'italic', fontWeight: 'bold' } }, t(minorTerm)),
        h('text', { x: 200, y: 335, textAnchor: 'middle', fill: 'var(--term-x)', style: { fontSize: '24px', fontStyle: 'italic', fontWeight: 'bold' } }, t(minorTerm) + '\''),
        h('text', { x: 50, y: 210, textAnchor: 'middle', fill: 'var(--term-y)', style: { fontSize: '24px', fontStyle: 'italic', fontWeight: 'bold', transform: 'rotate(-90 50 210)' } }, t(majorTerm)),
        h('text', { x: 350, y: 210, textAnchor: 'middle', fill: 'var(--term-y)', style: { fontSize: '24px', fontStyle: 'italic', fontWeight: 'bold', transform: 'rotate(-90 350 210)' } }, t(majorTerm) + '\''),
        h('text', { x: 200, y: 210, textAnchor: 'middle', fill: 'var(--term-m)', style: { fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold' } }, t(middleTerm)),
        counters,
        !isReadOnly ? largeCells.map(function(c) {
          return h('rect', {
            key: c.id + '-click',
            x: c.x, y: c.y, width: c.w, height: c.h,
            fill: 'transparent',
            style: { cursor: 'pointer' },
            onClick: function() { if (onCellClick) onCellClick(c.id); }
          });
        }) : null
      )
    );
  }

  LogicGame.LargeDiagram = LargeDiagram;
})();
