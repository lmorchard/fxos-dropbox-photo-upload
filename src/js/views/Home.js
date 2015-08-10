var App = require('ampersand-app');
var View = require('ampersand-view');
var ConsoleComponent = require('../components/Console');

module.exports = View.extend({

  viewClass: 'home',

  template: `
    <section class="view homeView">
      <p>Home</p>
      <p>FOO FOO FOO</p>
      <p class="name">NAME</p>
      <button class="signout">Sign Out</button>
      <section class="console"></section>
    </section>
  `,

  bindings: {
    'parent.model.dropboxUserInfo.name': '.name'
  },

  events: {
    'click button.signout': 'signout'
  },

  signout: function () {
    App.model.signOut().then((result) => {
      console.log("SIGNED OUT");
    })
  },

  subviews: {
    console: {
      container: '.console',
      constructor: ConsoleComponent
    }
  },

  derived: {
    consoleOutput: {
      deps: ['parent.model.consoleOutput'],
      fn: function () {
        return this.parent.model.consoleOutput;
      }
    }
  }

});
