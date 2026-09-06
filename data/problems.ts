export type Difficulty = "easy" | "medium" | "hard";
export type Language = "javascript" | "typescript";
export type ProblemType = "coding" | "code_review";

export type Problem = {
  id: string;
  title: string;
  type?: ProblemType;
  difficulty: Difficulty;
  category: string;
  description: string;
  examples: string;
  hints?: string[];
  starterCode: {
    javascript: string;
    typescript: string;
  };
};

const rawProblems: Problem[] = [
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
  {
    id: "n-plus-1-queries",
    title: "Code Review: N+1 Database Queries",
    type: "code_review",
    difficulty: "medium",
    category: "Database & Performance",
    description:
      "Review the following user profile enrichment service. Identify performance issues (specifically N+1 database query patterns), explain the architectural impact on database connection pools, and propose an optimized batching/joining solution.",
    examples:
      "Code Review Criteria:\n1. Identify the N+1 loop executing database queries per array item.\n2. Discuss database connection exhaustion and latency overhead.\n3. Refactor using IN clause batching, SQL JOINs, or DataLoaders.",
    hints: [
      "Per-item database queries inside for-loop (N+1 query anti-pattern).",
      "Connection pool exhaustion under concurrent user traffic.",
      "Refactoring opportunity: Use SQL JOINs, IN ($1, $2...) batching, or DataLoaders."
    ],
    starterCode: {
      javascript: `// Service handler fetching active user profiles and their recent orders
async function getUserDashboardData(userIds) {
  const users = [];

  for (const id of userIds) {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    const orders = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5', [id]);
    const settings = await db.query('SELECT * FROM user_settings WHERE user_id = $1', [id]);

    users.push({
      ...user,
      recentOrders: orders,
      settings: settings[0] || {}
    });
  }

  return users;
}
`,
      typescript: `interface User { id: string; name: string; }
interface Order { id: string; userId: string; amount: number; }
interface UserSettings { userId: string; theme: string; }

// Service handler fetching active user profiles and their recent orders
async function getUserDashboardData(userIds: string[]) {
  const users = [];

  for (const id of userIds) {
    const user = await db.query<User>('SELECT * FROM users WHERE id = $1', [id]);
    const orders = await db.query<Order[]>('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5', [id]);
    const settings = await db.query<UserSettings>('SELECT * FROM user_settings WHERE user_id = $1', [id]);

    users.push({
      ...user,
      recentOrders: orders,
      settings: settings[0] || {}
    });
  }

  return users;
}
`,
    },
  },
  {
    id: "async-error-handling",
    title: "Code Review: Async Error Handling",
    type: "code_review",
    difficulty: "medium",
    category: "Async & Promises",
    description:
      "Review the following payment notification pipeline. Identify problematic async behavior, missing error handling, floating unawaited promises, and failure propagation issues.",
    examples:
      "Code Review Criteria:\n1. Spot floating promises missing await/catch.\n2. Identify swallowed errors in try/catch blocks.\n3. Discuss unhandled rejection crashes in Node.js runtime.",
    hints: [
      "auditLogger.logTransaction promise is not awaited (floating promise / unhandled rejection).",
      "Array.prototype.forEach with async callback does not wait for item processing.",
      "catch block swallows the error silently and returns success status fallback."
    ],
    starterCode: {
      javascript: `// Background job processing webhook notifications
async function processWebhookPayment(payload) {
  try {
    const payment = await verifyPaymentSignature(payload);

    auditLogger.logTransaction({ id: payment.id, amount: payment.amount });

    payload.items.forEach(async (item) => {
      await updateInventoryStock(item.id, item.qty);
      await sendReceiptEmail(payment.customerEmail, item);
    });

    return { status: "processed" };
  } catch (err) {
    console.log("Something went wrong:", err);
    return { status: "processed" };
  }
}
`,
      typescript: `interface WebhookPayload { id: string; customerEmail: string; items: Array<{ id: string; qty: number }>; }

// Background job processing webhook notifications
async function processWebhookPayment(payload: WebhookPayload) {
  try {
    const payment = await verifyPaymentSignature(payload);

    auditLogger.logTransaction({ id: payment.id, amount: payment.amount });

    payload.items.forEach(async (item) => {
      await updateInventoryStock(item.id, item.qty);
      await sendReceiptEmail(payment.customerEmail, item);
    });

    return { status: "processed" };
  } catch (err) {
    console.log("Something went wrong:", err);
    return { status: "processed" };
  }
}
`,
    },
  },
  {
    id: "race-condition-state",
    title: "Code Review: Race Condition & State Mutability",
    type: "code_review",
    difficulty: "hard",
    category: "Concurrency & State",
    description:
      "Review the following wallet balance transfer handler. Identify how concurrent operations produce inconsistent state, explain the race condition window, and refactor using atomic operations or database transactions.",
    examples:
      "Code Review Criteria:\n1. Identify read-modify-write pattern vulnerable to race conditions.\n2. Explain double-spending or negative balance scenarios under high concurrency.\n3. Implement atomic SQL transactions or locking mechanisms.",
    hints: [
      "Read-modify-write pattern vulnerable to race conditions under concurrent requests.",
      "Delay between reading sender balance and writing new balance permits double-spending.",
      "Fix using atomic database updates (UPDATE users SET balance = balance - X) or SQL transactions with FOR UPDATE row locks."
    ],
    starterCode: {
      javascript: `// Account balance transfer service
async function transferFunds(senderId, receiverId, amount) {
  const sender = await db.findUser(senderId);
  
  if (sender.balance < amount) {
    throw new Error("Insufficient funds");
  }

  await new Promise(resolve => setTimeout(resolve, 50));

  const receiver = await db.findUser(receiverId);

  const newSenderBalance = sender.balance - amount;
  const newReceiverBalance = receiver.balance + amount;

  await db.updateUserBalance(senderId, newSenderBalance);
  await db.updateUserBalance(receiverId, newReceiverBalance);

  return { success: true };
}
`,
      typescript: `// Account balance transfer service
async function transferFunds(senderId: string, receiverId: string, amount: number) {
  const sender = await db.findUser(senderId);
  
  if (sender.balance < amount) {
    throw new Error("Insufficient funds");
  }

  await new Promise(resolve => setTimeout(resolve, 50));

  const receiver = await db.findUser(receiverId);

  const newSenderBalance = sender.balance - amount;
  const newReceiverBalance = receiver.balance + amount;

  await db.updateUserBalance(senderId, newSenderBalance);
  await db.updateUserBalance(receiverId, newReceiverBalance);

  return { success: true };
}
`,
    },
  },
  {
    id: "memory-leak-node",
    title: "Code Review: Node.js Memory Leak",
    type: "code_review",
    difficulty: "hard",
    category: "Node.js & Memory",
    description:
      "Review the following WebSocket stream manager and query cache. Identify why process memory grows continuously over time, locate uncleaned event listeners/timers, and propose a leak-free implementation.",
    examples:
      "Code Review Criteria:\n1. Identify event listeners registered per request without cleanup.\n2. Spot unbounded global in-memory cache objects.\n3. Fix using WeakMap, cache eviction (LRU), or proper unsubscription.",
    hints: [
      "globalBus.on('system_broadcast', ...) listener registered per socket connection without off() on close.",
      "queryCache object grows indefinitely without key eviction or TTL expiry.",
      "setInterval timer created per connection without clearInterval on socket disconnect."
    ],
    starterCode: {
      javascript: `const EventEmitter = require('events');
const globalBus = new EventEmitter();

const queryCache = {};

function handleClientConnection(socket, req) {
  const userId = req.headers['x-user-id'];

  globalBus.on('system_broadcast', (msg) => {
    socket.send(JSON.stringify({ type: 'broadcast', data: msg }));
  });

  socket.on('query', async (queryStr) => {
    if (!queryCache[queryStr]) {
      queryCache[queryStr] = await runHeavyQuery(queryStr);
    }
    socket.send(JSON.stringify(queryCache[queryStr]));
  });

  setInterval(() => {
    socket.send(JSON.stringify({ ping: Date.now() }));
  }, 5000);
}
`,
      typescript: `import EventEmitter from 'events';
const globalBus = new EventEmitter();

const queryCache: Record<string, any> = {};

function handleClientConnection(socket: any, req: any) {
  const userId = req.headers['x-user-id'];

  globalBus.on('system_broadcast', (msg) => {
    socket.send(JSON.stringify({ type: 'broadcast', data: msg }));
  });

  socket.on('query', async (queryStr: string) => {
    if (!queryCache[queryStr]) {
      queryCache[queryStr] = await runHeavyQuery(queryStr);
    }
    socket.send(JSON.stringify(queryCache[queryStr]));
  });

  setInterval(() => {
    socket.send(JSON.stringify({ ping: Date.now() }));
  }, 5000);
}
`,
    },
  },
  {
    id: "inefficient-api-handler",
    title: "Code Review: Inefficient API Implementation",
    type: "code_review",
    difficulty: "easy",
    category: "API & Backend",
    description:
      "Review the following search API route handler. Identify unnecessary work, missing database pagination, over-fetching raw data, and security exposures.",
    examples:
      "Code Review Criteria:\n1. Identify fetching full table without SQL OFFSET/LIMIT.\n2. Spot in-memory filtering of large datasets.\n3. Remove sensitive user password hashes from JSON response.",
    hints: [
      "SELECT * FROM users fetches entire database into RAM instead of using SQL WHERE clauses.",
      "In-memory Array.prototype.filter on large datasets causes severe CPU/RAM latency.",
      "Missing pagination LIMIT/OFFSET parameters returning massive payloads.",
      "Security flaw: Returns raw password_hash and internal security tokens to API clients."
    ],
    starterCode: {
      javascript: `// API route GET /api/users/search?q=name
async function searchUsersHandler(req, res) {
  const searchQuery = req.query.q || "";

  const allUsers = await db.query('SELECT * FROM users');

  const matchedUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return res.json({
    total: matchedUsers.length,
    users: matchedUsers
  });
}
`,
      typescript: `// API route GET /api/users/search?q=name
async function searchUsersHandler(req: any, res: any) {
  const searchQuery = (req.query.q as string) || "";

  const allUsers = await db.query('SELECT * FROM users');

  const matchedUsers = allUsers.filter((u: any) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return res.json({
    total: matchedUsers.length,
    users: matchedUsers
  });
}
`,
    },
  },
  {
    id: "unrestricted-promise-all",
    title: "Code Review: Promise Concurrency Exhaustion",
    type: "code_review",
    difficulty: "medium",
    category: "Async & Concurrency",
    description:
      "Review the following batch notification dispatcher. Identify why firing thousands of HTTP requests with unrestricted `Promise.all()` leads to socket exhaustion, memory spikes, and API rate limit bans. Refactor with controlled concurrency.",
    examples:
      "Code Review Criteria:\n1. Identify unrestricted Promise.all on unbounded array.\n2. Discuss OS file descriptor / socket exhaustion limits.\n3. Refactor using p-limit, chunking, or custom concurrency pool.",
    hints: [
      "Unrestricted Promise.all maps over 10,000 items simultaneously.",
      "Fires thousands of concurrent HTTP requests causing OS file descriptor / socket hangup errors.",
      "Triggers 429 Rate Limit bans from upstream email providers.",
      "Fix using p-limit, chunking, or a concurrency pool."
    ],
    starterCode: {
      javascript: `// Batch newsletter dispatcher
async function dispatchBulkNotifications(subscribers, message) {
  console.log(\`Starting dispatch to \${subscribers.length} subscribers...\`);

  const results = await Promise.all(
    subscribers.map(sub => 
      sendEmailViaSendgrid(sub.email, message.subject, message.body)
    )
  );

  return { dispatched: results.length };
}
`,
      typescript: `interface Subscriber { id: string; email: string; }
interface Message { subject: string; body: string; }

// Batch newsletter dispatcher
async function dispatchBulkNotifications(subscribers: Subscriber[], message: Message) {
  console.log(\`Starting dispatch to \${subscribers.length} subscribers...\`);

  const results = await Promise.all(
    subscribers.map(sub => 
      sendEmailViaSendgrid(sub.email, message.subject, message.body)
    )
  );

  return { dispatched: results.length };
}
`,
    },
  },
  {
    id: "bad-typescript-design",
    title: "Code Review: Bad TypeScript Design",
    type: "code_review",
    difficulty: "easy",
    category: "TypeScript & Architecture",
    description:
      "Review the following TypeScript data mapper. Identify type safety flaws, excessive `any` usage, unsafe type assertions (`as any`), and weak interfaces. Refactor for strict type safety.",
    examples:
      "Code Review Criteria:\n1. Identify unsafe type casting `as any` bypassing compiler checks.\n2. Replace implicit `any` parameters with generics or union types.\n3. Add type guards for runtime validation.",
    hints: [
      "Indiscriminate use of 'any' type parameters disabling TypeScript compiler checks.",
      "Unsafe type assertions (data as any, item.id as string) hiding runtime schema bugs.",
      "JSON.parse on metadata without type validation or error handling.",
      "Fix by defining strict interface definitions and type guards."
    ],
    starterCode: {
      javascript: `// Unsafe data normalization pipeline
function processApiResponse(data) {
  const result = (data as any).items.map((item) => {
    return {
      id: item.id as string,
      title: item.title || "Untitled",
      meta: (item as any).metadata ? JSON.parse((item as any).metadata) : {}
    };
  });

  return result as any;
}
`,
      typescript: `// Unsafe data normalization pipeline
function processApiResponse(data: any): any {
  const items = (data as any).items;

  const result = items.map((item: any) => {
    return {
      id: item.id as string,
      title: item.title || "Untitled",
      meta: (item as any).metadata ? JSON.parse((item as any).metadata) : {}
    };
  });

  return result as any;
}
`,
    },
  },
  {
    id: "auth-authorization-bug",
    title: "Code Review: Authorization & Security Bug",
    type: "code_review",
    difficulty: "medium",
    category: "Security & Auth",
    description:
      "Review the following document sharing API endpoint. Identify the critical security flaw (Insecure Direct Object Reference - IDOR), explain how an attacker could exploit it, and implement proper authorization checks.",
    examples:
      "Code Review Criteria:\n1. Identify missing tenant/user ownership verification.\n2. Explain IDOR vulnerability where any user can access another's private files.\n3. Add authorization check against session user ID.",
    hints: [
      "IDOR (Insecure Direct Object Reference) security vulnerability.",
      "Fetches document by URL parameter ID without verifying document.userId === currentUser.id.",
      "Allows any logged-in user to view private documents belonging to other accounts."
    ],
    starterCode: {
      javascript: `// GET /api/documents/:documentId
async function getDocumentHandler(req, res) {
  const currentUser = req.user; // { id: "user_123", role: "member" }
  const documentId = req.params.documentId;

  const document = await db.query('SELECT * FROM documents WHERE id = $1', [documentId]);

  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  return res.json(document);
}
`,
      typescript: `// GET /api/documents/:documentId
async function getDocumentHandler(req: any, res: any) {
  const currentUser = req.user; // { id: "user_123", role: "member" }
  const documentId = req.params.documentId;

  const document = await db.query('SELECT * FROM documents WHERE id = $1', [documentId]);

  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  return res.json(document);
}
`,
    },
  },
  {
    id: "poor-logging-error-design",
    title: "Code Review: Poor Logging & Error Design",
    type: "code_review",
    difficulty: "easy",
    category: "Observability & Error Handling",
    description:
      "Review the following checkout payment gateway integration. Identify security logging violations, swallowed errors, lack of contextual logging, and leaking internal database stack traces to clients.",
    examples:
      "Code Review Criteria:\n1. Identify PII / PCI compliance violation (logging raw credit card details).\n2. Fix swallowed error blocks.\n3. Stop leaking internal stack traces in HTTP responses.",
    hints: [
      "PCI-DSS / PII security violation: Logging cleartext credit card numbers and CVC to stdout.",
      "Leaking internal database stack traces (err.stack) in HTTP 500 error responses.",
      "Missing structured JSON logging format and request correlation IDs."
    ],
    starterCode: {
      javascript: `// Checkout billing processor
async function processBillingCheckout(req, res) {
  const { creditCardNumber, cvc, amount, userId } = req.body;

  console.log(\`Processing payment for user \${userId}: card=\${creditCardNumber}, cvc=\${cvc}\`);

  try {
    const charge = await stripe.charges.create({ amount, card: creditCardNumber });
    return res.json({ success: true, chargeId: charge.id });
  } catch (err) {
    return res.status(500).json({
      error: "Billing failure",
      debugStackTrace: err.stack,
      rawError: JSON.stringify(err)
    });
  }
}
`,
      typescript: `// Checkout billing processor
async function processBillingCheckout(req: any, res: any) {
  const { creditCardNumber, cvc, amount, userId } = req.body;

  console.log(\`Processing payment for user \${userId}: card=\${creditCardNumber}, cvc=\${cvc}\`);

  try {
    const charge = await stripe.charges.create({ amount, card: creditCardNumber });
    return res.json({ success: true, chargeId: charge.id });
  } catch (err: any) {
    return res.status(500).json({
      error: "Billing failure",
      debugStackTrace: err.stack,
      rawError: JSON.stringify(err)
    });
  }
}
`,
    },
  },
  {
    id: "overengineered-simple-task",
    title: "Code Review: Overengineered Code",
    type: "code_review",
    difficulty: "medium",
    category: "Software Design",
    description:
      "Review the following user name formatting module. Identify unnecessary design abstractions, premature generalization, and refactor it into a clean, simple, readable function.",
    examples:
      "Code Review Criteria:\n1. Identify overengineered AbstractFactory/Strategy wrappers for a 1-line string format.\n2. Discuss cognitive load, maintainability, and YAGNI principle.\n3. Refactor to a clean single-responsibility function.",
    hints: [
      "AbstractFactory and Strategy pattern wrappers used for a simple 1-line string format.",
      "Violates YAGNI (You Aren't Gonna Need It) and KISS software design principles.",
      "Adds high cognitive load and unnecessary runtime object allocations."
    ],
    starterCode: {
      javascript: `// Formatting a user's display name: "FirstName LastName"
class AbstractNameFormatterFactory {
  createFormatter() { throw new Error("Abstract method"); }
}

class StandardNameFormatterStrategy {
  format(firstName, lastName) {
    return \`\${firstName} \${lastName}\`.trim();
  }
}

class DefaultNameFormatterFactory extends AbstractNameFormatterFactory {
  createFormatter() {
    return new StandardNameFormatterStrategy();
  }
}

function formatUserDisplayName(user) {
  const factory = new DefaultNameFormatterFactory();
  const formatter = factory.createFormatter();
  return formatter.format(user.firstName, user.lastName);
}
`,
      typescript: `interface IUser { firstName: string; lastName: string; }

abstract class AbstractNameFormatterFactory {
  abstract createFormatter(): INameFormatter;
}

interface INameFormatter {
  format(firstName: string, lastName: string): string;
}

class StandardNameFormatterStrategy implements INameFormatter {
  format(firstName: string, lastName: string): string {
    return \`\${firstName} \${lastName}\`.trim();
  }
}

class DefaultNameFormatterFactory extends AbstractNameFormatterFactory {
  createFormatter(): INameFormatter {
    return new StandardNameFormatterStrategy();
  }
}

function formatUserDisplayName(user: IUser): string {
  const factory: AbstractNameFormatterFactory = new DefaultNameFormatterFactory();
  const formatter: INameFormatter = factory.createFormatter();
  return formatter.format(user.firstName, user.lastName);
}
`,
    },
  },
];

const difficultyRankMap: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export const PROBLEMS: Problem[] = rawProblems.sort(
  (a, b) => difficultyRankMap[a.difficulty] - difficultyRankMap[b.difficulty]
);

export function getProblemById(id: string): Problem | undefined {
  return PROBLEMS.find((p) => p.id === id);
}
