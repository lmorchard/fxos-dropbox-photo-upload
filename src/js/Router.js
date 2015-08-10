var App = require('ampersand-app');
var Router = require('ampersand-router');
var HomeView = require('./views/Home');
var ConnectView = require('./views/Connect');

module.exports = Router.extend({

  routes: {
    "": "home",
    //"help": "help",
    //"workouts/:index": "workout",
    "connect": "connect",
    "(*path)": "catchAll"
  },

  home: function () {
    App.trigger('page', new HomeView({
      parent: App.view
    }));
  },

  connect: function () {
    App.trigger('page', new ConnectView({
      parent: App.view
    }));
  },

  catchAll: function (path) {
    this.redirectTo('');
  }

});
