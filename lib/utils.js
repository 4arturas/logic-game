function formatDiagramCode(diagram, cells) {
  var cellIds = diagram === 'DD' ? DD_CELL_IDS : MD_CELL_IDS;
  var parts = cellIds.map(function(id) { return id + '-' + cells[id]; });
  return diagram + '=' + parts.join(',');
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
