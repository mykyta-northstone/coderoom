export type BlogCategory =
  | "javascript"
  | "typescript"
  | "coding-interviews"
  | "technical-interviews"
  | "code-review";

export interface BlogAuthor {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  publishedAt: string;
  updatedAt: string;
  author: BlogAuthor;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  content: string;
  relatedArticles: string[];
  relatedProblems: string[];
  faq?: FAQItem[];
  seoTitle: string;
  seoDescription: string;
}

export interface CategoryMeta {
  slug: BlogCategory;
  name: string;
  title: string;
  description: string;
  introHtml: string;
}

export const CATEGORIES: Record<BlogCategory, CategoryMeta> = {
  javascript: {
    slug: "javascript",
    name: "JavaScript",
    title: "JavaScript Interview Questions & Preparation Guides",
    description: "In-depth resources on JavaScript mechanics, event loop, closures, async patterns, and core algorithms.",
    introHtml: "Mastering modern JavaScript requires a deep understanding of runtime mechanics—from lexical closures and scope chains to microtask scheduling in the event loop. Explore our technical interview questions, coding exercises, and architectural guides tailored for engineering teams.",
  },
  typescript: {
    slug: "typescript",
    name: "TypeScript",
    title: "TypeScript Interview Questions & Type System Guides",
    description: "Master TypeScript type inference, discriminated unions, generic utility types, and live coding exercises.",
    introHtml: "TypeScript has become the default language for modern full-stack web applications. Our guides cover real-world type safety, conditional types, discriminated unions, generic utilities, and code review exercises to help engineering candidates and interviewers evaluate true TypeScript proficiency.",
  },
  "coding-interviews": {
    slug: "coding-interviews",
    name: "Coding Interviews",
    title: "Live Coding Interviews & Practical Problem Guides",
    description: "Best practices, problem lists, and scorecards for running zero-friction live coding interviews.",
    introHtml: "Practical live coding interviews should test real engineering capabilities—communication, problem solving, debugging, and code clarity—without candidate account friction or bloated subscription costs. Discover curated problem lists and interviewer scorecards.",
  },
  "technical-interviews": {
    slug: "technical-interviews",
    name: "Technical Interviews",
    title: "Technical Interviewing Frameworks & Senior Hiring",
    description: "Frameworks for evaluating software engineers, senior backend hiring, and building repeatable interview processes.",
    introHtml: "Scaling engineering organizations requires consistent, fair, and predictive technical interview frameworks. Learn how to distinguish memorization from authentic engineering talent across system design, API development, and data modeling.",
  },
  "code-review": {
    slug: "code-review",
    name: "Code Review",
    title: "Code Review Interviews: Exercises, Questions & Evaluation",
    description: "How to conduct realistic code review interviews that test code quality, security, performance, and architecture.",
    introHtml: "Code review interviews simulate actual day-to-day engineering better than traditional algorithm puzzles. Candidates analyze realistic pull requests containing concurrency bugs, security oversights, and TypeScript flaws.",
  },
};

const DEFAULT_AUTHOR: BlogAuthor = {
  name: "Pairlet Team",
  role: "Engineering & Technical Hiring",
};

export const ARTICLES: BlogArticle[] = [
  // --------------------------------------------------------------------------
  // ARTICLE 1: javascript/javascript-interview-questions
  // --------------------------------------------------------------------------
  {
    slug: "javascript-interview-questions",
    category: "javascript",
    title: "JavaScript Interview Questions: 25 Questions You Should Know",
    description: "Master the 25 essential JavaScript interview questions covering primitives, closures, event loop, promises, prototypes, and memory leaks with runnable code examples.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "16 min read",
    featured: true,
    tags: ["JavaScript", "Interview Questions", "Event Loop", "Closures", "Promises"],
    seoTitle: "JavaScript Interview Questions: 25 Questions You Should Know | Pairlet",
    seoDescription: "The definitive guide to 25 core JavaScript interview questions. Deep dives into scope, closures, event loop, promises, shallow vs deep copy, and memory management.",
    relatedArticles: [
      "javascript-coding-interview",
      "javascript-async-interview-questions",
      "javascript-closures-interview",
      "javascript-array-interview-questions",
    ],
    relatedProblems: ["valid-parentheses", "two-sum", "implement-debounce", "deep-clone"],
    faq: [
      {
        question: "What is the difference between primitives and reference types in JavaScript?",
        answer: "Primitive values (number, string, boolean, null, undefined, symbol, bigint) are immutable and stored directly by value. Objects, arrays, and functions are reference types, stored in memory as references; mutating a property alters all references pointing to that object.",
      },
      {
        question: "How does the JavaScript event loop handle microtasks vs macrotasks?",
        answer: "Microtasks (Promises, queueMicrotask, MutationObserver) are processed continuously until the microtask queue is empty after every task execution. Macrotasks (setTimeout, setInterval, setImmediate, I/O) are picked one at a time from the task queue after the microtask queue has drained completely.",
      },
    ],
    content: `
JavaScript interviews assess both foundational runtime knowledge and practical engineering problem-solving. Whether you are preparing for a senior frontend role or designing interview loops for your team, these 25 core questions cover the essential concepts every JavaScript engineer should master.

## 1. Primitives vs. Reference Types

JavaScript has 7 primitive types: \`string\`, \`number\`, \`bigint\`, \`boolean\`, \`undefined\`, \`symbol\`, and \`null\`. All primitives are immutable and passed by value.

Reference types (\`Object\`, \`Array\`, \`Function\`, \`Map\`, \`Set\`) are mutable and passed by reference:

\`\`\`javascript
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (primitives passed by value)

let obj1 = { name: "Alice" };
let obj2 = obj1;
obj2.name = "Bob";
console.log(obj1.name); // "Bob" (reference types share memory location)
\`\`\`

## 2. \`var\` vs \`let\` vs \`const\`

- **\`var\`**: Function-scoped, hoisted with \`undefined\` initialization, allows redeclaration.
- **\`let\`**: Block-scoped, hoisted but resides in the Temporal Dead Zone (TDZ) until evaluation, prevents redeclaration.
- **\`const\`**: Block-scoped, resides in TDZ, requires immediate initialization, prevents variable reassignment (though internal object properties remain mutable).

\`\`\`javascript
function scopeExample() {
  if (true) {
    var x = 1;
    let y = 2;
    const z = 3;
  }
  console.log(x); // 1
  // console.log(y); // ReferenceError: y is not defined
}
\`\`\`

## 3. Lexical Scope and Closures

A **closure** is the combination of a function bundled together with references to its surrounding state (lexical environment). Closures give inner functions access to outer function scope variables even after the outer function has returned.

\`\`\`javascript
function createCounter(initialValue = 0) {
  let count = initialValue;
  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    getValue() { return count; }
  };
}

const counter = createCounter(5);
console.log(counter.increment()); // 6
console.log(counter.getValue()); // 6
\`\`\`

## 4. Variable Hoisting & Temporal Dead Zone (TDZ)

Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope during execution context creation.

\`\`\`javascript
console.log(a); // undefined (var hoisted)
var a = 5;

// console.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)
let b = 10;
\`\`\`

## 5. Execution Context and the \`this\` Binding

The value of \`this\` is determined dynamically at call time (except for arrow functions, which inherit \`this\` lexically from their enclosing context):

1. **Implicit Binding**: \`obj.method()\` → \`this\` is \`obj\`.
2. **Explicit Binding**: \`fn.call(ctx)\`, \`fn.apply(ctx)\`, \`fn.bind(ctx)\`.
3. **New Binding**: \`new Constructor()\` → \`this\` is the newly created instance.
4. **Default Binding**: Plain function invocation → \`window\` (browser non-strict), \`undefined\` (strict mode).

## 6. Prototypes and Prototypal Inheritance

Every JavaScript object has an internal \`[[Prototype]]\` link to another object. Property lookups traverse up the prototype chain until the property is found or \`null\` is reached.

\`\`\`javascript
const animal = { eats: true };
const dog = Object.create(animal);
dog.bark = true;

console.log(dog.bark); // true (own property)
console.log(dog.eats); // true (inherited from animal prototype)
\`\`\`

## 7. Promises and Microtasks

A \`Promise\` represents the eventual completion or failure of an asynchronous operation. Promise resolution callbacks (\`.then()\`, \`.catch()\`, \`.finally()\`) are scheduled as **microtasks**.

## 8. \`async\` / \`await\` Syntax

Syntactic sugar built on top of Promises and Generators. An \`async\` function always returns a Promise. \`await\` pauses execution inside the function until the awaited Promise resolves or rejects.

\`\`\`javascript
async function fetchUserData(userId) {
  try {
    const res = await fetch(\`/api/users/\${userId}\`);
    if (!res.ok) throw new Error("User not found");
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch user:", err);
    throw err;
  }
}
\`\`\`

## 9. Event Loop: Microtasks vs Macrotasks

The Event Loop executes tasks in the following order:
1. Execute synchronous script in call stack.
2. Drain the **Microtask Queue** completely (Promise callbacks, \`queueMicrotask\`, \`MutationObserver\`).
3. Pick one task from the **Macrotask Queue** (\`setTimeout\`, \`setInterval\`, \`requestAnimationFrame\`, I/O).
4. Render UI updates if needed.
5. Repeat.

## 10. Map vs Filter vs Reduce

- **\`map\`**: Transforms every element, returning a new array of equal length.
- **\`filter\`**: Returns a new array containing elements that satisfy a predicate condition.
- **\`reduce\`**: Accumulates elements into a single value (number, object, or array).

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const doubledEvensSum = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .reduce((acc, curr) => acc + curr, 0); // (2*2) + (4*2) = 12
\`\`\`

## 11. Debounce Implementation

Debouncing ensures a function is not called until a specified delay has elapsed since its last invocation.

\`\`\`javascript
function debounce(fn, delayMs) {
  let timerId = null;
  return function (...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delayMs);
  };
}
\`\`\`
*Try the [Implement Debounce](https://www.pairlet.dev/problems/implement-debounce) coding problem live on Pairlet.*

## 12. Throttle Implementation

Throttling guarantees a function executes at most once per specified time interval.

\`\`\`javascript
function throttle(fn, intervalMs) {
  let lastExecTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastExecTime >= intervalMs) {
      lastExecTime = now;
      fn.apply(this, args);
    }
  };
}
\`\`\`

## 13. Shallow Copy vs. Deep Copy

- **Shallow Copy**: Copies top-level properties. Nested objects retain shared references (\`Object.assign()\`, spread operator \`{...obj}\`).
- **Deep Copy**: Recursively duplicates all nested objects and arrays (\`structuredClone()\`, custom recursive copy function).

\`\`\`javascript
const original = { a: 1, b: { c: 2 } };
const shallow = { ...original };
shallow.b.c = 99; // Alters original.b.c as well!

const deep = structuredClone(original);
deep.b.c = 42; // Independent copy
\`\`\`
*Practice implementing custom [Deep Clone](https://www.pairlet.dev/problems/deep-clone) in an interview session.*

## 14. Strict Equality (\`===\`) vs Loose Equality (\`==\`)

\`===\` checks equality without type coercion. \`==\` performs implicit type conversion before comparison, leading to subtle bugs:

\`\`\`javascript
0 == '0';   // true
0 === '0';  // false
null == undefined; // true
null === undefined; // false
\`\`\`

## 15. Destructuring & Rest / Spread Operators

Destructuring unpacks values from arrays or properties from objects into distinct variables. Rest (\`...\`) collects remaining properties, while spread expands iterables into elements.

\`\`\`javascript
const { name, ...details } = { name: "Pairlet", type: "Live Coding", price: 0 };
console.log(details); // { type: "Live Coding", price: 0 }
\`\`\`

## 16. ES Modules vs CommonJS

- **ES Modules (\`import\` / \`export\`)**: Static structure, evaluated at compile/parse time, supports tree-shaking, strict mode by default.
- **CommonJS (\`require()\` / \`module.exports\`)**: Dynamic loading, evaluated synchronously at runtime (Node.js legacy default).

## 17. Error Handling Best Practices

Always wrap asynchronous operations in \`try/catch\` blocks or attach \`.catch()\` handlers. Re-throw unhandled domain errors or wrap them in custom Error subclasses.

## 18. JavaScript Memory Leaks

Common causes of memory leaks in JavaScript applications:
1. Unexpected global variables.
2. Forgotten timers (\`setInterval\`) or unremoved event listeners.
3. Out-of-DOM references holding detached DOM nodes.
4. Unbound closures keeping large scopes alive.

## 19. Garbage Collection Mechanics

JavaScript engines use a **Mark-and-Sweep** algorithm. Starting from root references (\`globalThis\`, stack variables), the collector marks all reachable objects. Any unmarked objects are deemed unreachable and garbage collected.

## 20. Event Delegation

Event delegation leverages event bubbling to attach a single event listener to a parent element rather than attaching individual listeners to multiple child nodes.

\`\`\`javascript
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target && e.target.nodeName === "LI") {
    console.log("Clicked item:", e.target.textContent);
  }
});
\`\`\`

## 21. Currying

Currying transforms a function with multiple arguments into a sequence of nested functions that each accept a single argument.

\`\`\`javascript
const curry = (fn) =>
  function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...nextArgs) => curried.apply(this, args.concat(nextArgs));
  };

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
\`\`\`

## 22. Generator Functions & Iterators

Generators (\`function*\`) allow pausing and resuming function execution using the \`yield\` keyword, yielding sequence iterators on demand.

## 23. Concurrency in Single-Threaded JS

JavaScript achieves non-blocking concurrency despite being single-threaded by delegating asynchronous I/O (network requests, timers, file system ops) to the underlying system via Libuv (in Node) or Web APIs (in browsers).

## 24. \`Object.freeze()\` vs \`Object.seal()\`

- **\`Object.freeze()\`**: Prevents adding, deleting, or modifying existing property values (shallow immutability).
- **\`Object.seal()\`**: Prevents adding or deleting properties, but allows modifying existing property values.

## 25. Symbol & WeakMap / WeakSet

- **\`Symbol\`**: Guaranteed unique primitive identifier, ideal for non-colliding object property keys.
- **\`WeakMap\` / \`WeakSet\`**: Holds weak references to key objects, allowing key objects to be garbage-collected if no other references exist.

---

### Practice JavaScript Interviews Live
Are you evaluating JavaScript candidates or preparing for an upcoming technical loop? You can practice coding problems live in a zero-setup collaborative editor. [Create a free Pairlet interview room](https://www.pairlet.dev/interview/new) or explore our [coding problem library](https://www.pairlet.dev/problems).
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 2: javascript/javascript-coding-interview
  // --------------------------------------------------------------------------
  {
    slug: "javascript-coding-interview",
    category: "javascript",
    title: "JavaScript Coding Interview: What to Expect and How to Prepare",
    description: "A comprehensive guide to JavaScript coding interviews. Learn how interviewers evaluate candidates across algorithms, async utility building, code quality, and live communication.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "14 min read",
    tags: ["JavaScript", "Coding Interview", "Interview Preparation", "Algorithms", "Code Quality"],
    seoTitle: "JavaScript Coding Interview Guide: What to Expect & How to Prepare | Pairlet",
    seoDescription: "Learn what happens in a live JavaScript coding interview. Step-by-step breakdown of algorithm challenges, async utility exercises, code quality metrics, and candidate scorecards.",
    relatedArticles: [
      "javascript-interview-questions",
      "javascript-async-interview-questions",
      "live-coding-interview",
      "coding-interview-problems",
    ],
    relatedProblems: ["two-sum", "valid-parentheses", "implement-debounce"],
    faq: [
      {
        question: "What is expected during a 45-minute live JavaScript coding interview?",
        answer: "Typically, 5 minutes of introductions, 30-35 minutes of live problem solving and code implementation in a shared editor, and 5-10 minutes for candidate questions. Interviewers evaluate communication, problem decomposition, code correctness, and handling edge cases.",
      },
    ],
    content: `
A live JavaScript coding interview tests how you write, debug, and discuss code in real time under realistic workplace conditions. Rather than memorizing niche syntax tricks, top engineering teams evaluate your analytical problem decomposition, code readability, and mastery of core JavaScript runtime concepts.

## What Happens During a JavaScript Coding Interview?

A standard 45-to-60-minute technical interview typically follows a four-phase structure:

1. **Introduction & Context (5 mins)**: Brief setup, technical background check, and introduction to the collaborative interview environment.
2. **Problem Presentation & Clarification (5 mins)**: The interviewer shares the problem statement. Candidates ask clarifying questions about inputs, outputs, constraints, and edge cases.
3. **Live Coding & Communication (30 mins)**: You talk through your approach, outline data structures, write clean JavaScript/TypeScript, and test your logic against sample cases.
4. **Debrief & Candidate Questions (5-10 mins)**: Time for you to ask about team culture, engineering practices, and tech stack decisions.

## Common Types of JavaScript Coding Tasks

### 1. Algorithm & Data Structure Problems
Evaluating time and space complexity using core data structures (arrays, hash maps, queues, stacks). Example: [Two Sum](https://www.pairlet.dev/problems/two-sum) or [Valid Parentheses](https://www.pairlet.dev/problems/valid-parentheses).

### 2. Async & Concurrency Utility Implementation
Testing your understanding of Promises, event loop microtasks, and control flow. Tasks include building \`Promise.all\`, [Debounce](https://www.pairlet.dev/problems/implement-debounce), [Throttle](https://www.pairlet.dev/problems/implement-throttle), or a [Concurrency Limiter](https://www.pairlet.dev/problems/concurrency-limiter).

### 3. Object & Array Manipulation
Flattening deeply nested structures, implementing [Deep Clone](https://www.pairlet.dev/problems/deep-clone), or writing custom grouping/reduction helpers.

## Key Evaluation Criteria

Interviewers use explicit scorecards to assess four dimensions:

- **Problem Solving & Logic**: Can you break down a complex requirement into incremental, solvable steps?
- **JavaScript Mechanics**: Do you understand immutability, closures, asynchronous control flow, and ES6+ standards?
- **Code Quality & Readability**: Is your variable naming descriptive? Is the function structure modular and easy to test?
- **Communication & Collaboration**: Do you explain your thought process aloud before writing code? How do you react to interviewer hints?

## Common Mistakes to Avoid

1. **Coding before explaining**: Jumping straight to code without explaining your planned algorithm to the interviewer.
2. **Ignoring edge cases**: Forgetting to test empty inputs (\`null\`, \`undefined\`, \`[]\`), boundary values, or negative numbers.
3. **Silent debugging**: When encountering a bug or failing test, going quiet instead of explaining what you are observing and hypothesis testing aloud.
4. **Mutating input parameters unexpectedly**: Mutating caller arguments directly instead of returning fresh values.

## Practice a JavaScript Interview Live

Whether you are practicing with a peer or running interviews for your company, conducting sessions in a clean, zero-signup collaborative environment builds confidence.

[Create a Free Pairlet Interview Room](https://www.pairlet.dev/interview/new) — instant setup, real-time Monaco editor, and code execution.
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 3: javascript/javascript-async-interview-questions
  // --------------------------------------------------------------------------
  {
    slug: "javascript-async-interview-questions",
    category: "javascript",
    title: "15 JavaScript Async Interview Questions",
    description: "Deep dive into 15 asynchronous JavaScript interview questions covering Event Loop, Promises, async/await, Promise.all, race conditions, and AbortController.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "15 min read",
    tags: ["JavaScript", "Async", "Promises", "Event Loop", "Concurrency"],
    seoTitle: "15 JavaScript Async Interview Questions & Answers | Pairlet",
    seoDescription: "Master asynchronous JavaScript interview questions. Detailed code walkthroughs for Promise combinators, microtasks, event loop, concurrency limiters, and cancellation.",
    relatedArticles: [
      "javascript-interview-questions",
      "javascript-coding-interview",
      "javascript-closures-interview",
    ],
    relatedProblems: ["implement-promise-all", "concurrency-limiter", "implement-debounce"],
    faq: [
      {
        question: "What is the main difference between Promise.all and Promise.allSettled?",
        answer: "Promise.all rejects immediately if any input promise rejects (fail-fast behavior). Promise.allSettled waits for all input promises to either resolve or reject, returning an array of outcome objects with status and value/reason.",
      },
    ],
    content: `
Asynchronous programming is central to modern JavaScript and TypeScript development. Interviewers frequently probe candidate knowledge of the event loop, promise resolution order, error handling, and concurrency primitives. Here are 15 essential async questions with runnable code solutions.

## 1. Trace the Output: Call Stack, Promises, and SetTimeout

\`\`\`javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

queueMicrotask(() => console.log("4"));

console.log("5");
// Output: 1, 5, 3, 4, 2
\`\`\`
**Explanation**: Synchronous code (\`1\`, \`5\`) runs first. Next, the microtask queue drains completely (\`3\`, \`4\`). Finally, the macrotask callback (\`2\`) executes.

## 2. Implement \`Promise.all\` from Scratch

\`\`\`javascript
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }
    
    const results = [];
    let completedCount = 0;
    
    if (promises.length === 0) {
      return resolve([]);
    }

    promises.forEach((item, index) => {
      Promise.resolve(item)
        .then((val) => {
          results[index] = val;
          completedCount++;
          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(reject); // Fail fast on first rejection
    });
  });
}
\`\`\`
*Practice [Implement Promise.all](https://www.pairlet.dev/problems/implement-promise-all) live on Pairlet.*

## 3. Compare Promise Combinators

- **\`Promise.all([p1, p2])\`**: Resolves when ALL resolve, rejects if ANY rejects.
- **\`Promise.allSettled([p1, p2])\`**: Resolves when ALL settle (fulfilled or rejected).
- **\`Promise.race([p1, p2])\`**: Settles as soon as the FIRST promise settles.
- **\`Promise.any([p1, p2])\`**: Resolves as soon as the FIRST promise fulfills; rejects if ALL reject.

## 4. Sequential vs. Parallel Execution with \`async/await\`

\`\`\`javascript
// Sequential (takes ~2 seconds total)
async function fetchSequential() {
  const res1 = await fetchItem(1); // 1s
  const res2 = await fetchItem(2); // 1s
  return [res1, res2];
}

// Parallel (takes ~1 second total)
async function fetchParallel() {
  const p1 = fetchItem(1);
  const p2 = fetchItem(2);
  return await Promise.all([p1, p2]);
}
\`\`\`

## 5. Implement a Concurrency Limiter (Task Pool)

Limit the number of active concurrent promise executions to \`maxConcurrency\`.

\`\`\`javascript
async function mapConcurrent(items, limit, asyncFn) {
  const results = [];
  const executing = new Set();

  for (const [index, item] of items.entries()) {
    const p = Promise.resolve().then(() => asyncFn(item, index));
    results[index] = p;
    executing.add(p);

    const clean = () => executing.delete(p);
    p.then(clean, clean);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}
\`\`\`
*Try the [Concurrency Limiter](https://www.pairlet.dev/problems/concurrency-limiter) live problem on Pairlet.*

## 6. How to Cancel an In-Flight Async Request?

Use the browser-native **\`AbortController\`**:

\`\`\`javascript
const controller = new AbortController();

fetch('/api/data', { signal: controller.signal })
  .then(res => res.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Request was cancelled');
    }
  });

// Cancel the request
controller.abort();
\`\`\`

## 7. Retrying Failed Promises with Exponential Backoff

\`\`\`javascript
async function fetchWithRetry(fn, retries = 3, delayMs = 500) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(r => setTimeout(r, delayMs));
    return fetchWithRetry(fn, retries - 1, delayMs * 2);
  }
}
\`\`\`

---

### Practice Async Live Coding
Ready to test async problems live? [Create a free Pairlet interview room](https://www.pairlet.dev/interview/new) to collaborate in real time with candidates.
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 4: javascript/javascript-closures-interview
  // --------------------------------------------------------------------------
  {
    slug: "javascript-closures-interview",
    category: "javascript",
    title: "JavaScript Closures Explained for Coding Interviews",
    description: "Understand JavaScript closures, lexical scope, private state, factory functions, loop gotchas, and memory considerations with step-by-step interview exercises.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "12 min read",
    tags: ["JavaScript", "Closures", "Scope", "Memory", "Coding Interview"],
    seoTitle: "JavaScript Closures Explained for Coding Interviews | Pairlet",
    seoDescription: "Master closures for technical interviews. Learn lexical scope mechanics, private state patterns, factory functions, loop binding bugs, and memory leak prevention.",
    relatedArticles: [
      "javascript-interview-questions",
      "javascript-array-interview-questions",
      "javascript-coding-interview",
    ],
    relatedProblems: ["memoize", "currying", "implement-debounce"],
    faq: [
      {
        question: "What is a closure in simple terms?",
        answer: "A closure is a function that remembers and accesses variables from its outer lexical scope even after that outer function has finished executing.",
      },
    ],
    content: `
Closures are one of the most frequently tested concepts in JavaScript technical interviews. Understanding how closures work under the hood helps candidates write cleaner stateful functions and spot memory retention bugs.

## What is a Closure?

A **closure** is created whenever a function is defined inside another function, granting the inner function access to the outer function's variable environment (lexical scope).

\`\`\`javascript
function outerFunction(outerVariable) {
  return function innerFunction(innerVariable) {
    console.log(\`Outer: \${outerVariable}, Inner: \${innerVariable}\`);
  };
}

const closureFn = outerFunction("Hello");
closureFn("World"); // Outer: Hello, Inner: World
\`\`\`

## Practical Applications of Closures

### 1. Private State & Data Encapsulation
Before ES6 private class fields (\`#private\`), closures were the primary mechanism for creating private variables.

\`\`\`javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private state
  
  return {
    deposit(amount) {
      if (amount > 0) balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return balance;
      }
      return "Insufficient funds";
    },
    getBalance() {
      return balance;
    }
  };
}
\`\`\`

### 2. Function Memoization
Closures allow caching expensive function call results based on input parameters.

\`\`\`javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
\`\`\`
*Practice the [Memoize](https://www.pairlet.dev/problems/memoize) coding task on Pairlet.*

## Classic Interview Loop Gotcha

What does the following code log?

\`\`\`javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Logs: 3, 3, 3
\`\`\`

**Why?** \`var\` is function-scoped. All three callbacks share the exact same \`i\` reference, which is \`3\` by the time the timers fire.

### Fix 1: Use \`let\` (Block Scope)
\`\`\`javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
} // Logs: 0, 1, 2
\`\`\`

### Fix 2: Create a Closure via IIFE
\`\`\`javascript
for (var i = 0; i < 3; i++) {
  ((index) => {
    setTimeout(() => console.log(index), 100);
  })(i);
} // Logs: 0, 1, 2
\`\`\`

---

### Practice Closure Problems Live
Collaborate with candidates live on stateful closure exercises. [Create a free Pairlet interview room](https://www.pairlet.dev/interview/new).
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 5: javascript/javascript-array-interview-questions
  // --------------------------------------------------------------------------
  {
    slug: "javascript-array-interview-questions",
    category: "javascript",
    title: "JavaScript Array Interview Questions: 15 Coding Problems",
    description: "Practice 15 essential JavaScript array coding problems including Two Sum, flatten, deduplication, chunking, and custom array utilities with optimal time complexity.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "16 min read",
    tags: ["JavaScript", "Arrays", "Coding Problems", "Two Sum", "Algorithms"],
    seoTitle: "15 JavaScript Array Interview Questions & Coding Problems | Pairlet",
    seoDescription: "Solve 15 JavaScript array interview problems. Step-by-step solutions for Two Sum, array flattening, deduplication, chunking, group by, and custom utilities.",
    relatedArticles: [
      "javascript-interview-questions",
      "javascript-coding-interview",
      "coding-interview-problems",
    ],
    relatedProblems: ["two-sum", "flatten-array", "group-by", "three-sum"],
    faq: [
      {
        question: "How do you optimize array lookup from O(N) to O(1)?",
        answer: "By creating a hash map (object or Map) to store elements or frequency counts as keys, allowing constant time O(1) lookups during iteration.",
      },
    ],
    content: `
Arrays are the primary data structure tested in JavaScript coding interviews. Mastering array manipulation methods (\`map\`, \`filter\`, \`reduce\`, \`slice\`, \`splice\`) and hash map optimization strategies enables candidates to solve complex data processing tasks efficiently.

## 1. Two Sum Problem (O(N) Time Complexity)

Given an array of numbers and a target sum, return the indices of the two numbers that add up to the target.

\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
\`\`\`
*Try [Two Sum](https://www.pairlet.dev/problems/two-sum) live on Pairlet.*

## 2. Flatten a Nested Array

Implement a function to recursively flatten an array up to a specified depth.

\`\`\`javascript
function flatten(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...flatten(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}
\`\`\`
*Practice [Flatten Array](https://www.pairlet.dev/problems/flatten-array) on Pairlet.*

## 3. Array Deduplication (Unique Values)

\`\`\`javascript
// Primitive values
const uniqueNumbers = (arr) => [...new Set(arr)];

// Object values by property key
function uniqueBy(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}
\`\`\`

## 4. Group Array Elements by Key (\`groupBy\`)

\`\`\`javascript
function groupBy(array, keyFn) {
  return array.reduce((result, item) => {
    const key = typeof keyFn === "function" ? keyFn(item) : item[keyFn];
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {});
}
\`\`\`
*Try [Group By](https://www.pairlet.dev/problems/group-by) on Pairlet.*

## 5. Chunk an Array into Sub-Arrays

\`\`\`javascript
function chunk(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}
\`\`\`

---

### Run Array Coding Tasks Live
Conduct live technical interviews with instant code execution. [Create a free Pairlet interview room](https://www.pairlet.dev/interview/new).
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 6: typescript/typescript-interview-questions
  // --------------------------------------------------------------------------
  {
    slug: "typescript-interview-questions",
    category: "typescript",
    title: "TypeScript Interview Questions: 25 Questions for Developers",
    description: "25 core TypeScript interview questions covering interface vs type, generics, utility types, mapped types, discriminated unions, type guards, and strict mode.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "18 min read",
    featured: true,
    tags: ["TypeScript", "Type System", "Interview Questions", "Generics", "Type Guards"],
    seoTitle: "TypeScript Interview Questions: 25 Questions for Developers | Pairlet",
    seoDescription: "The complete guide to 25 TypeScript interview questions. Master types vs interfaces, generics, discriminated unions, conditional types, and strict mode.",
    relatedArticles: [
      "typescript-coding-interview",
      "typescript-generics-interview",
      "javascript-interview-questions",
    ],
    relatedProblems: ["bad-typescript-design", "valid-parentheses"],
    faq: [
      {
        question: "What is the key difference between type aliases and interfaces in TypeScript?",
        answer: "Interfaces support declaration merging and are optimized for object shape extension. Type aliases are more versatile, supporting unions, primitives, tuples, and mapped types.",
      },
    ],
    content: `
TypeScript is the standard for modern web application engineering. Evaluating a developer's TypeScript skills requires assessing their mastery of the compile-time type system, type safety patterns, and generic utilities.

## 1. \`type\` Alias vs \`interface\`

- **\`interface\`**: Best for object shapes and class contracts. Supports declaration merging (re-opening interfaces across files).
- **\`type\`**: Alias for any type (primitives, unions, tuples, functions, objects). Does not support declaration merging.

\`\`\`typescript
interface User {
  id: string;
  name: string;
}

type UserWithRole = User & { role: "admin" | "member" };
\`\`\`

## 2. Discriminated Unions (Tagged Unions)

Discriminated unions use a common literal property key to enable exhaustive type checking by the compiler.

\`\`\`typescript
type NetworkState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: Error };

function renderState(state: NetworkState) {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return \`Data items: \${state.data.join(", ")}\`;
    case "error":
      return \`Error: \${state.error.message}\`;
  }
}
\`\`\`

## 3. Built-in Utility Types

- **\`Partial<T>\`**: Makes all properties optional.
- **\`Required<T>\`**: Makes all properties required.
- **\`Readonly<T>\`**: Makes all properties readonly.
- **\`Pick<T, K>\`**: Selects a subset of properties \`K\` from \`T\`.
- **\`Omit<T, K>\`**: Removes properties \`K\` from \`T\`.
- **\`Record<K, T>\`**: Constructs an object type with keys \`K\` and values \`T\`.

## 4. Custom Type Guards (\`is\` Keyword)

Type guards provide runtime checks that narrow types within conditional blocks.

\`\`\`typescript
function isString(val: unknown): val is string {
  return typeof val === "string";
}

function processInput(input: unknown) {
  if (isString(input)) {
    console.log(input.toUpperCase()); // TypeScript knows input is string
  }
}
\`\`\`

## 5. \`unknown\` vs \`any\` vs \`never\`

- **\`any\`**: Disables all type checking. Avoid in production code.
- **\`unknown\`**: Type-safe counterpart to \`any\`. Requires type checking before property access or invocation.
- **\`never\`**: Represents values that can never occur (e.g. function that throws or infinite loop).

---

### Practice TypeScript Interviews Live
Evaluate TypeScript candidates in a real-time collaborative Monaco environment with instant compilation. [Create a free Pairlet interview room](https://www.pairlet.dev/interview/new).
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 7: typescript/typescript-coding-interview
  // --------------------------------------------------------------------------
  {
    slug: "typescript-coding-interview",
    category: "typescript",
    title: "TypeScript Coding Interview: 12 Problems to Practice",
    description: "12 practical TypeScript coding interview exercises with solutions, including typed event emitters, Result types, deep readonly, and code review scenarios.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "15 min read",
    tags: ["TypeScript", "Coding Interview", "Generics", "Type Safety", "Code Review"],
    seoTitle: "12 TypeScript Coding Interview Problems & Exercises | Pairlet",
    seoDescription: "Practice 12 real-world TypeScript coding interview problems. Code solutions for typed EventEmitters, Result types, DeepReadonly, typed debounce, and code review exercises.",
    relatedArticles: [
      "typescript-interview-questions",
      "typescript-generics-interview",
      "code-review-interview",
    ],
    relatedProblems: ["bad-typescript-design", "event-emitter", "implement-debounce"],
    faq: [
      {
        question: "Why test TypeScript specific problems instead of plain JavaScript?",
        answer: "TypeScript coding problems evaluate how candidates construct maintainable type contracts, avoid 'any' escape hatches, handle nullability, and model domain data accurately at compile time.",
      },
    ],
    content: `
Evaluating TypeScript proficiency requires going beyond simple JavaScript algorithms with added type annotations. Strong candidates demonstrate type-safe design patterns, zero unnecessary \`any\` usage, and proper generic constraints.

## Problem 1: Strongly Typed Event Emitter

Implement a type-safe event emitter where event names map to expected payload argument types.

\`\`\`typescript
type EventMap = Record<string, any>;

class TypedEventEmitter<Events extends EventMap> {
  private listeners: { [K in keyof Events]?: Array<(payload: Events[K]) => void> } = {};

  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach(cb => cb(payload));
    }
  }
}

// Usage Example:
interface AppEvents {
  userLogin: { userId: string; timestamp: number };
  error: { message: string };
}

const emitter = new TypedEventEmitter<AppEvents>();
emitter.on("userLogin", (data) => console.log(data.userId));
// emitter.emit("userLogin", { userId: 123 }); // Error: Type number is not assignable to string
\`\`\`
*Try the [Event Emitter](https://www.pairlet.dev/problems/event-emitter) exercise live on Pairlet.*

## Problem 2: Type-Safe Result Union (\`Result<T, E>\`)

Model success and error outcomes without relying on thrown exceptions.

\`\`\`typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
\`\`\`

## Problem 3: \`DeepReadonly<T>\` Utility Type

\`\`\`typescript
type DeepReadonly<T> = T extends Function
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
\`\`\`

## Problem 4: TypeScript Code Review Challenge

Spot the anti-patterns in the following snippet:

\`\`\`typescript
// Flawed implementation:
async function fetchUser(id: any): Promise<any> {
  const res = await fetch(\`/users/\${id}\`);
  const data = await res.json();
  return data as any;
}
\`\`\`

**Issues**: Heavy reliance on \`any\`, lack of error boundary check on \`res.ok\`, and unsafe type assertions.
*Explore the [Bad TypeScript Design](https://www.pairlet.dev/problems/bad-typescript-design) code review problem on Pairlet.*

---

### Practice TypeScript Interviews
Run TypeScript coding interviews in a collaborative browser workspace with real-time feedback. [Create a free Pairlet interview room](https://www.pairlet.dev/interview/new).
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 8: typescript/typescript-generics-interview
  // --------------------------------------------------------------------------
  {
    slug: "typescript-generics-interview",
    category: "typescript",
    title: "TypeScript Generics: Interview Questions and Practical Examples",
    description: "Master TypeScript generics for technical interviews. Learn generic constraints, keyof lookups, inference, conditional types, and common generic utility implementations.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "13 min read",
    tags: ["TypeScript", "Generics", "Type System", "Conditional Types", "Interview Preparation"],
    seoTitle: "TypeScript Generics: Interview Questions & Examples | Pairlet",
    seoDescription: "Comprehensive guide to TypeScript generics in coding interviews. Practical examples of generic constraints, keyof infer, mapped types, and generic functions.",
    relatedArticles: [
      "typescript-interview-questions",
      "typescript-coding-interview",
      "javascript-interview-questions",
    ],
    relatedProblems: ["group-by", "memoize", "event-emitter"],
    faq: [
      {
        question: "Why are generics essential in TypeScript?",
        answer: "Generics allow developers to create reusable, type-safe components and functions that work across multiple data types while preserving full compile-time type information without resorting to 'any'.",
      },
    ],
    content: `
Generics provide the foundation for reusable type-safe libraries in TypeScript. Interview questions often evaluate whether candidates can write parameterized functions, enforce constraints using \`extends\`, and infer return types dynamically.

## What Are Generics?

Generics enable functions, interfaces, and classes to accept type parameters:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const num = identity(42);       // Inferred as number
const str = identity("hello");  // Inferred as string
\`\`\`

## Generic Constraints (\`extends\`)

Restrict accepted type arguments using the \`extends\` keyword:

\`\`\`typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): number {
  console.log(item.length);
  return item.length;
}

logLength("hello"); // OK (strings have .length)
logLength([1, 2, 3]); // OK (arrays have .length)
// logLength(123); // Error: Argument of type 'number' is not assignable to 'HasLength'
\`\`\`

## Combining Generics with \`keyof\`

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice", active: true };
const name = getProperty(user, "name"); // Inferred as string
// const invalid = getProperty(user, "foo"); // Error: Argument of type '"foo"' is not assignable to keyof user
\`\`\`

---

### Test TypeScript Skills Live
[Create a free Pairlet interview room](https://www.pairlet.dev/interview/new) to practice live generic exercises with candidates.
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 9: coding-interviews/live-coding-interview
  // --------------------------------------------------------------------------
  {
    slug: "live-coding-interview",
    category: "coding-interviews",
    title: "Live Coding Interviews: A Practical Guide for Interviewers",
    description: "Learn how to conduct effective, fair live coding interviews. Includes problem selection criteria, hint strategies, candidate scorecards, and remote interview tips.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "14 min read",
    featured: true,
    tags: ["Coding Interviews", "Interviewer Guide", "Live Coding", "Hiring Framework"],
    seoTitle: "Live Coding Interviews: A Practical Guide for Interviewers | Pairlet",
    seoDescription: "The definitive guide to running live coding interviews. How to select practical problems, structure 45-minute sessions, evaluate candidate communication, and reduce candidate friction.",
    relatedArticles: [
      "remote-coding-interview",
      "coding-interview-problems",
      "technical-interview-questions",
      "code-review-interview",
    ],
    relatedProblems: ["two-sum", "valid-parentheses", "n-plus-1-queries"],
    faq: [
      {
        question: "How do you prevent live coding interviews from stressing candidates unnecessarily?",
        answer: "Use practical, realistic problem statements rather than obscure competitive math puzzles. Avoid requiring account signups, ensure a collaborative atmosphere where the interviewer acts as a pair programmer, and allow candidates to use standard documentation.",
      },
    ],
    content: `
Live coding interviews are among the most predictive signals in technical hiring when conducted properly. However, poorly structured live sessions can descend into artificial pressure cookers that measure stress tolerance rather than real-world engineering competency.

## The Goal of a Live Coding Interview

The primary objective of a live interview is to observe how a candidate solves problems collaboratively:

- **Thought Process**: How do they break down ambiguous requirements into manageable code steps?
- **Code Quality**: Is their code clean, organized, and properly structured?
- **Debugging Ability**: How systematically do they trace errors and evaluate test outputs?
- **Receptivity to Feedback**: How do they respond when you provide hints or suggest alternative edge cases?

## Recommended 45-Minute Interview Structure

| Time | Phase | Focus |
|---|---|---|
| **0-5m** | Setup & Welcome | Introductions, environment setup, establishing a friendly tone. |
| **5-10m** | Problem Framing | Sharing problem prompt, clarifying requirements, input/output limits. |
| **10-35m** | Collaborative Coding | Live coding, discussing tradeoffs, testing against sample inputs. |
| **35-40m** | Complexity & Refactoring | Discussing Big-O time/space complexity and potential optimizations. |
| **40-45m** | Candidate Q&A | Answering candidate questions about team tech stack and culture. |

## 5 Rules for Selecting Coding Problems

1. **Avoid Trick Algorithms**: Avoid niche puzzle problems that require a single specific mathematical trick to solve.
2. **Focus on Core Fundamentals**: Select problems involving arrays, strings, hash maps, promises, or code review.
3. **Ensure Multiple Solution Levels**: The problem should have a quick baseline solution (e.g. O(N²) brute force) and an optimal refactor (e.g. O(N) hash map).
4. **Keep Prompt Descriptions Concise**: Candidates should spend their time coding, not reading 3 pages of domain specifications.
5. **Provide Pre-populated Test Inputs**: Give candidates sample input data to run and verify immediately.

## Interviewer Evaluation Scorecard

Evaluate candidates across four standardized criteria:

- **Problem Solving (1-4)**: Systematic analysis, handling edge cases, algorithmic efficiency.
- **Technical Execution (1-4)**: Fluency in language syntax, clean modular code structure.
- **Communication (1-4)**: Clear articulation of ideas, thinking aloud, asking clarifying questions.
- **Collaboration (1-4)**: Working effectively with the interviewer as a pair programmer.

## Zero-Friction Live Coding with Pairlet

Traditional interview tools force candidates to register accounts, solve email verification captchas, or pay bloated subscription fees. 

**Pairlet** provides instant, free live coding rooms with zero candidate sign-up:

- Click **Create Interview Room**.
- Send the shareable room link to the candidate.
- Code together in real time with shared execution and console output.

[Create a Free Pairlet Interview Room Now](https://www.pairlet.dev/interview/new)
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 10: coding-interviews/coding-interview-problems
  // --------------------------------------------------------------------------
  {
    slug: "coding-interview-problems",
    category: "coding-interviews",
    title: "20 Coding Interview Problems for JavaScript Developers",
    description: "A curated list of 20 practical coding interview problems covering arrays, strings, hash maps, promises, stacks, and code review with difficulty ratings.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "15 min read",
    tags: ["Coding Interviews", "Coding Problems", "JavaScript", "Algorithms", "Practice"],
    seoTitle: "20 Coding Interview Problems for JavaScript Developers | Pairlet",
    seoDescription: "Explore 20 curated coding interview problems for JavaScript and TypeScript engineers. Complete with difficulty ratings, concept overviews, and live editor links.",
    relatedArticles: [
      "live-coding-interview",
      "javascript-array-interview-questions",
      "javascript-async-interview-questions",
    ],
    relatedProblems: [
      "valid-parentheses",
      "two-sum",
      "reverse-linked-list",
      "implement-debounce",
      "lru-cache",
    ],
    faq: [
      {
        question: "What categories of coding problems should I prepare for JavaScript roles?",
        answer: "Focus on Array & Hash Map manipulation, String parsing, Stack matching, Async Promises/Control Flow, and Code Review bug detection.",
      },
    ],
    content: `
Preparing for JavaScript technical interviews requires practicing problems across core data structures and asynchronous runtime mechanics. Here is a curated collection of 20 essential coding interview problems categorized by topic.

## Array & Hash Map Problems

### 1. Two Sum
- **Difficulty**: Easy
- **Tests**: Hash map lookup, O(N) time complexity optimization.
- **Description**: Given an array of integers \`nums\` and a target integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
- *Practice [Two Sum](https://www.pairlet.dev/problems/two-sum) on Pairlet.*

### 2. Three Sum
- **Difficulty**: Medium
- **Tests**: Two-pointer techniques, sorting, deduplication.
- **Description**: Find all unique triplets in an array that sum up to zero.
- *Practice [Three Sum](https://www.pairlet.dev/problems/three-sum) on Pairlet.*

### 3. Group By Utility
- **Difficulty**: Easy / Medium
- **Tests**: Array reduction, higher-order functions, object key grouping.
- *Practice [Group By](https://www.pairlet.dev/problems/group-by) on Pairlet.*

## String & Stack Problems

### 4. Valid Parentheses
- **Difficulty**: Easy
- **Tests**: Stack data structures, bracket balance validation.
- **Description**: Determine if a string containing bracket characters \`()\`, \`{}\`, \`[]\` is valid and properly ordered.
- *Practice [Valid Parentheses](https://www.pairlet.dev/problems/valid-parentheses) on Pairlet.*

### 5. Longest Substring Without Repeating Characters
- **Difficulty**: Medium
- **Tests**: Sliding window technique, Set / Map tracking.
- *Practice [Longest Substring Without Repeating Characters](https://www.pairlet.dev/problems/longest-substring-without-repeating-characters) on Pairlet.*

## Async & Control Flow Problems

### 6. Implement Debounce
- **Difficulty**: Easy / Medium
- **Tests**: Closures, timer management (\`setTimeout\`, \`clearTimeout\`).
- *Practice [Implement Debounce](https://www.pairlet.dev/problems/implement-debounce) on Pairlet.*

### 7. Implement Throttle
- **Difficulty**: Medium
- **Tests**: Timestamp tracking, rate limiting.
- *Practice [Implement Throttle](https://www.pairlet.dev/problems/implement-throttle) on Pairlet.*

### 8. Implement Promise.all
- **Difficulty**: Medium
- **Tests**: Promise constructor, asynchronous coordination.
- *Practice [Implement Promise.all](https://www.pairlet.dev/problems/implement-promise-all) on Pairlet.*

### 9. Concurrency Limiter
- **Difficulty**: Hard
- **Tests**: Queue management, promise batching.
- *Practice [Concurrency Limiter](https://www.pairlet.dev/problems/concurrency-limiter) on Pairlet.*

## Code Review Problems

### 10. N+1 Query Fix
- **Difficulty**: Medium
- **Tests**: Identifying database N+1 performance anti-patterns.
- *Practice [N+1 Queries](https://www.pairlet.dev/problems/n-plus-1-queries) on Pairlet.*

---

### Practice Coding Problems Live
Try any of these problems live in a free collaborative interview room with candidates. [Explore All Pairlet Problems](https://www.pairlet.dev/problems).
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 11: technical-interviews/technical-interview-questions
  // --------------------------------------------------------------------------
  {
    slug: "technical-interview-questions",
    category: "technical-interviews",
    title: "Technical Interview Questions: How to Evaluate Software Engineers",
    description: "A comprehensive framework for evaluating software engineers across problem solving, system architecture, code quality, and debugging skill.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "15 min read",
    tags: ["Technical Interviews", "Interviewer Guide", "Engineering Evaluation", "Hiring"],
    seoTitle: "Technical Interview Questions: How to Evaluate Software Engineers | Pairlet",
    seoDescription: "Learn how to conduct objective technical interviews. Questions and evaluation strategies to distinguish memorization from real engineering expertise across system design and coding.",
    relatedArticles: [
      "senior-backend-interview-questions",
      "live-coding-interview",
      "code-review-interview",
    ],
    relatedProblems: ["n-plus-1-queries", "async-error-handling"],
    faq: [
      {
        question: "How do you distinguish memorized solutions from authentic engineering ability?",
        answer: "Ask candidates to modify their constraints mid-interview (e.g. 'What if data exceeds memory?' or 'What if network calls fail dynamically?'). Authentic engineers quickly adjust their design trade-offs.",
      },
    ],
    content: `
Building high-performing engineering teams requires an objective, structured technical interview process. The goal of a technical interview is not to stump candidates with trivia, but to evaluate their practical engineering trade-offs, problem decomposition, and system design capability.

## The 4 Pillars of Technical Evaluation

1. **Problem Solving & Decomposition**: How systematically does a candidate convert ambiguous user requirements into concrete code logic?
2. **System Architecture & Data Modeling**: Can the candidate design reliable, scalable API contracts and database schemas?
3. **Debugging & Resilience**: How does the candidate handle unexpected edge cases, network failures, and race conditions?
4. **Code Maintainability & Communication**: Is the written code clean, self-documenting, and easy for peers to modify?

## High-Signal Interview Questions & Focus Areas

### 1. API Design & Data Contracts
- *Question*: "How do you design an idempotent payment endpoint?"
- *What to look for*: Understanding of idempotency keys, atomic database transactions, and handling network timeouts.

### 2. State & Concurrency Control
- *Question*: "What happens when two users attempt to update the same record simultaneously?"
- *What to look for*: Knowledge of optimistic locking (\`version\` fields) vs pessimistic locking (\`SELECT FOR UPDATE\`).

### 3. Debugging Real-World Anti-Patterns
Provide candidates with a realistic pull request containing performance or security bugs (e.g., [N+1 Queries](https://www.pairlet.dev/problems/n-plus-1-queries)). Observe how quickly they identify bottlenecks.

---

### Conduct Live Technical Interviews
Evaluate candidates in a collaborative live environment. [Create a free Pairlet interview room](https://www.pairlet.dev/interview/new).
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 12: technical-interviews/senior-backend-interview-questions
  // --------------------------------------------------------------------------
  {
    slug: "senior-backend-interview-questions",
    category: "technical-interviews",
    title: "Senior Backend Interview Questions: 30 Questions to Ask",
    description: "30 high-signal interview questions for senior backend engineers covering databases, API design, caching, queues, concurrency, and distributed system trade-offs.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "18 min read",
    featured: true,
    tags: ["Backend", "Technical Interviews", "Senior Hiring", "System Design", "Databases"],
    seoTitle: "Senior Backend Interview Questions: 30 Questions to Ask | Pairlet",
    seoDescription: "30 senior backend interview questions for engineering managers. Evaluate candidates on API design, database indexing, caching strategies, distributed locking, and resilience.",
    relatedArticles: [
      "technical-interview-questions",
      "code-review-interview-questions",
      "live-coding-interview",
    ],
    relatedProblems: ["lru-cache", "n-plus-1-queries", "concurrency-limiter"],
    faq: [
      {
        question: "What sets a senior backend engineer apart in technical interviews?",
        answer: "Senior backend engineers focus on system trade-offs, failure modes, data consistency, observability, and long-term maintainability rather than just making code pass happy-path unit tests.",
      },
    ],
    content: `
Hiring senior backend engineers requires probing beyond basic syntax and CRUD endpoints. Senior engineers must demonstrate mastery over database indexing, distributed locking, message queues, rate limiting, and failure mitigation.

## Database & Data Persistence

1. **How do B-Tree indexes work, and when can an index degrade write performance?**
   *Expected Answer*: B-Trees allow logarithmic O(log N) search lookups. However, every inserted or updated row requires updating associated indexes, increasing write latency and storage overhead.
2. **Explain the difference between Optimistic and Pessimistic Locking.**
3. **How do you detect and resolve N+1 database query issues?**
   *Practice the [N+1 Queries](https://www.pairlet.dev/problems/n-plus-1-queries) exercise on Pairlet.*

## Caching & Concurrency

4. **How do Cache-Aside, Write-Through, and Write-Behind caching strategies differ?**
5. **How do you implement an LRU (Least Recently Used) cache?**
   *Try the [LRU Cache](https://www.pairlet.dev/problems/lru-cache) problem on Pairlet.*
6. **How do you prevent Cache Stampedes (Thundering Herd Problem)?**

## Message Queues & Distributed Systems

7. **How do At-Least-Once vs At-Most-Once delivery guarantees impact message consumer design?**
8. **What is an Idempotency Key, and how do you implement it in API gateways?**

---

### Practice Senior Technical Loops
Conduct live backend interviews in a real-time collaborative editor. [Create a free Pairlet interview room](https://www.pairlet.dev/interview/new).
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 13: code-review/code-review-interview
  // --------------------------------------------------------------------------
  {
    slug: "code-review-interview",
    category: "code-review",
    title: "Code Review Interviews: How to Run One and What to Evaluate",
    description: "Learn why code review interviews are superior to abstract puzzle interviews. Step-by-step guide to designing exercises, candidate scorecards, and realistic pull request evaluations.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "14 min read",
    featured: true,
    tags: ["Code Review", "Interview Framework", "Interviewer Guide", "Software Quality"],
    seoTitle: "Code Review Interviews: How to Run One & What to Evaluate | Pairlet",
    seoDescription: "Master code review technical interviews. Learn how to present realistic pull requests, evaluate candidate code quality signal, and test real-world engineering skills.",
    relatedArticles: [
      "code-review-interview-questions",
      "live-coding-interview",
      "technical-interview-questions",
    ],
    relatedProblems: [
      "n-plus-1-queries",
      "async-error-handling",
      "race-condition-state",
      "memory-leak-node",
    ],
    faq: [
      {
        question: "Why are code review interviews gaining popularity?",
        answer: "Code review interviews mirror true day-to-day engineering tasks: reviewing code written by peers, identifying security/performance bugs, and communicating constructive feedback.",
      },
    ],
    content: `
Traditional algorithm interviews often fail to predict how well an engineer will perform on a team. A **Code Review Interview** presents candidates with a realistic pull request containing intentional flaws—performance bottlenecks, security vulnerabilities, edge-case oversights, or poor TypeScript design.

## Why Code Review Interviews Outperform Puzzle Puzzles

1. **Mirrors Daily Engineering**: Developers spend significant time reviewing peer pull requests.
2. **Evaluates Practical Depth**: Tests knowledge of security (SQL injection, auth bugs), performance (N+1 queries, memory leaks), and maintainability.
3. **Tests Communication Skills**: Observes how constructively candidates phrase feedback and suggest refactored alternatives.

## How to Structure a Code Review Exercise

1. **Provide Context**: Give candidates a brief user story or bug report explaining what the pull request is intended to accomplish.
2. **Include 3-5 Specific Flaws**: Mix bug categories (e.g. 1 security bug, 1 performance issue, 1 missing error handling case).
3. **Allow Live Editing**: Ask the candidate to not only point out the flaws but refactor the code live in the editor.

---

### Run Code Review Interviews Live
Pairlet includes built-in interactive Code Review interview tasks. [Try Code Review Problems on Pairlet](https://www.pairlet.dev/problems).
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 14: code-review/code-review-interview-questions
  // --------------------------------------------------------------------------
  {
    slug: "code-review-interview-questions",
    category: "code-review",
    title: "15 Code Review Interview Questions for Software Engineers",
    description: "15 realistic code review interview scenarios covering N+1 queries, race conditions, memory leaks, unhandled promises, authorization bugs, and poor TypeScript design.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "16 min read",
    tags: ["Code Review", "Interview Scenarios", "Bug Fixing", "Node.js", "TypeScript"],
    seoTitle: "15 Code Review Interview Questions & Exercises | Pairlet",
    seoDescription: "Explore 15 code review interview questions. Examples covering database N+1 queries, memory leaks, authorization oversights, race conditions, and error logging.",
    relatedArticles: [
      "code-review-interview",
      "senior-backend-interview-questions",
      "typescript-coding-interview",
    ],
    relatedProblems: [
      "n-plus-1-queries",
      "async-error-handling",
      "memory-leak-node",
      "auth-authorization-bug",
    ],
    faq: [
      {
        question: "What categories of bugs work best in code review exercises?",
        answer: "Database performance (N+1 queries), Async error swallowing, Authorization checking bypasses, Node.js memory leaks, and Unrestricted Promise concurrency.",
      },
    ],
    content: `
Code review exercises provide immediate signal on how candidates inspect code for bugs, edge cases, and architectural flaws. Here are 15 realistic code review interview scenarios complete with what interviewers should look for.

## Scenario 1: Database N+1 Query Anti-Pattern

\`\`\`javascript
// Flawed Pull Request:
async function getUsersWithOrders(userIds) {
  const users = [];
  for (const id of userIds) {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    const orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [id]);
    users.push({ ...user, orders });
  }
  return users;
}
\`\`\`
- **What to look for**: Candidate identifies N+1 database roundtrips and refactors using SQL \`IN (...)\` clauses or batch JOIN queries.
- *Practice [N+1 Queries](https://www.pairlet.dev/problems/n-plus-1-queries) on Pairlet.*

## Scenario 2: Swallowed Async Exceptions

\`\`\`javascript
// Flawed Pull Request:
async function processPayment(payment) {
  try {
    await stripe.charges.create(payment);
    await auditLogger.log(payment.id);
  } catch (err) {
    console.log("Something went wrong");
    return true; // Returns success despite failure!
  }
}
\`\`\`
- **What to look for**: Candidate catches the silent error swallowing and false positive return value.
- *Practice [Async Error Handling](https://www.pairlet.dev/problems/async-error-handling) on Pairlet.*

## Scenario 3: Node.js Memory Leak via Global Listeners

- *Practice [Node.js Memory Leak](https://www.pairlet.dev/problems/memory-leak-node) on Pairlet.*

---

### Practice Code Review Exercises Live
Run live code review interview loops with candidates in a free collaborative workspace. [Create a Pairlet Interview Room](https://www.pairlet.dev/interview/new).
`,
  },

  // --------------------------------------------------------------------------
  // ARTICLE 15: coding-interviews/remote-coding-interview
  // --------------------------------------------------------------------------
  {
    slug: "remote-coding-interview",
    category: "coding-interviews",
    title: "Remote Coding Interviews: How to Run Better Technical Interviews",
    description: "Best practices for conducting remote technical interviews. How to select lightweight coding environments, eliminate sign-up friction, and evaluate candidates fairly.",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "13 min read",
    tags: ["Remote Hiring", "Coding Interviews", "Interviewer Checklist", "Pair Programming"],
    seoTitle: "Remote Coding Interviews: How to Run Better Technical Interviews | Pairlet",
    seoDescription: "Guide to remote coding interviews. Eliminate candidate sign-up friction, set up instant collaborative coding rooms, and evaluate remote candidates fairly.",
    relatedArticles: [
      "live-coding-interview",
      "coding-interview-problems",
      "technical-interview-questions",
    ],
    relatedProblems: ["valid-parentheses", "two-sum"],
    faq: [
      {
        question: "How do you eliminate candidate friction during remote coding interviews?",
        answer: "Avoid tools that force candidates to create passwords, verify emails, or download heavy desktop executables. Use instant, browser-native collaborative editors where candidates can enter and code immediately.",
      },
    ],
    content: `
Remote technical hiring has become standard for engineering teams worldwide. However, many remote interview workflows suffer from avoidable setup friction—forcing candidates to navigate complex account registrations, IDE setup delays, or broken screen shares.

## Key Challenges of Remote Coding Interviews

1. **Account Registration Overhead**: Forcing candidates through 5 minutes of sign-up forms before the interview starts.
2. **Environment Mismatches**: Local IDE configurations failing due to local Node version differences.
3. **Communication Latency**: One-way screen sharing instead of real-time multi-cursor pair programming.

## Checklist for Running Seamless Remote Interviews

- [ ] **Instant Access**: Provide a shareable link that opens directly into a live collaborative workspace.
- [ ] **No Candidate Sign-Up Required**: Ensure candidates do not need to register accounts or share personal passwords.
- [ ] **Integrated Execution**: Provide in-browser execution with real-time output console logging.
- [ ] **Pre-loaded Problems**: Select problems with clear descriptions and starter templates pre-filled.

## Why Engineering Teams Choose Pairlet

Pairlet was built specifically to solve remote interview friction:

- **Instant Setup**: Create a room in 1 second.
- **Zero Candidate Sign-up**: Candidates click the link and start coding instantly.
- **Real-Time Collaboration**: Powered by Monaco Editor and Yjs for smooth multi-cursor interaction.
- **100% Free**: No subscription paywalls or trial limits.

[Create a Free Remote Interview Room on Pairlet](https://www.pairlet.dev/interview/new)
`,
  },
];
