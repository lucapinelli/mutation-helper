# mutation-helper

A collection of methods to mutate objects and arrays without modifying the source.
To reduce at minimum the amount of memory usage and optimize the creation of the
mutated objects, all the items that are not mutated are shared with the original
object.

**Example:**
```js
import { set } from 'mutation-helper';
// const set = require('mutation-helper').set;

const source = {
    a: [1, 2, 30],
    b: {
        c: { d: true },
        e: { f: false }
    }
};
const mutated = set(source, 'b.c.d', false);

console.log(source); // {a: [1,2,30], b: {c: {d: true}, e: {f: false}}}
console.log(mutated); // {a: [1,2,30], b: {c: {d: false}, e: {f: false}}}

console.log(source === mutated); // false
console.log(source.a === mutated.a); // true
console.log(source.b === mutated.b); // false
console.log(source.b.c === mutated.b.c); // false
console.log(source.b.c.d === mutated.b.c.d); // false
console.log(source.b.e === mutated.b.e); // true
console.log(source.b.e.f === mutated.b.e.f); // true
```

## Get the module

```bash
npm install mutation-helper
```

## Utilities

* merge
* get
* set
* pop
* push
* reverse
* shift
* unshift
* sort
* splice

### merge(objectA, objectB [ , objectC, ... ])

Returns the deep merge of the given objects.

```js
import { merge } from 'mutation-helper';
// const merge = require('mutation-helper').merge;

const a = { a: 12, b: 23, c: 34 };
const b = { a: 1, d: 4, e: 5 };
const c = { b: 2, e: 6, f: 7 };
const mutated = merge(a, b, c);

console.log(a); // { a: 12, b: 23, c: 34 };
console.log(b); // { a: 1, d: 4, e: 5 };
console.log(c); // { b: 2, e: 6, f: 7 };
console.log(mutated); // { a: 1, b: 2, c: 34, d: 4, e: 6, f: 7}
```

### get(source, path)

Returns the value of the specified field (null safe).

```js
import { get } from 'mutation-helper';
// const get = require('mutation-helper').get;

const source = { a: 12, b: [ { c: 34 } ] };

console.log(get(source, 'a')); // 12
console.log(get(source, 'b[0].c')); // 34
console.log(get(source, 'b[0].d')); // undefined
console.log(get(source, 'b[1].c')); // undefined
```

### set(source, path, value)

Returns a new object with the specified property updated using the given value.

```js
import { set } from 'mutation-helper';
// const set = require('mutation-helper').set;

const source = { a: 12, b: [ { c: 34 } ] };

console.log(set(source, 'a', 2)); // { a: 2, b: [ { c: 34 } ] }
console.log(set(source, 'b[0].c', 3)); // { a: 12, b: [ { c: 3 } ] }
console.log(set(source, 'b[0].d', 4)); // { a: 12, b: [ { c: 34, d: 4 } ] }
console.log(set(source, 'b[1].c', 5)); // { a: 12, b: [ { c: 34 }, { c: 5 } ] }
```

### pop(array)

```js
import { pop } from 'mutation-helper';
// const pop = require('mutation-helper').pop;

const source = [1, 2, 3];
const updated = pop(source);

console.log(source); // [1, 2, 3]
console.log(updated); // [1, 2]
```

### push(array, elementA [ , elementB, ... ])

```js
import { push } from 'mutation-helper';
// const push = require('mutation-helper').push;

const source = [1, 2, 3];
const updated = push(source, 4, 5);

console.log(source); // [1, 2, 3]
console.log(updated); // [1, 2, 3, 4, 5]
```

### reverse(array)

```js
import { reverse } from 'mutation-helper';
// const reverse = require('mutation-helper').reverse;

const source = [1, 22, 3];
const updated = reverse(source);

console.log(source); // [1, 22, 3]
console.log(updated); // [3, 22, 1]
```

### shift(array)

```js
import { shift } from 'mutation-helper';
// const shift = require('mutation-helper').shift;

const source = [1, 2, 3];
const updated = shift(source);

console.log(source); // [1, 2, 3]
console.log(updated); // [2, 3]
```

### unshift(array , item1 [ , item2, ... ])

```js
import { unshift } from 'mutation-helper';
// const unshift = require('mutation-helper').unshift;

const source = [1, 2, 3];
const updated = unshift(source, -1, 0);

console.log(source); // [1, 2, 3]
console.log(updated); // [-1, 0, 1, 2, 3]
```

### sort(array [ , sortFunction ])

```js
import { sort } from 'mutation-helper';
// const sort = require('mutation-helper').sort;

const source = ['this', 'is', 'a', 'test'];
const updatedA = sort(source);
const updatedB = sort(source, (a, b) => a < b ? 1 : -1;

console.log(source); // ['this', 'is', 'a', 'test']
console.log(updatedA); // ['a', 'is', 'test', 'this']
console.log(updatedB); // ['this', 'test', 'is', 'a']
```

### splice(array , startIndex , deleteCount [ , item1 , item2 , ... ])

```js
import { splice } from 'mutation-helper';
// const splice = require('mutation-helper').splice;

const source = [100, 2, 33, 82];
const updatedA = splice(source, 1, 2);
const updatedB = splice(source, 1, 0, 22, 23);
const updatedC = splice(source, 1, 1, 21);

console.log(source); // [100, 2, 33, 82]
console.log(updatedA); // [100, 82]
console.log(updatedB); // [100, 22, 23, 2, 33, 82]
console.log(updatedC); // [100, 21, 33, 82]
```
