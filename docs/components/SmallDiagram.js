window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;

  function SmallDiagram(props) {
    var state = props.state || {};
    var onCellClick = props.onCellClick;
    var minorTerm = props.minorTerm;
    var majorTerm = props.majorTerm;
    var t = props.t || function(k) { return k; };
    var isReadOnly = props.isReadOnly;

    var smallCells = [
      { id: 'c5', cx: 65, cy: 65, x: 5, y: 5, w: 120, h: 120 },
      { id: 'c6', cx: 185, cy: 65, x: 125, y: 5, w: 120, h: 120 },
      { id: 'c7', cx: 65, cy: 185, x: 5, y: 125, w: 120, h: 120 },
      { id: 'c8', cx: 185, cy: 185, x: 125, y: 125, w: 120, h: 120 },
    ];

    var counters = Object.keys(state).map(function(id) {
      var st = state[id];
      var cell = smallCells.find(function(c) { return c.id === id; });
      if (!cell || !st) return null;
      var radius = 16;
      var fill = st === 'red' ? '#dc2626' : '#6b7280';
      return h('g', { key: id },
        h('circle', { cx: cell.cx, cy: cell.cy, r: radius, fill: fill, stroke: 'rgba(0,0,0,0.5)', strokeWidth: '2' }),
        h('text', { x: cell.cx, y: cell.cy + 5, textAnchor: 'middle', fill: 'white', style: { fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold' } },
          st === 'red' ? '1' : '0'
        )
      );
    });

    return h('div', { style: { background: 'var(--surface)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,.08)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid var(--chip-line)', overflow: 'hidden' } },
      h('svg', { width: 280, height: 280, viewBox: '0 0 250 250', style: { userSelect: 'none' } },
        h('rect', { x: 5, y: 5, width: 240, height: 240, fill: 'none', stroke: 'black', strokeWidth: 2 }),
        h('line', { x1: 5, y1: 125, x2: 245, y2: 125, stroke: 'black', strokeWidth: 1.5 }),
        h('line', { x1: 125, y1: 5, x2: 125, y2: 245, stroke: 'black', strokeWidth: 1.5 }),
        h('text', { x: 8, y: 17, fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '5'),
        h('text', { x: 242, y: 17, textAnchor: 'end', fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '6'),
        h('text', { x: 8, y: 243, fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '7'),
        h('text', { x: 242, y: 243, textAnchor: 'end', fill: 'var(--sea-ink-soft)', style: { fontSize: '11px', fontFamily: '"Courier New", Courier, monospace', fontWeight: 'bold' } }, '8'),
        h('text', { x: 125, y: 55, textAnchor: 'middle', fill: 'var(--term-x)', style: { fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold' } }, t(minorTerm)),
        h('text', { x: 125, y: 205, textAnchor: 'middle', fill: 'var(--term-x)', style: { fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold' } }, t(minorTerm) + '\''),
        h('text', { x: 35, y: 135, textAnchor: 'middle', fill: 'var(--term-y)', style: { fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold', transform: 'rotate(-90 35 135)' } }, t(majorTerm)),
        h('text', { x: 215, y: 135, textAnchor: 'middle', fill: 'var(--term-y)', style: { fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold', transform: 'rotate(-90 215 135)' } }, t(majorTerm) + '\''),
        counters,
        !isReadOnly ? smallCells.map(function(c) {
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

  LogicGame.SmallDiagram = SmallDiagram;
})();
