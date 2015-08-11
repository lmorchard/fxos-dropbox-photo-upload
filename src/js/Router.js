var App = require('ampersand-app');
var Router = require('ampersand-router');
var HomeView = require('./views/Home');
var AboutView = require('./views/About');
var LogView = require('./views/Log');
var SettingsView = require('./views/Settings');

module.exports = Router.extend({

  routes: {
    "": "home",
    //"help": "help",
    //"workouts/:index": "workout",
    "about": "about",
    "log": "log",
    "settings": "settings",
    "(*path)": "catchAll"
  },

  home: function () {
    App.trigger('page', new HomeView({ parent: App.view }));
  },

  settings: function () {
    App.trigger('page', new SettingsView({ parent: App.view }));
  },

  log: function () {
    App.trigger('page', new LogView({ parent: App.view }));
  },

  about: function () {
    App.trigger('page', new AboutView({ parent: App.view }));
  },

  catchAll: function (path) {
    this.redirectTo('');
  }

});
