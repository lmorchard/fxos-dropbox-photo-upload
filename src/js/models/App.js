var State = require('ampersand-state');
var Utils = require('../Utils');

// HACK: This is a giant hack because I can't seem use an app:// URL as the receiver
var OAUTH_RECEIVER_URL = 'https://dl.dropboxusercontent.com/u/2798055/oauth_receiver.html';
var APP_KEY = 'schf2prlpcqiol5';

module.exports = State.extend({

  props: {
    consoleOutput: { type: 'array', default: () => [] },
    dropboxUserInfo: { type: 'object', default: () => {} },
    dropboxClient: 'object'
  },

  initialize: function () {

    var client = new Dropbox.Client({ key: APP_KEY });
    client.authDriver(new Dropbox.AuthDriver.Popup({
      rememberUser: true,
      receiverUrl: OAUTH_RECEIVER_URL
    }));

    this.dropboxClient = Utils.promisifyMethods(client, [
      'authenticate', 'signOut', 'getUserInfo',
      'readdir', 'writeFile', 'readFile', 'stat', 'mkdir',
      'remove', 'copy', 'move'
    ]);

  },

  signOut: function () {
    return this.dropboxClient.signOut().then(() => {
      this.dropboxUserInfo = null;
    })
  },

  authenticate: function (options) {
    return this.dropboxClient.authenticate(options).then((client) => {
      if (!client.isAuthenticated()) {
        return client;
      }
      return client.getUserInfo().then((result) => {
        this.dropboxUserInfo = result;
        return client;
      });
    });
  },



});
