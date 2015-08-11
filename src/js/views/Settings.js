var App = require('ampersand-app');
var View = require('ampersand-view');

module.exports = View.extend({

  viewClass: 'settings',

  template: `
    <section class="view settingsView">
      <h2>Settings</h2>
      <dl>
        <dt>Dropbox</dt>
        <dd class="dropbox">
          <p class="whenDisconnected">
            <button class="connect">Connect to Dropbox</button>
          </p>
          <p class="whenConnected">
            Connected as <span class="username"></span>
            <button class="disconnect">Disconnect</button>
          </p>
          <p class="whenWorking">
            Please wait...
          </p>
        </dd>
      </dl>
    </section>
  `,

  bindings: {
    'username': '.username'
  },

  derived: {
    username: {
      deps: ['parent.model.dropboxUserInfo'],
      fn: function () {
        return this.parent.model.dropboxUserInfo ?
          this.parent.model.dropboxUserInfo.email : '';
      }
    }
  },

  events: {
    'click button.connect': 'connect',
    'click button.disconnect': 'disconnect'
  },

  connect: function () {
    this.updateConnectionStatus(true);
    App.model.authenticate();
  },

  disconnect: function () {
    this.updateConnectionStatus(true);
    App.model.signOut();
  },

  updateConnectionStatus: function (isWorking) {
    var dropboxSetting = this.el.querySelector('dd.dropbox');
    if (isWorking) {
      dropboxSetting.className = 'dropbox working';
      return;
    }
    if (App.model.dropboxUserInfo) {
      dropboxSetting.className = 'dropbox connected';
    } else {
      dropboxSetting.className = 'dropbox';
    }
  },

  render: function () {
    this.renderWithTemplate(this);

    this.listenTo(App, 'connected', this.updateConnectionStatus);
    this.listenTo(App, 'disconnected', this.updateConnectionStatus);
    this.updateConnectionStatus();

    this.el.classList.add(this.type);
    return this;
  }

});
