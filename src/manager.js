const widgets = require('jupyter-js-widgets');

export class WidgetManager extends widgets.ManagerBase {
    constructor(kernel, el) {
        super();
        this.kernel = kernel;
        this.el = el;

        // Create a comm manager shim
        this.commManager = new widgets.shims.services.CommManager(kernel);

        // Register the comm target
        this.commManager.register_target(this.comm_target_name, this.handle_comm_open.bind(this));
    }

    display_view(msg, view, options) {
        var that = this;
        return Promise.resolve(view).then(function(view) {
            that.el.appendChild(view.el);
            view.trigger('displayed');
            view.on('remove', function() {
                console.log('view removed', view);
            });
            return view;
        });
    }

    _create_comm(targetName, id, metadata) {
        return this.commManager.new_comm(targetName, metadata, id);
    }

    _get_comm_info() {
        return Promise.resolve({});
    }

    require_error(success_callback) {
        /**
         * Takes a requirejs success handler and returns a requirejs error handler
         * that attempts loading the module from npmcdn.
         */
        return function(err) {
            var failedId = err.requireModules && err.requireModules[0];
            if (failedId) {
                window.require(['https://npmcdn.com/' + failedId + '/dist/index.js'], success_callback);
           } else {
                throw err;
           }
        };
    };
};
