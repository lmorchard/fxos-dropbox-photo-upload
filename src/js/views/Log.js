var App = require('ampersand-app');
var View = require('ampersand-view');

module.exports = View.extend({

  viewClass: 'log',

  template: `
    <section class="view logView">
      <h2>Log</h2>
      <pre class="output"></pre>
    </section>
  `,

  bindings: {
    'output': '.output'
  },

  derived: {
    output: {
      deps: ['parent.model.consoleOutput'],
      fn: function () {
        return this.parent.model.consoleOutput.join("\n");
      }
    }
  }

});
