var { useState } = React;

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
    return (
      <g key={id} className="pointer-events-none select-none">
        <circle cx={cell.cx} cy={cell.cy} r={radius} fill={fill} stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
        <text x={cell.cx} y={cell.cy + radius / 3} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          {st === 'red' ? '1' : '0'}
        </text>
      </g>
    );
  });

  return (
    <div style={{ background: 'var(--surface)', border: '2px solid var(--line)', borderRadius: '12px', padding: '8px', display: 'flex', justifyContent: 'center' }}>
      <svg width="320" height="320" viewBox="0 0 400 400">
        <rect x="10" y="10" width="380" height="380" fill="none" stroke="black" strokeWidth="2" />
        <rect x="105" y="105" width="190" height="190" fill="none" stroke="black" strokeWidth="1.5" />
        <line x1="10" y1="200" x2="390" y2="200" stroke="black" strokeWidth="1.5" />
        <line x1="200" y1="10" x2="200" y2="390" stroke="black" strokeWidth="1.5" />
        <text x="13" y="21" fill="var(--sea-ink-soft)" fontSize="15" fontWeight="bold">9</text>
        <text x="387" y="21" textAnchor="end" fill="var(--sea-ink-soft)" fontSize="15" fontWeight="bold">10</text>
        <text x="108" y="117" fill="var(--sea-ink-soft)" fontSize="15" fontWeight="bold">11</text>
        <text x="292" y="117" textAnchor="end" fill="var(--sea-ink-soft)" fontSize="15" fontWeight="bold">12</text>
        <text x="108" y="292" fill="var(--sea-ink-soft)" fontSize="15" fontWeight="bold">13</text>
        <text x="292" y="292" textAnchor="end" fill="var(--sea-ink-soft)" fontSize="15" fontWeight="bold">14</text>
        <text x="13" y="387" fill="var(--sea-ink-soft)" fontSize="15" fontWeight="bold">15</text>
        <text x="387" y="387" textAnchor="end" fill="var(--sea-ink-soft)" fontSize="15" fontWeight="bold">16</text>
        <text x="200" y="85" textAnchor="middle" fill="var(--term-x)" fontSize="17" fontWeight="bold" fontFamily="serif" fontStyle="italic">{t(minorTerm)}</text>
        <text x="200" y="335" textAnchor="middle" fill="var(--term-x)" fontSize="17" fontWeight="bold" fontFamily="serif" fontStyle="italic">{t(minorTerm)}'</text>
        <text x="50" y="210" textAnchor="middle" fill="var(--term-y)" fontSize="17" fontWeight="bold" fontFamily="serif" fontStyle="italic" transform="rotate(-90 50 210)">{t(majorTerm)}</text>
        <text x="350" y="210" textAnchor="middle" fill="var(--term-y)" fontSize="17" fontWeight="bold" fontFamily="serif" fontStyle="italic" transform="rotate(-90 350 210)">{t(majorTerm)}'</text>
        <text x="200" y="210" textAnchor="middle" fill="var(--term-m)" fontSize="17" fontWeight="bold" fontFamily="serif" fontStyle="italic">{t(middleTerm)}</text>
        {!isReadOnly && largeCells.map(function(c) {
          return (
            <rect key={c.id} x={c.x} y={c.y} width={c.w} height={c.h}
              fill="transparent" style={{ cursor: 'pointer' }}
              onClick={function() { if (onCellClick) onCellClick(c.id); }}
            />
          );
        })}
        <g>{counters}</g>
      </svg>
    </div>
  );
}
