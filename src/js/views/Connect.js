var App = require('ampersand-app');
var View = require('ampersand-view');

module.exports = View.extend({

  viewClass: 'connect',

  template: `
    <section class="view connectView">
      <button class="connect">Connect to Dropbox</button>
    </section>
  `,

  events: {
    'click button.connect': 'connect'
  },

  connect: function () {
    App.model.authenticate().then((result) => {
      console.log(result);
      App.router.navigate('');
    });
  }

});
