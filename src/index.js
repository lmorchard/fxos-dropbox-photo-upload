var _ = require('lodash');
var Promise = require("bluebird");
var async = require('async');

// HACK: This is a giant hack because I can't seem use an app:// URL as the receiver
var OAUTH_RECEIVER_URL = 'https://dl.dropboxusercontent.com/u/2798055/oauth_receiver.html';
var APP_KEY = 'schf2prlpcqiol5';

var client = promisifyMethods(new Dropbox.Client({ key: APP_KEY }), [
  'authenticate', 'getUserInfo', 'readdir', 'writeFile', 'readFile'
]);

client.authDriver(new Dropbox.AuthDriver.Popup({
  rememberUser: true, receiverUrl: OAUTH_RECEIVER_URL
}));

var userInfo;

client.authenticate().then(function () {
  return client.getUserInfo();
}).then(function (result) {
  userInfo = result;
  return Promise.props({
    remote: client.readdir('/Camera Uploads'),
    local: enumerateDeviceStorage('pictures')
  });
}).then(function (results) {

  var toUpload = results.local.slice(0, 10);
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

    return getFromDeviceStorage('pictures', file.name).then(function (result) {
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

function getFromDeviceStorage (type, name) {
  return new Promise(function (resolve, reject) {
    var storage = navigator.getDeviceStorage(type);
    var request = storage.get(name);
    request.onerror = function () { return reject(this.error) };
    request.onsuccess = function () {
      var file = this.result;
      var reader = new FileReader();
      reader.onerror = function () { return reject(this.error) };
      reader.onload = function () {
        return resolve(reader.result);
      };
      reader.readAsArrayBuffer(file);
    };
  });
}

function enumerateDeviceStorage (type) {
  return new Promise(function (resolve, reject) {
    var storage = navigator.getDeviceStorage(type);
    var entries = [];
    var cursor = storage.enumerate();
    cursor.onerror = function () {
      return reject(this.error);
    };
    cursor.onsuccess = function () {
      if (this.done) {
        return resolve(entries);
      }
      entries.push(this.result);
      this.continue();
    };
  });
}

function promisifyMethods(context, methodNames) {
  methodNames.forEach(function(name) {
    var originalMethod = context[name];
    context[name] = function() {
      var mutableArguments = Array.prototype.slice.call(arguments, 0);
      return new Promise(function(resolve, reject) {
        mutableArguments.push(function(err, result) {
          return err ? reject(err) : resolve(result);
        });
        originalMethod.apply(context, mutableArguments);
      });
    };
  });
  return context;
}
