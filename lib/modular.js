(function() {

	var root = this;

	var Modular = root.Modular = {};

	Modular.Services = {
		"query" : root.jQuery || root.$,
		"template" : root.Handlebars
	}

	//Sandbox is where all the modules access to services comes from
	//This includes the dom, ajax, etc...
	//options is the settings stored for the module
	Modular.Sandbox = function(id, label, options) {
		//set the default options
		options = options || {};
		//set the container id
		var containerId = id + "-" + label + "-container";
		//add the container to the page
		Modular.Services["query"](options.container).append("<div id='" + containerId + "'></div>");
		//find the container and setup the defaults
		var	container = Modular.Services["query"]("#" + containerId),
			_views = {};

		return {

			//DOM Manipulation
			//expose limited access to the dom within it's own container element
			$: function(element) {
				return container.find(element);	
			},

			$container: container,

			//register a view to use later
			//can be a precompiled view passed in or a view from the page from an ID
			//FIXME : do we really want the ability to register a veiw off the page?
			registerView: function(viewID, compiledView) {
				if (!compiledView) {
					var view = Modular.Services["template"].compile($("#" + viewID).html());
					if (view) {
						_views[viewID] = view;
						return true;
					} else {
						return null;
					}
				} else {
					_views[viewID] = compiledView;
					return true;
				}
			},

			//return a view from the current array of views
			getView: function(viewName) {
				if (_views[viewName]) {
					return _views[viewName];
				} else {
					return null;
				}
			},

			//change the view in the container currently
			//optionally pass in data to be rendered via handlebars
			//TODO : check if the view is a function or a string.  if string, just render it, if function, render with data
			changeView: function(viewName, data) {
				var view = this.getView(viewName);
				if (view) {
					container.html(view(data));
					return true;
				} else {
					return null;
				}
			},

			//Events
			//a sandbox will provide a module with access to its own events

			//let a module subscribe to its own events
			subscribe: function(event, callback) {
				Modular.Events.subscribe(id + ":" + event, callback);
			},

			//let a module unsubscribe from its own events
			unsubscribe: function(event) {
				Modular.Events.unsubscribe(id + ":" + event);
			},

			//let a module broadcast events to itself
			broadcast: function(event, data) {
				Modular.Events.broadcast(id + ":" + event, data);
			},

			//OPTIONS
			//a sandbox provides access to its own options
			getOption: function(optionname) {
				if (options[optionname]) {
					return options[optionname]
				} 
			},


			//AJAX REQUESTS
			//allow the sandbox to make restricted ajax calls
			ajax: function(params) {
				Modular.Services["query"].ajax(params);
			}
		}
	}

	// App allows you to register modules, gives you a sandbox and starts/stops modules
	// Pass in the container that module's views should be appended to
	Modular.App = function(container) {
		var modules = {};
		var globalCounter = 0;

		return {
			// Register modules
			// You can pass in options that will be preserved in the sandbox for the module to use
			register: function(label, creator, options) {
				if (creator) {
					globalCounter += 1;
					//try to set the container, default to 'body' if none is given
					options = options || {};
					options.container = options.container || container || "body";

					var id = "module-" + globalCounter;

					modules[id] = {
						label: label,
						options: options || null,
						creator: creator,
						instance: null
					};

					return id;
				} else {
					return null;
				}
			},

			//Start a module.  Create a sandbox and pass it to the module and then call it's create function
			start: function(id) {
				if (modules[id]) {
					var module = modules[id];
					var sandbox = new Modular.Sandbox(id, module.label, module.options);
					module.instance = new module.creator(sandbox);
					module.instance.create();
					return true;
				} else {
					return null;
				}
			},

			stop: function(id) {
				if (modules[id] && modules[id].instance) {
					modules[id].instance.destroy();
					modules[id].instance = null;
					return true;
				} else {
					return null;
				}
			}
		}
	}

	Modular.Events = (function() {
		var events = {};
		return {
			subscribe: function(channel, callback) {
				Modular.Services["query"](events).bind(channel, callback);
			},

			unsubscribe: function(channel, callback) {
				Modular.Services["query"](events).unbind(channel, callback);
			},

			broadcast: function(channel, data) {
				Modular.Services["query"](events).trigger(channel, data);
			}
		}
	})();

})();