import Subscriber from "./Subscriber";

class EventControl {
  constructor() {
    this.subscribersMap = new Map(); // 存储事件名称和对应的订阅者数组
  }

  subscribe(eventName, fn, option = {}) {
    if (typeof eventName !== 'string') {
      throw new TypeError('eventName must be a string'); // 检查事件名称类型
    }
    if (typeof fn !== 'function') {
      throw new TypeError('fn must be a function'); // 检查回调函数类型
    }

    let subscribers = this.subscribersMap.get(eventName);

    if (!subscribers) {
      subscribers = []; // 如果没有订阅者列表，则创建一个新的
      this.subscribersMap.set(eventName, subscribers);
    }

    const subscriber = new Subscriber(eventName, fn, option); // 创建新的订阅者实例
    subscribers.push(subscriber); // 添加到订阅者列表

    // 如果有优先级设置，按优先级排序订阅者
    if (subscriber.priority || subscribers[subscribers.length - 1].priority < 0) {
      subscribers.sort((a, b) => b.priority - a.priority);
    }

    return subscriber;
  }

  unsubscribe(eventName, fn) {
    const index = this.indexOfSubscribe(eventName, fn); // 查找订阅者索引
    if (index !== -1) {
      const subscribers = this.subscribersMap.get(eventName);
      subscribers.splice(index, 1); // 从订阅者列表中移除

      if (subscribers.length === 0) {
        this.subscribersMap.delete(eventName); // 如果没有订阅者了，删除事件条目
      }
    }
  }

  indexOfSubscribe(eventName, fn) {
    const subscribers = this.subscribersMap.get(eventName);
    if (!subscribers) return -1;

    // 查找回调函数对应的订阅者索引
    return subscribers.findIndex((subscriber) => subscriber.fn === fn);
  }

  notify(eventName, args) {
    const subscribers = this.subscribersMap.get(eventName);
    if (subscribers) {
      const argsArray = Array.isArray(args) ? args : [args]; // 确保参数是数组

      for (let i = 0; i < subscribers.length; i += 1) {
        const subscriber = subscribers[i];
        const { once, stopNextEvent } = subscriber.onMessage(argsArray); // 通知订阅者

        if (once) {
          this.unsubscribe(eventName, subscriber.fn); // 如果是一次性订阅，移除订阅者
          i -= 1; // 移除后调整索引
        }

        if (stopNextEvent) {
          break; // 如果设置了阻止下一个事件，停止通知后续订阅者
        }
      }
    }
  }
}

export default EventControl;
