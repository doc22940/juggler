require([
  "namespace",

  // Libs
  "jquery",
  "backbone",

  // Modules
  //"modules/data/appData",
  //"modules/translate/resourceSync",

  // common
  //"modules/common/common",
  //"modules/layout/layout",

  // pages
  "modules/bars/bars",
  "modules/demo/views"
],

function(ns, $, Backbone) {

  // Shorthand the application namespace
  var app = ns.app;

  app.isMobile = navigator.userAgent.match(/(iPad|iPhone|Android)/);

  // turn on debugging
  app.debug = false;

  // regions
  // you could add regions like this app.addRegions({});
  // or use stackRegions for transitioning
  app.stack.addStackRegion('content', '.content', {
    css: { position:'absolute', width: '100%' }
  });

  app.stack.addStackRegion('title', '.bar-title', {
    css: { display: 'box', 'box-orient': 'horizontal' }
  });
  app.stack.addStackRegion('header', '.bar-standard');
  app.stack.addStackRegion('subheader', '.bar-standard-secondary');
  app.stack.addStackRegion('tab', '.bar-tab');

  // initialize
  app.addAsyncInitializer(function(options, done) {
    if (app.isMobile) {
      // This is running on a device so waiting for deviceready event
      document.addEventListener('deviceready', done);
    } else {
      // On desktop don't have to wait for anything
      done();
    }
  });

  app.start(function() {
    Backbone.history.start(/*{ pushState: true }*/);
  });

});