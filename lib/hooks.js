function useSyllogismSolver(syllogism) {
  var _largeState = React.useState({});
  var largeState = _largeState[0];
  var setLargeState = _largeState[1];

  var _smallState = React.useState({});
  var smallState = _smallState[0];
  var setSmallState = _smallState[1];

  var _valResult = React.useState(null);
  var validationResult = _valResult[0];
  var setValidationResult = _valResult[1];

  var correctEncoding = React.useMemo(function() {
    return generateDiagram(syllogism);
  }, [syllogism]);

  function cycleCounter(type, id) {
    if (validationResult && validationResult.isCorrect) return;
    var setState = type === 'small' ? setSmallState : setLargeState;
    setState(function(prev) {
      var currentState = prev[id] || null;
      var nextState = currentState === null ? 'red' : (currentState === 'red' ? 'grey' : null);
      var newState = Object.assign({}, prev);
      if (nextState === null) delete newState[id];
      else newState[id] = nextState;
      return newState;
    });
  }

  function getStatusCodes() {
    function getStateCode(state, cellIds, prefix) {
      return cellIds.map(function(id) {
        var key = prefix === 'lg' ? prefix + '_' + id : prefix + id;
        var val = state[key] === 'red' ? '1' : state[key] === 'grey' ? '0' : '-';
        return id + '-' + val;
      }).join(',');
    }
    return {
      dd: getStateCode(largeState, DD_CELL_IDS, 'lg'),
      md: getStateCode(smallState, MD_CELL_IDS, 'c')
    };
  }

  function handleValidate() {
    var codes = getStatusCodes();
    var result = validateUserDiagram('DD=' + codes.dd, 'MD=' + codes.md, correctEncoding);
    setValidationResult(result);
    return result;
  }

  function handleClear() {
    setLargeState({});
    setSmallState({});
    setValidationResult(null);
  }

  return {
    largeState: largeState, setLargeState: setLargeState,
    smallState: smallState, setSmallState: setSmallState,
    validationResult: validationResult, setValidationResult: setValidationResult,
    correctEncoding: correctEncoding,
    cycleCounter: cycleCounter,
    getStatusCodes: getStatusCodes,
    handleValidate: handleValidate,
    handleClear: handleClear,
  };
}
