// 默认选项
const DEFAULT_OPTION = {
  priority: 0,        // 默认优先级为0
  once: false,        // 默认不是一次性订阅
  stopNextEvent: false, // 默认不会阻止下一个事件
};

// 定义订阅者类
class Subscriber {
  static defaultOption = DEFAULT_OPTION; // 静态属性，存储默认选项

  constructor(eventName, fn, option = {}) {
    // 检查事件名称类型
    if (typeof eventName !== "string") {
      throw new TypeError("eventName must be a string");
    }
    // 检查回调函数类型
    if (typeof fn !== "function") {
      throw new TypeError("fn must be a function");
    }

    // 事件名称
    this.eventName = eventName;
    // 事件处理函数
    this.fn = fn;
    // 合并默认选项和传入选项
    this.option = { ...Subscriber.defaultOption, ...option };
  }

  // 处理消息
  onMessage(args) {
    // 调用订阅的回调函数
    let fnResult = this.fn(...args);

    // 如果选项中设置了 stopNextEvent，则覆盖函数返回值为 true
    if (this.option.stopNextEvent) {
      fnResult = true;
    }

    return {
      once: this.option.once, // 是否一次性订阅
      stopNextEvent: fnResult, // 是否阻止下一个事件
    };
  }

  // 获取订阅者的优先级
  get priority() {
    return this.option.priority;
  }
}

// 导出订阅者类
export default Subscriber;
