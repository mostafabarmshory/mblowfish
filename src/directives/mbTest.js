

function greeting() {
  return {
    restrict: 'E',
    scope: {
      name: '='
    },
    template: '<h1>Hello, {{name}}</div><md-button>Test</md-button>'
  }
}

export default greeting;
