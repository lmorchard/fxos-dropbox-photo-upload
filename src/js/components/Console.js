var App = require('ampersand-app');
var View = require('ampersand-view')

module.exports = View.extend({

  template: `
    <section class="console">
      <pre class="output">EMPTY SO FAR</pre>
    </section>
  `,

  bindings: {
    'output': '.output'
  },

  derived: {
    output: {
      deps: ['parent.consoleOutput'],
      fn: function () {
        return this.parent.consoleOutput.join("\n");
      }
    }
  },

  events: {
  },

  render: function (opts) {
    this.renderWithTemplate(this);
    return this;
  }

});
