// devtool-panel.js
// author: robofox

const self = require("sdk/self");
var tabs = require("sdk/tabs");
var workers = require("sdk/content/worker");

var { Cu, Cc, Ci } = require("chrome");

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "gDevTools",
                                  "resource:///modules/devtools/gDevTools.jsm");

/* Depending on the version of Firefox, promise module can have different path */
try { Cu.import("resource://gre/modules/commonjs/promise/core.js"); } catch(e) {}
try { Cu.import("resource://gre/modules/commonjs/sdk/core/promise.js"); } catch(e) {}

XPCOMUtils.defineLazyGetter(this, "osString",
                            function() Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime).OS);

var Promise = require("sdk/core/promise");

function log() {
  var args = Array.prototype.slice.call(arguments, 0);
  console.debug.apply(console, ["grunt: "].concat(args));
}

exports.devtoolTabDefinition = {
  id: "grunt-devtools",
  ordinal: 7,
  icon: self.data.url("images/icon16.png"),
  url: self.data.url("devtool-panel.html"),
  label: "Grunt",
  tooltip: "Grunt Devtools",

  isTargetSupported: function(target) {
    return target.isLocalTab;
  },

  build: function(iframeWindow, toolbox) {
    // init devtool tab
    GruntDevtools.initialize(iframeWindow, toolbox);
    return Promise.resolve(GruntDevtools);
  }
};

let GruntDevtools = {
  initialize: function (iframeWindow, toolbox) {
    console.debug("initialize");
    this.iframeWindow = iframeWindow.document.querySelector("iframe");
    this.toolbox = toolbox;

    this.iframeWindow.setAttribute("src", self.data.url("panes/index.html"));
  },
    
  destroy : function() {
    log('destroyin...');
    this.iframeWindow.setAttribute('src', 'about:blank');
  }   
};