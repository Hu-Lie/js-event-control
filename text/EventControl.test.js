const { EventControl } = require("../src/index");

describe("EventControl", () => {
  it("should notify subscribers", () => {
    const eventControl = new EventControl();
    const callback = jest.fn();

    eventControl.subscribe("testEvent", callback);
    eventControl.subscribe("testEvent", callback);
    eventControl.subscribe("testEvent", callback);
    eventControl.subscribe("testEvent", callback);
    eventControl.notify("testEvent", "Hello World!");
    
    expect(callback).toHaveBeenCalledWith("Hello World!");
  });
});
