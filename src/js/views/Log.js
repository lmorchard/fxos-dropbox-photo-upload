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
      deps: ['App.model.consoleOutput'],
      fn: function () {
        return this.App.model.consoleOutput.join("\n");
      }
    }
  },

  initialize: function () {
    this.App = App;
  }

});
