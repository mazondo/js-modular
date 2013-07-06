describe("Events", function() {

	it("Should let you subscribe to events", function() {
		expect(function() {Modular.Events.subscribe("eventtype"); }).not.toThrow();
	});

	it("Should trigger events appropriately", function() {
		var trigger = {
			this : function() {return true;}
		}
		spyOn(trigger, "this");
		Modular.Events.subscribe("triggerthis", trigger.this);
		Modular.Events.broadcast("triggerthis");
		expect(trigger.this).toHaveBeenCalled();
	});

	it("Should let you unsubscribe from events", function() {
		var trigger = {
			this : function() {return true;}
		}
		spyOn(trigger, "this");
		Modular.Events.subscribe("triggerthis", trigger.this);
		Modular.Events.unsubscribe("triggerthis");
		Modular.Events.broadcast("triggerthis");
		expect(trigger.this).not.toHaveBeenCalled();
	});

	it("Should let me pass data", function() {
		var trigger = (function() {
			var message = "old message";
			return {
				setMessage: function(event, text) {
					message = text;
				},

				getMessage: function() {
					return message;
				}
			}
		})();
		Modular.Events.subscribe("messages", trigger.setMessage);
		Modular.Events.broadcast("messages", "message");
		expect(trigger.getMessage()).toEqual("message");
	});

});