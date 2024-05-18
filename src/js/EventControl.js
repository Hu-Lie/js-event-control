import Subscriber from "./Subscriber";

class EventControl {
  constructor() {
    this.subscribersMap = new Map();
  }

  subscribe(eventName, fn, option) {
    let subscribers = this.subscribersMap.get(eventName);

    if (!subscribers) {
      subscribers = [];
      this.subscribersMap.set(eventName, subscribers);
    }

    const subscriber = new Subscriber(eventName, fn, option || {});
    subscribers.push(subscriber);

    if (
      subscriber.priority
      || subscribers[subscribers.length - 1].priority < 0
    ) {
      subscribers.sort((a, b) => b.priority - a.priority);
    }

    return subscriber;
  }

  unsubscribe(eventName, fn) {
    const subscribers = this.subscribersMap.get(eventName);

    const index = this.indexOfSubscribe(eventName, fn);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  }

  indexOfSubscribe(eventName, fn) {
    const subscribers = this.subscribersMap.get(eventName);
    let index = -1;
    if (subscribers && subscribers.length) {
      index = subscribers.findIndex((i) => i.fn === fn);
    }
    return index;
  }

  notify(eventName, args) {
    const subscribers = this.subscribersMap.get(eventName);
    if (subscribers) {
      let argsCopy = args;
      if (!(argsCopy instanceof Array)) {
        argsCopy = [argsCopy];
      }
      for (let i = 0; i < subscribers.length; i += 1) {
        const subscriber = subscribers[i];
        const { once, stopNextEvent } = subscriber.onMessage(argsCopy);

        if (once) {
          this.unsubscribe(eventName, subscriber.fn);
          i -= 1;
        }

        if (stopNextEvent) {
          break;
        }
      }
    }
  }
}

export default EventControl;
