
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.EventControl = {}));
})(this, (function (exports) { 'use strict';

  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var mergeOption = function mergeOption(option, beforeOption) {
    var mergedOption = {};
    Object.keys(beforeOption).forEach(function (key) {
      if (Object.hasOwnProperty.call(option, key)) {
        mergedOption[key] = option[key];
      } else {
        mergedOption[key] = beforeOption[key];
      }
    });
    return mergedOption;
  };
  var DEFAULT_OPTION = {
    priority: 0,
    once: false,
    stopNextEvent: false
  };
  var Subscriber = /*#__PURE__*/function () {
    function Subscriber(eventName, fn, option) {
      _classCallCheck(this, Subscriber);
      this.index = Subscriber.index;
      Subscriber.index += 1;
      this.eventName = eventName;
      this.fn = fn;
      this.option = mergeOption(option, Subscriber.defaultOption);
    }
    return _createClass(Subscriber, [{
      key: "onMessage",
      value: function onMessage(args) {
        var fnResult = this.fn.apply(this, _toConsumableArray(args));
        if (this.option.stopNextEvent) {
          fnResult = true;
        }
        return {
          once: this.option.once,
          stopNextEvent: fnResult
        };
      }
    }, {
      key: "priority",
      get: function get() {
        return this.option.priority;
      }
    }]);
  }();
  _defineProperty(Subscriber, "index", 1);
  _defineProperty(Subscriber, "defaultOption", DEFAULT_OPTION);

  var EventControl = /*#__PURE__*/function () {
    function EventControl() {
      _classCallCheck(this, EventControl);
      this.subscribersMap = new Map();
    }
    return _createClass(EventControl, [{
      key: "subscribe",
      value: function subscribe(eventName, fn, option) {
        var subscribers = this.subscribersMap.get(eventName);
        if (!subscribers) {
          subscribers = [];
          this.subscribersMap.set(eventName, subscribers);
        }
        var subscriber = new Subscriber(eventName, fn, option || {});
        subscribers.push(subscriber);
        if (subscriber.priority || subscribers[subscribers.length - 1].priority < 0) {
          subscribers.sort(function (a, b) {
            return b.priority - a.priority;
          });
        }
        return subscriber;
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(eventName, fn) {
        var subscribers = this.subscribersMap.get(eventName);
        var index = this.indexOfSubscribe(eventName, fn);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      }
    }, {
      key: "indexOfSubscribe",
      value: function indexOfSubscribe(eventName, fn) {
        var subscribers = this.subscribersMap.get(eventName);
        var index = -1;
        if (subscribers && subscribers.length) {
          index = subscribers.findIndex(function (i) {
            return i.fn === fn;
          });
        }
        return index;
      }
    }, {
      key: "notify",
      value: function notify(eventName, args) {
        var subscribers = this.subscribersMap.get(eventName);
        if (subscribers) {
          var argsCopy = args;
          if (!(argsCopy instanceof Array)) {
            argsCopy = [argsCopy];
          }
          for (var i = 0; i < subscribers.length; i += 1) {
            var subscriber = subscribers[i];
            var _subscriber$onMessage = subscriber.onMessage(argsCopy),
              once = _subscriber$onMessage.once,
              stopNextEvent = _subscriber$onMessage.stopNextEvent;
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
    }]);
  }();

  exports.EventControl = EventControl;
  exports.Subscriber = Subscriber;
  exports.default = EventControl;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
