describe("Sandbox", function() {

	var SandboxModule = function(sandbox) {
	    return {
	      create: function() {
	        if (sandbox) {
	        	throw "Sandbox Created!";
	        }
	      },

	      destroy: function() {
	        console.log("destroyed")  ;
	      }
	    }
	  }

	//TODO : add tests for unbinding from ALL events

	it("Should create a sandbox for a module", function() {
		var App = new Modular.App();
		var moduleId = App.register("module", SandboxModule);
		expect(function() { App.start(moduleId)}).toThrow("Sandbox Created!");
	});

	it("Should let you create a sandbox separately", function () {
		expect(new Modular.Sandbox()).toBeDefined();
	});

	it("Should provide limited dom access via the sandbox", function() {
		var sandbox = new Modular.Sandbox("temp", "label", {container: "#container"});
		expect(sandbox.$()).toBeDefined();
		expect(sandbox.$("#outside-scope").length).toEqual(0);
		expect($("#outside-scope").length).toEqual(1);
		expect(sandbox.$("#outside-scope").selector).toBe("#temp-label-container #outside-scope");
	});

	it("Should let me see my own container", function() {
		var sandbox = new Modular.Sandbox("temp", "label", {container: "#container"});
		expect(sandbox.$container).toBeDefined();
	});

	it("Should let me subscribe to my own events", function() {
		var sandbox = new Modular.Sandbox("id", "label");
		var trigger = {this: function() {}}
		spyOn(trigger, "this");
		sandbox.subscribe("event", trigger.this);
		Modular.Events.broadcast("id:event");
		expect(trigger.this).toHaveBeenCalled();
	});

	it("Should let me unsubscribe from my own events", function() {
		var sandbox = new Modular.Sandbox("id", "label");
		var trigger = {this: function() {}}
		spyOn(trigger, "this");
		sandbox.subscribe("event", trigger.this);
		sandbox.unsubscribe("event");
		Modular.Events.broadcast("id:event");
		expect(trigger.this).not.toHaveBeenCalled();
	});

	it("Should let me trigger my own events", function() {
		var sandbox = new Modular.Sandbox("id", "label");
		var trigger = {this: function() {}}
		spyOn(trigger, "this");
		sandbox.subscribe("event", trigger.this);
		sandbox.broadcast("event");
		expect(trigger.this).toHaveBeenCalled();
	});

	it("Should let me send data with events", function() {
		var sandbox = new Modular.Sandbox("id", "label");
		var trigger = (function() {
			var message = "";
			return {
				setMessage: function(event, text) {
					message = text;
				},

				getMessage: function() {
					return message;
				}
			}
		})();
		sandbox.subscribe("event", trigger.setMessage);
		sandbox.broadcast("event", "event fired!");
		expect(trigger.getMessage()).toEqual("event fired!");
	});

	it("Should let me access my own options", function() {
		var sandbox = new Modular.Sandbox("id", "label", {test: "me"});
		expect(sandbox.getOption("test")).toEqual("me");
		expect(sandbox.getOption("test2")).not.toBeDefined();
	});

	it("Should have an ajax function", function() {
		var sandbox = new Modular.Sandbox("id", "label");
		expect(sandbox.ajax).toBeDefined();
	});

	it("Should use jquery ajax calls", function() {
		var sandbox = new Modular.Sandbox("id", "label");
		spyOn(jQuery, "ajax");
		sandbox.ajax();
		expect(jQuery.ajax).toHaveBeenCalled();
	});

	it("Should let me register module views from the page then render it with a convenience method", function() {
		var sandbox = new Modular.Sandbox("id", "label", {container: "body"});
		expect(sandbox.registerView).toBeDefined();
		$("body").append("<script id='test'>test</script>");
		//register it
		expect(sandbox.registerView("test")).toBeTruthy();
		expect(sandbox.getView("test")).toBeDefined();
		//switch it in
		expect(sandbox.changeView("test")).toBeTruthy();
		//make sure it's there now
		expect(sandbox.$container.html()).toEqual("test");
	});

	it("Should let me register a compiled view and then render it with a convenience method", function() {
		var sandbox = Modular.Sandbox("id", "label", {container: "body"});
		var view = Handlebars.compile("<div class='test'></div>");
		//register it
		expect(sandbox.registerView("test", view)).toBeTruthy();
		//make sure it exists
		expect(sandbox.getView("test")).toEqual(view);
		//switch it in
		expect(sandbox.changeView("test")).toBeTruthy();
		//make sure it's there now
		expect(sandbox.$(".test").length).toEqual(1);
	});

});