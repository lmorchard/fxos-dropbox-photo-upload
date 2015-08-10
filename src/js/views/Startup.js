var View = require('ampersand-view');

module.exports = View.extend({

  template: `
    <section class="view startupView">
      <h2>Loading...</h2>
    </section>
  `,

  render: function (opts) {
    this.viewClass = 'startup';
    this.renderWithTemplate(this);
    return this;
  }

});
