
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
const DEFAULT_OPTION = {
  priority: 0,
  // 默认优先级为0
  once: false,
  // 默认不是一次性订阅
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
    this.fn = fn; // 事件处理函数
    this.option = {
      ...Subscriber.defaultOption,
      ...option
    }; // 合并默认选项和传入选项
  }
  onMessage(args) {
    let fnResult = this.fn(...args); // 调用订阅的回调函数

    if (this.option.stopNextEvent) {
      fnResult = true; // 如果选项中设置了 stopNextEvent，则覆盖函数返回值为 true
    }
    return {
      once: this.option.once,
      // 返回是否一次性订阅
      stopNextEvent: fnResult // 返回是否阻止下一个事件
    };
  }
  get priority() {
    return this.option.priority; // 获取订阅者的优先级
  }
}

class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

class SubscriberLinkedList {
  constructor() {
    this.head = null;
  }
  insert(data) {
    const newNode = new Node(data);
    if (!this.head || data.priority > this.head.data.priority) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next && current.next.data.priority >= data.priority) {
        current = current.next;
      }
      newNode.next = current.next;
      current.next = newNode;
    }
  }
  remove(data) {
    if (!this.head) return;
    if (this.head.data === data) {
      this.head = this.head.next;
      return;
    }
    let current = this.head;
    while (current.next && current.next.data !== data) {
      current = current.next;
    }
    if (current.next) {
      current.next = current.next.next;
    }
  }
  *[Symbol.iterator]() {
    let current = this.head;
    while (current) {
      yield current.data;
      current = current.next;
    }
  }
}

class EventControl {
  constructor() {
    this.subscribersMap = new Map(); // 存储事件名称和对应的订阅者链表
  }
  subscribe(eventName, fn, option = {}) {
    if (typeof eventName !== "string") {
      throw new TypeError("eventName must be a string"); // 检查事件名称类型
    }
    if (typeof fn !== "function") {
      throw new TypeError("fn must be a function"); // 检查回调函数类型
    }
    let subscribers = this.subscribersMap.get(eventName);
    if (!subscribers) {
      subscribers = new SubscriberLinkedList(); // 如果没有订阅者链表，则创建一个新的
      this.subscribersMap.set(eventName, subscribers);
    }
    const subscriber = new Subscriber(eventName, fn, option); // 创建新的订阅者实例
    subscribers.insert(subscriber); // 按优先级插入到订阅者链表

    return subscriber;
  }
  unsubscribe(eventName, fn) {
    const subscribers = this.subscribersMap.get(eventName);
    if (subscribers) {
      for (const subscriber of subscribers) {
        if (subscriber.fn === fn) {
          subscribers.remove(subscriber); // 从订阅者链表中移除
          break;
        }
      }
      if (!subscribers.head) {
        this.subscribersMap.delete(eventName); // 如果没有订阅者了，删除事件条目
      }
    }
  }
  notify(eventName, args) {
    const subscribers = this.subscribersMap.get(eventName);
    if (subscribers) {
      const argsArray = Array.isArray(args) ? args : [args]; // 确保参数是数组

      for (const subscriber of subscribers) {
        const {
          once,
          stopNextEvent
        } = subscriber.onMessage(argsArray); // 通知订阅者

        if (once) {
          this.unsubscribe(eventName, subscriber.fn); // 如果是一次性订阅，移除订阅者
        }
        if (stopNextEvent) {
          break; // 如果设置了阻止下一个事件，停止通知后续订阅者
        }
      }
    }
  }
}

export { EventControl, Subscriber, EventControl as default };
//# sourceMappingURL=index-es.js.map
