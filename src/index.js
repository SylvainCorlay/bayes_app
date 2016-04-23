// Codemirror
var CodeMirror = require("codemirror");
require("codemirror/lib/codemirror.css");
require("codemirror/mode/python/python");

// Css
require("jupyter-js-widgets/css/widgets.min.css");
require('bootstrap/dist/css/bootstrap.css');
require('jquery-ui/themes/smoothness/jquery-ui.min.css');

// ES6 Promise polyfill
require('es6-promise').polyfill();

var WidgetManager = require("./manager").WidgetManager;

var services = require('jupyter-js-services');
var getKernelSpecs = services.getKernelSpecs;
var startNewKernel = services.startNewKernel;

var BASEURL = prompt('Notebook BASEURL', 'http://localhost:8888');
var WSURL = 'ws:' + BASEURL.split(':').slice(1).join(':');

var do_all_the_things = function() {
    // Define jupyter-js-widget requirejs module
    // This is needed for custom widget model to be able to require
    // jupyter-js-widgets.
    window.define('jupyter-js-widgets', function() {
        return require('jupyter-js-widgets');
    });
    // Connect to the notebook webserver.
    let connectionInfo = {
        baseUrl: BASEURL,
        wsUrl: WSURL
    };
    getKernelSpecs(connectionInfo).then(kernelSpecs => {
        connectionInfo.name = kernelSpecs.default;
        return startNewKernel(connectionInfo);
    }).then(kernel => {

        // Create a codemirror instance
        var code = require("raw!../code.py");
        var inputarea = document.getElementsByClassName("inputarea")[0];
        var editor = CodeMirror(inputarea, {
            value: code,
            mode: "python",
            tabSize: 4,
            showCursorWhenSelecting: true,
            viewportMargin: Infinity,
            readOnly: true
        });

        // Create the widget area and widget manager
        var widgetarea = document.getElementsByClassName("widgetarea")[0];
        var manager = new WidgetManager(kernel, widgetarea);

        // Run backend code to create the widgets.  You could also create the
        // widgets in the frontend, like the other /web/ examples demonstrate.
        kernel.execute({ code: code });
    });
};

function load(event) {
    // If requirejs is not on the page on page load, load it from cdn.
    if (!window.requirejs) {
        var scriptjs = require('scriptjs');
        scriptjs('https://npmcdn.com/requirejs/require.js', function() {
            do_all_the_things();
        });
    } else {
        do_all_the_things();
    }
};

document.addEventListener("DOMContentLoaded", load);
