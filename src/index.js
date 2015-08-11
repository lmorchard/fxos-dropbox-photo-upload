var _ = require('lodash');
var Promise = require("bluebird");
var async = require('async');
var Utils = require('./js/Utils');
var domready = require('domready');

var App = require('ampersand-app');
var AppModel = require('./js/models/App');
var AppView = require('./js/views/App');
var AppRouter = require('./js/router');
var StartupView = require('./js/views/Startup');

App.extend({

  initialize: function () {

    this.model = new AppModel();
    this.view = new AppView({ model: this.model });
    this.router = new AppRouter();

    this.view.render();
    document.body.appendChild(this.view.el);
    this.trigger('page', new StartupView());

    this.model.on('change:dropboxUserInfo', () => {
      var event = this.model.dropboxUserInfo ? 'connected' : 'disconnected';
      this.log("Dropbox " + event);
      this.trigger(event);
    });

    this.model.authenticate({ interactive: false }).then((client) => {

      this.router.history.start({
        pushState: false,
        hashChange: true
      });

      if (!client.isAuthenticated()) {
        this.router.navigate('settings');
      }

    });

  },

  log: function (msg) {
    this.model.consoleOutput.push(msg);
    if (this.model.consoleOutput.length > 1000) {
      this.model.consoleOutput.shift();
    }
  }

});

// HACK: Give access to the app from console
window.App = App;

domready(App.initialize.bind(App));

/*
}).then(function (result) {
  userInfo = result;
  return Promise.props({
    remote: client.readdir('/Camera Uploads'),
    local: Utils.enumerateDeviceStorage('pictures')
  });
}).then(function (results) {

  var toUpload = results.local.slice(0, 3);
  //var toUpload = results.local;

  var xhrListener = function(dbXhr) {
    dbXhr.xhr.upload.addEventListener("progress", function(event) {
      //console.log(event, event.loaded, event.total);
      var progress = parseInt((event.loaded / event.total) * 100);
      if ((progress % 10) === 0) {
        console.log(progress);
      }
    });
    return true;  // otherwise, the XMLHttpRequest is canceled
  };
  client.onXhr.addListener(xhrListener);

  return Promise.map(toUpload, function (file) {

    return Utils.getFromDeviceStorage('pictures', file.name).then(function (result) {
      file.contents = result;

      if (file.name.indexOf('/DCIM/') !== -1) {
        // HACK: Replace DCF filename with munged ISO timestamp
        var ext = file.name.split('.').pop();
        var dateStr = file.lastModifiedDate.toISOString().replace(/(\....Z$|[:\.])/g, '');
        file.destinationFilename = dateStr + '.' + ext;
      } else {
        file.destinationFilename = file.name.split('/').pop();
      }

      console.log("UPLOADING", file.destinationFilename, file);
      return client.writeFile('/Camera uploads/' + file.destinationFilename, file.contents);
    });

  }, { concurrency: 2 }); // Serial upload because Dropbox rate limiting
}).then(function (results) {
  console.log('RESULTS', results);
}).catch(function (err) {
  console.log('ERROR CATCH', err);
});
*/
