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
    return (
      <g key={id}>
        <circle cx={cell.cx} cy={cell.cy} r={radius} fill={fill} stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
        <text x={cell.cx} y={cell.cy + 5} textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
          {st === 'red' ? '1' : '0'}
        </text>
      </g>
    );
  });

  return (
    <div style={{ background: 'var(--surface)', border: '2px solid var(--line)', borderRadius: '12px', padding: '8px', display: 'flex', justifyContent: 'center' }}>
      <svg width="280" height="280" viewBox="0 0 250 250">
        <rect x="5" y="5" width="240" height="240" fill="none" stroke="black" strokeWidth="2" />
        <line x1="5" y1="125" x2="245" y2="125" stroke="black" strokeWidth="1.5" />
        <line x1="125" y1="5" x2="125" y2="245" stroke="black" strokeWidth="1.5" />
        <text x="8" y="35" fill="var(--sea-ink-soft)" fontSize="26" fontWeight="bold">5</text>
        <text x="242" y="35" textAnchor="end" fill="var(--sea-ink-soft)" fontSize="26" fontWeight="bold">6</text>
        <text x="8" y="243" fill="var(--sea-ink-soft)" fontSize="26" fontWeight="bold">7</text>
        <text x="242" y="243" textAnchor="end" fill="var(--sea-ink-soft)" fontSize="26" fontWeight="bold">8</text>
        <text x="125" y="55" textAnchor="middle" fill="var(--term-x)" fontSize="28" fontWeight="bold" fontFamily="serif" fontStyle="italic">{t(minorTerm)}</text>
        <text x="125" y="205" textAnchor="middle" fill="var(--term-x)" fontSize="28" fontWeight="bold" fontFamily="serif" fontStyle="italic">{t(minorTerm)}'</text>
        <text x="35" y="135" textAnchor="middle" fill="var(--term-y)" fontSize="28" fontWeight="bold" fontFamily="serif" fontStyle="italic" transform="rotate(-90 35 135)">{t(majorTerm)}</text>
        <text x="215" y="135" textAnchor="middle" fill="var(--term-y)" fontSize="28" fontWeight="bold" fontFamily="serif" fontStyle="italic" transform="rotate(-90 215 135)">{t(majorTerm)}'</text>
        {counters}
        {!isReadOnly && smallCells.map(function(c) {
          return (
            <rect key={c.id + '-click'} x={c.x} y={c.y} width={c.w} height={c.h}
              fill="transparent" style={{ cursor: 'pointer' }}
              onClick={function() { if (onCellClick) onCellClick(c.id); }}
            />
          );
        })}
      </svg>
    </div>
  );
}
