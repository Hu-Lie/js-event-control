const DEFAULT_OPTION = {
  priority: 0,       // 默认优先级为0
  once: false,       // 默认不是一次性订阅
  stopNextEvent: false // 默认不会阻止下一个事件
};

class Subscriber {
  static defaultOption = DEFAULT_OPTION;

  constructor(eventName, fn, option = {}) {
    if (typeof eventName !== "string") {
      throw new TypeError("eventName must be a string");
    }
    if (typeof fn !== "function") {
      throw new TypeError("fn must be a function");
    }

    this.eventName = eventName; // 事件名称
    this.fn = fn;               // 事件处理函数
    this.option = { ...Subscriber.defaultOption, ...option }; // 合并默认选项和传入选项
  }

  onMessage(args) {
    let fnResult = this.fn(...args); // 调用订阅的回调函数

    if (this.option.stopNextEvent) {
      fnResult = true; // 如果选项中设置了 stopNextEvent，则覆盖函数返回值为 true
    }

    return {
      once: this.option.once,            // 返回是否一次性订阅
      stopNextEvent: fnResult,           // 返回是否阻止下一个事件
    };
  }

  get priority() {
    return this.option.priority; // 获取订阅者的优先级
  }
}

export default Subscriber;
