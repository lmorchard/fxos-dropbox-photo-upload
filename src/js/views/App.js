var App = require('ampersand-app');
var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');

module.exports = View.extend({

  template: `
    <section class="app home">

      <input type="checkbox" id="nav-trigger" class="nav-trigger" />
      <label for="nav-trigger"></label>

      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#settings">Settings</a></li>
          <li><a href="#log">Log</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>

      <header>
        <h1 class="title">
          <span>Camera Uploader</span>
        </h1>
      </header>

      <section class="main" data-hook="main"></section>

    </section>
  `,

  bindings: {
  },

  events: {
  },

  initialize: function () {
    this.listenTo(App, 'page', this.handleNewPage);
  },

  handleNewPage: function (view) {
    window.scrollTo(0, 0);
    this.el.querySelector('#nav-trigger').checked = false;
    this.switcher.set(view);
  },

  render: function () {
    var self = this;

    this.renderWithTemplate(this);

    this.switcher = new ViewSwitcher(this.queryByHook('main'), {
      hide: function (oldView, cb) {
        return cb();
      },
      show: function (newView) {
        self.el.className = 'app ' + newView.viewClass;
      }
    });

    return this;
  }

});
