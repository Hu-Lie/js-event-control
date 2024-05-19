// 导入节点类
import Node from "./Node";

// 定义订阅者链表类
class SubscriberLinkedList {
  constructor() {
    // 初始化头节点为 null
    this.head = null;
  }

  // 插入新节点
  insert(data) {
    // 创建新节点
    const newNode = new Node(data);
    // 如果链表为空或者新节点的优先级高于头节点，则将新节点作为新的头节点
    if (!this.head || data.priority > this.head.data.priority) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      // 否则，找到合适的位置插入新节点，保持链表按照优先级有序
      let current = this.head;
      while (current.next && current.next.data.priority >= data.priority) {
        current = current.next;
      }
      newNode.next = current.next;
      current.next = newNode;
    }
  }

  // 移除节点
  remove(data) {
    // 如果链表为空，直接返回
    if (!this.head) return;
    // 如果头节点就是要移除的节点，则将头节点指向下一个节点
    if (this.head.data === data) {
      this.head = this.head.next;
      return;
    }
    // 否则，在链表中找到要移除节点的前一个节点
    let current = this.head;
    while (current.next && current.next.data !== data) {
      current = current.next;
    }
    // 如果找到要移除的节点，则将其指向下一个节点的下一个节点，从而删除目标节点
    if (current.next) {
      current.next = current.next.next;
    }
  }

  // 定义迭代器
  *[Symbol.iterator]() {
    let current = this.head;
    // 通过生成器函数实现迭代器，每次迭代返回当前节点的数据，并将当前节点指向下一个节点
    while (current) {
      yield current.data;
      current = current.next;
    }
  }
}

// 导出订阅者链表类
export default SubscriberLinkedList;
