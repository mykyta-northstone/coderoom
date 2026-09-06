export type Difficulty = "easy" | "medium" | "hard";
export type Language = "javascript" | "typescript";

export type Problem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  examples: string;
  starterCode: {
    javascript: string;
    typescript: string;
  };
};

export const PROBLEMS: Problem[] = [
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "easy",
    category: "Strings / Data Structures",
    description:
      "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples:
      "Example 1:\nInput: s = \"()\"\nOutput: true\n\nExample 2:\nInput: s = \"()[]{}\"\nOutput: true\n\nExample 3:\nInput: s = \"(]\"\nOutput: false",
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your implementation here
  
}
`,
      typescript: `function isValid(s: string): boolean {
  // Your implementation here
  
}
`,
    },
  },
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    category: "Arrays & Hashing",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples:
      "Example 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]",
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your implementation here

}
`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Your implementation here

}
`,
    },
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "easy",
    category: "Linked Lists",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples:
      "Example 1:\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]\n\nExample 2:\nInput: head = [1,2]\nOutput: [2,1]",
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  // Your implementation here

}
`,
      typescript: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  // Your implementation here

}
`,
    },
  },
  {
    id: "three-sum",
    title: "Three Sum",
    difficulty: "medium",
    category: "Two Pointers",
    description:
      "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    examples:
      "Example 1:\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\n\nExample 2:\nInput: nums = [0,1,1]\nOutput: []",
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // Your implementation here

}
`,
      typescript: `function threeSum(nums: number[]): number[][] {
  // Your implementation here

}
`,
    },
  },
  {
    id: "implement-promise-all",
    title: "Implement Promise.all",
    difficulty: "medium",
    category: "JavaScript Async",
    description:
      "Implement a custom `promiseAll` function that accepts an array of promises (or values) and returns a single Promise that resolves to an array of results, maintaining original order. If any promise rejects, `promiseAll` rejects with that error immediately.",
    examples:
      "Example:\nconst p1 = Promise.resolve(42);\nconst p2 = new Promise((resolve) => setTimeout(() => resolve('hello'), 100));\npromiseAll([p1, p2]).then(console.log); // [42, 'hello']",
    starterCode: {
      javascript: `/**
 * @param {Array<Promise<any> | any>} promises
 * @return {Promise<Array<any>>}
 */
function promiseAll(promises) {
  // Your implementation here

}
`,
      typescript: `function promiseAll<T>(promises: Array<Promise<T> | T>): Promise<T[]> {
  // Your implementation here

}
`,
    },
  },
  {
    id: "implement-debounce",
    title: "Implement Debounce",
    difficulty: "easy",
    category: "JavaScript Utilities",
    description:
      "Implement a `debounce` function that delays invoking `fn` until after `delay` milliseconds have elapsed since the last time the debounced function was invoked.",
    examples:
      "Example:\nconst log = debounce(() => console.log('Fired!'), 300);\nlog(); log(); log(); // Only prints once after 300ms of inactivity",
    starterCode: {
      javascript: `/**
 * @param {Function} fn
 * @param {number} delay
 * @return {Function}
 */
function debounce(fn, delay) {
  // Your implementation here

}
`,
      typescript: `function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  // Your implementation here

}
`,
    },
  },
  {
    id: "implement-throttle",
    title: "Implement Throttle",
    difficulty: "medium",
    category: "JavaScript Utilities",
    description:
      "Implement a `throttle` function that creates a throttled function that only invokes `fn` at most once per every `limit` milliseconds.",
    examples:
      "Example:\nconst log = throttle(() => console.log('Throttled'), 1000);\nlog(); // Runs immediately\nlog(); // Ignored if called within 1000ms",
    starterCode: {
      javascript: `/**
 * @param {Function} fn
 * @param {number} limit
 * @return {Function}
 */
function throttle(fn, limit) {
  // Your implementation here

}
`,
      typescript: `function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  // Your implementation here

}
`,
    },
  },
  {
    id: "concurrency-limiter",
    title: "Implement Concurrency Limiter",
    difficulty: "hard",
    category: "Async Control Flow",
    description:
      "Implement a `ConcurrencyLimiter` class (or function) that manages async task execution, ensuring that no more than `maxConcurrency` tasks run simultaneously while queueing additional tasks.",
    examples:
      "Example:\nconst limiter = new ConcurrencyLimiter(2);\nlimiter.add(() => fetch('/api/1'));\nlimiter.add(() => fetch('/api/2'));\nlimiter.add(() => fetch('/api/3')); // Waits until 1 or 2 finishes",
    starterCode: {
      javascript: `class ConcurrencyLimiter {
  constructor(maxConcurrency) {
    this.maxConcurrency = maxConcurrency;
    // Your initialization
  }

  async add(taskFn) {
    // Your implementation here
  }
}
`,
      typescript: `class ConcurrencyLimiter {
  private maxConcurrency: number;

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency;
    // Your initialization
  }

  async add<T>(taskFn: () => Promise<T>): Promise<T> {
    // Your implementation here
    throw new Error("Not implemented");
  }
}
`,
    },
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "medium",
    category: "System & Data Structures",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(capacity)` Initialize the LRU cache with positive size capacity.\n- `get(key)` Return the value of key if it exists, otherwise return -1.\n- `put(key, value)` Update or insert the value. When capacity is reached, invalidate the least recently used item.",
    examples:
      "Example:\nconst cache = new LRUCache(2);\ncache.put(1, 1);\ncache.put(2, 2);\ncache.get(1);    // returns 1\ncache.put(3, 3); // evicts key 2\ncache.get(2);    // returns -1",
    starterCode: {
      javascript: `class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    // Your initialization here
  }

  /** 
   * @param {number} key
   * @return {number}
   */
  get(key) {
    // Your implementation here
  }

  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    // Your implementation here
  }
}
`,
      typescript: `class LRUCache {
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    // Your initialization here
  }

  get(key: number): number {
    // Your implementation here
    return -1;
  }

  put(key: number, value: number): void {
    // Your implementation here
  }
}
`,
    },
  },
  {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    category: "Sliding Window",
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples:
      "Example 1:\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.\n\nExample 2:\nInput: s = \"bbbbb\"\nOutput: 1",
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Your implementation here

}
`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Your implementation here

}
`,
    },
  },
  {
    id: "flatten-array",
    title: "Flatten Array (Deep)",
    difficulty: "easy",
    category: "Arrays",
    description:
      "Write a function `flatten` that recursively flattens a nested array of arbitrary depth without using `Array.prototype.flat`.",
    examples:
      "Example:\nflatten([1, [2, [3, [4]], 5]]) -> [1, 2, 3, 4, 5]",
    starterCode: {
      javascript: `/**
 * @param {Array} arr
 * @return {Array}
 */
function flatten(arr) {
  // Your implementation here

}
`,
      typescript: `type NestedArray<T> = Array<T | NestedArray<T>>;

function flatten<T>(arr: NestedArray<T>): T[] {
  // Your implementation here

}
`,
    },
  },
  {
    id: "event-emitter",
    title: "Custom Event Emitter",
    difficulty: "medium",
    category: "Object-Oriented / Patterns",
    description:
      "Design an `EventEmitter` class with `subscribe(eventName, callback)` and `emit(eventName, args)` methods. `subscribe` should return an unsubscribe handle object with an `unsubscribe()` method.",
    examples:
      "Example:\nconst emitter = new EventEmitter();\nconst sub = emitter.subscribe('onClick', (x) => console.log(x));\nemitter.emit('onClick', [42]); // prints 42\nsub.unsubscribe();",
    starterCode: {
      javascript: `class EventEmitter {
  constructor() {
    // Your initialization here
  }

  subscribe(eventName, callback) {
    // Return handle with unsubscribe method
  }

  emit(eventName, args = []) {
    // Call all subscribed callbacks
  }
}
`,
      typescript: `type Callback = (...args: any[]) => any;

class EventEmitter {
  constructor() {
    // Your initialization here
  }

  subscribe(eventName: string, callback: Callback): { unsubscribe: () => void } {
    // Return handle with unsubscribe method
    return { unsubscribe: () => {} };
  }

  emit(eventName: string, args: any[] = []): any[] {
    // Call all subscribed callbacks
    return [];
  }
}
`,
    },
  },
  {
    id: "deep-clone",
    title: "Deep Clone Object",
    difficulty: "medium",
    category: "Objects & Recursion",
    description:
      "Write a function `deepClone(obj)` that returns a deep copy of an object or array, handling primitives, nested objects, arrays, and dates without using `structuredClone` or `JSON.parse(JSON.stringify(obj))`.",
    examples:
      "Example:\nconst original = { a: 1, b: { c: 2 } };\nconst copy = deepClone(original);\ncopy.b.c = 42;\nconsole.log(original.b.c); // 2",
    starterCode: {
      javascript: `/**
 * @param {any} obj
 * @return {any}
 */
function deepClone(obj) {
  // Your implementation here

}
`,
      typescript: `function deepClone<T>(obj: T): T {
  // Your implementation here

}
`,
    },
  },
  {
    id: "currying",
    title: "Implement Currying",
    difficulty: "medium",
    category: "Functional Programming",
    description:
      "Write a function `curry(fn)` that transforms a function `fn` that accepts multiple arguments into a function that can be called repeatedly with single or multiple arguments until all expected arguments are provided.",
    examples:
      "Example:\nconst sum = (a, b, c) => a + b + c;\nconst curriedSum = curry(sum);\ncurriedSum(1)(2)(3); // 6\ncurriedSum(1, 2)(3); // 6",
    starterCode: {
      javascript: `/**
 * @param {Function} fn
 * @return {Function}
 */
function curry(fn) {
  // Your implementation here

}
`,
      typescript: `function curry(fn: Function): Function {
  // Your implementation here

}
`,
    },
  },
  {
    id: "memoize",
    title: "Implement Memoize",
    difficulty: "easy",
    category: "Higher-Order Functions",
    description:
      "Implement a `memoize` function that takes a function `fn` and returns a memoized version that caches results based on arguments stringification.",
    examples:
      "Example:\nlet callCount = 0;\nconst memoizedFn = memoize((a, b) => { callCount++; return a + b; });\nmemoizedFn(2, 2); // 4\nmemoizedFn(2, 2); // 4 (cached, callCount stays 1)",
    starterCode: {
      javascript: `/**
 * @param {Function} fn
 * @return {Function}
 */
function memoize(fn) {
  // Your implementation here

}
`,
      typescript: `function memoize<T extends (...args: any[]) => any>(fn: T): T {
  // Your implementation here

}
`,
    },
  },
  {
    id: "group-by",
    title: "Group By Polyfill",
    difficulty: "easy",
    category: "Arrays & Objects",
    description:
      "Write a method or function `groupBy(array, fn)` that splits an array into an object grouped by the key returned from `fn(item)`.",
    examples:
      "Example:\ngroupBy([6.1, 4.2, 6.3], Math.floor) -> { '4': [4.2], '6': [6.1, 6.3] }",
    starterCode: {
      javascript: `/**
 * @param {Array} array
 * @param {Function} fn
 * @return {Object}
 */
function groupBy(array, fn) {
  // Your implementation here

}
`,
      typescript: `function groupBy<T, K extends string | number | symbol>(
  array: T[],
  fn: (item: T) => K
): Record<K, T[]> {
  // Your implementation here

}
`,
    },
  },
];

export function getProblemById(id: string): Problem | undefined {
  return PROBLEMS.find((p) => p.id === id);
}
