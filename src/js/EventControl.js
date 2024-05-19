// 导入订阅者类和订阅者链表类
import Subscriber from "./Subscriber";
import SubscriberLinkedList from "./SubscriberLinkedList";

// 定义事件控制类
class EventControl {
  constructor() {
    this.subscribersMap = new Map(); // 存储事件名称和对应的订阅者链表
  }

  // 订阅事件
  subscribe(eventName, fn, option = {}) {
    // 检查事件名称类型
    if (typeof eventName !== "string") {
      throw new TypeError("eventName must be a string");
    }
    // 检查回调函数类型
    if (typeof fn !== "function") {
      throw new TypeError("fn must be a function");
    }

    let subscribers = this.subscribersMap.get(eventName);

    if (!subscribers) {
      subscribers = new SubscriberLinkedList(); // 如果没有订阅者链表，则创建一个新的
      this.subscribersMap.set(eventName, subscribers);
    }

    const subscriber = new Subscriber(eventName, fn, option); // 创建新的订阅者实例
    subscribers.insert(subscriber); // 按优先级插入到订阅者链表

    return subscriber; // 返回订阅者实例
  }

  // 取消订阅事件
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

  // 通知订阅者事件发生
  notify(eventName, args) {
    const subscribers = this.subscribersMap.get(eventName);
    if (subscribers) {
      const argsArray = Array.isArray(args) ? args : [args]; // 确保参数是数组

      for (const subscriber of subscribers) {
        const { once, stopNextEvent } = subscriber.onMessage(argsArray); // 通知订阅者

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

// 导出事件控制类
export default EventControl;
