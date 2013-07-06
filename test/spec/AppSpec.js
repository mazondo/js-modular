describe("App", function() {
  var Module = function(sandbox) {
    return {
      create: function() {
        return "created";
      },

      destroy: function() {
        return "destroyed";
      }
    }
  }

  it("Should let you register a module", function() {
    var App = new Modular.App();
    expect(App.register("mymodule", Module)).toContain("module-");
  });

  it("Should increment the modules id each time", function() {
    var App = new Modular.App();
    expect(App.register("mymodule", Module)).toContain("module-1");
    expect(App.register("mymodule", Module)).toContain("module-2");
  });

  it("Should let you start a module", function() {
    var App = new Modular.App();
    var id = App.register("mymodule", Module);
    expect(App.start(id)).toBeTruthy();
  });

  it("Should let you stop a module", function() {
    var App = new Modular.App();
    var id = App.register("mymodule", Module);
    App.start(id);
    expect(App.stop(id)).toBeTruthy();
  });

  //TODO : add tests for starting/stopping all modules
  xit("Should let you start all modules", function() {
    expect(true).toBe(false);
  });

  xit("Should let you stop all modules", function() {
    expect(true).toBe(false);
  });

});