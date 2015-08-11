var App = require('ampersand-app');
var View = require('ampersand-view');

module.exports = View.extend({

  viewClass: 'home',

  template: `
    <section class="view homeView">

      <button class="scan mainAction">Scan photos</button>
      <button class="sync mainAction">Upload photos</button>

    </section>
  `,

  bindings: {
  },

  events: {
    'click button.scan': 'scanPhotos',
    'click button.upload': 'uploadPhotos'
  },

  scanPhotos: function () {

  },

  uploadPhotos: function () {

  }

});
