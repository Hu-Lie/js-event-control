const { EventControl } = require("../src/index");

describe("EventControl", () => {
  it("should notify subscribers", () => {
    const eventControl = new EventControl();

    for (let i = 0; i < 5; i++) {
      const randomPriority = parseInt(Math.random() * 10);
      eventControl.subscribe(
        "testEvent",
        () => {
          console.log(randomPriority);
        },
        { priority: randomPriority }
      );
    }

    eventControl.notify("testEvent", "Hello World!");
  });
});
