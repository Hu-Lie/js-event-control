const mergeOption = function mergeOption(option, beforeOption) {
  const mergedOption = {};
  Object.keys(beforeOption).forEach((key) => {
    if (Object.hasOwnProperty.call(option, key)) {
      mergedOption[key] = option[key];
    } else {
      mergedOption[key] = beforeOption[key];
    }
  });
  return mergedOption;
};

const DEFAULT_OPTION = {
  priority: 0,
  once: false,
  stopNextEvent: false,
};

class Subscriber {
  static index = 1;

  static defaultOption = DEFAULT_OPTION;

  constructor(eventName, fn, option) {
    this.index = Subscriber.index;
    Subscriber.index += 1;
    this.eventName = eventName;
    this.fn = fn;
    this.option = mergeOption(option, Subscriber.defaultOption);
  }

  onMessage(args) {
    let fnResult = this.fn(...args);

    if (this.option.stopNextEvent) {
      fnResult = true;
    }

    return {
      once: this.option.once,
      stopNextEvent: fnResult,
    };
  }

  get priority() {
    return this.option.priority;
  }
}

export default Subscriber;
